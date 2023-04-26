import _ from 'lodash'
import {Event} from '@/utils/Event'
import Frame from "@/utils/Frame";
import FrameGroup from "@/utils/FrameGroup";
import {cloneCanvas} from "@/utils/CanvasUtils";

class TimeLinePlayer extends Event {

  UUID = `time-line-player-${Math.random()}`

  /**
   * 循环播放
   * @type {boolean}
   */
  loop = false

  /**
   * 开始播放
   * @type {boolean}
   */
  start = false

  /**
   * 反向
   * @type {boolean}
   */
  reverse = false

  /**
   * 播放速度
   * @type {number}
   */
  speed = 1

  /**
   * 持续时间
   * @type {number}
   */
  // duration = 0

  /**
   * 每一帧持续时间
   * @type {number}
   */
  frameTime = 40

  /**
   * 当前时间， 播放用
   * @type {number}
   */
  currentTime = 0

  /**
   * 开始时间， 播放用
   * @type {number}
   */
  startTime = 0

  /**
   * 关键帧（时间,开始时间/startTime）: [100, 200, 240, 300, ......]
   * @type {[]}
   */
  keyFrameTime = []

  /**
   * 关键帧
   * @type {[]}
   */
  frameGroups = []

  constructor() {
    super()
  }

  /**
   * 重置时间轴
   * @param options
   */
  reset(options) {
    options = options || {}
    this.start = false
    this.startTime = 0
    this.currentTime = 0
    this.frameGroups = []
    this.frameTime = options.frameTime || 0

    if (!_.isEmpty(options.frameGroups)) {
      options.frameGroups.forEach(frameGroup => this.addFrameGroup(frameGroup))
    }
    // this.duration = options.duration || 0
    // const keyFrameTime = options.keyFrameTime || []
    // const frameCount = this.frameCount
    // 修正总时间
    // this.duration = frameCount * this.frameTime
    // 插入关键帧
    // for (let i = 0; i < frameCount; i++) {
    //   const frameTimeIndex = i * this.frameTime
    //   if (!keyFrameTime.includes(frameTimeIndex)) {
    //     keyFrameTime.push(frameTimeIndex)
    //   }
    // }
    // 排序
    // this.keyFrameTime = keyFrameTime.sort((a, b) => a - b)

    this.refreshKeyFrameTimes()
    // 渲染
    this.requestFrame()
  }

  /**
   * 重置当前播放帧
   */
  resetCurrentTime(time) {
    console.log('====>>> resetCurrentTime')
    if (time === undefined) {
      time = this.getLimit()[0]
    }
    this.currentTime = time
    this.requestFrame(time)
  }

  refreshKeyFrameTimes() {
    const times = []
    const { frameCount } = this
    // 插入普通关键帧
    for (let i = 0; i < frameCount; i++) {
      const frameTimeIndex = i * this.frameTime
      times.push(frameTimeIndex)
    }
    // 特殊关键帧
    this.frameGroups.forEach(group =>
      group.frames.forEach(frame => {
        if (!times.includes(frame.startTime)) {
          times.push(frame.startTime)
        }
      }))
    this.keyFrameTime = times.sort((a, b) => a - b)
  }

  /**
   * 将对象添加为动画片段
   * @param obj
   */
  addObjectAsFrameGroup(obj) {
    const keyFrame = new Frame()
    obj.ignore = true
    keyFrame.add(obj)
    keyFrame.startTime = 0
    keyFrame.duration = this.duration
    this.addFrameGroup(new FrameGroup([keyFrame]))
  }

  addFrameGroup(frameGroup) {
    frameGroup.on('update:frame:time', this.refreshKeyFrameTimes.bind(this))
    this.frameGroups.push(frameGroup)
    this.requestFrame()
  }

  findGroupByTarget(target) {
    return this.frameGroups.find(group => group.includes(target))
  }

  /**
   * 时间帧转为canvas对象
   * @param time
   * @param canvasClone
   * @returns {Promise<void>}
   */
  async timeToCanvas(time, canvasClone) {
    canvasClone = canvasClone || await cloneCanvas(this.canvas, true)
    const cloneList = []
    for (let i = 0; i < this.frameGroups.length; i++) {
      const frameGroup = this.frameGroups[i]
      const frame = frameGroup.getFrameInTime(time, true)
      if (frame) {
        await Promise.all(frame._objects.map(obj => new Promise(resolve => obj.clone((clone) => {
          cloneList.push(clone)
          resolve()
        }))))
      }
    }
    const backgroundColor = canvasClone.backgroundColor
    canvasClone.clear()
    canvasClone.backgroundColor = backgroundColor
    canvasClone.add(...cloneList)
    // canvasClone.setZoom(1)
    canvasClone.requestRenderAll()
    const { originWidth: width, originHeight: height } = canvasClone
    // Canvas2Image.saveAsPNG(canvasClone.toCanvasElement(1, {width, height}), width, height)
    return canvasClone.toCanvasElement(1, {width, height})
    // Canvas2Image.saveAsPNG(canvasClone.toCanvasElement(1, {width, height}), width, height)
    // return canvasClone
  }

  /**
   * 渲染time时刻
   * @param time
   */
  requestFrame(time) {
    if (typeof time === 'undefined') {
      time = this.currentTime
    }
    time = time || 0
    // ImageHelper.cleanCanvas()
    this.frameGroups.forEach(frameGroup => frameGroup.renderFrame(time))
    this.currentTime = time
    this.trigger('requestFrame')
  }

  /**
   * 渲染下一帧
   */
  requestNextFrame() {
    console.log('------- requestNextFrame', this.currentTime)
    if (this.start) {
      const { currentTime } = this
      const nextTime = this.reverse ? this.getPreTime(currentTime) : this.getNextTime(currentTime)
      this.requestFrame(currentTime)
      const between = this.getTimeToNextFrame(currentTime)
      setTimeout(() => {
        if (this.start) {
          this.requestNextFrame()
        }
      }, between * (1 / this.speed))
      this.currentTime = nextTime
    }
  }

  /**
   * 获取传入时间到下一帧时间之间间隔
   * @param time
   * @returns {number}
   */
  getTimeToNextFrame(time) {
    const limit = this.getLimit()
    if (this.reverse) {
      const preTime = this.getPreTime(time)
      if (preTime > time) {
        return time - limit[0] + limit[1] - preTime
      } else {
        return time - preTime
      }
    } else {
      const nextTime = this.getNextTime(time)
      if (nextTime < time) {
        return limit[1] - time + nextTime - limit[0]
      } else {
        return nextTime - time
      }
    }
  }

  /**
   * 获取指定时间到下一帧时间的开始时间
   * @param time
   * @returns {number}
   */
  getNextTime(time) {
    const keyFrameTime = this.keyFrameTime
    const limit = this.getLimit()
    let nextTime = keyFrameTime.find(t => t >= limit[0] && t <= limit[1] && t > time)
    if (nextTime === undefined) {
      nextTime =  0
    }
    return Math.max(limit[0], nextTime)
  }

  /**
   * 获取指定时间到上一帧时间间隔
   * @param time
   * @returns {number}
   */
  getPreTime(time) {
    const keyFrameTime = this.keyFrameTime
    const limit = this.getLimit()
    let preTime = [...keyFrameTime].reverse().find(t => t >= limit[0] && t <= limit[1] && t < time)
    if (preTime === undefined) {
      preTime = keyFrameTime[keyFrameTime.length - 1]
    }
    return Math.min(limit[1], preTime)
  }

  /**
   * 获取时间有效范围，不判断时间限制，除去delay，只看内容
   */
  getTimeRange() {
    const limit = []
    this.frameGroups.forEach(frameGroup => {
      const start = frameGroup.delay
      const end = frameGroup.duration + frameGroup.delay
      if (limit[0] === undefined) {
        limit[0] = start
        limit[1] = end
      } else {
        limit[0] = Math.min(start, limit[0])
        limit[1] = Math.max(end, limit[1])
      }
    })
    return limit
  }

  /**
   * 时间限制的结束时间不能为0
   * @returns {number[]}
   */
  getLimit() {
    const defaultLimit = [0, this.duration]
    if (_.isEmpty(this.frameGroups)) {
      return defaultLimit
    }
    const limit = [...(this.frameGroups[0].limit || defaultLimit)]
    limit[0] += this.frameGroups[0].delay
    limit[1] += this.frameGroups[0].delay
    this.frameGroups.forEach(frameGroup => {
      const [start, end] = frameGroup.limit
      limit[0] = Math.min((start + frameGroup.delay) || 0, limit[0])
      limit[1] = Math.max((end + frameGroup.delay) || this.duration, limit[1])
    })
    return limit
  }

  /**
   * 渲染
   */
  render() {
    // this.requestNextFrame()
    // this.start && fabric.util.requestAnimFrame(() => this.render())
  }

  /**
   * 播放
   */
  play() {
    if (!_.isEmpty(this.frameGroups)) {
      this.start = true
      this.requestNextFrame()
    }
  }

  /**
   * 暂停
   */
  stop() {
    this.start = false
  }

  /**
   * 播放或暂停
   */
  togglePlay() {
    this.start = !this.start
    this.start && this.play()
  }

  /**
   * 活动帧数
   * @returns {number}
   */
  get frameCount() {
    // 向上取整
    return Math.ceil(this.duration / this.frameTime)
  }

  /**
   * 持续时间
   * @returns {*}
   */
  get duration() {
    return (this.frameGroups || []).reduce((pre, cur) => Math.max(pre, cur.totalTime), 0)
  }

  get canvas() {
    return (this.frameGroups.find(frameGroup => !!frameGroup.canvas) || {}).canvas
  }

}
const timeLinePlayer = new TimeLinePlayer()

export default timeLinePlayer

import _ from 'lodash'
import {Event} from '@/utils/Event'
import ImageHelper from "@/utils/ImageHelper"
import Frame from "@/utils/Frame";
import FrameGroup from "@/utils/FrameGroup";
import GIF from "@/lib/gif"
import gifWorker from '@/lib/gif.worker'
import saveAs from "@/lib/FileSaver";
import Canvas2Image from "@/utils/CanvasToImage";

class TimeLinePlayer extends Event {

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
  duration = 0

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

  /**
   * 重置时间轴
   * @param options
   */
  reset(options) {
    options = options || {}
    this.start = false
    this.startTime = 0
    this.currentTime = 0
    this.frameGroups = options.frameGroups
    this.frameTime = options.frameTime || 0
    this.duration = options.duration || 0
    const keyFrameTime = options.keyFrameTime || []
    const frameCount = this.frameCount
    // 修正总时间
    this.duration = frameCount * this.frameTime
    // 插入关键帧
    for (let i = 0; i < frameCount; i++) {
      const frameTimeIndex = i * this.frameTime
      if (!keyFrameTime.includes(frameTimeIndex)) {
        keyFrameTime.push(frameTimeIndex)
      }
    }
    // 排序
    this.keyFrameTime = keyFrameTime.sort((a, b) => a - b)
    // 渲染
    this.requestFrame()
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
    this.frameGroups.push(frameGroup)
    this.requestFrame()
  }

  findGroupByTarget(target) {
    return this.frameGroups.find(group => group.includes(target))
  }

  // /**
  //  * 导出gif
  //  * @returns {Promise<void>}
  //  */
  // async exportAsGif() {
  //   const canvasClone = await ImageHelper.cloneClearCanvas()
  //   const { originWidth: width, originHeight: height } = canvasClone
  //   const gif = new GIF({ workers: 2, quality: 1, width, height, workerScript: gifWorker });
  //   const [start, end] = this.getLimit()
  //   for (let i = 0; i < this.keyFrameTime.length; i++) {
  //     const time = this.keyFrameTime[i]
  //     if (time >= start && time <= end) {
  //       const delay = (this.keyFrameTime[i + 1] || this.duration) - time
  //       const canvas = await this.timeToCanvas(time, canvasClone)
  //       gif.addFrame(canvas, {delay})
  //     }
  //   }
  //   gif.on('finished', blob => saveAs(blob, '导出' + '.gif'));
  //   gif.render()
  // }

  /**
   * 时间帧转为canvas对象
   * @param time
   * @param canvasClone
   * @returns {Promise<void>}
   */
  async timeToCanvas(time, canvasClone) {
    canvasClone = canvasClone || await ImageHelper.cloneClearCanvas()
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
    console.log('------- requestNextFrame')
    if (this.start) {
      const { currentTime } = this
      const nextTime = this.reverse ? this.getPreTime(this.currentTime) : this.getNextTime(this.currentTime)
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
   * 获取指定时间到下一帧时间间隔
   * @param time
   * @returns {number}
   */
  getNextTime(time) {
    const limit = this.getLimit()
    let nextTime = this.keyFrameTime.find(t => t >= limit[0] && t <= limit[1] && t > time)
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
    const limit = this.getLimit()
    let preTime = [...this.keyFrameTime].reverse().find(t => t >= limit[0] && t <= limit[1] && t < time)
    if (preTime === undefined) {
      preTime = this.keyFrameTime[this.keyFrameTime.length - 1]
    }
    return Math.min(limit[1], preTime)
  }

  /**
   * 获取时间有效范围
   */
  getTimeRange() {
    const limit = [0, 0]
    this.frameGroups.forEach(frameGroup => {
      const start = frameGroup.delay
      const end = frameGroup.duration - frameGroup.delay
      limit[0] = Math.min(start, limit[0])
      limit[1] = Math.max(end, limit[1])
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
    this.frameGroups.forEach(frameGroup => {
      const [start, end] = frameGroup.limit
      limit[0] = Math.min(start || 0, limit[0])
      limit[1] = Math.max(end || this.duration, limit[1])
    })
    return limit
  }

  render() {
    this.requestNextFrame()
    // this.start && fabric.util.requestAnimFrame(() => this.render())
  }

  play() {
    if (!_.isEmpty(this.frameGroups)) {
      this.start = true
      this.render()
    }
  }

  stop() {
    this.start = false
  }

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

}

export default new TimeLinePlayer()

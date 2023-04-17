import _ from 'lodash'
import {Event} from '@/utils/Event'
import ImageHelper from "@/utils/ImageHelper"
import Frame from "@/utils/Frame";
import FrameGroup from "@/utils/FrameGroup";
import GIF from "@/lib/gif"
import gifWorker from '@/lib/gif.worker'
import saveAs from "@/lib/FileSaver";

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
   * 持续时间
   * @type {number}
   */
  duration = 0

  /**
   * 每一帧持续时间
   * @type {number}
   */
  frameTime = 100

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
    const frameCount = this.duration / this.frameTime
    for (let i = 0; i < frameCount; i++) {
      const frameTimeIndex = i * this.frameTime
      if (keyFrameTime.includes(!frameTimeIndex)) {
        keyFrameTime.push(frameTimeIndex)
      }
    }
    this.keyFrameTime = keyFrameTime.sort((a, b) => a - b)
    this.requestFrame()
  }

  /**
   * 将对象添加为动画片段
   * @param obj
   */
  addObjectAsFrameGroup(obj) {
    const keyFrame = new Frame()
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

  async exportAsGif() {
    const canvasClone = await ImageHelper.cloneClearCanvas()
    const { originWidth: width, originHeight: height } = canvasClone
    const gif = new GIF({ workers: 2, quality: 1, width, height, workerScript: gifWorker });
    for (let i = 0; i < this.keyFrameTime.length; i++) {
      const time = this.keyFrameTime[i]
      const delay = (this.keyFrameTime[i + 1] || this.duration) - time
      const canvas = await this.timeToCanvas(time, canvasClone)
      gif.addFrame(canvas, {delay})
    }
    gif.on('finished', blob => saveAs(blob, '导出' + '.gif'));
    gif.render()
  }

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
      const frame = frameGroup.getFrameInTime(time)
      await Promise.all(frame._objects.map(obj => new Promise(resolve => obj.clone((clone) => {
        cloneList.push(clone)
        resolve()
      }))))
    }
    canvasClone.clear()
    canvasClone.add(...cloneList)
    // canvasClone.setZoom(1)
    canvasClone.requestRenderAll()
    const { originWidth: width, originHeight: height } = canvasClone
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
    ImageHelper.cleanCanvas()
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
      const { currentTime, duration } = this
      // const objects = this.canvas._objects
      let nextTime = this.keyFrameTime.find(t => t > this.currentTime)
      nextTime = nextTime || 0
      this.requestFrame(currentTime)
      // objects.forEach(object => object.requestNextFrame && object.requestNextFrame(this.currentTime))
      setTimeout(() => {
        if (this.start) {
          this.requestNextFrame()
        }
      }, (nextTime || duration) - currentTime)
      this.currentTime = nextTime
    }
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

}

export default new TimeLinePlayer()

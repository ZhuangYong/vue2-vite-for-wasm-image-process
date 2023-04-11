import _ from 'lodash'
import { Event } from '@/utils/Event'
import ImageHelper from "@/utils/ImageHelper"
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
   * 每一帧持时间
   * @type {number}
   */
  frameTime = 100

  /**
   * 当前时间
   * @type {number}
   */
  currentTime = 0

  /**
   * 开始时间
   * @type {number}
   */
  startTime = 0

  /**
   * 关键帧（时间）: [100, 200, 240, 300, ......]
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

  addFrameGroup(frameGroup) {
    this.frameGroups.push(frameGroup)
    this.requestFrame()
  }

  requestFrame(time) {
    time = time || this.currentTime || 0
    ImageHelper.cleanCanvas()
    this.frameGroups.forEach(frameGroup => frameGroup.renderFrame(time))
    this.currentTime = time
    this.trigger('requestFrame')
  }

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

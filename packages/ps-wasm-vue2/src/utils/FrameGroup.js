import _ from 'lodash'
import Frame from "@/utils/Frame"
import animates from "@/animate"
import { Event } from "@/utils/Event"

export default class FrameGroup extends Event {

  UUID = `frame-group-${Math.random()}`
  /**
   * 关键帧对象
   * @type {[]}
   */
  frames = []

  /**
   * 动画
   * @type {[BaseAnimate]}
   */
  animates = []

  /**
   * 总时间
   * @type {number}
   */
  _delay = 0

  /**
   * 输出范围
   * @type {[]}
   */
  limit = []

  duration = 0

  currentFrame = null

  constructor(frames) {
    super()
    this.frames = frames || []
    this.frames.forEach(frame => (frame.group = this))
    this.duration = this.frames.reduce((pre, cur) => pre + cur.duration, 0)
    this.limit = [0, this.duration]
    this.sort()
  }

  /**
   * 获取快照
   * @param time
   * @returns {*}
   */
  async getSnapshot(time) {
    // const frame = this.frames.find(frame => (time >= frame.startTime && time < frame.startTime + frame.duration))
    const frame = this.getFrameInTime(time)
    if (frame) {
      return await frame.snapshot()
    }
  }

  /**
   * 根据时间显示
   * @param time
   */
  renderFrame(time) {
    if (this.currentFrame) {
      this.currentFrame.clearRender()
      this.canvas.requestRenderAll()
    }
    const frame = this.getFrameInTime(time, true, true)
    if (frame) {
      frame.render()
      this.currentFrame = frame
    }
    // if (frame) {
    //   frame._objects.forEach(obj => obj.ignore = false)
    //   // ImageHelper.addToCanvas(...frame._objects)
    //   // this.frames.forEach(frame => {
    //   //   if (time >= frame.startTime && time < frame.startTime + frame.duration) {
    //   //     ImageHelper.addToCanvas(...frame._objects)
    //   //   }
    //   // })
    // }
    // ImageHelper.requestRenderAll()
  }

  async addIfAbsentKeyFrames(keyFrameTimes) {
    for (let i = 0; i < keyFrameTimes.length; i++) {
      const time = keyFrameTimes[i]
      const frame = this.findFrameByStartTime(time)
      // 如果该时间不存在帧，则新建关键帧
      if (!frame) {
        const newFrame = new Frame()
        newFrame.startTime = time
        const includeFrame = this.findFrameByIncludeTime(time)
        const nextFrame = this.findNextFrameByTime(time)
        const previousFrame = this.findPreviousFrameByTime(time)
        // 如果有帧包含，拆分该帧
        if (includeFrame) {
          const oldDuration = includeFrame.duration
          // 重新计算时长
          includeFrame.duration = time - includeFrame.startTime
          // 时长为拆分的帧结束时间与time差
          newFrame.duration = oldDuration - includeFrame.duration
          const objects = await includeFrame.cloneObjects()
          if (!_.isEmpty(objects)) {
            objects.forEach(obj => (obj.ignore = true))
            includeFrame.canvas.add(...objects)
            newFrame.add(...objects)
            // await Promise.all(includeFrame._objects.map(async (obj) => new Promise(resolve => obj.clone(clone => resolve(newFrame.add(clone))))))
            this.addFrame(newFrame)
          }
        } else if (nextFrame || previousFrame) {
          newFrame.duration = nextFrame ? (nextFrame.startTime - time - 1) : (this.duration - time)
          const objects = previousFrame ? await previousFrame.cloneObjects() : await previousFrame.cloneObjects()
          newFrame.add(...objects)
          this.addFrame(newFrame)
        }
      }
    }
  }

  /**
   * 在关键帧上应用动画
   * @param keyFrameTimes
   * @param animateName {string}
   */
  async applyAnimate(keyFrameTimes, animateName) {
    await this.addIfAbsentKeyFrames(keyFrameTimes)
    const { Constructor } = animates.find(({ key }) => key === animateName) || {}
    const animate = new Constructor(keyFrameTimes)
    this.animates.push(animate)
    animate.doAnimates.forEach(item => item.accept(this.findFrameByStartTime(item.time)))
  }

  useEase(time, frame) {
    const easeInOutQuad = fabric.util.ease.easeInOutQuad
    frame._objects.forEach(target => {
      if (!target.hasOwnProperty('preVal')) {
        target.preVal = target.top
      }
      const curVal = target.preVal
      target.top = easeInOutQuad(time, curVal, curVal + 100, this.duration)
    })
  }

  /**
   * 获取在time时间上的frame
   * @param time 指定时间
   * @param limit 是否判断限制
   * @param delay 是否判断延迟
   * @returns {*}
   */
  getFrameInTime(time, limit, delay) {
    // 考虑延迟
    const delayTime = delay ? this.delay : 0
    // 考虑限制时间
    if (limit && (time < (this.limit[0] + delayTime) || time > (this.limit[1] + delayTime))) {
      return
    }
    const frameInTime = this.frames.find(frame => time >= (frame.startTime + delayTime) && time < (frame.startTime + frame.duration + delayTime))
    // 如果时间大于0，且未找到，返回最后一帧
    if (time > 0 && !frameInTime) {
      return this.frames[this.frames.length - 1]
      // return this.frames.reduce((pre, cur) => pre.startTime > cur.startTime ? pre : cur)
    }
    return frameInTime
  }

  /**
   * 按开始时间排序
   */
  sort() {
    this.frames.sort((a, b) => a.startTime - b.startTime)
  }

  addFrame(frame) {
    this.frames.push(frame)
    this.sort()
  }

  insertBefore(frame, insert) {
    this.sort()
    const index = this.frames.findIndex(iter => iter.UUID === frame.UUID)
    if (~index) {
      this.frames.splice(index, 0, insert)
    }
    this.sort()
  }

  insertAfter(frame, insert) {
    this.sort()
    const index = this.frames.findIndex(iter => iter.UUID === frame.UUID)
    if (~index) {
      this.frames.splice(index + 1, 0, insert)
    }
    this.sort()
  }

  findFrameByStartTime(startTime) {
    return this.frames.find(frame => frame.startTime === startTime)
  }

  findFrameByIncludeTime(startTime) {
    return this.frames.find(frame => frame.startTime < startTime && startTime < (frame.startTime + frame.duration))
  }

  findPreviousFrameByTime(startTime) {
    return this.frames.filter(frame => frame.startTime < startTime).reduce((a, b) => (startTime - ((a || {}).startTime || 0)) < (startTime - ((b || {}).startTime || 0)) ? a : b, null)
  }

  findNextFrameByTime(startTime) {
    return this.frames.filter(frame => frame.startTime > startTime).reduce((a, b) => (((a || {}).startTime || 0) - startTime) < (((b || {}).startTime || 0) - startTime) ? a : b, null)
  }

  findFrameByTarget(target) {
    return this.frames.find(frame => frame._objects.includes(target))
  }

  includes(target) {
    return !!this.findFrameByTarget(target)
  }

  get canvas() {
    return (this.frames.find(item => !!item.canvas) || {}).canvas
  }

  /**
   * 总时间
   * @returns {number}
   */
  get totalTime() {
    return this.delay + this.duration
  }

  get delay() {
    return this._delay
  }

  set delay(val) {
    this._delay = val
    this.trigger('update:frame:time')
  }

}

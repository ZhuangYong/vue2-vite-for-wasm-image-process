import ImageHelper from "@/utils/ImageHelper";

export default class FrameGroup {

  UUID = `frame-group-${Math.random()}`
  /**
   * 关键帧对象
   * @type {[]}
   */
  frames = []

  /**
   * 延迟
   * @type {number}
   */
  delay = 0

  /**
   * 输出范围
   * @type {[]}
   */
  limit = []

  constructor(frames) {
    this.frames = frames
  }

  /**
   * 获取快照
   * @param time
   * @returns {*}
   */
  async getSnapshot(time) {
    const frame = this.frames.find(frame => (time >= frame.startTime && time < frame.startTime + frame.duration))
    if (frame) {
      return await frame.snapshot()
    }
  }

  /**
   * 根据时间显示
   * @param time
   */
  renderFrame(time) {
    this.frames.forEach(frame => {
      if (time >= frame.startTime && time <= frame.startTime + frame.duration) {
        ImageHelper.addToCanvas(...frame._objects)
      }
    })
    ImageHelper.requestRenderAll()
  }

}

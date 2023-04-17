import BaseAnimate from "@/animate/BaseAnimate"

export default class Scale extends BaseAnimate {

  static name = '缩放'

  /**
   * 幅度大小
   * @type {number}
   */
  amplitude = 0.5

  ease = fabric.util.ease.easeInOutQuad

  constructor(times) {
    super()
    this.times = times
    this.refreshMark(times)
  }

  refreshMark(times) {
    const time2value = this.calcByTimes(times, true)
    time2value.forEach(({ time, newVal }) => {
      this.doAnimates.push({ time, accept: frame => frame._objects.forEach(obj => {
          obj.scaleX += newVal
          obj.scaleY += newVal
          obj.left -= newVal * obj.width * 0.5
          obj.top -= newVal * obj.height * 0.5
        })})
      this.backAnimates.push({ time, accept: frame => frame._objects.forEach(obj => {
          obj.scaleX -= newVal
          obj.scaleY -= newVal
        })})
    })
  }

}

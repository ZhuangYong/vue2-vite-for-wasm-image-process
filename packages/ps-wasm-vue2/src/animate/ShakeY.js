import BaseAnimate from "@/animate/BaseAnimate"

export default class ShakeY extends BaseAnimate {

  static name = '上下抖动'

  constructor(times) {
    super()
    this.times = times
    this.refreshMark(times)
  }

  refreshMark(times) {
    const time2value = this.calcByTimes(times, true)
    time2value.forEach(({ time, newVal }) => {
      this.doAnimates.push({ time, accept: frame => frame._objects.forEach(obj => obj.top += newVal) })
      this.backAnimates.push({ time, accept: frame => frame._objects.forEach(obj => obj.top -= newVal) })
    })
  }

}

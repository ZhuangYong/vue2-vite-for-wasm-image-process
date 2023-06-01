import {fabric} from "@/lib/fabric.min"
import BaseAnimate from "@/animate/BaseAnimate"

export default class Shake extends BaseAnimate {

  static name = '闪烁'

  /**
   * 透明度
   * @type {number}
   */
  amplitude = 1

  ease = fabric.util.ease.easeInOutCirc

  constructor(times) {
    super()
    this.times = times
    this.refreshMark(times)
  }

  refreshMark(times) {
    const time2value = this.calcByTimes(times)
    time2value.forEach(({ time, newVal }) => {
      this.doAnimates.push({ time, accept: frame => frame._objects.forEach(obj => obj.opacity -= newVal) })
      this.backAnimates.push({ time, accept: frame => frame._objects.forEach(obj => obj.opacity += newVal) })
    })
  }

}

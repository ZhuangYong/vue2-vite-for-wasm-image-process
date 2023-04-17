import {fabric} from "@/lib/fabric.min"
export default class BaseAnimate {

  times

  /**
   * 幅度大小px
   * @type {number}
   */
  amplitude = 40

  /**
   * 频率ms
   * @type {number}
   */
  frequency = 200

  doAnimates = []

  backAnimates = []

  ease = fabric.util.ease.easeInOutQuad

  calcByTimes(times, fixOffset) {
    let switchWay = false
    const from = 0
    const time2values = []
    const to = this.amplitude
    const offset = fixOffset ? (this.amplitude / 2) : 0
    let currentTime = 0
    this.doAnimates = []
    this.backAnimates = []
    times = times || this.times;
    (times || []).forEach(time => {
      const nextTime = time % this.frequency
      if (nextTime < currentTime) {
        currentTime = 0
        switchWay = !switchWay
      } else {
        currentTime = nextTime
      }
      let newVal = this.ease(currentTime, from, to, this.frequency)
      switchWay && (newVal = to - newVal)
      newVal -= offset
      time2values.push({ time, newVal })
      // this.doAnimates.push({ time, accept: frame => frame._objects.forEach(obj => obj.top += newVal) })
      // this.backAnimates.push({ time, accept: frame => frame._objects.forEach(obj => obj.top -= newVal) })
    })
    return time2values
  }

  get name() {
    return this.constructor.name
  }
}

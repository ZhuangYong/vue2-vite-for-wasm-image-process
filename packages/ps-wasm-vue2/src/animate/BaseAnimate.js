import {fabric} from "@/lib/fabric.min"
export default class BaseAnimate {

  UUID = `animate-${Math.random()}`

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

  /**
   * 计算位移动画在时间上的位移量
   * @param times 时间数组
   * @param fixOffset 是否修正到中线，比如抖动，修复后将以摆动中线为中线上线摆动
   * @returns {[{time: number, newVal: number}]}
   */
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
    })
    return time2values
  }

  get name() {
    return this.constructor.name
  }
}

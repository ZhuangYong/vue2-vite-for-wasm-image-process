import BaseAnimate from "@/animate/BaseAnimate"

export default class Shake extends BaseAnimate {

  static name = '抖动'

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
    // let switchWay = false
    // const from = 0
    // const to = this.amplitude
    // const offset = this.amplitude / 2
    // let currentTime = 0
    // this.doAnimates = []
    // this.backAnimates = []
    // times = times || this.times;
    // (times || []).forEach(time => {
    //   const nextTime = time % this.frequency
    //   if (nextTime < currentTime) {
    //     currentTime = 0
    //     switchWay = !switchWay
    //   } else {
    //     currentTime = nextTime
    //   }
    //   let newVal = this.ease(currentTime, from, to, this.frequency)
    //   switchWay && (newVal = to - newVal)
    //   newVal -= offset
    //   this.doAnimates.push({ time, accept: frame => frame._objects.forEach(obj => obj.top += newVal) })
    //   this.backAnimates.push({ time, accept: frame => frame._objects.forEach(obj => obj.top -= newVal) })
    //   console.log({currentTime, time, newVal, from, to, frequency: this.frequency})
    // })
  }

}

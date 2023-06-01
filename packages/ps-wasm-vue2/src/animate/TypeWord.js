import BaseAnimate from "@/animate/BaseAnimate"
import Const from "@/const"

export default class TypeWord extends BaseAnimate {

  UUID = `type-word-animate-${Math.random()}`

  static name = '打字'

  /**
   * 打字时间
   * @type {number}
   */
  typeTime = 200

  /**
   * 光标闪烁时间
   * @type {number}
   */
  markTime = 80

  constructor(times) {
    super()
    this.times = times
    this.refreshMark(times)
  }

  refreshMark(times) {
    (times || []).forEach(time => {
      // 显示文字个数
      const wordLength = Math.ceil(time / this.typeTime)
      // 是否显示光标
      const showMark = (Math.ceil(time / this.markTime) % 2) === 0
      this.doAnimates.push({ time, accept: frame => frame._objects.forEach(obj => this.changeTextShow(obj, wordLength, showMark)) })
      this.backAnimates.push({ time, accept: frame => frame._objects.forEach(this.resetTextShow) })
    })
  }

  changeTextShow(target, maxLength, showMark) {
    if ([Const.FABRIC_TYPE.I_TEXT, Const.FABRIC_TYPE.TEXT, Const.FABRIC_TYPE.TEXTBOX].includes(target.type)) {
      target[`origin-text-${this.UUID}`] = target.text
      target.text = target.text.substr(0, maxLength) + (showMark ? '|' : "")
    }
  }

  resetTextShow(target) {
    target.text = target[`origin-text-${this.UUID}`]
    delete target[`origin-text-${this.UUID}`]
  }

}

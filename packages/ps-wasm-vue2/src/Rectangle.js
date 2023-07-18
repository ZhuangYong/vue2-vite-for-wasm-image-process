import Point from "./Point"
import {fabric} from './lib/fabric.min'

export default class Rectangle {
  x = 0
  y = 0
  width = 0
  height = 0

  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  static from(x, y, width, height) {
    return new Rectangle(x, y, width, height)
  }

  /**
   * 转换为点数组
   * @returns {({x: number, y: number}|{x: *, y: number}|{x: *, y: *}|{x: number, y: *})[]}
   */
  toPoints() {
    const { x, y, width, height } = this
    return [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height }
    ]
  }

  contains(point) {
    if (!(point instanceof Point)) {
      throw new Error('in valid type')
    }
    return point.x >= this.x && point.x <= this.x + this.width && point.y >= this.y && point.y <= this.y + this.height
  }

  /**
   * 是否相交
   * @param rect
   */
  isIntersect(rect) {
    if (!(rect instanceof Rectangle)) {
      throw new Error('in valid type')
    }
    return new fabric.Polygon(rect.toPoints()).intersectsWithObject(new fabric.Polygon(this.toPoints()))
  }
}

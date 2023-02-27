export default class Point {
  x = 0
  y = 0

  constructor(x, y) {
    this.x = x
    this.y = y
  }

  static from(x, y) {
    return new Point(x, y)
  }

}

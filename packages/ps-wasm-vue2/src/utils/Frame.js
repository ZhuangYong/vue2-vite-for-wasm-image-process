import _ from 'lodash'
import ImageHelper from '@/utils/ImageHelper'
import Canvas2Image from "@/utils/CanvasToImage";
import imageHelper from "@/utils/ImageHelper";
export default class Frame {

  UUID = `frame-${Math.random()}`

  duration = 0

  startTime = 0

  _objects = []

  _snapshot

  constructor() {
  }

  add() {
    this._objects.push(...arguments)
    this._objects.forEach(obj => obj.on('modified', this.onModify))
  }

  onModify() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      console.log('/???????????????????????')
      this._snapshot = null
    }, 400)

  }

  remove() {
    Array.from(arguments).forEach(obj => {
      const index = this._objects.findIndex(item => item.UUID === obj.UUID)
      this._objects.splice(index, 1)
      // ImageHelper.removeFromCanvas(...objects)
    })
  }

  async snapshot() {
    if (!this._snapshot) {
      if (_.isEmpty(this._objects)) {
        this._snapshot = null
      } else {
        console.log('>>>>>>>. gen snapshot')
        const canvasClone = await new Promise(resolve => ImageHelper.canvas.clone(resolve))
        canvasClone.clear();
        canvasClone.setZoom(imageHelper.canvas.getZoom())
        const cloneList = []
        await Promise.all(this._objects.map(obj => new Promise(resolve => obj.clone((clone) => {
          cloneList.push(clone)
          resolve()
        }))))
        canvasClone.add(...cloneList)
        // canvasClone.setZoom(1)
        const { originWidth: width, originHeight: height } = canvasClone
        this._snapshot = canvasClone.toDataURL({width, height, multiplier: 1, withoutTransform: true}) // 1, {width, height}
      }
    }
    return this._snapshot
  }

  // requestNextFrame(time) {
  //   if (time >= this.startTime && time < this.startTime + this.duration) {
  //     ImageHelper.addToCanvas(...this._objects)
  //   } else {
  //     ImageHelper.removeFromCanvas(...this._objects)
  //   }
  // }

}

import _ from 'lodash'
import ImageHelper from '@/utils/ImageHelper'
import {fabric} from "../lib/fabric.min";
export default class Frame {

  UUID = `frame-${Math.random()}`

  group

  duration = 0

  startTime = 0

  _objects = []

  _snapshot = null

  constructor() {
  }

  // getObjects(time) {
  //   time = time || 0
  //   this._objects.forEach(target => {
  //     const previewState = {...target._stateProperties}
  //     fabric.util.object.extend(target, previewState)
  //     const currentState = {}
  //     Object.keys(previewState).forEach(key => {
  //       currentState[key] = target[key]
  //     })
  //   })
  //   return [...this._objects]
  // }

  /**
   * 添加fabric对象
   */
  add() {
    this._objects.push(...arguments)
    this._objects.forEach(obj => obj.on('modified', () => {
      this._snapshot = null
      this.snapshot().then(() => {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          ImageHelper.canvas.fire('update:snapshot')
          this.timer = null
        }, 400)
      })
    }))
  }

  /**
   * 删除fabric对象
   */
  remove() {
    Array.from(arguments).forEach(obj => {
      const index = this._objects.findIndex(item => item.UUID === obj.UUID)
      this._objects.splice(index, 1)
    })
  }

  async cloneObjects() {
    return await Promise.all(this._objects.map(async (obj) => new Promise(resolve => obj.clone(clone => resolve(clone)))))
  }

  /**
   * 获取快照
   * @returns {Promise<null>}
   */
  async snapshot() {
    if (!this._snapshot) {
      if (_.isEmpty(this._objects)) {
        this._snapshot = null
      } else {
        // const canvasClone = await new Promise(resolve => ImageHelper.canvas.clone(resolve))
        // canvasClone.clear();
        // canvasClone.setZoom(ImageHelper.canvas.getZoom())
        const canvasClone = await ImageHelper.cloneClearCanvas()
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

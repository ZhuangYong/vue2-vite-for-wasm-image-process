import _ from 'lodash'
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
    this._objects.forEach(obj => this.initialObj(obj))
    // this._objects.forEach(obj => obj.on('modified', () => {
    //   console.log('------- on modify in frame')
    //   this._snapshot = null
    //   this.snapshot().then(() => {
    //     if (this.timer) {
    //       clearTimeout(this.timer)
    //     }
    //     this.timer = setTimeout(() => {
    //       ImageHelper.canvas.fire('update:snapshot')
    //       this.timer = null
    //     }, 400)
    //   })
    // }))
  }

  clearRender() {
    this._objects.forEach(obj => obj.ignore = true)
  }

  render() {
    this._objects.forEach(obj => obj.ignore = false)
    this.canvas.requestRenderAll()
  }

  /**
   * 初始话对象
   */
  initialObj(obj) {
    const onObjModified = this.onObjModified.bind(this)
    obj.on('removed', () => {
      obj.off('modified', onObjModified)
    })
    obj.on('modified', onObjModified)
  }

  onObjModified() {
    console.log('------- on modify in frame')
    this._snapshot = null
    this.snapshot().then(() => {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.canvas.fire('update:snapshot')
        this.timer = null
      }, 400)
    })
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

  /**
   * 从fabric中克隆对象
   * @returns {Promise<unknown[]>}
   */
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
        if (!this.loading) {
          this.loading = true
          const canvasClone = await this.cloneClearCanvas()
          const cloneList = await this.cloneObjects()
          canvasClone.add(...cloneList)
          const { originWidth: width, originHeight: height } = canvasClone
          this._snapshot = canvasClone.toDataURL({width, height, multiplier: 1, withoutTransform: true}) // 1, {width, height}
          this.loading = false
        }
      }
    }
    return this._snapshot
  }

  async cloneClearCanvas() {
    const canvasClone = await new Promise(resolve => this.canvas.clone(resolve))
    canvasClone.clear();
    canvasClone.originWidth = this.canvas.originWidth
    canvasClone.originHeight = this.canvas.originHeight
    canvasClone.backgroundColor = this.canvas.backgroundColor
    // canvasClone.setZoom(this.canvas.getZoom())
    return canvasClone
  }

  get canvas() {
    return (this._objects.find(item => !!item.canvas) || {}).canvas
  }

}

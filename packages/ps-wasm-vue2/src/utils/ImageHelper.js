import Point from "../Point"
import Rectangle from "../Rectangle"
import {fabric} from "../lib/fabric.min"
import {isImage} from "../utils/index"

export const COMMAND_TYPES = {
  EDIT: {
    MOVE_TOP_LAYER: {key: 'moveTopLayer', label: '置顶', keyMap: ''},
    MOVE_BOTTOM_LAYER: {key: 'moveBottomLayer', label: '置底', keyMap: ''},
    UP_LAYER: {key: 'upLayer', label: '上移一层', keyMap: ''},
    DOWN_LAYER: {key: 'downLayer', label: '下移一层', keyMap: ''},
    BACK: {key: 'back', label: '撤销', keyMap: 'ctrl + z'},
    REDO: {key: 'redo', label: '重做', keyMap: 'ctrl + y'},
    COPY: {key: 'copy', label: '复制', keyMap: 'ctrl + c'},
    PASTE: {key: 'paste', label: '粘贴', keyMap: 'ctrl + v'},
    DELETE: {key: 'delete', label: '删除', keyMap: 'del, back'}
  }
}

/**
 * 对象类型
 * @type {{I_TEXT: string, IMAGE: string}}
 */
class ImageHelper {
  _canvas
  constructor(canvas) {
    this._canvas = canvas
  }
  get canvas() {
    return this._canvas
  }

  set canvas(v) {
    this._canvas = v
  }

  handleCommand(command) {
    const target = this.canvas.getActiveObject()
    switch (command) {
      case COMMAND_TYPES.EDIT.DELETE.key: {
        if (target) {
          if (target._objects) {
            this.canvas.remove(...target._objects)
          } else {
            this.canvas.remove(target)
          }
          this.canvas.requestRenderAll()
        }
        break
      }

      case COMMAND_TYPES.EDIT.UP_LAYER.key:
        target && target.bringForward()
        break

      case COMMAND_TYPES.EDIT.DOWN_LAYER.key:
        target && target.sendBackwards()
        break

      case COMMAND_TYPES.EDIT.MOVE_TOP_LAYER.key:
        target && target.bringToFront()
        break

      case COMMAND_TYPES.EDIT.MOVE_BOTTOM_LAYER.key:
        target && target.sendToBack()
        break
    }
  }

  /**
   * 添加贴图
   * @param fabricDragEvent
   */
  addStroke(fabricDragEvent) {
    const { clientX, clientY } = fabricDragEvent.originalEvent
    const point = Point.from(clientX, clientY)
    const { x: canvasX, y: canvasY, width: canvasWidth, height: canvasHeight } = this.canvas.lowerCanvasEl.getBoundingClientRect()
    const intersects = Rectangle.from(canvasX, canvasY, canvasWidth, canvasHeight).contains(point)
    if (intersects) {
      const offset = {x: point.x - canvasX, y: point.y - canvasY}
      const img = fabricDragEvent.item.querySelector('img')
      fabric.Image.fromURL(img.src, shape => {
        const size = img.getAttribute('size')
        // 只有svg有size
        if (size) {
          const scale = 1.2
          let [width, height] = size.split(',').filter(str => str.trim()).filter(Boolean).map(Number)
          width = width * scale
          height = height * scale
          shape.set({ width, height, top: offset.y, left: offset.x, scaleX: 0.1, scaleY: 0.1, cornerSize: 7 })
          shape._element.height = height
          shape._element.width = width
          Object.defineProperty(shape._element, 'naturalWidth', { get: () => width })
          Object.defineProperty(shape._element, 'naturalHeight', { get: () => height })
        }
        this.canvas.add(shape)
        shape.on('selected', () => {
          this.currentObject = shape
        })
      })
    }
  }

  /**
   * 添加图片文件
   * @param file
   * @param option
   */
  uploadImage(file, option) {
    option = option || {}
    if (isImage(file.type)) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = e => {
        fabric.Image.fromURL(e.target.result, img => {
          const { width, height } = this.canvas
          const scale = Math.min(width/img.width, height/img.height)
          img.set({ scaleX: scale, scaleY: scale, ...option })
          this.canvas.add(img)
          img.on('selected', () => {
            this.currentObject = img
          })
        })
      }
    }
  }

  addText(text, option) {
    option = option || {}
    this.canvas.add(new fabric.Textbox(text, { left: 50, top: 50, fontSize: 30, cornerSize: 7, ...option }))
  }
}
const imageHelper = new ImageHelper(null)


export default imageHelper

import Point from "../Point"
import Rectangle from "../Rectangle"
import {fabric} from "@/lib/fabric.min"
import {isImage} from "@/utils/index"

export const defaultProps = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  scaleX: 1,
  scaleY: 1,
  angle: 0,
  text: '',
  // type: '',
  fontSize: 0,
  fontFamily: '',
  visible: true
}
export const COMMAND_TYPES = {
  EDIT: {
    MOVE_TOP_LAYER: {key: 'moveTopLayer', label: '置顶', keyMap: '', disableNoTarget: true},
    MOVE_BOTTOM_LAYER: {key: 'moveBottomLayer', label: '置底', keyMap: '', disableNoTarget: true},
    UP_LAYER: {key: 'upLayer', label: '上移一层', keyMap: '', disableNoTarget: true},
    DOWN_LAYER: {key: 'downLayer', label: '下移一层', keyMap: '', disableNoTarget: true},
    BACK: {key: 'back', label: '撤销', keyMap: 'ctrl + z'},
    REDO: {key: 'redo', label: '重做', keyMap: 'ctrl + y'},
    COPY: {key: 'copy', label: '复制', keyMap: 'ctrl + c'},
    PASTE: {key: 'paste', label: '粘贴', keyMap: 'ctrl + v'},
    DELETE: {key: 'delete', label: '删除', keyMap: 'del, back', disableNoTarget: true},
    VISIBLE: {key: 'visible', label: '显示/隐藏', keyMap: '', disableNoTarget: true}
  },
  RESIZE: {
    ACTIVE_OBJECT_WIDTH: {key: 'activeObjectWidth', label: '修改对象宽'},
    ACTIVE_OBJECT_HEIGHT: {key: 'activeObjectHeight', label: '修改对象宽'},
  }
}

export const scaleXtoWidth = ({ scaleX, width }) => (scaleX * width).toFixed(2)
export const scaleYtoHeight = ({ scaleY, height }) => (scaleY * height).toFixed(2)

const ignore = ['canvas']
const toFix = ['left', 'top', 'angle']
const formatter = { width: scaleXtoWidth, height: scaleYtoHeight }

/**
 * 对象类型
 * @type {{I_TEXT: string, IMAGE: string}}
 */
class ImageHelper {

  _canvas

  copyTarget

  constructor(canvas) {
    this._canvas = canvas
  }
  get canvas() {
    return this._canvas
  }

  set canvas(v) {
    this._canvas = v
  }

  handleCommand() {
    const [command, target, arg1, ...otherArgs] = Array.from(arguments)
    // const target = this.canvas.getActiveObject()
    if (!target) {
      return
    }
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

      /**
       * 拷贝
       */
      case COMMAND_TYPES.EDIT.COPY.key:
        this.copyTarget = target
        break

      /**
       * 粘贴
       */
      case COMMAND_TYPES.EDIT.PASTE.key:
        this.copyTarget = target
        break

      case COMMAND_TYPES.EDIT.UP_LAYER.key:
        target.bringForward()
        break

      case COMMAND_TYPES.EDIT.DOWN_LAYER.key:
        target.sendBackwards()
        break

      case COMMAND_TYPES.EDIT.MOVE_TOP_LAYER.key:
        target.bringToFront()
        break

      case COMMAND_TYPES.EDIT.MOVE_BOTTOM_LAYER.key:
        target.sendToBack()
        break

      case COMMAND_TYPES.EDIT.VISIBLE.key:
        target.visible = arg1
        break

      // 修改对象宽
      case COMMAND_TYPES.RESIZE.ACTIVE_OBJECT_WIDTH.key:
        if (arg1) {
          const newWidth = arg1
          const newScaleX = newWidth / target.width
          if (target.canvas.getActiveObject().scaleX === newScaleX) {
            return
          }
          console.log(newWidth,  target.width)
          target.canvas.getActiveObject().scaleX = newWidth / target.width
        }
        break
    }

    this.canvas.renderAll()
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
        this.addToCanvas(shape)
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
          this.addToCanvas(img)
          img.on('selected', () => {
            this.currentObject = img
          })
        })
      }
    }
  }

  /**
   * 监听对象修改
   * @param target
   * @returns {{scaleX: number, scaleY: number, fontFamily: string, visible: boolean, top: number, left: number, width: number, angle: number, fontSize: number, text: string, height: number}}
   */
  watchTarget(target) {
    const result = { ...defaultProps }
    if (target) {
      Object.keys(defaultProps).forEach(key => {
        if (!ignore.includes(key)) {
          Object.defineProperty(result, key, {
            get() {
              // console.log('..... get key', key)
              if (formatter[key]) {
                return formatter[key](target)
              } else if (toFix.includes(key)) {
                return (Number(target[key]) || 0).toFixed(2)
              } else {
                return target[key]
              }
            },
            set(v) {
              console.log('..... set key>> ', key)
              switch (key) {
                case 'width':
                  imageHelper.handleCommand(COMMAND_TYPES.RESIZE.ACTIVE_OBJECT_WIDTH.key, target, v)
                  break
                case 'visible':
                  imageHelper.handleCommand(COMMAND_TYPES.EDIT.VISIBLE.key, target, Boolean(v))
                  break
                default:
                  result[key] = target[key]
              }
            }
          })
        }
      })
    }

    return result
  }

  addText(text, option) {
    option = option || {}
    this.addToCanvas(new fabric.Textbox(text, { left: 50, top: 50, fontSize: 30, cornerSize: 7, ...option }))
  }

  addToCanvas() {
    Array.from(arguments).forEach(obj => {
      Object.keys(defaultProps).forEach(key => {
        if (!obj.hasOwnProperty(key)) {
          obj[key] = defaultProps[key]
        }
      })
    })
    this.canvas.add.apply(this.canvas, arguments)
  }
}
const imageHelper = new ImageHelper(null)


export default imageHelper

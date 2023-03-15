import Point from "../Point"
import Rectangle from "../Rectangle"
import {fabric} from "@/lib/fabric.min"
import {isImage, isMac} from "@/utils/index"
import {resetKey} from "@/utils/KeyCode";

/**
 * 对象默认属性
 * @type {{
 * scaleX: number,
 * scaleY: number,
 * fontFamily: string,
 * visible: boolean,
 * top: number,
 * left: number,
 * width: number,
 * angle: number,
 * fontSize: number,
 * text: string,
 * height: number
 * }}
 */
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

const CTRL_KEY = isMac() ? 'Command' : 'Control'
export const COMMAND_TYPES = {
  EDIT: {
    MOVE_TOP_LAYER: {key: 'moveTopLayer', label: '置顶', keyMap: '', disableNoTarget: true},
    MOVE_BOTTOM_LAYER: {key: 'moveBottomLayer', label: '置底', keyMap: '', disableNoTarget: true},
    UP_LAYER: {key: 'upLayer', label: '上移一层', keyMap: '', disableNoTarget: true},
    DOWN_LAYER: {key: 'downLayer', label: '下移一层', keyMap: '', disableNoTarget: true},
    SWITCH_INDEX: {key: 'switchIndex', label: '交换位置', keyMap: '', hidden: true},
    BACK: {key: 'back', label: '撤销', keyMap: `${CTRL_KEY} + z`},
    REDO: {key: 'redo', label: '重做', keyMap: `${CTRL_KEY} + y`},
    COPY: {key: 'copy', label: '复制', keyMap: `${CTRL_KEY} + c`, disableNoTarget: true},
    PASTE: {key: 'paste', label: '粘贴', keyMap:`${CTRL_KEY} + v`},
    DELETE: {key: 'delete', label: '删除', keyMap: 'del, Backspace', disableNoTarget: true},
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

const keyMaps = {}
Object.values(COMMAND_TYPES).forEach(type => Object.values(type).forEach(item => {
  if (item.keyMap) {
    item.keyMap.toLowerCase().split(',').filter(Boolean).map(str => str.trim()).filter(Boolean).forEach(subKeyMap => {
      const keyMap = subKeyMap.split('+').filter(Boolean).map(str => str.trim()).filter(Boolean) //.sort((a, b) => a > b ? 1 : -1)
      const keyMapStr = keyMap.join('+')
      if (keyMaps[keyMapStr]) {
        throw new Error('重复的快捷键！')
      }
      keyMaps[keyMapStr] = item
    })
  }
}))
const KEY_MAP_MAP_LIST = Object.values(keyMaps)
const KEY_MAP_KEY_LIST = Object.keys(keyMaps)

/**
 * 对象类型
 * @type {{I_TEXT: string, IMAGE: string}}
 */
class ImageHelper {
  // 回退历史记录操作
  back = []

  // 重做操作
  redo = []

  // canvas对象
  canvas

  // 拷贝对象
  copyTarget

  // 当前选择对象
  currentTarget

  // 当前鼠标移动事件对象
  currentMouseMoveEvent

  constructor(_canvas) {
    this.canvas = _canvas
  }

  registerKeyEvent(el) {
    let enabled = false
    let inputCode = ''
    let codeStart = false
    let checkTimer = null
    const checkLater = (e) => {
      if (checkTimer) {
        clearTimeout(checkTimer)
        checkTimer = null
      }
      checkTimer = setTimeout(() => {
        checkTimer = null
        const find = KEY_MAP_KEY_LIST.filter(str => str === inputCode)
        if (find.length === 1) {
          inputCode = ''
          const item = keyMaps[find[0]]
          this.handleCommand(item.key, this.currentTarget, e)
          console.log('>>> found', find[0])
        } else {
          const findStart = KEY_MAP_KEY_LIST.some(key => key.indexOf(inputCode) === 0)
          if (!findStart) {
            inputCode = ''
          } else {
            codeStart = true
          }
        }
      }, 0.6 * 100)
    }
    const onKeyDown = (e) => {
      if (!enabled) {
        return
      }
      if (codeStart) {
        e.stopPropagation()
        e.preventDefault()
      }
      const { key } = e
      const keyName = resetKey(key)
      if (!inputCode) {
        if (KEY_MAP_KEY_LIST.some(keyStr => keyStr.indexOf(keyName) === 0)) {
          inputCode = keyName
          codeStart = true
        }
      } else if (codeStart) {
        inputCode += `+${keyName}`
      }
      checkLater(e)
    }

    const onMousemove = (e) => {
      this.currentMouseMoveEvent = e
      const {clientX, clientY} = e
      if (el) {
        const {x, y, width, height} = el.getBoundingClientRect() || {}
        const rect = Rectangle.from(x, y, width, height)
        enabled = rect.contains(Point.from(clientX, clientY))
      } else {
        enabled = true
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousemove', onMousemove)
  }

  recordHistory(operate, clearRedo = true) {
    this.back.push(operate)
    if (clearRedo) {
      this.redo = []
    }
  }

  backFromHistory() {
    const operateFromHistory = this.back.pop()
    operateFromHistory && operateFromHistory.back.apply(this)
    this.redo.push(operateFromHistory)
  }

  redoFromHistory() {
    const operateFromRedo = this.redo.pop()
    operateFromRedo && operateFromRedo.redo.apply(this)
    this.recordHistory(operateFromRedo, false)
  }


  handleCommand() {
    const [command, target, arg1, arg2, arg3, ...otherArgs] = Array.from(arguments)
    // const target = this.canvas.getActiveObject()
    // if (typeof target === 'undefined') {
    //   return
    // }
    switch (command) {
      case COMMAND_TYPES.EDIT.BACK.key:
        console.log('----back')
        // const operateFromHistory = this.back.pop()
        // operateFromHistory && operateFromHistory.back.apply(this)
        // this.redo.push(operateFromHistory)
        this.backFromHistory()
        break
      case COMMAND_TYPES.EDIT.REDO.key:
        // const operateFromRedo = this.redo.pop()
        // operateFromRedo && operateFromRedo.redo.apply(this)
        // this.recordHistory(operateFromRedo, false)
        this.redoFromHistory()
        break

      case COMMAND_TYPES.EDIT.DELETE.key: {
        if (target) {
          if (target._objects) {
            this.canvas.remove(...target._objects)
          } else {
            this.canvas.remove(target)
          }
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
        const { x: canvasX, y: canvasY, width: canvasWidth, height: canvasHeight } = this.canvas.lowerCanvasEl.getBoundingClientRect()
        if (arg1 instanceof KeyboardEvent && this.currentMouseMoveEvent) {
          this.copyTarget.clone(o => {
            const { clientX, clientY } = this.currentMouseMoveEvent
            const x = Math.max(0, clientX - canvasX)
            const y = Math.max(0, clientY - canvasY)

            o.left = Math.min(x, canvasWidth)
            o.top = Math.min(y, canvasHeight)
            this.addToCanvas(o)
            // this.back.push({ back: () => this.canvas.remove(o), redo: () => this.addToCanvas(o)})
            this.recordHistory({ back: () => this.removeFromCanvas(o), redo: () => this.addToCanvas(o)})
          })
        } else {
          this.copyTarget.clone(o => {
            const pasteOffset = 20
            if (o.left < (1 / 2) * canvasWidth) {
              o.left += pasteOffset
            } else {
              o.left -= pasteOffset
            }
            if (o.top < (1 / 2) * canvasHeight) {
              o.left += pasteOffset
            } else {
              o.left -= pasteOffset
            }
            this.addToCanvas(o)
            this.recordHistory({ back: () => this.removeFromCanvas(o), redo: () => this.addToCanvas(o)})
            // this.back.push({ back: () => this.canvas.remove(o), redo: () => this.addToCanvas(o)})
          })
        }
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

      // 交换位置
      case COMMAND_TYPES.EDIT.SWITCH_INDEX.key:
        // const size = this.canvas._objects.length - 1
        // const oldIndex = size - target
        // const newIndex = size - arg1
        // const old = this.canvas._objects[oldIndex]
        // this.canvas._objects[oldIndex] = this.canvas._objects[newIndex]
        // this.canvas._objects[newIndex] = old
        break

      // 是否显示
      case COMMAND_TYPES.EDIT.VISIBLE.key:
        const visible = target.visible
        this.recordHistory({ back: () => target.visible = visible, redo: () => target.visible = arg1 })
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
          let { width, height } = img
          if (!width || !height) {
            [width, height] = size.split(',').filter(str => str.trim()).filter(Boolean).map(Number)
          }
          shape.set({ width, height, top: offset.y, left: offset.x, cornerSize: 7 })
          shape._element.height = height
          shape._element.width = width
          Object.defineProperty(shape._element, 'naturalWidth', { get: () => width })
          Object.defineProperty(shape._element, 'naturalHeight', { get: () => height })
        }
        this.addToCanvas(shape)
        this.recordHistory({ back: () => this.removeFromCanvas(shape), redo: () => this.addToCanvas(shape) })
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
          this.recordHistory({ back: () => this.removeFromCanvas(img), redo: () => this.addToCanvas(img) })
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

  /**
   * 添加文字
   * @param text
   * @param option
   */
  addText(text, option) {
    option = option || {}
    const textBox = new fabric.Textbox(text, { left: 50, top: 50, fontSize: 30, cornerSize: 7, ...option })
    this.addToCanvas(textBox)
    this.recordHistory({ back: () => this.removeFromCanvas(textBox), redo: () => this.addToCanvas(textBox) })
  }

  /**
   * 添加到canvas中
   */
  addToCanvas() {
    Array.from(arguments).forEach(obj => {
      Object.keys(defaultProps).forEach(key => {
        if (!obj.hasOwnProperty(key)) {
          obj[key] = defaultProps[key]
        }
        obj.cornerSize = 7
      })
      // !obj.UUID && (obj.UUID = Math.random())
    })
    this.canvas.add.apply(this.canvas, arguments)
  }

  /**
   * 从canvas中移除
   */
  removeFromCanvas() {
    this.canvas.remove.apply(this.canvas, arguments)
  }
}
const imageHelper = new ImageHelper(null)


export default imageHelper

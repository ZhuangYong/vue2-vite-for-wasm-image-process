import Point from "../Point"
import Rectangle from "../Rectangle"
import {fabric} from "@/lib/fabric.min"
import {ImageDataToBase64, isGif, isImage, isMac} from "@/utils"
import {resetKey} from "@/utils/KeyCode"
import _ from 'lodash'
import Const from "@/const";
import Canvas2Image from "@/utils/CanvasToImage";
import saveAs from "@/lib/FileSaver";
import testImg from "../../static/images/effect/e1.jpg"
import LibGif from '@/lib/libgif'
import timeLinePlayer from '@/utils/TimeLinePlayer'
import Frame from "@/utils/Frame"
import FrameGroup from "@/utils/FrameGroup"
import {Event} from "@/utils/Event"
import GIF from "@/lib/gif";
import gifWorker from "@/lib/gif.worker"
import {cloneCanvas} from "@/utils/CanvasUtils"

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
  fill: '#000000',
  fontSize: 0,
  fontFamily: '',
  visible: true
}

const FUNCTION_KEY = isMac() ? {
  CTRL_KEY: 'Command'
} : {
  CTRL_KEY: 'Control'
}
const FUNCTION_KEYS = Object.values(FUNCTION_KEY).map(key => resetKey(key))
export const COMMAND_TYPES = {
  EDIT: {
    MOVE_TOP_LAYER: {key: 'moveTopLayer', label: '置顶', keyMap: '', disabled: () => !imageHelper.currentTarget},
    MOVE_BOTTOM_LAYER: {key: 'moveBottomLayer', label: '置底', keyMap: '', disabled: () => !imageHelper.currentTarget},
    UP_LAYER: {key: 'upLayer', label: '上移一层', keyMap: '', disabled: () => !imageHelper.currentTarget},
    DOWN_LAYER: {key: 'downLayer', label: '下移一层', keyMap: '', disabled: () => !imageHelper.currentTarget},
    BACK: {key: 'back', label: '撤销', keyMap: `${FUNCTION_KEY.CTRL_KEY} + z`, disabled: () => _.isEmpty(imageHelper.back)},
    REDO: {key: 'redo', label: '重做', keyMap: `${FUNCTION_KEY.CTRL_KEY} + y`, disabled: () => _.isEmpty(imageHelper.redo)},
    COPY: {key: 'copy', label: '复制', keyMap: `${FUNCTION_KEY.CTRL_KEY} + c`, disabled: () => !imageHelper.currentTarget },
    PASTE: {key: 'paste', label: '粘贴', keyMap:`${FUNCTION_KEY.CTRL_KEY} + v`, disabled: () => !imageHelper.copyTarget},
    DELETE: {key: 'delete', label: '删除', keyMap: 'del, Backspace', disabled: () => !imageHelper.currentTarget},
    VISIBLE: {key: 'visible', label: '显示/隐藏', keyMap: '', disabled: () => !imageHelper.currentTarget},
    SWITCH_INDEX: {key: 'switchIndex', label: '交换位置', keyMap: '', hidden: true},
    CHANGE_FONT_COLOR: {key: 'changeFontColor', label: '修改字体颜色', keyMap: '', hidden: true},
    CHANGE_FONT_SIZE: {key: 'changeFontSize', label: '修改字体大小', keyMap: '', hidden: true},
    CHANGE_FONT_FAMILY: {key: 'changeFontFamily', label: '修改字体', keyMap: '', hidden: true}
  },
  RESIZE: {
    ACTIVE_OBJECT_WIDTH: {key: 'activeObjectWidth', label: '修改对象宽'},
    ACTIVE_OBJECT_HEIGHT: {key: 'activeObjectHeight', label: '修改对象高'},
    ACTIVE_OBJECT_LEFT: {key: 'activeObjectLeft', label: '修改对象左边距'},
    ACTIVE_OBJECT_TOP: {key: 'activeObjectTop', label: '修改对象上边距'},
    ACTIVE_OBJECT_ANGLE: {key: 'activeObjectAngle', label: '修改对象角度'},
  },
  CONTROL: {
    PLAY_OR_STOP: {key: 'playOrStrop', label: '播放/暂停', keyMap: `space`},
    PLAY_REVERSE: {key: 'playReverse', label: '正序/倒序'},
    PLAY_SPEED: {key: 'playSpeed', label: '倍速'},
  },
  ANIMATE: {
    APPLY: {key: 'applyAnimate', label: '应用动画'},
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
class ImageHelper extends Event {
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

  defaultProps = defaultProps

  // 画笔
  brushes = { vLinePatternBrush: null, hLinePatternBrush: null,squarePatternBrush: null,diamondPatternBrush: null,texturePatternBrush: null }

  constructor(_canvas) {
    super()
    this.canvas = _canvas
    this.initialBrush()
  }

  createCanvas(el) {
    fabric.enableGLFiltering = false
    const canvas = new fabric.Canvas(el, { stateful: true, controlsAboveOverlay: true, preserveObjectStacking: true })
    canvas.originWidth = 0
    canvas.originHeight = 0
    canvas.viewScale = 1
    canvas.gifMode = false
    // canvas.on('selection:updated', this.onSelect)
    // canvas.on('selection:created', this.onSelect)
    // canvas.on('selection:cleared', this.onSelect)
    // canvas.on('object:removed', this.onSelect)
    // canvas.on('dragover', this.onDragResourceOver)
    // canvas.on('dragleave', this.onDragResourceLeave)
    // canvas.on('object:added', e => console.log(e))
    canvas.on('object:modified', ({ target }) => {
      console.log('object:modified', target)
      const previewState = { ...target._stateProperties }
      const currentState = {}
      Object.keys(previewState).forEach(key => {
        currentState[key] = target[key]
      })
      // 修改back和redo
      this.recordHistory({
        back: () => fabric.util.object.extend(target, previewState) && target.fire('modified'),
        redo: () => fabric.util.object.extend(target, currentState) && target.fire('modified')
      })
      this.trigger('object:modified', { target })
    })
    canvas.isDrawingMode = false
    this.canvas = canvas
    this.trigger('initialized', canvas)
    return canvas
  }

  /**
   * 注册快捷键
   * @param el
   * @returns unregister {function(): void}
   */
  registerKeyEvent(el) {
    let enabled = false
    let inputCode = ''
    let codeStart = false
    let checkTimer = null
    const clearTimer = () => {
      if (checkTimer) {
        clearTimeout(checkTimer)
        checkTimer = null
      }
    }
    const checkLater = (e) => {
      clearTimer()
      // 延时以区分有包含关系的快捷键,如：ctrl + z 与 ctrl + z + y
      checkTimer = setTimeout(() => {
        checkTimer = null
        const find = KEY_MAP_KEY_LIST.filter(str => str === inputCode)
        if (find.length === 1) {
          inputCode = inputCode.split('+').filter(keyStr => FUNCTION_KEYS.includes(keyStr)).join('+')
          const item = keyMaps[find[0]]
          this.handleCommand(item.key, this.currentTarget, e)
          console.log('>>> found key code: ', find[0])
        }
      }, 0.6 * 100)
    }
    const onKeyDown = (e) => {
      if (!enabled || ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
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
    const onKeyup = ({ key }) => {
      const keyName = resetKey(key)
      if (codeStart) {
        setTimeout(() => {
          inputCode = inputCode.split('+').filter(keyStr => keyStr !== keyName && FUNCTION_KEYS.includes(keyStr)).join('+')
        }, 200)
      }
    }

    const onMouseout = () => {
      clearTimer()
      inputCode = ''
      codeStart = false
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
    document.addEventListener('keyup', onKeyup)
    el && el.addEventListener('mouseout', onMouseout)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousemove', onMousemove)
      document.removeEventListener('keyup', onKeyup)
      el && el.removeEventListener('mouseout', onMouseout)
    }
  }

  /**
   * 记录回退
   * @param operate {{ back: Function, redo: Function }}
   * @param clearRedo 是否情况redo
   */
  recordHistory(operate, clearRedo = true) {
    this.back.push(operate)
    if (clearRedo) {
      this.redo = []
    }
  }

  backFromHistory() {
    const operateFromHistory = this.back.pop()
    if (operateFromHistory) {
      operateFromHistory.back.apply(this)
      this.redo.push(operateFromHistory)
    }
  }

  redoFromHistory() {
    const operateFromRedo = this.redo.pop()
    if (operateFromRedo) {
      operateFromRedo.redo.apply(this)
      this.recordHistory(operateFromRedo, false)
    }
  }


  async handleCommand() {
    let modifyObject = false
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
          if (target.type === Const.FABRIC_TYPE.ACTIVE_SELECTION) {
            const list = [...target._objects]
            this.removeFromCanvas(...list)
            this.recordHistory({ back: () => this.addToCanvas(...list), redo: () => this.removeFromCanvas(...list)})
          } else {
            this.removeFromCanvas(target)
            this.recordHistory({ back: () => this.addToCanvas(target), redo: () => this.removeFromCanvas(target)})
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
        if (!this.copyTarget) {
          return
        }
        const { x: canvasX, y: canvasY, width: canvasWidth, height: canvasHeight } = this.canvas.lowerCanvasEl.getBoundingClientRect()
        // 粘贴时处理对象位置
        const handlePosition = o => {
          if (arg1 instanceof KeyboardEvent && this.currentMouseMoveEvent) {
            const { clientX, clientY } = this.currentMouseMoveEvent
            const x = Math.max(0, clientX - canvasX)
            const y = Math.max(0, clientY - canvasY)
            o.left = Math.min(x, canvasWidth)
            o.top = Math.min(y, canvasHeight)
          } else {
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
          }
          return o
        }
        this.copyTarget.clone(o => {
          handlePosition(o)
          if (_.isEmpty(o._objects)) {
            this.addToCanvas(o)
            this.recordHistory({ back: () => this.removeFromCanvas(o), redo: () => this.addToCanvas(o)})
          } else {
            o.canvas = this.canvas
            this.addToCanvas(o._objects)
            this.canvas.setActiveObject(o)
            this.recordHistory({
              back: () => {
                this.removeFromCanvas(o._objects)
                this.canvas.discardActiveObject()
              }, redo: () => {
                this.addToCanvas(o._objects)
              }
            })
          }
        })
        break

      // 图层上移
      case COMMAND_TYPES.EDIT.UP_LAYER.key:
        target.bringForward()
        break

      // 图层下移
      case COMMAND_TYPES.EDIT.DOWN_LAYER.key:
        target.sendBackwards()
        break

      // 图层移动到顶部
      case COMMAND_TYPES.EDIT.MOVE_TOP_LAYER.key:
        target.bringToFront()
        break

      // 图层移动到底部
      case COMMAND_TYPES.EDIT.MOVE_BOTTOM_LAYER.key:
        target.sendToBack()
        break

      // 交换位置
      case COMMAND_TYPES.EDIT.SWITCH_INDEX.key:
        const fromIndex = target
        const toIndex = target < arg1 ? arg1 - 1 : arg1
        this.changeLayer(fromIndex, toIndex)
        this.recordHistory({ back: () => this.changeLayer(toIndex, fromIndex), redo: () => this.changeLayer(fromIndex, toIndex) })
        break

      // 是否显示
      case COMMAND_TYPES.EDIT.VISIBLE.key:
        // const visible = target.visible
        if (target.visible !== arg1) {
          target.visible = arg1
          modifyObject = true
          // this.recordHistory({ back: () => target.visible = visible, redo: () => target.visible = arg1 })
        }
        break

      // 修改对象宽
      case COMMAND_TYPES.RESIZE.ACTIVE_OBJECT_WIDTH.key:
        const newScaleX = arg1 / target.width
        if (target.canvas.getActiveObject().scaleX !== newScaleX) {
          target.canvas.getActiveObject().scaleX = newScaleX
          modifyObject = true
        }
        break

      // 修改对象高
      case COMMAND_TYPES.RESIZE.ACTIVE_OBJECT_HEIGHT.key:
        const newScaleY = arg1 / target.height
        if (target.canvas.getActiveObject().scaleX !== newScaleY) {
          target.canvas.getActiveObject().scaleY = newScaleY
          modifyObject = true
        }
        break

      // 修改对象顶部距离
      case COMMAND_TYPES.RESIZE.ACTIVE_OBJECT_TOP.key:
        if (target.canvas.getActiveObject().top !== arg1) {
          target.canvas.getActiveObject().top = arg1
          modifyObject = true
        }
        break

      // 修改对象左边距离
      case COMMAND_TYPES.RESIZE.ACTIVE_OBJECT_LEFT.key:
        if (target.canvas.getActiveObject().left !== arg1) {
          target.canvas.getActiveObject().left = arg1
          modifyObject = true
        }
        break

      // 修改对象旋转角度
      case COMMAND_TYPES.RESIZE.ACTIVE_OBJECT_ANGLE.key:
        if (target.canvas.getActiveObject().angle !== arg1) {
          target.canvas.getActiveObject().angle = arg1
          modifyObject = true
        }
        break

      // 修改字体
      case COMMAND_TYPES.EDIT.CHANGE_FONT_FAMILY.key:
        const oldFontFamily = target.fontFamily
        if (oldFontFamily !== arg1) {
          target.set('fontFamily', arg1)
          this.recordHistory({ back: () => target.fontFamily = oldFontFamily, redo: () => target.fontFamily = arg1 })
          modifyObject = true
        }
        break

      // 修改文字颜色
      case COMMAND_TYPES.EDIT.CHANGE_FONT_COLOR.key:
        const oldColor = target.fill
        if (oldColor !== arg1) {
          target.set('fill', arg1)
          this.recordHistory({ back: () => target.fill = oldColor, redo: () => target.fill = arg1 })
          modifyObject = true
        }
        break
      // 修改文字大小
      case COMMAND_TYPES.EDIT.CHANGE_FONT_SIZE.key:
        const oldSize = target.fontSize
        if (oldSize !== arg1) {
          target.set('fontSize', arg1)
          this.recordHistory({ back: () => target.fontSize = oldSize, redo: () => target.fontSize = arg1 })
          modifyObject = true
        }
        break

      // 播放或暂停
      case COMMAND_TYPES.CONTROL.PLAY_OR_STOP.key:
        this.clearActiveObjects()
        timeLinePlayer.togglePlay()
        break

      // 应用动画
      case COMMAND_TYPES.ANIMATE.APPLY.key:
        const animateName = arg1
        const frameGroup = timeLinePlayer.findGroupByTarget(target)
        if (frameGroup) {
          await frameGroup.applyAnimate(timeLinePlayer.keyFrameTime, animateName).then(() => this.trigger('applyAnimate'))
        }
        break

      // 播放翻转修改
      case COMMAND_TYPES.CONTROL.PLAY_REVERSE.key:
        timeLinePlayer.reverse = arg1 || false
        break

      // 播放速度修改
      case COMMAND_TYPES.CONTROL.PLAY_SPEED.key:
        timeLinePlayer.speed = arg1 || 1
        break

    }

    // 如果修改过
    if (modifyObject) {
      this.canvas.fire('object:modified', { target })
    }
    // 渲染
    this.requestRenderAll()
  }

  /**
   * 添加贴图
   * @param fabricDragEvent
   */
  addStroke(fabricDragEvent) {
    const scale = this.canvas.viewScale
    // 直接添加base64
    if (typeof fabricDragEvent === 'string') {
      fabric.Image.fromURL(fabricDragEvent, shape => {
        shape.set({ scaleX: 1 / scale, scaleY: 1 / scale, top: this.canvas.width * 0.3 / scale, left: this.canvas.width * 0.3 / scale, cornerSize: 7 })
        this.addToCanvas(shape)
        this.recordHistory({ back: () => this.removeFromCanvas(shape), redo: () => this.addToCanvas(shape) })
      })
    } else {
      const { clientX, clientY } = fabricDragEvent.originalEvent
      const point = Point.from(clientX, clientY)
      const { x: canvasX, y: canvasY, width: canvasWidth, height: canvasHeight } = this.canvas.lowerCanvasEl.getBoundingClientRect()
      const intersects = Rectangle.from(canvasX, canvasY, canvasWidth, canvasHeight).contains(point)
      if (intersects) {
        const offset = {x: (point.x - canvasX) / scale, y: (point.y - canvasY) / scale}
        const img = fabricDragEvent.item.querySelector('img')
        fabric.Image.fromURL(img.src, shape => {
          const size = img.getAttribute('size')
          let { width, height } = img
          if (size && (!width || !height)) {
            [width, height] = size.split(',').filter(str => str.trim()).filter(Boolean).map(Number)
          }
          shape.set({ width, height, scaleX: 1 / scale, scaleY: 1 / scale, top: offset.y, left: offset.x, cornerSize: 7 })
          shape._element.height = height
          shape._element.width = width
          Object.defineProperty(shape._element, 'naturalWidth', { get: () => width })
          Object.defineProperty(shape._element, 'naturalHeight', { get: () => height })

          this.addToCanvas(shape)
          if (this.canvas.gifMode) {
            timeLinePlayer.addObjectAsFrameGroup(shape)
          } else {
            this.recordHistory({ back: () => this.removeFromCanvas(shape), redo: () => this.addToCanvas(shape) })
          }
        })
      }
    }
  }

  /**
   * 添加文字
   * @param text
   * @param option
   */
  addText(text, option) {
    option = option || {}
    const textBox = new fabric.Text(text, { left: 50, top: 50, fontSize: 30, cornerSize: 7, ...option })
    this.addToCanvas(textBox)
    if (this.canvas.gifMode) {
      timeLinePlayer.addObjectAsFrameGroup(textBox)
    } else {
      this.recordHistory({ back: () => this.removeFromCanvas(textBox), redo: () => this.addToCanvas(textBox) })
    }
  }

  /**
   * 将文件当作gif解析并上传
   * @param file
   * @param option
   * @returns {Promise<void>}
   */
  async uploadGif(file, option) {
    option = option || {}
    // 解析gif
    const rawFrames = await this.splitGif(file)
    // 不为空才继续解析
    if (!_.isEmpty(rawFrames)) {
      // 上一帧
      let preFrame
      // 元素帧数组
      const frames = rawFrames.map(frame => {
        // 帧信息
        const item = { UUID: Math.random(), duration: frame.delay * 10, url: frame.data, startTime: 0 }
        if (preFrame) {
          // 开始时间为上一帧开始时间加上上一帧的持续时间
          item.startTime = preFrame.startTime + preFrame.duration
        }
        preFrame = item
        return item
      })

      // 将gif解析后的url转为fabric对象
      await Promise.all(frames.map(async (frame) => {
        // 将imageData转为base64
        frame.url = await ImageDataToBase64(frame.url)
        // 转为fabric对象
        frame.img = await new Promise(resolve => fabric.Image.fromURL(frame.url, img => resolve(img)))
      }))
      // 帧时间与出现次数统计对象
      const frameTimes = {}
      // 对帧时间出现次数计数
      frames.forEach(frame => (frameTimes[frame.duration] = (frameTimes[frame.duration] || 0) + 1))
      // 帧最多的次数
      const max = Object.values(frameTimes).sort().pop()
      // 最多次数的帧时间，可能是数组，从中选取时间最大的
      const maxTime = Object.keys(frameTimes).filter(duration => frameTimes[duration] === max).reduce((a, b) => a > b ? a : b)
      // 帧时间
      const frameTime = Number(Object.keys(frameTimes).find(key => key === maxTime))
      // 总时间
      const duration = frames.reduce((a, b) => a + b.duration, 0)
      // 关键帧的开始时间
      // const keyFrameTime = frames.map(frame => frame.startTime)
      // 片段对象
      const frameGroup = new FrameGroup(frames.map(frame => {
        // 一帧
        const keyFrame = new Frame()
        // 图片初始化
        frame.img.set({...option, ignore: true, selectable: false, hoverCursor: 'default'})
        // 帧时间
        keyFrame.duration = frame.duration
        // 帧开始时间
        keyFrame.startTime = frame.startTime
        // 将对象添加到帧
        keyFrame.add(frame.img)
        // 将对象添加到舞台
        this.addToCanvas(frame.img)
        return keyFrame
      }))
      // 重置播放
      timeLinePlayer.reset({ frameTime, duration, frameGroups: [frameGroup] })
      // 开启gif模式
      this.canvas.gifMode = true
    }
  }

  /**
   * 添加图片文件
   * @param file
   * @param option
   */
  async uploadImage(file, option) {
    option = option || {}
    if (isGif(file.type)) {
      await this.uploadGif(file, option)
    } else if (isImage(file.type)) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = e => {
        fabric.Image.fromURL(e.target.result, async (img) => {
          img.set(option)
          this.addToCanvas(img)
          if (this.canvas.gifMode) {
            timeLinePlayer.addObjectAsFrameGroup(img)
          } else {
            this.recordHistory({ back: () => this.removeFromCanvas(img), redo: () => this.addToCanvas(img) })
          }
        })
      }
    }
  }

  /**
   * 监听对象修改
   * @param target
   * @returns {{
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
                case 'fontFamily':
                  imageHelper.handleCommand(COMMAND_TYPES.EDIT.CHANGE_FONT_FAMILY.key, target, v)
                // default:
                //   result[key] = target[key]
              }
            }
          })
        }
      })
    }

    return result
  }

  debounce(fun) {

  }

  /**
   * 刷新舞台可视尺寸
   */
  refreshStageView() {
    console.log('-----refreshStageView')
    let { originWidth: width, originHeight: height } = this.canvas
    width = width || this.canvas.width
    height = height || this.canvas.height
    let scale = 1
    // 找到最外层显示视窗宽高限制元素
    let boundEl = this.canvas.lowerCanvasEl
    while (boundEl && !boundEl.classList.contains(Const.MAIN_STAGE_CLASS) && boundEl.parentNode !== boundEl) {
      boundEl = boundEl.parentNode
    }
    // 计算缩放，图片宽高默认不超过最外层限制视窗
    if (boundEl && boundEl.classList.contains(Const.MAIN_STAGE_CLASS)) {
      const {width: boundWidth, height: boundHeight} = boundEl.getBoundingClientRect()
      scale = Math.min(1, Math.min(boundWidth / width, boundHeight / height))
    }
    this.canvas.viewScale = scale
    this.canvas.setZoom(scale)
    this.canvas.setDimensions({ width: width * scale, height: height * scale })
  }

  /**
   * 新建文件
   * @param option
   */
  newSage(option) {
    const {width, height} = option
    this.canvas.originWidth = width
    this.canvas.originHeight = height
    // 清空所有对象
    this.canvas.clear()
    // 清空历史记录
    this.redo = this.back = []
    // 刷新舞台显示大小
    this.refreshStageView()
  }

  newPicture(option) {
    this.newSage(option)
    this.addText('Hi welcome')
  }

  /**
   * 从json中加载
   * @param json
   * @param callback
   * @param reviver
   */
  importFromJson(json, callback, reviver) {
    if (typeof  json === 'string') {
      json = JSON.parse(json)
    }
    const { viewScale: scale, originWidth: width, originHeight: height } = json
    this.canvas.loadFromJSON(json, callback, reviver)
    this.canvas.setZoom(scale)
    this.canvas.setDimensions({ width: width * scale, height: height * scale })
  }

  async download() {
    if (this.canvas.gifMode) {
      await this.downloadGif()
    } else {
      this.downloadPng()
    }
  }

  /**
   * 导出为png
   */
  downloadPng() {
    const zoom = this.canvas.getZoom()
    this.canvas.setZoom(1)
    const { originWidth: width, originHeight: height } = this.canvas
    Canvas2Image.saveAsPNG(this.canvas.toCanvasElement(1, {width, height}), width, height)
    this.canvas.setZoom(zoom)
  }

  async downloadGif() {
    await this.exportAsGif()
  }

  /**
   * 导出源文件
   */
  downloadJson() {
    const json = this.canvas.toJSON(['UUID', 'originWidth', 'originHeight', 'viewScale', 'width', 'height', 'gifMode'])
    saveAs(new Blob([JSON.stringify(json)], {type: 'text/plain'}), '导出' + '.json')
  }

  /**
   * 导出gif
   * @returns {Promise<void>}
   */
  async exportAsGif() {
    const canvasClone = await this.cloneClearCanvas()
    const { originWidth: width, originHeight: height } = canvasClone
    const gif = new GIF({ workers: 2, quality: 1, width, height, workerScript: gifWorker, background: canvasClone.backgroundColor });
    const [start, end] = timeLinePlayer.getLimit()
    for (let i = 0; i < timeLinePlayer.keyFrameTime.length; i++) {
      const time = timeLinePlayer.keyFrameTime[i]
      if (time >= start && time <= end) {
        const delay = (timeLinePlayer.keyFrameTime[i + 1] || timeLinePlayer.duration) - time
        const canvas = await timeLinePlayer.timeToCanvas(time, canvasClone)
        gif.addFrame(canvas, {delay})
      }
    }
    return new Promise(resolve => {
      gif.on('finished', blob => resolve(saveAs(blob, '导出' + '.gif')));
      gif.render()
    })
  }

  /**
   * 添加到canvas中
   */
  addToCanvas() {
    // if (!_.isEmpty(arguments) && !this.canvas.originWidth) {
    //   this.initial(arguments[0])
    // }
    const objs = arguments[0] instanceof Array ? arguments[0] : Array.from(arguments)
    objs.forEach(obj => {
      this.initialObject(obj)
      Object.keys(defaultProps).forEach(key => {
        if (!obj.hasOwnProperty(key)) {
          obj[key] = defaultProps[key]
        }
        obj.cornerSize = 7
        obj.perPixelTargetFind = true
      })
      // !obj.UUID && (obj.UUID = Math.random())
    })
    this.canvas.add.apply(this.canvas, objs)
  }

  /**
   * 从canvas中移除
   */
  removeFromCanvas() {
    const objs = arguments[0] instanceof Array ? arguments[0] : arguments
    this.canvas.remove.apply(this.canvas, objs)
  }

  /**
   * 清空画布
   */
  cleanCanvas() {
    this.canvas.clear()
    this.requestRenderAll()
  }

  requestRenderAll() {
    this.canvas.requestRenderAll()
  }

  initialObject(target) {
    const { width, height } = target
    // 未初始化过
    if (this.canvas.originWidth) {
      const { viewScale, width: canvasWidth, height: canvasHeight } = this.canvas
      // 如果添加元素比画布大进行缩放
      if (!target.initialed && (width * viewScale > canvasWidth || height * viewScale > canvasHeight)) {
        const scale = Math.min(1, Math.min(canvasWidth / (width  * viewScale), canvasHeight / (height  * viewScale)))
        target.scaleX = scale
        target.scaleY = scale
        target.initialed = true
      }
    } else {
      // let scale = 1
      // // 找到最外层显示视窗宽高限制元素
      // let boundEl = this.canvas.lowerCanvasEl
      // while (boundEl && !boundEl.classList.contains(Const.MAIN_STAGE_CLASS) && boundEl.parentNode !== boundEl) {
      //   boundEl = boundEl.parentNode
      // }
      // // 计算缩放，图片宽高默认不超过最外层限制视窗
      // if (boundEl && boundEl.classList.contains(Const.MAIN_STAGE_CLASS)) {
      //   const {width: boundWidth, height: boundHeight} = boundEl.getBoundingClientRect()
      //   scale = Math.min(1, Math.min(boundWidth / width, boundHeight / height))
      // }
      // 元素必须在初始位置
      target.top = 0
      target.left = 0

      this.newSage({ width, height})
      // 初始化画布，大小按初始元素而定
      // this.canvas.viewScale = scale
      // this.canvas.originWidth = width
      // this.canvas.originHeight = height
      // this.canvas.setZoom(scale)
      // this.canvas.setDimensions({ width: width * scale, height: height * scale })
    }
  }

  /**
   * 交换layer
   * @param fromIndex
   * @param toIndex
   */
  changeLayer(fromIndex, toIndex) {
    const size = this.canvas._objects.length
    const currentIndex = size - fromIndex - 1
    const [currentTarget] = this.canvas._objects.splice(currentIndex, 1)
    this.canvas._objects.splice(size - toIndex - 1, 0, currentTarget)
  }

  renderAll() {
    console.log('---- renderAll')
    return this.canvas && this.canvas.renderAll()
  }

  /**
   * 初始化画笔
   */
  initialBrush() {
    const { canvas } = this
    const vLinePatternBrush = new fabric.PatternBrush(canvas)
    vLinePatternBrush.getPatternSrc = function() {

      const patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      const ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(10, 5);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    const hLinePatternBrush = new fabric.PatternBrush(canvas);
    hLinePatternBrush.getPatternSrc = function() {

      const patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      const ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    const squarePatternBrush = new fabric.PatternBrush(canvas);
    squarePatternBrush.getPatternSrc = function() {

      const squareWidth = 10, squareDistance = 2;

      const patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
      const ctx = patternCanvas.getContext('2d');

      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, squareWidth, squareWidth);

      return patternCanvas;
    };

    const diamondPatternBrush = new fabric.PatternBrush(canvas);
    diamondPatternBrush.getPatternSrc = function() {

      const squareWidth = 10, squareDistance = 5;
      const patternCanvas = fabric.document.createElement('canvas');
      const rect = new fabric.Rect({
        width: squareWidth,
        height: squareWidth,
        angle: 45,
        fill: this.color
      });

      const canvasWidth = rect.getBoundingRect().width;

      patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
      rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

      const ctx = patternCanvas.getContext('2d');
      rect.render(ctx);

      return patternCanvas;
    };

    const img = new Image();
    img.src = testImg

    const texturePatternBrush = new fabric.PatternBrush(canvas);
    texturePatternBrush.source = img;

    this.brushes['vLinePatternBrush'] = vLinePatternBrush
    this.brushes['hLinePatternBrush'] = hLinePatternBrush
    this.brushes['squarePatternBrush'] = squarePatternBrush
    this.brushes['diamondPatternBrush'] = diamondPatternBrush
    this.brushes['texturePatternBrush'] = texturePatternBrush
  }

  getBrush(type) {
    let brush
    switch (type) {
      case "vLine":
        brush = this.brushes.vLinePatternBrush
        break
      case "hLine":
        brush = this.brushes.hLinePatternBrush
        break
      case "square":
        brush = this.brushes.squarePatternBrush
        break;
      case "diamond":
        brush = this.brushes.diamondPatternBrush
        break;
      case "texture":
        brush = this.brushes.texturePatternBrush
        break;
      default:
        brush = new fabric[type + 'Brush'](this.canvas)
    }
    return brush
  }

  /**
   * 修改canvas宽高
   * @param width
   * @param height
   */
  resizeCanvas(width, height) {
    const { viewScale } = this.canvas
    this.canvas.originWidth = width
    this.canvas.originHeight = height
    this.canvas.setDimensions({ width: width * viewScale, height: height * viewScale })
  }

  /**
   * 拷贝canvas实例
   * @returns {Promise<unknown>}
   */
  async cloneClearCanvas() {
    return await cloneCanvas(this.canvas, true)
  }

  /**
   * 将gif拆分
   * @param file
   */
  splitGif(file) {
    return new Promise(resolve => {
      const gifImg = document.createElement('img')
      gifImg.style.position = 'fixed'
      gifImg.style.width = '1px'
      gifImg.style.height = '1px'
      gifImg.style.opacity = '0.001'
      gifImg.setAttribute('rel:animated_src', URL.createObjectURL(file))
      gifImg.setAttribute('rel:auto_play', '0')
      document.body.appendChild(gifImg)
      const gif = new LibGif({ gif: gifImg, loadOnly: true, show_progress_bar: false })
      gif.load(() => {
        // const img_list = []
        // for (let i=1; i <= rub.get_length(); i++) {
        //   rub.move_to(i)
        //   let cur_file = this.convertCanvasToImage(rub.get_canvas(), file.name.replace('.gif', '') + `-${i}`)
        // }
        resolve([...gif.get_frames()])
      })
    })
  }

  /**
   * 清空对象选择
   * @param e
   */
  clearActiveObjects(e) {
    this.canvas.discardActiveObject(e)
    this.requestRenderAll()
  }
}
const imageHelper = new ImageHelper(null)


export default imageHelper

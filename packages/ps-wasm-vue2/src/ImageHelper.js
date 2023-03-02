import Point from "./Point";
import Rectangle from "./Rectangle";
import {fabric} from "./lib/fabric.min";
import {isImage} from "./utils";

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
    if (!this._canvas) {
      throw new Error('not set canvas yet')
    }
    return this._canvas
  }

  set canvas(v) {
    this._canvas = v
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

export default new ImageHelper(null)

import imageHelper from "@/utils/ImageHelper";

let fabric
export default function enhance(_fabric) {
  if (_fabric) {
    fabric = _fabric

    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.cornerColor = '#009987'
    fabric.Object.prototype.cornerStyle = 'circle'
    // const createClass = fabric.util.createClass
    // fabric.util.createClass = function() {
    //   const klass = createClass.apply(this, arguments)
    //   const klassInitialize = klass.prototype.initialize
    //   klass.prototype.initialize = function() {
    //     this._UUID = Math.random()
    //     return klassInitialize.apply(this, arguments)
    //   }
    //   return klass
    // }
    addUUID()
    filterHidden()
    modifyFreeDraw()
  }
}

function addUUID() {
  if (!fabric.Canvas.prototype._old_add) {
    fabric.Canvas.prototype._old_add = fabric.Canvas.prototype.add
    fabric.Canvas.prototype.add = function () {
      for (let i = 0, length = arguments.length; i < length; i++) {
        !arguments[i].UUID && (arguments[i].UUID = Math.random())
      }
      return fabric.Canvas.prototype._old_add.apply(this, arguments)
    }
  }
}

/**
 * 隐藏对象不渲染
 */
function filterHidden() {
  if (!fabric.Canvas.prototype._old_chooseObjectsToRender) {
    fabric.Canvas.prototype._old_chooseObjectsToRender = fabric.Canvas.prototype._chooseObjectsToRender
    fabric.Canvas.prototype._chooseObjectsToRender = function () {
      let objects = fabric.Canvas.prototype._old_chooseObjectsToRender.apply(this, arguments)
      if (objects) {
        objects = objects.filter(item => !!item.visible)
      }
      return objects
    }
  }
}

/**
 * 修改画笔逻辑
 */
function modifyFreeDraw() {
  multiDrawPencilBrush()
}

/**
 * 铅笔改为多笔画
 */
function multiDrawPencilBrush() {
  fabric.PencilBrush.prototype._finalizeAndAddPath = function () {
    const ctx = this.canvas.contextTop;
    ctx.closePath();
    if (this.decimate) {
      this._points = this.decimatePoints(this._points, this.decimate);
    }
    const pathData = this.convertPointsToSVGPath(this._points);
    if (this._isEmptySVGPath(pathData)) {
      // do not create 0 width/height paths, as they are
      // rendered inconsistently across browsers
      // Firefox 4, for example, renders a dot,
      // whereas Chrome 10 renders nothing
      this.canvas.requestRenderAll();
      return;
    }

    let group = (this.canvas._chooseObjectsToRender() || []).pop() || {}
    const path = this.createPath(pathData);
    if (group.drawable) {
      group.addWithUpdate(path)
      imageHelper.recordHistory({back: () => group.removeWithUpdate(path), redo: () => group.addWithUpdate(path)})
    } else {
      group = new fabric.Group([path]);
      group.drawable = true
      group.visible = true
      group.canvas = this.canvas
      this.canvas.fire('before:path:created', { path: group })
      // this.canvas.add(group);
      imageHelper.addToCanvas(group)
      imageHelper.recordHistory({back: () => imageHelper.removeFromCanvas(group), redo: () => imageHelper.addToCanvas(group)})
      // fire event 'path' created
      this.canvas.fire('path:created', { path: group })
    }
    path.setCoords();
    this.canvas.clearContext(this.canvas.contextTop)
    this._resetShadow();
    this.canvas.requestRenderAll();
  }
}


let canvas
export default function enhance(_canvas) {
  if (_canvas) {
    canvas = _canvas
    filterHidden()
  }
}

function filterHidden() {
  if (!canvas._old_chooseObjectsToRender) {
    canvas._old_chooseObjectsToRender = canvas._chooseObjectsToRender
    canvas._chooseObjectsToRender = function () {
      let objects = canvas._old_chooseObjectsToRender.apply(canvas, arguments)
      if (objects) {
        objects = objects.filter(item => !!item.visible)
      }
      return objects
    }
  }
}

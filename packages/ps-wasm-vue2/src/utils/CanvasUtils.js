/**
 * 拷贝一个无任何元素的canvas实例化对象
 * @param canvas
 * @param clear 是否清除所有元素
 * @returns {Promise<unknown>}
 */
export async function cloneCanvas(canvas, clear = false) {
  const canvasClone = await new Promise(resolve => canvas.clone(resolve))
  clear && canvasClone.clear();
  canvasClone.originWidth = canvas.originWidth
  canvasClone.originHeight = canvas.originHeight
  canvasClone.backgroundColor = canvas.backgroundColor
  // canvasClone.setZoom(canvas.getZoom())
  return canvasClone
}

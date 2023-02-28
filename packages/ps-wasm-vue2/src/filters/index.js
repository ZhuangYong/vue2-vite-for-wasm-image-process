import {loadBlobWebAssembly} from "../wasmHelper"
import imageProcess from "../lib/imageProcess.wasm"

let wasmInstance
loadBlobWebAssembly(imageProcess).then(instance => (wasmInstance = instance))

/**
 * 测试处理图片的方法
 * @param imageData
 * @param args
 */
export function GaussBlurFilter(imageData, args) {
  const { width, height } = imageData
  wasmInstance.exports.gaussBlur(imageData, width, height)
  // console.warn('调用了wasm测试处理图片的方法(实际是个加法：333+555)：', wasmInstance.exports.add(333, 555))
}
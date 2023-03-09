import {loadBlobWebAssembly} from "@/utils/wasmHelper"
// import imageProcess from "@/lib/photon_rs_bg.wasm"
// import * as wasmImportJs from "@/lib/photon_rs_bg.js"
//
// let wasmInstance
// loadBlobWebAssembly(imageProcess, {'./photon_rs_bg.js': wasmImportJs}).then(instance => {
//   wasmInstance = instance
//   wasmImportJs.__wbg_set_wasm(instance.exports)
// })
//
import imageProcess from "@/lib/photon_bg.wasm"
import * as wasmImportJs from "@/lib/photon.js"

let wasmInstance
loadBlobWebAssembly(imageProcess, {'./photon': wasmImportJs}).then(instance => {
  wasmInstance = instance
  wasmImportJs.__wbg_set_wasm(instance.exports)
})


/**
 * 测试处理图片的方法
 * @param imageData
 * @param canvasEl
 * @param args
 */
export function GaussBlurFilter({imageData}, args) {
  const { width, height } = imageData
  const un8arr = wasmImportJs.to_raw_pixels(imageData)
  const img = new wasmImportJs.PhotonImage(un8arr, width, height)
  wasmImportJs.offset(img, 0, 30)
  // wasmImportJs.filter(img)
  const data = img.get_image_data().data
  for (let i = 0; i < un8arr.length; i++) {
    imageData.data[i] = data[i]
  }
  img.free()
  console.log('----- do filter')
}

export async function testFilter(base64) {
  const [, content] = base64.split(',')
  const img = wasmImportJs.PhotonImage.new_from_base64(content)
  wasmImportJs.offset(img, 0, 30)
  console.log(img.get_base64)
  return await ImageDataToBase64(img.get_image_data())
}

const ImageDataToBase64 = function(imageData){
  let w = imageData.width;
  let h = imageData.height;
  let canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  let ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);        // synchronous
  return new Promise((resolve) => {
    canvas.toBlob(blob => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = function (e) {
        resolve(e.target.result);
      }
    }); // implied image/png format
  });
}

// import {loadBlobWebAssembly} from "@/utils/wasmHelper"
// import imageProcess from "@/lib/photonCustom/photon_rs_bg.wasm"
import {photon} from "@/filters/PhotonHelper"
import e1 from '@/../static/images/effect/e1.png'
import e2 from '@/../static/images/effect/e2.png'
import e3 from '@/../static/images/effect/e3.png'
import e4 from '@/../static/images/effect/e4.png'
import e5 from '@/../static/images/effect/e1.png'
import e6 from '@/../static/images/effect/e1.png'
import {fabric} from "@/lib/fabric.min";
import imageHelper from "@/utils/ImageHelper";
//
// let wasmInstance
// loadBlobWebAssembly(imageProcess, {'./photon_rs_bg.js': wasmImportJs}).then(instance => {
//   wasmInstance = instance
//   wasmImportJs.__wbg_set_wasm(instance.exports)
// })
//
// // import imageProcess from "@/lib/photon_bg.wasm"
// // import * as wasmImportJs from "@/lib/photon.js"
// //
// // let wasmInstance
// // loadBlobWebAssembly(imageProcess, {'./photon': wasmImportJs}).then(instance => {
// //   wasmInstance = instance
// //   wasmImportJs.__wbg_set_wasm(instance.exports)
// // })
//
//
// /**
//  * 测试处理图片的方法
//  * @param imageData
//  * @param canvasEl
//  * @param args
//  */
// export function GaussBlurFilter({imageData}, args) {
//   const { width, height } = imageData
//   const un8arr = wasmImportJs.to_raw_pixels(imageData)
//   const img = new wasmImportJs.PhotonImage(un8arr, width, height)
//   wasmImportJs.offset(img, 0, 30)
//   // wasmImportJs.filter(img)
//   const data = img.get_image_data().data
//   for (let i = 0; i < un8arr.length; i++) {
//     imageData.data[i] = data[i]
//   }
//   // img.free()
//   console.log('----- do filter')
// }
//
// export async function testFilter(base64) {
//   const [, content] = base64.split(',')
//   const img = wasmImportJs.PhotonImage.new_from_base64(content)
//   wasmImportJs.offset(img, 0, 30)
//   console.log(img.get_base64)
//   return await ImageDataToBase64(img.get_image_data())
// }
//
// const ImageDataToBase64 = function(imageData){
//   let w = imageData.width;
//   let h = imageData.height;
//   let canvas = document.createElement("canvas");
//   canvas.width = w;
//   canvas.height = h;
//   let ctx = canvas.getContext("2d");
//   ctx.putImageData(imageData, 0, 0);        // synchronous
//   return new Promise((resolve) => {
//     canvas.toBlob(blob => {
//       const reader = new FileReader()
//       reader.readAsDataURL(blob)
//       reader.onload = function (e) {
//         resolve(e.target.result);
//       }
//     }); // implied image/png format
//   });
// }
// const filter = new fabric.Image.filters.Blur({ webgl: false,
//   blur: 0.5
// });
// this.currentObject.filters.push(filter)
// this.currentObject.applyFilters()
// imageHelper.canvas.renderAll()
export const FAST_FILTERS = {
  BEAUTIFUL: { key: 'beautiful', desc: '美肤', fun: (img) => {
      // photon.gaussian_blur(img, 1)
      photon.lighten_lch(img, 0.1)
    }, icon: e1, args: []}
}
function doFilter(target, key, args) {
  // const filter = new fabric.Image.filters.Blur({ webgl: false,
  //   blur: 0.5
  // });
  // target.filters.push(filter)
  // target.applyFilters()
  // imageHelper.renderAll()

  const exist = Object.values(FAST_FILTERS).find(item => item.key === key)
  if (exist) {
    args = [].concat(args || exist.args || [])
    target.addFilter(exist.fun, ...args)
  }

  // const[,base64] = target._element.src.split(',')
  // const img = wasmImportJs.base64_to_image(base64)
  // wasmImportJs.gaussian_blur(img, 1)
  // wasmImportJs.lighten_lch(img, 0.1)
  // target.setSrc(img.get_base64())
  // imageHelper.renderAll()
}
export default doFilter

import {fabric} from '@/lib/fabric.min'
import {photon} from "@/filters/PhotonHelper"
// import {loadBlobWebAssembly} from "@/utils/wasmHelper"
// // import imageProcess from "@/lib/photonCustom/photon_rs_bg.wasm"
// // import * as wasmImportJs from "@/lib/photonCustom/photon_rs_bg.js"
// //
// // let wasmInstance
// // loadBlobWebAssembly(imageProcess, {'./photon_rs_bg.js': wasmImportJs}).then(instance => {
// //   wasmInstance = instance
// //   wasmImportJs.__wbg_set_wasm(instance.exports)
// // })
//
// import imageProcess from "@/lib/photon_bg.wasm"
// import * as wasmImportJs from "@/lib/photon.js"
//
// let wasmInstance
// loadBlobWebAssembly(imageProcess, {'./photon': wasmImportJs}).then(instance => {
//   wasmInstance = instance
//   wasmImportJs.__wbg_set_wasm(instance.exports)
// })

class CustomFilter extends fabric.Image.filters.BaseFilter {

  type = 'CustomFilter'

  filters = []

  applyTo(options) {
    this.applyTo2d(options)
  }

  applyTo2d({ imageData }) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>> applyTo2d start ')
    const { width, height } = imageData
    const un8arr = photon.to_raw_pixels(imageData)
    const img = new photon.PhotonImage(un8arr, width, height)
    this.filters.forEach(item => item.fun && item.fun(img, ...item.args))
    // wasmImportJs.offset(img, 0, 30)
    // wasmImportJs.filter(img)
    const data = img.get_image_data().data
    for (let i = 0; i < un8arr.length; i++) {
      imageData.data[i] = data[i]
    }
    console.log('<<<<<<<<<<<<<<<<<<<<<<<< applyTo2d end ')
  }

  /**
   * 添加子滤镜
   * @param id
   * @param args
   * @param fun
   */
  add({id, args, fun }) {
    this.filters.push({id, args, fun})
  }

  /**
   * 删除滤镜
   * @param target {{ id: String, args: Array<any>, fun: Function | String }}
   */
  removeId(target) {
    let id = target
    if (typeof target === 'object') {
      id = target.id
    }
    const index = this.filters.findIndex(item => item.id === id)
    if (index >= 0) {
      this.filters.splice(index, 1)
    }
  }
}


export default CustomFilter

fabric.Image.filters.CustomFilter = CustomFilter

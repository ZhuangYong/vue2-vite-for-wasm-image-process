import {loadBlobWebAssembly} from "@/utils/wasmHelper"
import imageProcess from "@/lib/photonCustom/photon_rs_bg.wasm"
import * as wasmImportJs from "@/lib/photonCustom/photon_rs_bg.js"

let wasmInstance
loadBlobWebAssembly(imageProcess, {'./photon_rs_bg.js': wasmImportJs}).then(instance => {
  wasmInstance = instance
  wasmImportJs.__wbg_set_wasm(instance.exports)
})

// import imageProcess from "@/lib/photon_bg.wasm"
// import * as wasmImportJs from "@/lib/photon.js"
//
// let wasmInstance
// loadBlobWebAssembly(imageProcess, {'./photon': wasmImportJs}).then(instance => {
//   wasmInstance = instance
//   wasmImportJs.__wbg_set_wasm(instance.exports)
// })
export const photon = wasmImportJs
export default { wasmImportJs }

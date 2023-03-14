import * as wasm from "./photon_rs_bg.wasm";
import { __wbg_set_wasm } from "./photon_rs_bg.js";
__wbg_set_wasm(wasm);
export * from "./photon_rs_bg.js";

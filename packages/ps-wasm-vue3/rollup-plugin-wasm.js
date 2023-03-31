import { readFileSync } from 'fs'
import { extname } from 'path'
import { createFilter } from 'rollup-pluginutils'

const mimeTypes = {
  '.wasm':  'application/wasm'
}

function wasm ( options ) {
  if ( options === void 0 ) options = {};

  const filter = createFilter( options.include, options.exclude );

  return {
    name: 'wasm',

    load: function load ( id ) {
      if ( !filter( id ) ) return null;

      const mime = mimeTypes[ extname( id ) ]
      if ( !mime ) return null;

      const data = readFileSync( id, 'base64' )
      const code = `var bstr = atob('${data}'),n = bstr.length,u8arr = new Uint8Array(n);while (n--) {u8arr[n] = bstr.charCodeAt(n);};export default new Blob([u8arr], {type: "application/wasm"})`
      return { code: code, map: { mappings: '' } };
    }
  };
}

export default wasm


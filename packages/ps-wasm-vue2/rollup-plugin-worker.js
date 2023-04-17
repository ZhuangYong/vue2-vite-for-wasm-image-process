import {readFileSync} from 'fs'
import {createFilter} from 'rollup-pluginutils'

function worker ( options ) {
  if ( options === void 0 ) options = {};
  const filter = createFilter( options.include, options.exclude );
  return {
    name: 'worker',

    load: function load ( id ) {
      if ( !filter( id ) ) return null;
      const data = readFileSync( id, 'utf-8' )
      const code = `export default window.URL.createObjectURL(new Blob(['${data}'], { type: "text/javascript" }))`
      return { code: code, map: { mappings: '' } };
    }
  };
}

export default worker


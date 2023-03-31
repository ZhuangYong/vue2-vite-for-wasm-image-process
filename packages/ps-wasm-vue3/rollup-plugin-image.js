import { readFileSync } from 'fs';
import { extname } from 'path';
import { createFilter } from 'rollup-pluginutils';

const mimeTypes = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml'
};

function image ( options ) {
  if ( options === void 0 ) options = {};

  const filter = createFilter( options.include, options.exclude );

  return {
    name: 'image',

    load: function load ( id ) {
      if ( !filter( id ) ) return null;

      const mime = mimeTypes[ extname( id ) ];
      if ( !mime ) return null; // not an image

      // if (mime === mimeTypes['.svg']) {
      //   const ast = {
      //     type: 'Program',
      //     sourceType: 'module',
      //     start: 0,
      //     end: null,
      //     body: []
      //   }
      //
      //   const data = readFileSync( id, 'utf8' );
      //   return { code: `export default '${data}';`, map: { mappings: '' } };
      // }
      const data = readFileSync( id, 'base64' );
      const code = `export default 'data:${mime};base64,${data}'`
      return { code: code, map: { mappings: '' } };
    }
  };
}

export default image;

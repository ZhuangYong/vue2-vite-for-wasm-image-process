'use strict'
const path = require('path')
module.exports = {
  context: path.resolve('./'),
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve('src/')
    }
  }
}

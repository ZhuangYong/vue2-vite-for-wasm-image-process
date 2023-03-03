const IMAGE_TYPES = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml'
}

/**
 * 是否是图片类型
 * @param mimeType
 * @returns {boolean}
 */
export function isImage(mimeType) {
  return Object.values(IMAGE_TYPES).includes(mimeType)
}

/**
 * 根据内容判断是否是svg
 * @param src
 */
export function isSvgByBase64(src) {
  return (src || '').indexOf(IMAGE_TYPES['.svg']) >= 0
}

/**
 * base64图片内容转str
 * @param base64
 * @returns {string}
 */
export function base64ToStr(base64) {
  try {
    return atob(base64.split(',').pop())
  } catch (e) {
    return ''
  }
}

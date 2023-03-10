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

export function getOsInfo() {
  const userAgent = navigator.userAgent.toLowerCase();
  let name
  let version = 'Unknown'
  if (userAgent.indexOf('win') > -1) {
    name = 'Windows'
    if (userAgent.indexOf('windows nt 5.0') > -1) {
      version = 'Windows 2000'
    } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
      version = 'Windows XP'
    } else if (userAgent.indexOf('windows nt 6.0') > -1) {
      version = 'Windows Vista'
    } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
      version = 'Windows 7'
    } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
      version = 'Windows 8'
    } else if (userAgent.indexOf('windows nt 6.3') > -1) {
      version = 'Windows 8.1'
    } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
      version = 'Windows 10'
    } else {
      version = 'Unknown'
    }
  } else if (userAgent.indexOf('iphone') > -1) {
    name = 'Iphone'
  } else if (userAgent.indexOf('mac') > -1) {
    name = 'Mac'
  } else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 || userAgent.indexOf('bsd') > -1) {
    name = 'Unix'
  } else if (userAgent.indexOf('linux') > -1) {
    if (userAgent.indexOf('android') > -1) {
      name = 'Android'
    } else {
      name = 'Linux'
    }
  } else {
    name = 'Unknown'
  }
  return { name, version };
}

export function isMac() {
  return getOsInfo().name === 'Mac'
}

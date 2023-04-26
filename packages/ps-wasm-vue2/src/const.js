import moveSvg from "../static/icon/move.svg"
import pencilSvg from "../static/icon/pencil.svg"
import wordSvg from "../static/icon/word.svg"

const Const = {
  MAIN_STAGE_CLASS: 'main-stage',
  FABRIC_TYPE: {
    TEXT: 'text',
    I_TEXT: 'i-text',
    TEXTBOX: 'textbox',
    IMAGE: 'image',
    // 选择集合
    ACTIVE_SELECTION: 'activeSelection'
  },
  EDIT_MODE: {
    MOVE: { key: 'MOVE', value: '移动', icon: base64ToStr(moveSvg) },
    PENCIL: { key: 'PENCIL', value: '画笔', icon: base64ToStr(pencilSvg) },
    TEXT: { key: 'TEXT', value: '文字', icon: base64ToStr(wordSvg) }
  },
  DRAW_MODE: {
    Pencil: '铅笔',
    Circle: '圆',
    Spray: '喷雾',
    Pattern: '图案',
    hLine: '横线',
    vLine: '竖线',
    square: '方格',
    diamond: '钻石格',
    texture: '圆格'
  }
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

export default Const

// /**
//  * 是否是文本类型
//  * @param type
//  * @returns {boolean}
//  */
// export function isText(type) {
//   return [Const.FABRIC_TYPE.TEXT, Const.FABRIC_TYPE.I_TEXT, Const.FABRIC_TYPE.TEXTBOX].includes(type)
// }

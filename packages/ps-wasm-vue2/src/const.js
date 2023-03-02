import moveSvg from "../static/icon/move.svg"
import pencilSvg from "../static/icon/pencil.svg"
import wordSvg from "../static/icon/word.svg"
import {base64ToStr} from "./utils"

export default {
  FABRIC_TYPE: {
    I_TEXT: 'i-text',
    TEXTBOX: 'textbox',
    IMAGE: 'image'
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

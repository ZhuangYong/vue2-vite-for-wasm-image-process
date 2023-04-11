/**
 * 返回统一小写
 * @param name
 * @returns {string}
 */
export function resetKey(name) {
  if (name === ' ') {
    return 'space'
  }
  name = (name || '').trim().toLowerCase()
  switch (name) {
    case 'meta':
      return 'command'
  }
  return name
}

export default {

  back: 8, //退格键

  tab: 9, //tab键

  return: 13, //回车键

  shift: 16, //shift键

  control: 17, //ctrl键

  menu: 18, //alt键

  pause: 19, //pause break键

  capital: 20, //caps lock键

  space: 32, //空格键

  prior: 33, //page up

  next: 34, //page down

  end: 35, //end键

  home: 36, //home键

  left: 37, //方向键:←

  up: 38, //方向键:↑

  right: 39, //方向键:→

  down: 40, //方向键:↓

  insert: 45, //insert键

  delete: 46, //delete键

  //字母表
  a: 65,
  b: 66,
  c: 67,
  d: 68,
  e: 69,
  f: 70,
  g: 71,
  h: 72,
  i: 73,
  j: 74,
  k: 75,
  l: 76,
  m: 77,
  n: 78,
  o: 79,
  p: 80,
  q: 81,
  r: 82,
  s: 83,
  t: 84,
  u: 85,
  v: 86,
  w: 87,
  x: 88,
  y: 89,
  z: 90,

  lwin: 91, //左徽标键

  rwin: 92, //右徽标键

  apps: 93, //鼠标右键快捷键

  '0': 96, //小键盘0

  '1': 97, //小键盘1

  '2': 98, //小键盘2

  '3': 99, //小键盘3

  '4': 100, //小键盘4

  '5': 101, //小键盘5

  '6': 102, //小键盘6

  '7': 103, //小键盘7

  '8': 104, //小键盘8

  '9': 105, //小键盘9

  decimal: 110, //小键盘.

  '*': 106, //小键盘*

  '+': 107, //小键盘+

  '-': 109, //小键盘-

  '/': 111, //小键盘/

  f1: 112, //f1键

  f2: 113, //f2键

  f3: 114, //f3键

  f4: 115, //f4键

  f5: 116, //f5键

  f6: 117, //f6键

  f7: 118, //f7键

  f8: 119, //f8键

  f9: 120, //f9键

  f10: 121, //f10键

  f11: 122, //f11键

  f12: 123, //f12键

  numlock: 144, //num lock键

  scroll: 145, //scroll lock键
}

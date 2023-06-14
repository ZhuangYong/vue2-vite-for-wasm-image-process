const fonts = {

  windows: [{
    label: '宋体',
    value: 'SimSun'
  }, {
    label: '黑体',
    value: 'SimHei'
  }, {
    label: '微软雅黑',
    value: 'Microsoft Yahei'
  }, {
    label: '微软正黑体',
    value: 'Microsoft JhengHei'
  }, {
    label: '楷体',
    value: 'KaiTi'
  }, {
    label: '新宋体',
    value: 'NSimSun'
  }, {
    label: '仿宋',
    value: 'FangSong'
  }],
  Mac: [{
    label: '苹方',
    value: 'PingFang SC'
  }, {
    label: '华文黑体',
    value: 'STHeiti'
  }, {
    label: '华文楷体',
    value: 'STKaiti'
  }, {
    label: '华文宋体',
    value: 'STSong'
  }, {
    label: '华文仿宋',
    value: 'STFangsong'
  }, {
    label: '华文中宋',
    value: 'STZhongsong'
  }, {
    label: '华文琥珀',
    value: 'STHupo'
  }, {
    label: '华文新魏',
    value: 'STXinwei'
  }, {
    label: '华文隶书',
    value: 'STLiti'
  }, {
    label: '华文行楷',
    value: 'STXingkai'
  }, {
    label: '冬青黑体简',
    value: 'Hiragino Sans GB'
  }, {
    label: '兰亭黑-简',
    value: 'Lantinghei SC'
  }, {
    label: '翩翩体-简',
    value: 'Hanzipen SC'
  }, {
    label: '手札体-简',
    value: 'Hannotate SC'
  }, {
    label: '宋体-简',
    value: 'Songti SC'
  }, {
    label: '娃娃体-简',
    value: 'Wawati SC'
  }, {
    label: '魏碑-简',
    value: 'Weibei SC'
  }, {
    label: '行楷-简',
    value: 'Xingkai SC'
  }, {
    label: '雅痞-简',
    value: 'Yapi SC'
  }, {
    label: '圆体-简',
    value: 'Yuanti SC'
  }],
  office: [{
    label: '幼圆',
    value: 'YouYuan'
  }, {
    label: '隶书',
    value: 'LiSu'
  }, {
    label: '华文细黑',
    value: 'STXihei'
  }, {
    label: '华文彩云',
    value: 'STCaiyun'
  }, {
    label: '方正舒体',
    value: 'FZShuTi'
  }, {
    label: '方正姚体',
    value: 'FZYaoti'
  }],
  opvalue: [{
    label: '思源黑体',
    value: 'Source Han Sans CN'
  }, {
    label: '思源宋体',
    value: 'Source Han Serif SC'
  }, {
    label: '文泉驿微米黑',
    value: 'WenQuanYi Micro Hei'
  }, {
    label: '文泉驿正黑',
    value: 'WenQuanYi Zen Hei'
  }, {
    label: '文泉驿点阵正黑',
    value: 'WenQuanYi Zen Hei Sharp'
  }, {
    label: '文泉驿等宽正黑',
    value: 'WenQuanYi Zen Hei Mono'
  }, {
    label: '文泉驿等宽微米黑',
    value: 'WenQuanYi Micro Hei Mono'
  }],
  hanYi: [{
    label: '汉仪旗黑',
    value: 'HYQihei 40S'
  }, {
    label: '汉仪旗黑',
    value: 'HYQihei 50S'
  }, {
    label: '汉仪旗黑',
    value: 'HYQihei 60S'
  }, {
    label: '汉仪大宋简',
    value: 'HYDaSongJ'
  }, {
    label: '汉仪楷体',
    value: 'HYKaiti'
  }, {
    label: '汉仪家书简',
    value: 'HYJiaShuJ'
  }, {
    label: '汉仪PP体简',
    value: 'HYPPTiJ'
  }, {
    label: '汉仪乐喵体简',
    value: 'HYLeMiaoTi'
  }, {
    label: '汉仪小麦体',
    value: 'HYXiaoMaiTiJ'
  }, {
    label: '汉仪程行体',
    value: 'HYChengXingJ'
  }, {
    label: '汉仪黑荔枝',
    value: 'HYHeiLiZhiTiJ'
  }, {
    label: '汉仪雅酷黑W',
    value: 'HYYaKuHeiW'
  }, {
    label: '汉仪大黑简',
    value: 'HYDaHeiJ'
  }, {
    label: '汉仪尚魏手书W',
    value: 'HYShangWeiShouShuW'
  }],
  fangZhvalue: [{
    label: "方正粗雅宋简体",
    value: "FZYaSongS-B-GB"
  }, {
    label: "方正报宋简体",
    value: "FZBaoSong-Z04S"
  }, {
    label: "方正粗圆简体",
    value: "FZCuYuan-M03S"
  }, {
    label: "方正大标宋简体",
    value: "FZDaBiaoSong-B06S"
  }, {
    label: "方正大黑简体",
    value: "FZDaHei-B02S"
  }, {
    label: "方正仿宋简体",
    value: "FZFangSong-Z02S"
  }, {
    label: "方正黑体简体",
    value: "FZHei-B01S"
  }, {
    label: "方正琥珀简体",
    value: "FZHuPo-M04S"
  }, {
    label: "方正楷体简体",
    value: "FZKai-Z03S"
  }, {
    label: "方正隶变简体",
    value: "FZLiBian-S02S"
  }, {
    label: "方正隶书简体",
    value: "FZLiShu-S01S"
  }, {
    label: "方正美黑简体",
    value: "FZMeiHei-M07S"
  }, {
    label: "方正书宋简体",
    value: "FZShuSong-Z01S"
  }, {
    label: "方正舒体简体",
    value: "FZShuTi-S05S"
  }, {
    label: "方正水柱简体",
    value: "FZShuiZhu-M08S"
  }, {
    label: "方正宋黑简体",
    value: "FZSongHei-B07S"
  }, {
    label: "方正宋三简体",
    value: "FZSong"
  }, {
    label: "方正魏碑简体",
    value: "FZWeiBei-S03S"
  }, {
    label: "方正细等线简体",
    value: "FZXiDengXian-Z06S"
  }, {
    label: "方正细黑一简体",
    value: "FZXiHei I-Z08S"
  }, {
    label: "方正细圆简体",
    value: "FZXiYuan-M01S"
  }, {
    label: "方正小标宋简体",
    value: "FZXiaoBiaoSong-B05S"
  }, {
    label: "方正行楷简体",
    value: "FZXingKai-S04S"
  }, {
    label: "方正姚体简体",
    value: "FZYaoTi-M06S"
  }, {
    label: "方正中等线简体",
    value: "FZZhongDengXian-Z07S"
  }, {
    label: "方正准圆简体",
    value: "FZZhunYuan-M02S"
  }, {
    label: "方正综艺简体",
    value: "FZZongYi-M05S"
  }, {
    label: "方正彩云简体",
    value: "FZCaiYun-M09S"
  }, {
    label: "方正隶二简体",
    value: "FZLiShu II-S06S"
  }, {
    label: "方正康体简体",
    value: "FZKangTi-S07S"
  }, {
    label: "方正超粗黑简体",
    value: "FZChaoCuHei-M10S"
  }, {
    label: "方正新报宋简体",
    value: "FZNew BaoSong-Z12S"
  }, {
    label: "方正新舒体简体",
    value: "FZNew ShuTi-S08S"
  }, {
    label: "方正黄草简体",
    value: "FZHuangCao-S09S"
  }, {
    label: "方正少儿简体",
    value: "FZShaoEr-M11S"
  }, {
    label: "方正稚艺简体",
    value: "FZZhiYi-M12S"
  }, {
    label: "方正细珊瑚简体",
    value: "FZXiShanHu-M13S"
  }, {
    label: "方正粗宋简体",
    value: "FZCuSong-B09S"
  }, {
    label: "方正平和简体",
    value: "FZPingHe-S11S"
  }, {
    label: "方正华隶简体",
    value: "FZHuaLi-M14S"
  }, {
    label: "方正瘦金书简体",
    value: "FZShouJinShu-S10S"
  }, {
    label: "方正细倩简体",
    value: "FZXiQian-M15S"
  }, {
    label: "方正中倩简体",
    value: "FZZhongQian-M16S"
  }, {
    label: "方正粗倩简体",
    value: "FZCuQian-M17S"
  }, {
    label: "方正胖娃简体",
    value: "FZPangWa-M18S"
  }, {
    label: "方正宋一简体",
    value: "FZSongYi-Z13S"
  }, {
    label: "方正剪纸简体",
    value: "FZJianZhi-M23S"
  }, {
    label: "方正流行体简体",
    value: "FZLiuXingTi-M26S"
  }, {
    label: "方正祥隶简体",
    value: "FZXiangLi-S17S"
  }, {
    label: "方正粗活意简体",
    value: "FZCuHuoYi-M25S"
  }, {
    label: "方正胖头鱼简体",
    value: "FZPangTouYu-M24S"
  }, {
    label: "方正铁筋隶书简体",
    value: "FZTieJinLiShu-Z14S"
  }, {
    label: "方正北魏楷书简体",
    value: "FZBeiWeiKaiShu-Z15S"
  }, {
    label: "方正卡通简体",
    value: "FZKaTong-M19S"
  }, {
    label: "方正艺黑简体",
    value: "FZYiHei-M20S"
  }, {
    label: "方正水黑简体",
    value: "FZShuiHei-M21S"
  }, {
    label: "方正古隶简体",
    value: "FZGuLi-S12S"
  }, {
    label: "方正幼线简体",
    value: "FZYouXian-Z09S"
  }, {
    label: "方正启体简体",
    value: "FZQiTi-S14S"
  }, {
    label: "方正小篆体",
    value: "FZXiaoZhuanTi-S13T"
  }, {
    label: "方正硬笔楷书简体",
    value: "FZYingBiKaiShu-S15S"
  }, {
    label: "方正毡笔黑简体",
    value: "FZZhanBiHei-M22S"
  }, {
    label: "方正硬笔行书简体",
    value: "FZYingBiXingShu-S16S"
  }],
  mips: [{
    label: '仿宋-GB18030',
    value: 'CESI_FS_GB18030'
  }, {
    label: '小标宋-GB2312',
    value: 'CESI_XBS_GB2312'
  }, {
    label: '宋体-GB13000',
    value: 'CESI_SS_GB13000'
  }, {
    label: '仿宋-GB13000',
    value: 'CESI_FS_GB13000'
  }, {
    label: '宋体-GB2312',
    value: 'CESI_SS_GB2312'
  }, {
    label: '仿宋-GB2312',
    value: 'CESI_FS_GB2312'
  }, {
    label: '小标宋-GB18030',
    value: 'CESI_XBS_GB18030'
  }, {
    label: '黑体-GB2312',
    value: 'CESI_HT_GB2312'
  }, {
    label: 'CESI楷体-GB18030',
    value: 'CESI_KT_GB18030'
  }, {
    label: '楷体-GB13000',
    value: 'CESI_KT_GB13000'
  }, {
    label: '小标宋-GB13000',
    value: 'CESI_XBS_GB13000'
  }, {
    label: '楷体-GB2312',
    value: 'CESI_KT_GB2312'
  }, {
    label: '黑体-GB18030',
    value: 'CESI_HT_GB18030'
  }, {
    label: '宋体-GB18030',
    value: 'CESI_SS_GB18030'
  }, {
    label: '黑体-GB13000',
    value: 'CESI_HT_GB13000'
  }]
}

export function isSupportFontFamily(f) {
  if (typeof f != "string") {
    return false
  }
  const arial = "Arial";
  if (f.toLowerCase() === arial.toLowerCase()) {
    return true
  }
  const word = "abc";
  const fontSize = 300;
  const width = 300
  const height = 300
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = width;
  canvas.height = height;
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.textBaseline = "middle";
  const getData = fontName => {
    ctx.clearRect(0, 0, width, height)
    ctx.font = fontSize + "px " + fontName + ", " + arial
    ctx.fillText(word, width / 2, height / 2)
    const {data} = ctx.getImageData(0, 0, width, height)
    return [].slice.call(data).filter(l => l !== 0)
  }
  return getData(arial).join('') !== getData(f).join('')
}
export const fontOptions = fonts['windows'].concat(fonts['Mac'], fonts['office']).filter(item => isSupportFontFamily(item.value))

import {loadBlobWebAssembly} from "./wasmHelper"
import add from "./lib/add.wasm";

let wasmInstance
loadBlobWebAssembly(add).then(instance => (wasmInstance = instance))

//主画布
let ps
let layers = []
let currLayer = []

export function addImage(img){
    const psObj = AlloyImage(img)
    if(!ps) {
        ps = AlloyImage(parseInt(img.width), parseInt(img.height), "rgba(255,255,255,0)")
    }

    layers.push(psObj)

    //添加一个图层
    ps.addLayer(psObj)

    //设置当前图层
    currLayer = [layers.length - 1]

    //向面板添加一个图层
    addLayer()
    draw()
}

export function draw (isFast){
    //显示主画布
    ps.show(".painting", isFast)

    //重绘直方图
    ps.drawRect()
}

//向图层面板添加一个图层
export function addLayer () {
    // var html = "<div class='lItem'><span class='layerName'>图层" + (++ layerCount) + "</span> 混合模式" + COM_HTML_MODEL + "</div>";
    // $(".layer").prepend(html);
    // 添加图层操作
    showCurrLayer()
}

//显示当前操作或选中的图层
export function showCurrLayer (){
    // $(".lItem").removeClass("blueStyle");
    //
    // for(var i = 0;i < this.currLayer.length;i ++){
    //     $(".lItem:eq(" + (this.layers.length - 1 - this.currLayer[i]) + ")").addClass("blueStyle");
    // }
}

/**
 * 测试处理图片的方法
 * @param imageData
 * @param args
 */
export function testImageFunction(imageData, args) {
  console.warn('调用了wasm测试处理图片的方法(实际是个加法：333+555)：', wasmInstance.exports.add(333, 555))
}

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

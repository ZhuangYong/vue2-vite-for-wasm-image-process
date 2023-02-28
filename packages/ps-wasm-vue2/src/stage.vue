<template>
  <div class="stage">
    <el-container>
      <el-aside width="200px" class="left-function">
        <div class="target-info">
          <ObjectProps :target="currentObject" />
        </div>
        <el-tabs v-model="activeName" type="card" class="left-function-tabs">
          <el-tab-pane label="特效" name="fastEffect">
            <FastEffect @fabric-filter="onFabricFilter" @do-filter="doFilter" />
          </el-tab-pane>
          <el-tab-pane label="调整" name="ttttt">
            <FastEffect />
          </el-tab-pane>
        </el-tabs>

      </el-aside>
      <el-container>
        <el-header height="32px">
          <el-upload action="" :auto-upload="false" :show-file-list="false" :on-change="onFileAdd" class="import-file">
            <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
          </el-upload>
          <el-button v-if="showExport" size="mini" type="primary" @click="onExport">导出</el-button>
        </el-header>
        <el-main ref="main" class="main-stage" @drop.native.prevent="onStageDrop">
          <canvas ref="imgRect" :width="width" :height="height" />
        </el-main>
        <el-footer height="80px">
          <el-tabs v-model="activeResourceName" type="card" class="bottom-function-tabs">
            <el-tab-pane label="贴纸" name="stickers">
              <Stickers @start.native="onDragstart" @end.native="onDragend" />
            </el-tab-pane>
            <el-tab-pane label="-------" name="---">
              -------
            </el-tab-pane>
          </el-tabs>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {fabric} from './lib/fabric.min'
import {loadBlobWebAssembly} from "./wasmHelper"
import add from './lib/add.wasm'
import FastEffect from './components/FastEffect.vue'
import Stickers from './components/Stickers.vue'
import {GaussBlur} from "./filters/GaussBlur"
import Canvas2Image from "./CanvasToImage"
import Rectangle from "./Rectangle"
import Point from "./Point";
import {isImage} from "./utils"
import ObjectProps from "./components/ObjectProps.vue"

fabric.enableGLFiltering = false

export default {
  components: { FastEffect, Stickers, ObjectProps },
  data() {
    return {
      width: 300,
      height: 300,
      canDrop: false, // 拖拽是否在可释放区域
      startDrag: false,
      startDragOffset: {x: 0, y:0}, // 开始拖动作用在对象上的偏移
      currentObject: null,
      activeResourceName: 'stickers',
      activeName: 'fastEffect',
      canvas: null
    }
  },
  watch: {
    currentObject(v) {
      console.log('--- currentObject:', v)
    }
  },
  mounted() {
    loadBlobWebAssembly(add).then(instance => {
      console.warn('测试 wasm 方法（add），333 + 555 =', instance.exports.add(333, 555))
    })
    // const rect = new fabric.Rect({
    //   left: 100,
    //   top: 50,
    //   fill: 'yellow',
    //   width: 200,
    //   height: 100,
    //   objectCaching: false,
    //   stroke: 'lightgreen',
    //   strokeWidth: 4,
    // })
    // canvas.add(rect)
    // canvas.setActiveObject(rect)
    this.refreshSize()
    this.$nextTick(() => {
      this.canvas = new fabric.Canvas(this.$refs.imgRect)
      console.log(fabric, this.canvas)
    })
  },
  computed: {
    showExport() {
      return !!this.canvas
    },
    /**
     * 高亮显示画布，拖拽资源时候
     * @returns {boolean}
     */
    highlightCanvas() {
      return this.canDrop && this.startDrag
    }
  },
  methods: {
    refreshSize() {
      if (this.$refs.main) {
        const { width, height } = this.$refs.main.$el.getBoundingClientRect()
        this.width = width
        this.height = height
        console.log(width, height)
      }
    },
    onFileAdd(file) {
      this.addImage(file.raw)
      // const reader = new FileReader();
      // reader.readAsDataURL(file.raw);
      // reader.onload = e => {
      //   // const img = new Image()
      //   // img.src = this.result
      //   // img.onload = function(){
      //   //   addImage(img)
      //   // }
      //   fabric.Image.fromURL(e.target.result, img => {
      //     this.canvas.add(img)
      //     img.on('selected', () => {
      //       this.currentObject = img
      //     })
      //   })
      // }
    },

    /**
     * 添加图片
     * @param file
     * @param option
     */
    addImage(file, option) {
      option = option || {}
      if (isImage(file.type)) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = e => {
          fabric.Image.fromURL(e.target.result, img => {
            const { width, height } = this
            const scale = Math.min(width/img.width, height/img.height)
            img.set({ scaleX: scale, scaleY: scale, ...option })
            this.canvas.add(img)
            img.on('selected', () => {
              this.currentObject = img
            })
          })
        }
      }
    },
    onFabricFilter(type) {
      switch (type) {
        case 'blur':
          const filter = new fabric.Image.filters.Blur({ webgl: false,
            blur: 0.5
          });
          this.currentObject.filters.push(filter)
          this.currentObject.applyFilters()
          this.canvas.renderAll()
      }
    },

    doFilter(filter) {
      if (!this.currentObject) {
        return
      }
      switch (filter) {
        case 'gaussBlur': {
          const gaussBlur = new GaussBlur({ webgl: false })
          this.currentObject.filters.push(gaussBlur)
          this.currentObject.applyFilters()
          this.canvas.renderAll()
        }
      }
    },

    onExport() {
      Canvas2Image.saveAsPNG(this.canvas.toCanvasElement(), this.width, this.height)
    },
    onDragend(e) {
      console.log('onDragend:', e)
      if (this.startDrag === true) {
        this.startDrag = false
        const { clientX, clientY } = e.originalEvent
        const point = Point.from(clientX, clientY)
        const { x: canvasX, y: canvasY, width: canvasWidth, height: canvasHeight } = this.canvas.lowerCanvasEl.getBoundingClientRect()
        const intersects = Rectangle.from(canvasX, canvasY, canvasWidth, canvasHeight).contains(point)
        if (intersects) {
          const offset = {x: point.x - canvasX, y: point.y - canvasY}
          const img = e.item.querySelector('img')
          fabric.Image.fromURL(img.src, shape => {
            const size = img.getAttribute('size')
            if (size) {
              const scale = 1.2
              let [width, height] = size.split(',').filter(str => str.trim()).filter(Boolean).map(Number)
              width = width * scale
              height = height * scale
              shape.set({ width, height, top: offset.y, left: offset.x, scaleX: 0.1, scaleY: 0.1 })
              shape._element.height = height
              shape._element.width = width
              Object.defineProperty(shape._element, 'naturalWidth', { get: () => width })
              Object.defineProperty(shape._element, 'naturalHeight', { get: () => height })
            }
            this.canvas.add(shape)
            shape.on('selected', () => {
              this.currentObject = shape
            })
          })
          // if (e.item.querySelector('svg')) {
          //   fabric.loadSVGFromURL(e.item.innerHTML, (objects, options) => {
          //     const shape = fabric.util.groupSVGElements(objects, options);
          //     this.canvas.add(shape)
          //     shape.on('selected', () => {
          //       this.currentObject = shape
          //     })
          //   })
          // } else {
          //   fabric.Image.fromURL(e.item.querySelector('img').src, img => {
          //     this.canvas.add(img)
          //     img.on('selected', () => {
          //       this.currentObject = img
          //     })
          //   })
          // }
        }
      }
    },
    onDragstart(e) {
      this.startDrag = true
      const { x: itemX, y: itemY } = e.item.getBoundingClientRect()
      const { clientX, clientY } = e.originalEvent
      this.startDragOffset = {x: itemX - clientX, y: itemY - clientY}
    },

    onStageDrop(e) {
      const { clientX, clientY } = e.originalEvent || e
      const { x: canvasX, y: canvasY } = this.canvas.lowerCanvasEl.getBoundingClientRect()
      const offset = {x: clientX - canvasX, y: clientY - canvasY}
      Array.from(e.dataTransfer.files || []).forEach(file => {
        this.addImage(file, {top: offset.y, left: offset.x})
        // if (isImage(file.type)) {
        //   fabric.Image.from(e.item.querySelector('img').src, img => {
        //     this.canvas.add(img)
        //     img.on('selected', () => {
        //       this.currentObject = img
        //     })
        //   })
        // }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin tabItem {
  ::v-deep .el-tabs__item {
    height: 22px;
    font-size: 12px;
    line-height: 22px;
  }
}
.stage {
  border: 1px solid #dedede;
}
.target-info {
  height: 46%;
}
.left-function {
  border-right: 1px solid #dedede;
}
.left-function-tabs {
  padding-top: 12px;
  @include tabItem;
}
.bottom-function-tabs {
  padding-top: 0;
  @include tabItem;
}
.el-aside {
}
.el-header {
  padding: 6px 8px;
  text-align: left;
}
.el-footer {
  padding: 0 8px 6px 8px;
}
.main-stage {
  padding: 0;
  margin: 8px;
  border: 1px solid #dedede;
}
.import-file {
  display: inline-block;
}
</style>

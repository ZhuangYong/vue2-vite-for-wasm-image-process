<template>
  <div class="stage">
    <el-container>
      <el-aside width="200px" class="left-function">
        <div class="target-info">
          -----
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
        <el-main ref="main" class="main-stage">
          <canvas ref="imgRect" :width="width" :height="height" />
        </el-main>
        <el-footer height="80px">
          <el-tabs v-model="activeResourceName" type="card" class="bottom-function-tabs">
            <el-tab-pane label="贴纸" name="stickers">
              <Stickers />
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
import Canvas2Image from "./CanvasToImage";

fabric.enableGLFiltering = false

export default {
  components: { FastEffect, Stickers },
  data() {
    return {
      width: 300,
      height: 300,
      currentObject: null,
      activeResourceName: 'stickers',
      activeName: 'fastEffect',
      canvas: null
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
      const reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = e => {
        // const img = new Image()
        // img.src = this.result
        // img.onload = function(){
        //   addImage(img)
        // }
        fabric.Image.fromURL(e.target.result, img => {
          this.canvas.add(img)
          img.on('selected', () => {
            this.currentObject = img
          })
        })
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
    }
  },
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

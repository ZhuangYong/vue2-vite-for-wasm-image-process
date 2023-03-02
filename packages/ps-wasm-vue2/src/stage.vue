<template>
  <div ref="stage" class="stage">
    <el-container>
      <el-aside width="200px" class="left-function">
        <!--属性-->
        <el-tabs v-model="leftTopTab" type="card" class="left-function-tabs">
          <el-tab-pane label="属性" name="targetProps">
            <div class="target-info">
              <ObjectProps :props="showProps" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="画笔" name="pencilProps">
            <PencilModelPropertyPanel />
          </el-tab-pane>
        </el-tabs>

        <!--效果-->
        <el-tabs v-model="leftBottomTab" type="card" class="left-function-tabs">
          <el-tab-pane label="特效" name="fastEffect">
            <FastEffect @fabric-filter="onFabricFilter" @do-filter="doFilter" />
          </el-tab-pane>
          <el-tab-pane label="调整" name="ttttt">
            <FastEffect />
          </el-tab-pane>
        </el-tabs>

      </el-aside>
      <el-container>
        <el-header height="32px" class="operation-head">
          <div class="left-head">
            <OperationPanel :mode.sync="editMode" />
            <Menus />
          </div>
          <FullscreenButton :target="$refs.stage" />
        </el-header>
        <el-main ref="main" class="main-stage" :class="`${highlightCanvas && 'high-light'}`"
                 :style="`background-image: url(${transparentSvg})`" @drop.native.prevent="onStageDrop"
                 @dragover.native="onDragResourceOver" @mousedown.native="onStageMousedown">
        <canvas ref="imgRect" :width="width" :height="height" />
        </el-main>
        <el-footer height="70px">
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

    <el-dialog :visible.sync="showTextDialog" title="文字" width="600px">
      <el-form>
        <el-form-item label="">
          <el-input v-model="editText" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入文本内容" />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button size="mini" type="primary" @click="onEditTextSure">确定</el-button>
      </div>
    </el-dialog>
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
import ObjectProps from "./components/ObjectProps.vue"
import imageHelper from "./ImageHelper"
import OperationPanel from "./components/OperationPanel.vue"
import PencilModelPropertyPanel from "./components/PencilModelPropertyPanel.vue"
import transparentSvg from '../static/icon/transparent.svg'
import Menus from './components/Menus/index.vue'
import Const from "./const";
import FullscreenButton from "./components/FullscreenButton.vue"
import fabricEnhance from './utils/fabricEnhance'

export default {
  components: { FastEffect, Stickers, ObjectProps, OperationPanel, PencilModelPropertyPanel, Menus, FullscreenButton },
  provide() {
    return {
      getCanvas: () => this.canvas,
      getTarget: () => this.currentObject
    }
  },
  data() {
    return {
      transparentSvg,
      width: 300,
      height: 300,
      editText: '',
      canDrop: false, // 拖拽是否在可释放区域
      startDrag: false,
      showTextDialog: false,
      editMode: Const.EDIT_MODE.MOVE.value, // 编辑模式
      startDragOffset: {x: 0, y:0}, // 开始拖动作用在对象上的偏移
      currentObject: null, // 当前选择的编辑对象
      activeResourceName: 'stickers', // 选择的资源tabs
      leftBottomTab: 'fastEffect',
      canvas: null,
      leftTopTab: 'targetProps'
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
      fabric.enableGLFiltering = false
      const canvas = new fabric.Canvas(this.$refs.imgRect, { controlsAboveOverlay: true, preserveObjectStacking: true })
      canvas.on('selection:updated', this.onSelect)
      canvas.on('selection:created', this.onSelect)
      canvas.on('selection:cleared', this.onSelect)
      canvas.on('dragover', this.onDragResourceOver)
      canvas.on('dragleave', this.onDragResourceLeave)
      canvas.isDrawingMode = false
      fabricEnhance(canvas)
      this.canvas = canvas
      imageHelper.canvas = this.canvas
      // this.canvas.on('after:render', () => {
      //   const {width, height, left, top} = this.currentObject || {}
      //   console.log({width, height, left, top})
      // })
      console.log(fabric, this.canvas)
    })
  },
  computed: {
    /**
     * 高亮显示画布，拖拽资源时候
     * @returns {boolean}
     */
    highlightCanvas() {
      return this.canDrop && this.startDrag
    },

    showProps: {
      get () {
        if (!this.currentObject) {
          return null
        }
        const { fontFamily, type, ...res } = this.currentObject
        return { ...res, type, fontFamily }
      }
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
    onAddTextShow() {
      this.showTextDialog = true
    },
    onEditTextSure() {
      imageHelper.addText(this.editText)
      this.showTextDialog = false
    },

    // /**
    //  * 添加图片
    //  * @param file
    //  * @param option
    //  */
    // addImage(file, option) {
    //   option = option || {}
    //   if (isImage(file.type)) {
    //     const reader = new FileReader()
    //     reader.readAsDataURL(file)
    //     reader.onload = e => {
    //       fabric.Image.fromURL(e.target.result, img => {
    //         const { width, height } = this
    //         const scale = Math.min(width/img.width, height/img.height)
    //         img.set({ scaleX: scale, scaleY: scale, ...option })
    //         this.canvas.add(img)
    //         img.on('selected', () => {
    //           this.currentObject = img
    //         })
    //       })
    //     }
    //   }
    // },
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

    onSelect() {
      this.currentObject = this.canvas.getActiveObject()
      console.log('----- select object', this.currentObject)
    },

    onExport() {
      Canvas2Image.saveAsPNG(this.canvas.toCanvasElement(), this.width, this.height)
    },
    onDragend(e) {
      if (this.startDrag === true) {
        this.startDrag = false
        imageHelper.addStroke(e)
      }
    },
    onDragstart(e) {
      this.startDrag = true
      const { x: itemX, y: itemY } = e.item.getBoundingClientRect()
      const { clientX, clientY } = e.originalEvent
      this.startDragOffset = {x: itemX - clientX, y: itemY - clientY}
    },

    onDragResourceOver(e) {
      this.canDrop = true
      if (e.dataTransfer && e.dataTransfer.files) {
        this.startDrag = true
      }
    },

    onDragResourceLeave(e) {
      this.canDrop = false
      if (e.dataTransfer && e.dataTransfer.files) {
        this.startDrag = false
      }
    },

    onStageDrop(e) {
      const { clientX, clientY } = e.originalEvent || e
      const { x: canvasX, y: canvasY } = this.canvas.lowerCanvasEl.getBoundingClientRect()
      const offset = {x: clientX - canvasX, y: clientY - canvasY}
      Array.from(e.dataTransfer.files || []).forEach(file => {
        imageHelper.uploadImage(file, {top: offset.y, left: offset.x})
      })
    },

    onStageMousedown() {
      if (this.editMode === Const.EDIT_MODE.TEXT.value) {
        this.onAddTextShow()
      }
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
  background-color: white;
  border: 1px solid #dedede;
  .el-container {
    height: 100%;
  }
  ::v-deep {
    .el-tabs__header {
      margin-bottom: 6px;
    }
  }
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

.operation-head {
  display: flex;
  padding: 8px;
  margin-top: 4px;
  align-items: center;
  justify-content: space-between;
  .left-head {
    display: flex;
    align-items: center;
  }
  .operation-panel {
    margin-right: 8px;
  }
}
.el-footer {
  padding: 0 8px 6px 8px;
}
.main-stage {
  padding: 0;
  margin: 8px;
  border: 1px solid #dedede;
  &.high-light {
    border: 1px solid green;
  }
}
.import-file {
  display: inline-block;
}
</style>

<template>
  <div ref="main" class="canvas-panel" @drop.prevent="onStageDrop" @dragover="onDragResourceOver" @mousedown="onStageMousedown">
    <canvas ref="imgRect" :width="width" :height="height" class="main-canvas" :class="`${highlightCanvas && 'high-light'}`" :style="`background-image: url(${transparentSvg})`" />

    <!--输入文字-->
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
import imageHelper from "@/utils/ImageHelper"
import Const from "@/const";
import {fabric} from "@/lib/fabric.min";
import fabricEnhance from "@/utils/fabricEnhance";
import transparentSvg from "@/../static/icon/transparent.svg"

fabricEnhance(fabric)
export default {
  name: 'CanvasPanel',
  inject: ['getEditMode'],
  props: {

    currentSelectTarget: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      width: 300, // 画布宽
      height: 300, // 画布高
      canDrop: false, // 拖拽是否在可释放区域
      canvas: null, // 画布实例化对象
      editText: '', // 文字编辑内容
      transparentSvg, // 透明背景
      showTextDialog: false,
      currentObject: null, // 当前选择的编辑对象
      startDragOffset: {x: 0, y:0}, // 开始拖动作用在对象上的偏移
    }
  },
  computed: {
    /**
     * 高亮显示画布，拖拽资源时候
     * @returns {boolean}
     */
    highlightCanvas() {
      return this.canDrop && this.startDrag
    },

    editMode() {
      return this.getEditMode ? this.getEditMode() : null
    }
  },
  mounted() {
    this.refreshSize()
    this.$nextTick(() => {
      // imageHelper.registerKeyEvent(this.$refs.main)
      fabric.enableGLFiltering = false
      const canvas = new fabric.Canvas(this.$refs.imgRect, { stateful: true, controlsAboveOverlay: true, preserveObjectStacking: true })
      canvas.on('selection:updated', this.onSelect)
      canvas.on('selection:created', this.onSelect)
      canvas.on('selection:cleared', this.onSelect)
      canvas.on('object:removed', this.onSelect)
      canvas.on('dragover', this.onDragResourceOver)
      canvas.on('dragleave', this.onDragResourceLeave)
      canvas.on('object:added', e => console.log(e))
      canvas.on('object:modified', ({ target, transform }) => {
        console.log('object:modified', transform)
        const previewState = {...target._stateProperties}
        const currentState = {}
        Object.keys(previewState).forEach(key => {
          currentState[key] = target[key]
        })
        // 修改back和redo
        imageHelper.recordHistory({
          back: () => fabric.util.object.extend(target, previewState),
          redo: () => fabric.util.object.extend(target, currentState)
        })
      })
      canvas.isDrawingMode = false
      this.canvas = canvas
      imageHelper.canvas = this.canvas
      canvas.renderAll()
      this.$emit('initialized', canvas)
      console.log(fabric, this.canvas)
    })
  },
  methods: {
    refreshSize() {
      if (this.$refs.main) {
        const { width, height } = this.$refs.main.getBoundingClientRect()
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

    onSelect() {
      this.currentObject = this.canvas.getActiveObject()
      imageHelper.currentTarget = this.currentObject
      this.$emit('update:currentSelectTarget', this.currentObject)
      console.log('----- select object', this.currentObject)
    },

    /**
     * 拖动释放资源
     * @param e
     */
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

    onDragResourceOver(e) {
      this.canDrop = true
      if (e.dataTransfer && e.dataTransfer.files) {
        this.startDrag = true
      }
    },

    onStageMousedown() {
      if (this.editMode === Const.EDIT_MODE.TEXT.value) {
        this.onAddTextShow()
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.canvas-panel {
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .high-light {
    box-shadow: inset 0 0 0 1px green;
  }
  .main-canvas {
    background-color: white;
    box-shadow: inset 0 0 0 1px #dedede;
    ::v-deep +canvas {
      background-image: none!important;
    }
  }
}
</style>

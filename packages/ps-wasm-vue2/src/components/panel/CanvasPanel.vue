<template>
  <div ref="main" :class="mainStageClass" style="width: 100%; height: 100%;">
    <div class="canvas-panel" @drop.stop.prevent="onStageDrop" @dragover="onDragResourceOver" @click.capture="onStageClick" @wheel.prevent="onWheel">
      <div :style="`transform: matrix(1, 0, 0, 1, ${viewPort.x}, ${viewPort.y});`">
        <div v-if="showDefault" class="default">
          <el-upload action="" accept="application/json" :auto-upload="false" :show-file-list="false" :on-change="onImport">
            <el-button size="mini" type="warning">导入</el-button>
          </el-upload>
          <el-upload action="" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="onFileAdd" style="margin-left: 12px;">
            <el-button size="mini" type="primary">打开</el-button>
          </el-upload>
          <el-button size="mini" type="primary" style="margin-left: 12px;" @click="onNew">新建</el-button>
        </div>
        <canvas
          ref="imgRect"
          :width="width"
          :height="height"
          class="main-canvas"
          :class="`${highlightCanvas && 'high-light'}`"
          :style="`background-image: url(${transparentSvg});`"/>
      </div>
    </div>
  </div>
</template>

<script>
import imageHelper from "@/utils/ImageHelper"
import Const from "@/const";
import {fabric} from "@/lib/fabric.min";
import fabricEnhance from "@/utils/fabricEnhance";
import transparentSvg from "@/../static/icon/transparent.svg"
import {eventBus} from "@/components/BaseFabricComponent";
import {isText} from "@/utils";

fabricEnhance(fabric)
export default {
  name: 'CanvasPanel',
  inject: ['getEditMode', 'waiting'],
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
      transparentSvg, // 透明背景
      currentObject: null, // 当前选择的编辑对象
      viewPort: {x: 0, y: 0},
      startDragOffset: {x: 0, y:0}, // 开始拖动作用在对象上的偏移
      mainStageClass: Const.MAIN_STAGE_CLASS,
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
    },

    /**
     * 显示默认选项
     * */
    showDefault() {
      return !(this.canvas || {}).originWidth
    },
    canvasState() {
      const { viewPort, canvas } = this
      const {x, y} = viewPort || {}
      const { width, height } = canvas || {}
      return { width, height, x, y }
    }
  },
  watch: {
    canvasState() {
      this.refreshReset()
    }
  },
  mounted() {
    this.refreshSize()
    this.$nextTick(() => {
      // imageHelper.registerKeyEvent(this.$refs.main)
      this.createCanvas()
    })
  },
  methods: {
    createCanvas() {
      // fabric.enableGLFiltering = false
      // const canvas = new fabric.Canvas(this.$refs.imgRect, { stateful: true, controlsAboveOverlay: true, preserveObjectStacking: true })
      // canvas.originWidth = 0
      // canvas.originHeight = 0
      // canvas.viewScale = 1
      // canvas.gifMode = false
      // canvas.on('selection:updated', this.onSelect)
      // canvas.on('selection:created', this.onSelect)
      // canvas.on('selection:cleared', this.onSelect)
      // canvas.on('object:removed', this.onSelect)
      // canvas.on('dragover', this.onDragResourceOver)
      // canvas.on('dragleave', this.onDragResourceLeave)
      // // canvas.on('object:added', e => console.log(e))
      // canvas.on('object:modified', ({ target, transform }) => {
      //   console.log('object:modified', transform)
      //   const previewState = {...target._stateProperties}
      //   const currentState = {}
      //   Object.keys(previewState).forEach(key => {
      //     currentState[key] = target[key]
      //   })
      //   // 修改back和redo
      //   imageHelper.recordHistory({
      //     back: () => fabric.util.object.extend(target, previewState) && target.fire('modified'),
      //     redo: () => fabric.util.object.extend(target, currentState) && target.fire('modified')
      //   })
      // })
      // canvas.isDrawingMode = false
      const canvas = imageHelper.createCanvas(this.$refs.imgRect)
      canvas.on('selection:updated', this.onSelect)
      canvas.on('selection:created', this.onSelect)
      canvas.on('selection:cleared', this.onSelect)
      canvas.on('object:removed', this.onSelect)
      canvas.on('dragover', this.onDragResourceOver)
      canvas.on('dragleave', this.onDragResourceLeave)
      canvas.renderAll()
      this.canvas = canvas
      // imageHelper.canvas = this.canvas
      this.$emit('initialized', canvas)
      // imageHelper.trigger('initialized', canvas)
      // this.$refs.main.addEventListener('wheel', e => {
      //
      // })
      console.log(this.canvas, fabric)
    },
    refreshSize() {
      if (this.$refs.main) {
        const { width, height } = this.$refs.main.getBoundingClientRect()
        this.width = width
        this.height = height
        console.log(width, height)
      }
    },

    async onImport(file) {
      console.log(file)
      const text = await file.raw.text()
      imageHelper.importFromJson(text)
    },
    onNew() {
      eventBus.trigger('new')
    },

    async onFileAdd(file) {
      this.waiting(true)
      await imageHelper.uploadImage(file.raw)
      this.waiting(false)
    },

    onSelect() {
      this.currentObject = this.canvas.getActiveObject()
      if (this.currentObject && this.editMode === Const.EDIT_MODE.TEXT.value && !isText(this.currentObject.type)) {
        this.canvas.discardActiveObject()
      } else {
        imageHelper.currentTarget = this.currentObject
        this.$emit('update:currentSelectTarget', this.currentObject)
      }

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

    async onStageDrop(e) {
      if (this.showDefault) {
        return
      }
      const { clientX, clientY } = e.originalEvent || e
      const { x: canvasX, y: canvasY } = this.canvas.lowerCanvasEl.getBoundingClientRect()
      const offset = {x: clientX - canvasX, y: clientY - canvasY}
      const files = e.dataTransfer.files || []
      for (let i = 0; i < files.length; i++) {
        await imageHelper.uploadImage(files[i], {top: offset.y, left: offset.x})
      }
    },

    onDragResourceOver(e) {
      this.canDrop = true
      if (e.dataTransfer && e.dataTransfer.files) {
        this.startDrag = true
      }
    },

    onStageClick(e) {
      if (e.target.classList.contains('canvas-panel')) {
        imageHelper.clearActiveObjects(e)
        return
      }
      const { x: canvasX, y: canvasY } = this.canvas.lowerCanvasEl.getBoundingClientRect()
      const currentMouseDownPoint = {x: e.clientX - canvasX, y: e.clientY - canvasY}
      if ((!this.currentObject || (this.currentObject && ![Const.FABRIC_TYPE.I_TEXT, Const.FABRIC_TYPE.TEXTBOX].includes(this.currentObject.type))) && this.editMode === Const.EDIT_MODE.TEXT.value) {
        console.log('------ addText')
        eventBus.trigger('addText', currentMouseDownPoint)
      }
    },

    onWheel(e) {
      if (this.showDefault) {
        return
      }
      const { wheelDelta, deltaX, deltaY, clientX, clientY } = e
      const { x: canvasX, y: canvasY } = this.canvas.lowerCanvasEl.getBoundingClientRect()
      // todo 兼容 240 为放大缩小，其他可能是平移
      if (Math.abs(wheelDelta) === 240 || Math.abs(wheelDelta) === 480) {
        // const zoom = this.canvas.getZoom()
        const scale = Math.max(0.1, this.canvas.viewScale - deltaY * 0.0004)
        const width = scale * this.canvas.originWidth
        const height = scale * this.canvas.originHeight
        this.canvas.setZoom(scale)
        this.canvas.setDimensions({ width, height })
        this.canvas.viewScale = scale
        // this.canvas.zoomToPoint(new fabric.Point(clientX - canvasX, clientY - canvasY), Math.max(0.1, zoom - deltaY * 0.04))
        console.log(this.canvas.getZoom(), { width, height }, e)
      } else {
        this.viewPort.x += -deltaX * 0.1
        this.viewPort.y += -deltaY * 0.1
        // this.refreshReset()
        // this.canvas.relativePan({x : -deltaX, y: -deltaY})
      }
      // this.refreshReset()
    },

    refreshReset() {
      const { width: canvasWidth, height: canvasHeight } = this.canvas
      const { width, height } = this.$refs.main.getBoundingClientRect()
      if (width >= canvasWidth && height >= canvasHeight) {
        this.viewPort.x = 0
        this.viewPort.y = 0
      } else {
        const nearSize = 60
        const boundWidth = ((canvasWidth + width) / 2)
        const boundHeight = ((canvasHeight + height) / 2)
        if (boundWidth - Math.abs(this.viewPort.x) < nearSize) {
          this.viewPort.x = this.viewPort.x > 0 ? boundWidth - nearSize : -(boundWidth - nearSize)
        }

        if (boundHeight - Math.abs(this.viewPort.y) < nearSize) {
          this.viewPort.y = this.viewPort.y > 0 ? boundHeight - nearSize : -(boundHeight - nearSize)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.canvas-panel {
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  min-height: 200px;
  //position: relative;
  align-items: center;
  justify-content: center;
  background-color: #acacac;
  box-shadow: 0 0 0 1px #acacac;
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
  .default {
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
  }
}
</style>

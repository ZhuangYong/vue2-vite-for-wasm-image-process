<template>
  <div ref="main" :class="mainStageClass" style="width: 100%; height: 100%;">
    <div class="canvas-panel" @drop.stop.prevent="onStageDrop" @dragover="onDragResourceOver" @mousedown.capture="onStageClick" @wheel.prevent="onWheel">
      <div class="canvas-container" :style="`transform: matrix(1, 0, 0, 1, ${viewPort.x}, ${viewPort.y});`">
        <div v-if="showDefault" class="default">
          <!--<el-upload action="" accept="application/json" :auto-upload="false" :show-file-list="false" :on-change="onImport">
            <el-button size="small" type="warning">导入</el-button>
          </el-upload>
          <el-upload action="" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="onFileAdd" style="margin-left: 12px;">
            <el-button size="small" type="primary">打开</el-button>
          </el-upload>
          <el-button size="small" type="primary" style="margin-left: 12px;" @click="onNew">新建</el-button>-->
          <div class="empty-tip">
            <svg-icon name="editor-empty" size="120px" />
            <p style="margin-top: 20px;">请从左侧选择素材进行表情的制作</p>
          </div>
        </div>
        <div v-if="tipDragArea" class="show-drag-tip" :style="tipAreaStyle" />
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
import _ from 'lodash'
import {Const, imageHelper, timeLinePlayer, fabric, Event as eventBus, Rectangle } from 'ps-wasm-vue2'
import transparentSvg from './transparent.svg'
import {isText} from '@vue/compiler-core';
import {CUSTOM_EVENT} from '../utils'

export default {
  name: 'CanvasPanel',
  inject: ['getEditMode'],
  props: {
    currentSelectTarget: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      width: 300, // 画布宽
      height: 300, // 画布高
      canDrop: false, // 拖拽是否在可释放区域
      canvas: {}, // 画布实例化对象
      objects: [],
      transparentSvg, // 透明背景
      currentObject: null, // 当前选择的编辑对象
      viewPort: {x: 0, y: 0},
      startDragOffset: {x: 0, y:0}, // 开始拖动作用在对象上的偏移
      mainStageClass: Const.MAIN_STAGE_CLASS,
      startDrag: false,
      tipDragArea: null // 拖拽提示
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
      return this.canvas.gifMode ? _.isEmpty(timeLinePlayer.frameGroups) : _.isEmpty(this.canvas._objects)
      // return !this.canvas.originWidth
    },
    canvasState() {
      const { viewPort, canvas } = this
      const {x, y} = viewPort || {}
      const { width, height } = canvas || {}
      return { width, height, x, y }
    },

    tipAreaStyle() {
      if (!this.tipDragArea) {
        return {}
      }
      const {x, y, width, height} = this.tipDragArea
      return {
        top: `${y}px`,
        left: `${x}px`,
        width: `${width}px`,
        height: `${height}px`,
      }
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
      this.createCanvas()
    })
    window.addEventListener('mouseup', this.onResourceDrop)
    window.addEventListener(CUSTOM_EVENT.DRAG_RESOURCE, this.onDragResourceOver)
  },
  unmounted() {
    window.removeEventListener('mouseup', this.onResourceDrop)
    window.removeEventListener(CUSTOM_EVENT.DRAG_RESOURCE, this.onDragResourceOver)
  },
  methods: {
    createCanvas() {
      const canvas = imageHelper.createCanvas(this.$refs.imgRect)
      canvas.on('selection:updated', this.onSelect)
      canvas.on('selection:created', this.onSelect)
      canvas.on('selection:cleared', this.onSelect)
      canvas.on('object:removed', this.onSelect)
      canvas.on('dragover', this.onDragResourceOver)
      canvas.on('dragleave', this.onDragResourceLeave)
      canvas.renderAll()
      this.canvas = canvas
      canvas._objects = this.objects
      imageHelper.canvas = this.canvas
      this.$emit('initialized', canvas)
      // 初始化舞台大小
      imageHelper.newSage({ width: 240, height: 240 })
      setTimeout(() => imageHelper.refreshStageView(), 200)
      console.log(this.canvas, fabric)
    },

    /**
     * 初始化舞台大小
     * */
    refreshSize() {
      if (this.$refs.main) {
        const { width, height } = this.$refs.main.getBoundingClientRect()
        this.width = width
        this.height = height
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

    onFileAdd(file) {
      imageHelper.uploadImage(file.raw)
    },

    onSelect() {
      this.currentObject = this.canvas.getActiveObject()
      if (this.currentObject && this.editMode === Const.EDIT_MODE.TEXT.value && ![Const.FABRIC_TYPE.I_TEXT, Const.FABRIC_TYPE.TEXTBOX].includes(this.currentObject.type)) {
        this.canvas.discardActiveObject()
      } else {
        imageHelper.currentTarget = this.currentObject
        this.$emit('update:currentSelectTarget', this.currentObject)
      }
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

    onResourceDrop() {
      if (this.tipDragArea && this.tipDragArea.resource) {
        const { resource, width, height, type } = this.tipDragArea
        if (!imageHelper.stageReady()) {
          // this.canvas.originWidth = width
          // this.canvas.originHeight = height
          const { naturalHeight, naturalWidth } = resource.naturalSize || {}
          imageHelper.newSage({ width: naturalWidth || width, height: naturalHeight || height })
        }
        if (resource.url) {
          if (resource.type === 'gif') {
            imageHelper.uploadGif(resource.url, {})
          } else {
            imageHelper.uploadImage(resource.url, {})
          }
        } else {
          imageHelper.addText(resource.label, {})
        }
      }
      this.tipDragArea = null
    },

    onStageDrop(e) {
      if (this.showDefault) {
        return
      }
      const { clientX, clientY } = e.originalEvent || e
      const { x: canvasX, y: canvasY } = this.canvas.lowerCanvasEl.getBoundingClientRect()
      const offset = {x: clientX - canvasX, y: clientY - canvasY}
      Array.from(e.dataTransfer.files || []).forEach(file => {
        imageHelper.uploadImage(file, {top: offset.y, left: offset.x})
      })
    },

    onDragResourceOver(e) {
      if (CUSTOM_EVENT.DRAG_RESOURCE === e.type) {
        this.refreshInStage(e)
      } else {
        this.canDrop = true
        if (e.dataTransfer && e.dataTransfer.files) {
          this.startDrag = true
        }
      }
    },

    onStageClick(e) {
      if (this.showDefault) {
        return
      }
      const { x: canvasX, y: canvasY } = this.canvas.lowerCanvasEl.getBoundingClientRect()
      const currentMouseDownPoint = {x: e.clientX - canvasX, y: e.clientY - canvasY}
      if ((!this.currentObject || (this.currentObject && !isText(this.currentObject.type))) && this.editMode === Const.EDIT_MODE.TEXT.key) {
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
        // console.log(this.canvas.getZoom(), { width, height }, e)
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
    },

    refreshInStage(e) {
      const { detail } = e
      const boundary = this.canvas.lowerCanvasEl.getBoundingClientRect()
      const { x: canvasX, y: canvasY, width: canvasWidth, height: canvasHeight } = boundary
      if (detail && detail.ghostInfo) {
        const { left, top, width, height, moveX, moveY } = detail.ghostInfo
        const x = left + moveX
        const y = top + moveY
        const intersect = Rectangle.from(canvasX, canvasY, canvasWidth, canvasHeight).isIntersect(Rectangle.from(x, y, width, height))
        this.canDrop = intersect
        if (intersect) {
          this.tipDragArea = this.toLocalArea({ x, y, width, height }, boundary)
          this.tipDragArea.resource = detail.resource
          return
        }
      }
      this.tipDragArea = null
    },

    toLocalArea(area, boundary) {
      const { x: canvasX, y: canvasY } = boundary || this.canvas.lowerCanvasEl.getBoundingClientRect()
      return {
        x: area.x - canvasX,
        y: area.y - canvasY,
        width: area.width,
        height: area.height
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
  background-color: #f6f6f6;
  box-shadow: 0 0 0 1px #acacac;
  .high-light {
    box-shadow: inset 0 0 0 1px green;
  }

  .show-drag-tip {
    z-index: 99999;
    position: absolute;
    pointer-events: none;
    border: 1px solid #009983;
  }
  .main-canvas {
    background-color: white;
    box-shadow: inset 0 0 0 1px #dedede;
    :deep(+canvas) {
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
    background-color: white;
    transition: all ease 0.3s;
    .empty-tip {
      color: #CCCCCC;
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>

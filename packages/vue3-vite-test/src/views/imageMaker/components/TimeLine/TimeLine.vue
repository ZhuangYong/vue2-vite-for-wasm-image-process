<template>
  <div class="time-line-item" :style="timeLineContainerStyle">
    <div ref="timeLine" class="time-line" :class="active && 'active'" :style="timeLineStyle">
      <!--显示时间限制，可拖动改变范围-->
      <span ref="timeLineLimit" class="limit-panel" :style="limitStyle" @mousedown="onMousedown" @mouseup="onMouseup">
        <!--左边拖动锚-->
        <span v-if="active" class="limit-bar left" @mousedown="onLeftMousedown" @mousemove="onLimitMousemove" @mouseup="leaveChangeLimit" />
        <!--右边拖动锚-->
        <span v-if="active" class="limit-bar right" @mousedown="onRightMousedown" @mousemove="onLimitMousemove" @mouseup="leaveChangeLimit" />
      </span>
      <!--显示时间下截图-->
      <div class="preview-container" :style="limitStyle">
        <div class="preview-list" :style="previewListStyle">
          <div v-for="frame in frames" :key="frame.UUID" class="preview-item" :style="previewItemStyle(frame)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { timeLinePlayer, imageHelper, COMMAND_TYPES } from 'ps-wasm-vue2'

export default {
  name: 'TimeLine',
  inject: ['getContainer'],
  props: {
    /**
     * 片段
     * */
    frameGroup: {
      type: Object,
      default: () => ({})
    },

    /**
     * 缩放
     * */
    scale: {
      type: Number,
      default: 1
    },

    /**
     * 排序
     * */
    index: {
      type: Number,
      default: 0
    },

    /**
     * 截图时间范围
     * */
    itemSize: {
      type: Number,
      default: 40
    },

    gap: {
      type: Number,
      default: 10
    },

    /**
     * 偏移
     * */
    offset: {
      type: Number,
      default: 0
    },

    /**
     * 限制时间是否可操作
     * */
    limitEditable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      active: false,
      frames: [],
      offsetTop: 0,
      startDelay: false,
      limit: {left: 0, right: 0},
      timeLinePlayer,
      startLimit: [],
      startLimitWay: '',
      startPoint: { x: 0 }
    }
  },
  computed: {

    timeLineContainerStyle() {
      const { gap, itemSize, frameGroup, scale } = this
      if (frameGroup.UUID === 'ghost') {
        return `margin: ${gap}px 0; height: ${itemSize}px; width: 100%; background-color: #04630429;`
      }
      return `margin: ${gap}px 0; height: ${itemSize}px; width: ${(frameGroup.duration + frameGroup.delay) * (scale || 1)}px`
    },

    timeLineStyle() {
      // const { index, itemSize, gap, offsetTop } = this
      // const styleOnOrder = ``
      // const top = `top: ${index * (itemSize + gap) + gap}px;`
      // const offset = `transform: translate(${this.frameGroup.delay * this.scale}px, ${this.offsetTop}px);`
      // return `${this.startDelay ? `position: absolute;${top}` : ''} height: ${this.itemSize}px; width: ${this.frameGroup.duration * this.scale}px; ${offset}`
      const styleMargin = ~this.orderIndex && this.orderIndex < this.index ? `margin-top: ${-(this.itemSize + this.gap)}px;` : ''
      return `${styleMargin} transform: translate(${this.frameGroup.delay * this.scale}px, ${this.offsetTop}px); width: ${this.frameGroup.duration * this.scale}px`
    },

    /**
     * 限制操作面板样式
     * */
    limitStyle() {
      let left = 0
      let width = '100%'
      const limit = this.limit
      const { duration } = this.frameGroup
      if (duration) {
        left = `${(limit.left / duration) * 100}%`
        // 边框有1像素
        width = `calc(${((limit.right - limit.left) / duration) * 100}%)`
      }

      return `width: ${width}; left: ${left}`
    },

    /**
     * 预览列样式
     * */
    previewListStyle() {
      return `width: ${this.frameGroup.duration * this.scale}px; left: -${this.limit.left * this.scale}px;`
    },

    orderIndex() {
      const { offsetTop: v, itemSize, gap, index } = this
      const maxIndex = timeLinePlayer.frameGroups.length - 1
      if ((index <= 0 && v < 0) || (index >= maxIndex && v > 0)) {
        return -1
      }
      if (Math.abs(v) > itemSize * 1.2) {
        let size = Number((v / (itemSize + gap)).toFixed(0))
        const newIndex = Math.max(index + size, 0)
        // return Math.max(index + size, 0)
        return newIndex >= 0 ? (~Math.sign(size) && Math.abs(this.index - Math.abs(newIndex)) <= 1 ? (newIndex + Math.sign(size)) : newIndex) : -1
      } else {
        return -1
      }
    }
  },
  watch: {
    frameGroup: {
      handler(v) {
        const [left, right] = (v || {}).limit || []
        this.limit.left = left
        this.limit.right = right
      },
      immediate: true
    },
    scale() {
      this.refreshFrames()
    },

    active(v) {
      this.timeLinePlayer.setSelectFrameGroup(this.frameGroup, !!v)
    },

    orderIndex(v) {
      this.changeSwitchIndex(v)
    }
  },
  mounted() {
    imageHelper.canvas.on('object:removed', this.refreshFrames)
    imageHelper.canvas.on('object:added', this.refreshFrames)
    imageHelper.canvas.on('object:modified', this.refreshFrames)
    imageHelper.canvas.on('update:snapshot', this.refreshFrames)
    imageHelper.on('applyAnimate', this.refreshFrames)
    document.addEventListener('mousedown', this.onDocumentMousedown)
    document.addEventListener('mouseup', this.onMouseup)
    document.addEventListener('mousemove', this.onMousemove)
    this.refreshFrames()
  },
  beforeDestroy() {
    imageHelper.canvas.off('object:removed', this.refreshFrames)
    imageHelper.canvas.off('object:added', this.refreshFrames)
    imageHelper.canvas.off('object:modified', this.refreshFrames)
    imageHelper.canvas.off('update:snapshot', this.refreshFrames)
    imageHelper.off('applyAnimate', this.refreshFrames)
    document.removeEventListener('mousedown', this.onDocumentMousedown)
    document.removeEventListener('mouseup', this.onMouseup)
    document.removeEventListener('mousemove', this.onMousemove)
  },
  methods: {
    leaveChangeLimit() {
      this.startLimitWay = ''
    },

    onDocumentMousedown(e) {
      const container = this.getContainer()
      if (
        !((this.$refs.timeLineLimit && this.$refs.timeLineLimit.contains(e.target)) || this.$refs.timeLineLimit === e.target) &&
        container && container.contains(e.target)
      ) {
        this.active = false
      }
    },

    onMousedown(e) {
      if (this.limitEditable) {
        this.active = true
      }
      this.startDelay = true
      this.preClientX = e.clientX
      this.preClientY = e.clientY
      this.preDelay = this.frameGroup.delay
      this.changeCursor('move')
    },

    onMousemove(e) {
      const { frameGroup } = this
      if (this.startDelay) {
        const distance = Number(((e.clientX - this.preClientX) / this.scale).toFixed(0))
        frameGroup.delay = Math.max(-this.frameGroup.limit[0], this.preDelay + distance)
        timeLinePlayer.resetCurrentTime()
        this.offsetTop = e.clientY - this.preClientY
        // this.preClientX = e.clientX
      }
      this.onLimitMousemove(e)
    },

    onMouseup() {
      this.changeIndex()
      this.offsetTop = 0
      this.startDelay = false
      this.leaveChangeLimit()
      this.resetCursor()
      this.changeSwitchIndex(-1)
    },

    /**
     * 左侧时间限制bar
     * */
    onLeftMousedown(e) {
      e.stopPropagation()
      e.preventDefault()
      this.startPoint = {x: e.clientX}
      this.startLimit = [...this.frameGroup.limit]
      this.startLimitWay = 'left'
      this.changeCursor('ew-resize')
    },

    /**
     * 右侧时间限制bar
     * */
    onRightMousedown(e) {
      e.stopPropagation()
      e.preventDefault()
      this.startPoint = {x: e.clientX}
      this.startLimit = [...this.frameGroup.limit]
      this.startLimitWay = 'right'
      this.changeCursor('ew-resize')
    },
    /**
     * 修改时间限制
     * @param e event
     * */
    onLimitMousemove(e) {
      if (!this.startLimitWay || !this.$refs.timeLine) {
        return
      }
      const { width } = this.$refs.timeLine.getBoundingClientRect()
      const distance = Number(((e.clientX - this.startPoint.x) / width * this.frameGroup.duration).toFixed(0))
      const { frameGroup } = this
      if (this.startLimitWay === 'left') {
        const newLimit = this.startLimit[0] + distance
        this.limit.left = frameGroup.limit[0] = Math.min(Math.max(0, newLimit), this.startLimit[1])
        timeLinePlayer.resetCurrentTime(this.limit.left + this.frameGroup.delay)
      } else if (this.startLimitWay === 'right') {
        const newLimit = this.startLimit[1] + distance
        this.limit.right = frameGroup.limit[1] = Math.max(Math.min(this.frameGroup.duration, newLimit), this.startLimit[0])
        timeLinePlayer.resetCurrentTime(this.limit.right + this.frameGroup.delay)
      }
    },

    /**
     * 刷新帧
     * */
    async refreshFrames() {
      const arr = []
      const viewFrameTime = this.itemSize / this.scale
      // const { frameCount } = this.timeLinePlayer
      const frameCount = Math.ceil(this.frameGroup.duration / viewFrameTime)
      for (let i = 0; i < frameCount; i++) {
        const keyTime = viewFrameTime * i
        const snapshot = await this.frameGroup.getSnapshot(keyTime)
        arr.push({ UUID: `snapshot-${keyTime}`, index: i, keyTime, snapshot })
      }
      this.frames = arr
    },

    reloadSnapshot() {
      // todo
    },

    changeIndex() {
      const { index: from, orderIndex } = this
      if (this.orderIndex >= 0) {
        const to = from < orderIndex ? orderIndex -1 : orderIndex
        this.$emit('change-index', { from, to })
        imageHelper.handleCommand(COMMAND_TYPES.EDIT.SWITCH_INDEX.key, from, to)
      }
    },
    changeSwitchIndex(index) {
      this.$emit('switch-index', index)
    },

    /**
     * 截图帧样式，可视范围内渲染
     * @param frame
     * @returns {string}
     */
    previewItemStyle(frame) {
      const boundSize = 4
      const { width } = this.getContainer().getBoundingClientRect()
      const count = Math.ceil(width / this.itemSize)
      const leftCount = Math.ceil((this.offset - this.frameGroup.delay * this.scale) / this.itemSize)
      if (frame.index > leftCount - boundSize && frame.index < leftCount + count + boundSize) {
        return `background-image: url('${frame.snapshot}')`
      }
      return ''
    },

    changeCursor(type) {
      document.body.oldCursor = document.body.style.cursor
      document.body.style.cursor = type
    },

    resetCursor() {
      document.body.style.cursor = document.body.oldCursor
    }
  },
}
</script>

<style lang="scss" scoped>
@use 'sass:math';
$itemSize: 40px;
$borderSize: 1px;
$limitBarWidth: 3px;
.time-line {
  height: $itemSize;
  position: relative;
  white-space: nowrap;
  border-radius: 4px;
  background-color: #f7f9f8;
  &.active {
    z-index: 2;
    .limit-panel {
      border: $borderSize solid #009983;
    }
  }
  .limit-panel {
    z-index: 9;
    cursor: move;
    border-radius: 4px;
    position: absolute;
    height: $itemSize + $borderSize * 2;
    .limit-bar {
      top: 27.5%;
      height: 45%;
      cursor: ew-resize;
      position: absolute;
      border-radius: math.div($limitBarWidth, 2);
      width: $limitBarWidth;
      background-color: #009987;
      &:before {
        top: 33%;
        left: 1px;
        width: 1px;
        height: 34%;
        content: " ";
        background: white;
        position: absolute;
      }
      &:after {
        content: ' ';
        width: 8px;
        height: 40px;
        top: -12px;
        position: absolute;
        background: #ffffff00;
      }
      &.left {
        left: -($borderSize + 1px);
        border-radius: 3px;
        &:after {
          left: 0;
        }
      }
      &.right {
        right: -($borderSize + 1px);
        border-radius: 3px;
        &:after {
          right: 0;
        }
      }
    }
  }
}
.preview-container {
  overflow: hidden;
  position: relative;
  border-radius: 4px;
  pointer-events: none;
  border: 1px solid #00998333;
  height: calc(#{$itemSize} + 2px);
  .preview-list {
    position: absolute;
    background-color: #cedcda;
    .preview-item {
      width: $itemSize;
      height: $itemSize;
      display: inline-block;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      img {
        max-width: 100%;
        max-height: 100%;
        user-select: none;
        pointer-events: none;
      }
    }
  }
}
</style>

<template>
  <div ref="timeLine" class="time-line" :style="`transform: translateX(${frameGroup.delay * scale}px); width: ${frameGroup.duration * scale}px`" @mousedown="onMousedown" @mousemove="onMousemove" @mouseup="onMouseup">
    <!--<div v-for="frame in frameGroup.frames" :key="frame.UUID" class="preview-item">
      <div v-for="object in frame._objects" :key="object.UUID" v-html="`<svg viewBox='0 0 ${object.width} ${object.height}'>${object.toSVG()}</svg>`" />
      &lt;!&ndash;<img :src="frame.url" alt="">&ndash;&gt;
    </div>-->
    <!--显示时间限制，可拖动改变范围-->
    <span class="limit-panel" :style="`width: ${widthStyle}; left: ${leftStyle}`">
      <!--左边拖动锚-->
      <span class="limit-bar left" @mousedown="onLeftMousedown" @mousemove="onLimitMousemove" @mouseup="leaveChangeLimit" />
      <!--右边拖动锚-->
      <span class="limit-bar right" @mousedown="onRightMousedown" @mousemove="onLimitMousemove" @mouseup="leaveChangeLimit" />
    </span>
    <!--显示时间下截图-->
    <div v-for="frame in frames" :key="frame.UUID" class="preview-item" :style="previewItemStyle(frame)" />
  </div>
</template>

<script>
import timeLinePlayer from "@/utils/TimeLinePlayer"
import imageHelper from "@/utils/ImageHelper"

export default {
  name: 'TimeLine',
  inject: ['getContainer'],
  props: {
    /**
     * 片段
     * */
    frameGroup: {
      type: Object,
      default: () => {}
    },
    /**
     * 缩放
     * */
    scale: {
      type: Number,
      default: 1
    },
    /**
     * 缩放
     * */
    itemSize: {
      type: Number,
      default: 40
    },
    /**
     * 偏移
     * */
    offset: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      frames: [],
      limit: {left: 0, right: 0},
      timeLinePlayer,
      startLimit: [],
      startLimitWay: '',
      startPoint: { x: 0 }
    }
  },
  computed: {
    /**
     * 限制下的宽度
     * */
    widthStyle() {
      const limit = this.limit
      const { duration } = this.frameGroup
      if (duration) {
        return `calc(${((limit.right - limit.left) / duration) * 100}% - 4px)`
      }
      return `calc(100% - 4px)`
    },
    /**
     * 限制下的左边position
     * @returns {string|number}
     */
    leftStyle() {
      const limit = this.limit
      const { duration } = this.frameGroup
      if (duration) {
        return `${(limit.left / duration) * 100}%`
      }
      return 0
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
    }
  },
  mounted() {
    imageHelper.canvas.on('object:removed', this.refreshFrames)
    imageHelper.canvas.on('object:added', this.refreshFrames)
    imageHelper.canvas.on('object:modified', this.refreshFrames)
    imageHelper.canvas.on('update:snapshot', this.refreshFrames)
    imageHelper.on('applyAnimate', this.refreshFrames)
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
    document.removeEventListener('mouseup', this.onMouseup)
    document.removeEventListener('mousemove', this.onMousemove)
  },
  methods: {
    leaveChangeLimit() {
      this.startLimitWay = ''
    },

    onMousedown(e) {
      this.startDelay = true
      this.preClientX = e.clientX
      this.preDelay = this.frameGroup.delay
    },

    onMousemove(e) {
      if (this.startDelay) {
        const distance = e.clientX - this.preClientX
        this.frameGroup.delay = Math.max(0, this.preDelay + distance)
        timeLinePlayer.resetCurrentTime()
        console.log('----- onMousemove', this.frameGroup.delay, distance)
        // this.preClientX = e.clientX
      }
      this.onLimitMousemove(e)
    },

    onMouseup() {
      this.startDelay = false
      this.leaveChangeLimit()
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
    },
    onLimitMousemove(e) {
      if (!this.startLimitWay || !this.$refs.timeLine) {
        return
      }
      const { width } = this.$refs.timeLine.getBoundingClientRect()
      const distance = (e.clientX - this.startPoint.x) / width * this.frameGroup.duration

      if (this.startLimitWay === 'left') {
        const newLimit = this.startLimit[0] + distance
        this.limit.left = this.frameGroup.limit[0] = Math.min(Math.max(0, newLimit), this.startLimit[1])
        timeLinePlayer.resetCurrentTime(this.limit.left)
      } else if (this.startLimitWay === 'right') {
        const newLimit = this.startLimit[1] + distance
        this.limit.right = this.frameGroup.limit[1] = Math.max(Math.min(this.frameGroup.duration, newLimit), this.startLimit[0])
        timeLinePlayer.resetCurrentTime(this.limit.right)
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
      const leftCount = Math.ceil((this.offset - this.frameGroup.delay) / this.itemSize)
      if (frame.index > leftCount - boundSize && frame.index < leftCount + count + boundSize) {
        return `background-image: url('${frame.snapshot}')`
      }
      return ''
    }
  },
}
</script>

<style lang="scss" scoped>
$itemSize: 40px;
$borderSize: 2px;
$limitBarWidth: 15px;
.time-line {
  cursor: move;
  overflow: hidden;
  height: $itemSize;
  position: relative;
  white-space: nowrap;
  .limit-panel {
    z-index: 9;
    border-radius: 4px;
    position: absolute;
    //width: calc(100% - #{$borderSize * 2});
    height: $itemSize - $borderSize * 2;
    border: $borderSize solid #009987;
    .limit-bar {
      top: 0;
      height: 100%;
      cursor: ew-resize;
      position: absolute;
      width: $limitBarWidth;
      background-color: #009987;
      &:before {
        top: 10%;
        width: 2px;
        height: 80%;
        content: " ";
        background: white;
        position: absolute;
        border-radius: 2px;
      }
      &.left {
        left: -$borderSize;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      &.right {
        right: -$borderSize;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }
}
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
</style>

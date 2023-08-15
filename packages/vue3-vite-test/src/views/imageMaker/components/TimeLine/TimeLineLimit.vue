<template>
  <div ref="timeLine" class="time-line time-line-limit" :style="`transform: translateX(${offset}px)`" @mousedown="onMousedown" @mousemove="onMousemove" @mouseup="onMouseup">
    <!--显示时间限制，可拖动改变范围-->
    <span class="limit-panel" :style="`width: ${widthStyle}; left: ${leftStyle};`">
      <!--左边拖动锚-->
      <span class="limit-bar left" @mousedown="onLeftMousedown" @mousemove="onLimitMousemove" @mouseup="leaveChangeLimit" />
      <!--右边拖动锚-->
      <span class="limit-bar right" @mousedown="onRightMousedown" @mousemove="onLimitMousemove" @mouseup="leaveChangeLimit" />
    </span>
  </div>
</template>

<script>
import { timeLinePlayer } from 'ps-wasm-vue2'

export default {
  name: 'TimeLineLimit',
  inject: ['getContainer'],
  props: {
    /**
     * 片段
     * */
    outputLimit: {
      type: Array,
      default: () => []
    },

    /**
     * 最小限制
     * */
    min: {
      type: Number,
      default: 40
    },

    /**
     * 缩放
     * */
    scale: {
      type: Number,
      default: 1
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
      limit: { start: 0, end: 0 },
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
      return `calc(${(this.limit.end - this.limit.start) * this.scale}px - 4px)`
    },
    /**
     * 限制下的左边position
     * @returns {string|number}
     */
    leftStyle() {
      return `${this.limit.start}px`
    }
  },
  watch: {
    outputLimit: {
      handler(v) {
        const [left, right] = v || []
        this.limit.start = left || 0
        this.limit.end = right || 0
      },
      immediate: true
    }
  },
  mounted() {
    document.addEventListener('mouseup', this.onMouseup)
    document.addEventListener('mousemove', this.onMousemove)
  },
  beforeUnmount() {
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
      this.startLimit = [this.limit.start, this.limit.end]
    },

    onMousemove(e) {
      if (this.startDelay) {
        const distance = e.clientX - this.preClientX
        this.limit.start = Math.max(0, this.startLimit[0] + distance)
        this.limit.end = this.startLimit[1] + this.limit.start - this.startLimit[0]
        timeLinePlayer.resetCurrentTime()
        console.log('----- onMousemove', distance)
      }
      this.onLimitMousemove(e)
    },

    onMouseup() {
      this.startLimitWay = this.startDelay = false
      this.leaveChangeLimit()
    },

    /**
     * 左侧时间限制bar
     * */
    onLeftMousedown(e) {
      e.stopPropagation()
      e.preventDefault()
      this.startPoint = {x: e.clientX}
      this.startLimit = [this.limit.start, this.limit.end]
      this.startLimitWay = 'left'
    },

    /**
     * 右侧时间限制bar
     * */
    onRightMousedown(e) {
      e.stopPropagation()
      e.preventDefault()
      this.startPoint = {x: e.clientX}
      this.startLimit = [this.limit.start, this.limit.end]
      this.startLimitWay = 'right'
    },
    onLimitMousemove(e) {
      if (!this.startLimitWay || !this.$refs.timeLine) {
        return
      }
      const distance = e.clientX - this.startPoint.x
      if (this.startLimitWay === 'left') {
        this.limit.start = Math.min(Math.max(0, this.startLimit[0] + distance), this.limit.end - this.min)
        timeLinePlayer.resetCurrentTime(this.limit.start)
      } else if (this.startLimitWay === 'right') {
        this.limit.end = Math.max(this.startLimit[1] + distance, this.limit.start + this.min)
        timeLinePlayer.resetCurrentTime(this.limit.end)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$itemSize: 16px;
$borderSize: 1px;
$limitBarWidth: 5px;
.time-line {
  cursor: move;
  height: $itemSize;
  position: relative;
  white-space: nowrap;
  .limit-panel {
    z-index: 9;
    position: absolute;
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
        width: 1px;
        height: 80%;
        content: " ";
        background: white;
        position: absolute;
        border-radius: 2px;
      }
      &.left {
        left: -$borderSize;
      }
      &.right {
        right: -$borderSize;
      }
    }
  }
}
</style>

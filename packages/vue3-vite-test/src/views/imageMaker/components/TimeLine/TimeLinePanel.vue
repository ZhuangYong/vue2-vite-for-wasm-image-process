<template>
  <div v-if="timeLinePlayer" ref="timeLinePanel" class="time-line-panel" @mousedown="onMousedown" @mouseup="onMouseup" @mousemove="onMousemove" @wheel="onWheel">
    <!--时间刻度-->
    <TimeLineMark :offset="timeLineContainer.x" :scale="scale || defaultScale" class="time-line-mark" @mousedown.native="onMarkMousedown" @mousemove.native="onMarkMousemove" @mouseout.native="onMarkMouseout" />
    <!--时间限制编辑-->
    <TimeLineLimit v-show="active && timeLinePlayer.enabledOutputLimit" :output-limit="timeLinePlayer.outputLimit" :style="`top: 22px; transform: translate(${-timeLineContainer.x}px`" />
    <!--辅助显示当前鼠标移动刻度-->
    <div v-if="showTimeAssetsLine && timeLinePlayer.duration" class="time-assets-line" :style="`transform: translateX(${timeAssetsLine.x}px)`" />
    <!--辅助显示当前播放刻度-->
    <div v-if="active" class="time-assets-line play-time-line" :style="`transform: translateX(${playTimeLineX}px)`">
      <span class="play-time-line-head" />
    </div>
    <!--帧预览-->
    <div ref="timeLineContainer" class="time-line-container" :style="`transform: translate(${-timeLineContainer.x}px, ${-timeLineContainer.y}px)`">
      <div v-for="frameGroup in timeLinePlayer.frameGroups" :key="frameGroup.UUID" class="time-line-item" :style="`width: ${(frameGroup.duration + frameGroup.delay) * (scale || 1)}px`">
        <TimeLine :frame-group="frameGroup" :offset="timeLineContainer.x" :item-size="itemSize"
                  :scale="scale || defaultScale" :limit-editable="true" @click.native="onFrameGroupClick(frameGroup)"/>
      </div>
    </div>
    <div v-show="showScrollBar" class="scroll-bar" :class="scrollbarScroll === 'h' && scrollbarScroll" :style="`width: ${scrollBar.width}px; transform: translateX(${scrollBar.x}px)`" @mousedown="onScrollbarMousedown" />
    <div v-show="showScrollBar" class="scroll-bar vertical" :class="scrollbarScroll === 'v' && scrollbarScroll" :style="`height: ${scrollBar.height}px; transform: translateY(${scrollBar.y}px)`" @mousedown="onScrollbarMousedown" />
  </div>
</template>

<script>
import { timeLinePlayer } from 'ps-wasm-vue2'
import { BaseFabricComponent } from "ps-wasm-vue2"
import TimeLine from "./TimeLine.vue"
import TimeLineMark from "./TimeLineMark.vue"
import TimeLineLimit from "./TimeLineLimit.vue"

// 样式(TimeLine.vue)中itemSize保持一致
const itemSize = 40

export default {
  name: 'TimeLinePanel',
  mixins: [BaseFabricComponent],
  components: { TimeLine, TimeLineMark, TimeLineLimit },
  provide() {
    return {
      getContainer: () => this.$refs.timeLinePanel
    }
  },
  props: {
    // timeLinePlayer: {
    //   type: Object,
    //   default: () => {}
    // },
  },
  data() {
    return {
      scale: 0,
      itemSize,
      currentFrameGroup: null, // 当前编辑的片段
      changeTime: false, // 当前是否为修改时间状态
      timeLinePlayer,
      paddingBottom: 80, // 内容底部多显示距离
      paddingRight: 100, // 内容右侧多显示距离
      timeAssetsLine: {x: 0, y: 0},
      showTimeAssetsLine: false, // 是否显示时间辅助线
      scrollbarScroll: '', // 滚动条拖动
      showScrollBar: false, // 显示滚动条
      timeLineContainer: { x: 0, y: 0 }, // 帧预览面板
      scrollBar: { width: 0, height: 0, x: 0, y: 0, startX: 0, startY: 0, startClientX: 0, startClientY: 0 },
      playTimeLineX: 0
    }
  },
  computed: {
    /**
     * 默认缩放，放大不能超过该值
     * */
    defaultScale() {
      return (itemSize / this.timeLinePlayer.frameTime) || 1
    },

    active() {
      return this.timeLinePlayer.duration
    },

    // timeLinePlayer() {
    //   console.log('>>>', this.$timeLinePlayer)
    //   return this.$timeLinePlayer || {}
    // }
  },
  watch: {
    "timeLinePlayer.currentTime"() {
      this.refreshTimeLine()
    },
    active() {
      this.refreshScale()
    }
  },
  created() {
  },
  mounted() {
    document.addEventListener('mouseup', this.leaveChangeTime)
    document.addEventListener('mousemove', this.onDocumentMousemove)
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.leaveChangeTime)
    document.removeEventListener('mousemove', this.onDocumentMousemove)
  },
  methods: {
    leaveChangeTime() {
      this.changeTime = false
      this.scrollbarScroll = ''
    },
    refreshTimeLine() {
      if (this.$refs.timeLineContainer) {
        const { width } = this.$refs.timeLineContainer.getBoundingClientRect()
        const { duration, currentTime } = this.timeLinePlayer
        this.playTimeLineX = (((currentTime / duration) * width) || 0) - (this.timeLineContainer.x || 0)
      } else {
        this.playTimeLineX = 0
      }
    },
    /**
     * 滚动条按下
     * */
    onScrollbarMousedown(e) {
      e.stopPropagation()
      e.preventDefault()
      this.scrollBar.startClientX = e.clientX
      this.scrollBar.startClientY = e.clientY
      this.scrollBar.startX = this.scrollBar.x
      this.scrollBar.startY = this.scrollBar.y
      this.scrollbarScroll = e.target.classList.contains('vertical') ? 'v' : 'h'
      // this.scrollbarScroll = true
    },

    onFrameGroupClick(frameGroup) {
      this.currentFrameGroup = frameGroup
    },

    onMousedown(e) {
    },
    onMarkMousedown(e) {
      this.changeTime = true
      this.refreshPlayTime(e)
      this.refreshTimeLine()
    },
    onDocumentMousemove(e) {
      this.refreshPlayTime(e)
      this.refreshScrollbar(e)
    },
    onMarkMousemove(e) {
      if (!this.showTimeAssetsLine) {
        this.showTimeAssetsLine = true
      }
      this.refreshTimeAssetsLine(e)
      this.refreshPlayTime(e)
    },
    onMousemove(e) {
      this.refreshScrollbar(e)
    },
    onMouseup() {
      this.leaveChangeTime()
    },
    onMarkMouseout() {
      this.showTimeAssetsLine = false
    },
    onWheel(e) {
      e.stopPropagation()
      e.preventDefault()
      const { wheelDelta, deltaY, deltaX } = e
      // todo 兼容 240、480 为放大缩小，其他可能是平移
      if (Math.abs(wheelDelta) !== 240 && Math.abs(wheelDelta) !== 480) {
        this.refreshTimeLineContainer(e)
      } else {
        // const [min, max] = this.timeLinePlayer.getTimeRange()
        // const { width } = this.$refs.timeLinePanel.getBoundingClientRect()
        // const time = max - min
        // const minScale = time * this.defaultScale > width ? ((width - 40) / time * this.defaultScale) : this.defaultScale
        // this.scale = Math.max(minScale, Math.min(this.defaultScale, (this.scale || this.defaultScale) - deltaY * 0.0004))
        this.refreshScale(e)
        this.refreshScrollbar(e)
      }
    },

    refreshScale(e) {
      const { deltaY } = e || {}
      const [min, max] = timeLinePlayer.getTimeRange()
      const { width } = this.$refs.timeLinePanel.getBoundingClientRect()
      const time = max - min
      const minScale = Math.min(1, time * this.defaultScale > width ? ((width - 40) / time * this.defaultScale) : this.defaultScale)
      this.scale = Math.max(minScale, Math.min(this.defaultScale, (this.scale || this.defaultScale) - (deltaY || 0) * 0.0004))
    },

    /**
     * 刷新可滚动区域属性
     * */
    refreshTimeLineContainer(e) {
      const { width, height } = this.$refs.timeLinePanel.getBoundingClientRect()
      const { width: containerWidth, height: containerHeight } = this.$refs.timeLineContainer.getBoundingClientRect()
      const left = this.timeLineContainer.x + e.deltaX * 0.1
      const top = this.timeLineContainer.y + e.deltaY * 0.1
      this.timeLineContainer.x = Math.max(0, Math.min(left, containerWidth - width + this.paddingRight))
      this.timeLineContainer.y = Math.max(0, Math.min(top, containerHeight - height + this.paddingBottom))

      this.scrollBar.x =  this.timeLineContainer.x / ((containerWidth - width + this.paddingRight) / (width - this.scrollBar.width))
      this.scrollBar.y =  this.timeLineContainer.y / ((containerHeight - height + this.paddingBottom) / (height - this.scrollBar.height))
      this.refreshTimeLine()
    },

    /**
     * 刷新时间辅助线状态
     * */
    refreshTimeAssetsLine(e) {
      if (this.$refs.timeLinePanel) {
        const { x, width, height } = this.$refs.timeLinePanel.getBoundingClientRect()
        const { width: containerWidth, height: containerHeight } = this.$refs.timeLineContainer.getBoundingClientRect()
        this.showScrollBar = (containerWidth + this.paddingRight) > width
        this.timeAssetsLine.x = Math.max(0, e.clientX - x)
        this.scrollBar.width = width / (containerWidth  + this.paddingRight) * width
        this.scrollBar.height = height / (containerHeight  + this.paddingBottom) * height
      }
    },

    refreshScrollbar(e) {
      if (!this.$refs.timeLinePanel) {
        return
      }
      const { width, height } = this.$refs.timeLinePanel.getBoundingClientRect()
      const { width: containerWidth, height: containerHeight } = this.$refs.timeLineContainer.getBoundingClientRect()
      if (this.scrollbarScroll === 'h') {
        const distance = e.clientX - this.scrollBar.startClientX
        const x = this.scrollBar.startX + distance
        this.scrollBar.x = Math.min(Math.max(0, x), width - this.scrollBar.width)
        this.timeLineContainer.x =  this.scrollBar.x * ((containerWidth - width + this.paddingRight) / (width - this.scrollBar.width))
      } else if (this.scrollbarScroll === 'v') {
        const distance = e.clientY - this.scrollBar.startClientY
        const y = this.scrollBar.startY + distance
        this.scrollBar.y = Math.min(Math.max(0, y), height - this.scrollBar.height)
        this.timeLineContainer.y =  this.scrollBar.y * ((containerHeight - height + this.paddingBottom) / (height - this.scrollBar.height))
      }
      this.scrollBar.width = width / (containerWidth  + this.paddingRight) * width
      this.scrollBar.height = height / (containerHeight  + this.paddingBottom) * height
      this.refreshTimeLine()
    },

    /**
     * 刷新时间
     * @param e
     */
    refreshPlayTime(e) {
      if (this.changeTime) {
        const {x} = this.$refs.timeLinePanel.getBoundingClientRect()
        const {width} = this.$refs.timeLineContainer.getBoundingClientRect()
        const time = (e.clientX - x + this.timeLineContainer.x) / width * this.timeLinePlayer.duration
        const resetTime = Math.max(0, Math.min(time, this.timeLinePlayer.duration)).toFixed(2)
        this.timeLinePlayer.requestFrame(Number(resetTime))
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.time-line-panel {
  overflow: hidden;
  position: relative;
  min-height: 100px;
  border: 1px solid #ebeef5ff;
  .time-line-container {
    top: 18px;
    left: 0;
    position: absolute;
    .time-line-item {
      margin-top: 10px;
      border-radius: 4px;
      background-color: white;
      &:before {
        left: 0;
        height: 42px;
        content: " ";
        margin-top: -1px;
        border-radius: 4px;
        position: absolute;
        width: calc(100% + 800px);
        border-top: 1px solid #ebeef5ff;
        border-bottom: 1px solid #ebeef5ff;
      }
    }
  }
  .time-line-mark {
    top: -5px;
    left: 0;
    z-index: 1;
    border-bottom: 1px solid #ebebeb;
    position: absolute;
    background-color: white;
    ::v-deep line {
      stroke: #cccccc
    }
  }
  .time-assets-line {
    left: 0;
    top: 0;
    z-index: 1;
    height: 100%;
    position: absolute;
    pointer-events: none;
    border-left: 1px solid #ebebeb;
    &.play-time-line {
      top: 9px;
      width: 1px;
      height: 100%;
      border: none;
      border-radius: 2px;
      background-color: gray;
      .play-time-line-head {
        top: -9px;
        width: 6px;
        height: 6px;
        margin-left: -2.5px;
        position: absolute;
        border: 1px solid gray;
        border-bottom: none;
        &:before, &:after {
          top: 6px;
          width: 4px;
          height: 0;
          content: ' ';
          position: absolute;
          border-top: 1px solid gray;
        }
        &:before {
          margin-left: -1px;
          transform: rotate(45deg);
        }
        &:after {
          margin-left: 1px;
          transform: rotate(-45deg);
        }
      }
    }
  }
  .scroll-bar {
    z-index: 1;
    height: 8px;
    border-radius: 4px;
    position: absolute;
    background-color: #0000001f;
    &:hover {
      background-color: #0000006f;
    }
    &:not(.vertical) {
      bottom: 0;
    }
    &:not(.h),
    &:not(.v) {
      transition: all ease 0.1s;
    }
    &.h, &.v {
      background-color: #0000006f;
    }
    &.vertical {
      width: 8px;
      right: 0;
    }
  }
}
</style>

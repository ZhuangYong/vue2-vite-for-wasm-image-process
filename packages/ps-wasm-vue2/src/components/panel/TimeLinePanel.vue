<template>
  <div ref="timeLinePanel" class="time-line-panel" @mousedown="onMousedown" @mouseup="onMouseup" @mousemove="onMousemove" @mouseout="onMouseout" @wheel="onWheel">
    <!--辅助显示当前-->
    <div v-if="showTimeAssetsLine && TimeLinePlayer.duration" class="time-assets-line" :style="`transform: translateX(${timeAssetsLine.x}px)`" />
    <!--辅助显示当前播放-->
    <div v-if="TimeLinePlayer.duration" class="time-assets-line play-time-line" :style="`transform: translateX(${playTimeLineX}px)`" />
    <!--帧预览-->
    <div ref="timeLineContainer" class="time-line-container"  :style="`transform: translateX(${-timeLineContainer.x}px)`">
      <div v-for="frameGroup in TimeLinePlayer.frameGroups" :key="frameGroup.UUID" class="time-line-item">
        <TimeLine :frame-group="frameGroup" />
      </div>
    </div>
    <div v-if="showTimeAssetsLine && showScrollBar" class="scroll-bar" :style="`width: ${scrollBar.width}px;transform: translateX(${scrollBar.x}px)`" />
  </div>
</template>

<script>
import TimeLine from "@/components/panel/TimeLine.vue"
import BaseFabricComponent from "@/components/BaseFabricComponent"
import TimeLinePlayer from '@/utils/TimeLinePlayer'

export default {
  name: 'TimeLinePanel',
  mixins: [BaseFabricComponent],
  components: { TimeLine },
  data() {
    return {
      changeTime: false, // 当前是否为修改时间状态
      TimeLinePlayer,
      timeAssetsLine: {x: 0, y: 0},
      showTimeAssetsLine: false,
      showScrollBar: false, // 显示滚动条
      timeLineContainer: {x: 0},
      scrollBar: { width: 0, x: 0 },
      playTimeLineX: 0
    }
  },
  computed: {
    // playTimeLineX() {
    //   console.log('>>>>>>>>>>>>>>>>>>>>>>')
    //   if (!this.$refs.timeLineContainer) {
    //     return 0
    //   }
    //   const { width } = this.$refs.timeLineContainer.getBoundingClientRect()
    //   const { duration, currentTime } = this.TimeLinePlayer
    //   console.log({ duration, currentTime })
    //   return ((currentTime / duration) * width) || 0
    // }
    // layers() {
    //   return ((this.canvas || {})._objects || []).filter(item => item.isGif).map(target => {
    //     const { UUID, frames } = target
    //     return { UUID, frames }
    //   }).reverse()
    // }
  },
  watch: {
    'timeLineContainer.x'(x) {
      const { timeLineContainer, timeLinePanel } = this.$refs
      if (timeLineContainer && timeLinePanel) {
        const { width: containerWidth } = timeLineContainer.getBoundingClientRect()
        const { width } = timeLinePanel.getBoundingClientRect()
        this.scrollBar.x = (width - this.scrollBar.width) * (x / (containerWidth - width))
      } else {
        this.scrollBar.x = 0
      }
      this.refreshTimeLine()
    }
  },
  mounted() {
    this.TimeLinePlayer.on('requestFrame', this.refreshTimeLine)
    document.addEventListener('mouseup', this.leaveChangeTime)
    document.addEventListener('mousemove', this.refreshPlayTime)
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.leaveChangeTime)
    document.removeEventListener('mousemove', this.refreshPlayTime)
  },
  methods: {
    leaveChangeTime() {
      this.changeTime = false
    },
    refreshTimeLine() {
      if (this.$refs.timeLineContainer) {
        const { width } = this.$refs.timeLineContainer.getBoundingClientRect()
        const { duration, currentTime } = this.TimeLinePlayer
        this.playTimeLineX = (((currentTime / duration) * width) || 0) - (this.timeLineContainer.x || 0)
      } else {
        this.playTimeLineX = 0
      }
    },
    onMousedown(e) {
      this.changeTime = true
      this.refreshPlayTime(e)
    },
    onMousemove(e) {
      if (this.moveOutTimer) {
        clearTimeout(this.moveOutTimer)
      }
      if (!this.showTimeAssetsLine) {
        this.showTimeAssetsLine = true
      }
      this.refreshTimeAssetsLine(e)
      this.refreshPlayTime(e)
    },
    onMouseup() {
      this.leaveChangeTime()
    },
    onMouseout() {
      if (this.moveOutTimer) {
        clearTimeout(this.moveOutTimer)
      }
      this.moveOutTimer = setTimeout(() => {
        this.showTimeAssetsLine = false
      }, 400)
    },
    onWheel(e) {
      e.stopPropagation()
      e.preventDefault()
      const { wheelDelta } = e
      // todo 兼容 240、480 为放大缩小，其他可能是平移
      if (Math.abs(wheelDelta) !== 240 && Math.abs(wheelDelta) !== 480) {
        this.refreshTimeLineContainer(e)
      }
      console.log('----- onwheel')
    },

    /**
     * 刷新可滚动区域属性
     * */
    refreshTimeLineContainer(e) {
      const { width } = this.$refs.timeLinePanel.getBoundingClientRect()
      const { width: containerWidth } = this.$refs.timeLineContainer.getBoundingClientRect()
      const left = this.timeLineContainer.x + e.deltaX * 0.1
      this.timeLineContainer.x = Math.max(0, Math.min(left, containerWidth - width))
    },

    /**
     * 刷新时间辅助线状态
     * */
    refreshTimeAssetsLine(e) {
      if (this.$refs.timeLinePanel) {
        const { x, width } = this.$refs.timeLinePanel.getBoundingClientRect()
        const { width: containerWidth } = this.$refs.timeLineContainer.getBoundingClientRect()
        this.showScrollBar = containerWidth > width
        this.timeAssetsLine.x = Math.max(0, e.clientX - x)
        this.scrollBar.width = width / containerWidth * width
      }
    },

    /**
     * 刷新时间
     * @param e
     */
    refreshPlayTime(e) {
      if (this.changeTime) {
        const {x} = this.$refs.timeLinePanel.getBoundingClientRect()
        const {width} = this.$refs.timeLineContainer.getBoundingClientRect()
        const time = (e.clientX - x + this.timeLineContainer.x) / width * this.TimeLinePlayer.duration
        this.TimeLinePlayer.requestFrame(Math.max(0, Math.min(time, this.TimeLinePlayer.duration)))
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
  .time-line-container {
    top: 0;
    left: 0;
    position: absolute;
    .time-line-item {
      margin-top: 4px;
    }
  }
  .time-assets-line {
    top: 0;
    left: 0;
    z-index: 1;
    height: 100%;
    position: absolute;
    pointer-events: none;
    border-left: 1px solid #ebebeb;
    &.play-time-line {
      width: 4px;
      height: 50px;
      border: none;
      border-radius: 2px;
      background-color: gray;
    }
  }
  .scroll-bar {
    bottom: 0;
    z-index: 1;
    height: 8px;
    border-radius: 4px;
    position: absolute;
    background-color: rgba(0, 0, 0, .3);
  }
}
</style>

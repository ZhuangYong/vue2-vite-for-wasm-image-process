<template>
  <div class="time-line">
    <!--<div v-for="frame in frameGroup.frames" :key="frame.UUID" class="preview-item">
      <div v-for="object in frame._objects" :key="object.UUID" v-html="`<svg viewBox='0 0 ${object.width} ${object.height}'>${object.toSVG()}</svg>`" />
      &lt;!&ndash;<img :src="frame.url" alt="">&ndash;&gt;
    </div>-->
    <div v-for="frame in frames" :key="frame.UUID" class="preview-item">
      <img :src="frame.snapshot" alt="">
    </div>
  </div>
</template>

<script>
import TimeLinePlayer from "@/utils/TimeLinePlayer"
import ImageHelper from "@/utils/ImageHelper";
export default {
  name: 'TimeLine',
  props: {
    frameGroup: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      frames: [],
      TimeLinePlayer
    }
  },
  mounted() {
    ImageHelper.canvas.on('object:removed', this.refreshFrames)
    ImageHelper.canvas.on('object:added', this.refreshFrames)
    ImageHelper.canvas.on('object:modified', this.refreshFrames)
    this.refreshFrames()
  },
  beforeDestroy() {
    ImageHelper.canvas.off('object:removed', this.refreshFrames)
    ImageHelper.canvas.off('object:added', this.refreshFrames)
    ImageHelper.canvas.off('object:modified', this.refreshFrames)
  },
  methods: {
    async refreshFrames() {
      console.log('refreshFrames')
      const arr = []
      await Promise.all(this.TimeLinePlayer.keyFrameTime.map(async (keyTime) => {
        const snapshot = await this.frameGroup.getSnapshot(keyTime)
        arr.push({ UUID: keyTime, snapshot })
      }))
      this.frames = arr
    }
  },
}
</script>

<style lang="scss" scoped>
.time-line {
  white-space: nowrap;
}
.preview-item {
  width: 42px;
  display: inline-block;
  img {
    max-width: 100%;
    max-height: 100%;
    user-select: none;
    pointer-events: none;
  }
}
</style>

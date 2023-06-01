<template>
  <el-button type="text" :disabled="disabled" @click="onClick">
    <div v-html="nextSvg" />
  </el-button>
</template>

<script>
import nextSvg from "@/../static/icon/next.svg"
import { base64ToStr } from "@/utils"
import timeLinePlayer from "@/utils/TimeLinePlayer"

export default {
  name: 'NextButton',
  data() {
    return {
      timeLinePlayer,
      nextSvg: base64ToStr(nextSvg)
    }
  },
  computed: {
    disabled() {
      return !this.timeLinePlayer.duration
    }
  },
  methods: {
    onClick(e) {
      e.stopPropagation()
      e.preventDefault()
      timeLinePlayer.renderNextFrame()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

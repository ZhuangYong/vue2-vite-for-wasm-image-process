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
  name: 'PreButton',
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
      timeLinePlayer.renderPreFrame()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button ::v-deep svg {
  transform: rotate(180deg);
}
</style>

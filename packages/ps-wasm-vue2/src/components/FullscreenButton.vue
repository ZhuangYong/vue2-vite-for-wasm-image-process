<template>
  <el-button type="text" @click="onClick">
    <div v-html="currentSvg" />
  </el-button>
</template>

<script>
import expandSvg from "../../static/icon/fullscreen-expand.svg"
import shrinkSvg from "../../static/icon/fullscreen-shrink.svg"
import {base64ToStr} from "../utils"
export default {
  props: {
    target: {
      type: Element,
      default: () => {}
    }
  },
  data() {
    return {
      expand: false,
      expandIcon: base64ToStr(expandSvg),
      shrinkIcon: base64ToStr(shrinkSvg)
    }
  },
  watch: {
    target: {
      handler(v) {
        if (v) {
          v.onfullscreenchange = () => this.expand = document.fullscreen || document.fullscreenElement !== null
        }
      },
      immediate: true
    }
  },
  computed: {
    currentSvg() {
      return this.expand ? this.shrinkIcon : this.expandIcon
    }
  },
  methods: {
    async onClick() {
      if (this.target && this.target.requestFullscreen) {
        const {requestFullscreen, webkitRequestFullScreen, mozRequestFullScreen, msRequestFullscreen} = this.target
        try {
          if (!this.expand) {
            await (requestFullscreen || webkitRequestFullScreen || mozRequestFullScreen || msRequestFullscreen).apply(this.target)
          } else {
            await (document.exitFullscreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen).apply(document)
          }
        } catch (e) {void 0}
      }

    }
  }
}
</script>

<style lang="scss" scoped>

</style>

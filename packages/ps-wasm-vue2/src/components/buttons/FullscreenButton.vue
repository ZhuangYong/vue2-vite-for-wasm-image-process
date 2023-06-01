<template>
  <el-button type="text" @click="onClick">
    <div v-html="currentSvg" />
  </el-button>
</template>

<script>
import expandSvg from "@/../static/icon/fullscreen-expand.svg"
import shrinkSvg from "@/../static/icon/fullscreen-shrink.svg"
import {base64ToStr} from "@/utils"
import imageHelper from "@/utils/ImageHelper";
export default {
  name: 'FullscreenButton',
  props: {
    el: {
      type: Object | HTMLElement,
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
    el: {
      handler(v) {
        if (v) {
          v.onfullscreenchange = () => this.expand = document.fullscreen || document.fullscreenElement !== null
        }
      },
      immediate: true
    },
    expand(v, ov) {
      if (v !== ov) {
        this.$nextTick(() => imageHelper.refreshStageView())
      }
    }
  },
  computed: {
    currentSvg() {
      return this.expand ? this.shrinkIcon : this.expandIcon
    }
  },
  methods: {
    async onClick() {
      const el = this.el ? (this.el.$el || this.el) : null
      if (el) {
        const {requestFullscreen, webkitRequestFullScreen, mozRequestFullScreen, msRequestFullscreen} = this.el
        try {
          if (!this.expand) {
            await (requestFullscreen || webkitRequestFullScreen || mozRequestFullScreen || msRequestFullscreen).apply(el)
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

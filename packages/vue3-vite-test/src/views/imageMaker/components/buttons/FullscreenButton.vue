<template>
  <el-link :underline="false" @click="onClick" :title="label || showLabel">
    <svg-icon size="18px" :name="expand ? 'editor-fullscreen-shrink' : 'editor-fullscreen-expand' " />
    <span v-if="label">{{ label }}</span>
    <span v-else>{{ showLabel }}</span>
  </el-link>
</template>

<script>
import { imageHelper } from 'ps-wasm-vue2'
export default {
  name: 'FullscreenButton',
  props: {
    el: {
      type: [Object, HTMLElement],
      default: () => ({})
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      expand: false
    }
  },
  computed: {
    showLabel() {
      return this.expand ? '退出全屏' : '全屏'
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

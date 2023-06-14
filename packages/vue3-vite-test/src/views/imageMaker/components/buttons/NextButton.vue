<template>
  <el-link :underline="false" :disabled="disabled" @click="onClick">
    <svg-icon name="editor-next" size="18px" />
  </el-link>
</template>

<script>
import { timeLinePlayer } from "ps-wasm-vue2"

export default {
  name: 'NextButton',
  data() {
    return {
      timeLinePlayer,
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

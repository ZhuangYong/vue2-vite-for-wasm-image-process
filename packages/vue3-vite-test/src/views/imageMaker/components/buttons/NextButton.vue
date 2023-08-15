<template>
  <el-link :underline="false" :disabled="disabled" @click="onClick">
    <svg-icon name="editor-next" size="18px" />
  </el-link>
</template>

<script>
import { timeLinePlayer, imageHelper, COMMAND_TYPES } from 'ps-wasm-vue2'

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
      // timeLinePlayer.renderNextFrame()
      imageHelper.handleCommand(COMMAND_TYPES.CONTROL.PLAY_NEXT_STEP.key)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

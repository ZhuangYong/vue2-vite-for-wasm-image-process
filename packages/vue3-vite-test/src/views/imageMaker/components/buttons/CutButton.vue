<template>
  <el-link :underline="false" :disabled="!hasSelected" @click.stop="onClick">
    <svg-icon name="editor-cut" size="18px" />
  </el-link>
</template>

<script>
import { imageHelper, timeLinePlayer, COMMAND_TYPES} from 'ps-wasm-vue2'

export default {
  name: 'CutButton',
  data() {
    return {
      timeLinePlayer,
    }
  },
  computed: {
    hasSelected() {
      return (this.timeLinePlayer.selectedList || []).length > 0
    }
  },
  methods: {
    onClick(e) {
      e.stopPropagation()
      e.preventDefault()
      imageHelper.handleCommand(COMMAND_TYPES.TIME_LINE.FRAME_GROUP_DELETE.key, timeLinePlayer.selectedList)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

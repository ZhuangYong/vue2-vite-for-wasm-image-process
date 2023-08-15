<template>
  <el-link :underline="false" :disabled="timeLinePlayer._selectFrameGroups <= 0" @click.stop="onClick">
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
      selectedList: timeLinePlayer._selectFrameGroups,
    }
  },
  computed: {
    hasSelected() {
      return (this.selectedList || []).length > 0
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

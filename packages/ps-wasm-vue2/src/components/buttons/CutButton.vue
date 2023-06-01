<template>
  <el-button type="text" :disabled="!hasSelected" @click.stop="onClick">
    <div v-html="cutIcon" />
  </el-button>
</template>

<script>
import cutSvg from "@/../static/icon/cut.svg"
import { base64ToStr } from "@/utils"
import imageHelper, {COMMAND_TYPES} from "@/utils/ImageHelper";
import timeLinePlayer from "@/utils/TimeLinePlayer";

export default {
  name: 'CutButton',
  data() {
    return {
      timeLinePlayer,
      cutIcon: base64ToStr(cutSvg)
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

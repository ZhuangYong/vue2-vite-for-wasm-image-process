<template>
  <div>
    <el-button type="primary" @click="applyAnimate">抖动</el-button>
  </div>
</template>

<script>
import imageHelper, {COMMAND_TYPES} from "@/utils/ImageHelper"
import BaseFabricComponent from "@/components/BaseFabricComponent"

export default {
  name: 'AnimatePanel',
  mixins: [BaseFabricComponent],
  data() {
    return {
    }
  },
  methods: {
    applyAnimate() {
      imageHelper.handleCommand(COMMAND_TYPES.ANIMATE.SHAKE.key, this.target)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <el-button :disabled="disabled" type="text" @click="onClick">
    <div v-html="layer.visible ? showIcon : hideIcon" />
  </el-button>
</template>

<script>
import eyeSvg from "@/../static/icon/eye.svg"
import eyeCloseSvg from "@/../static/icon/eye-close.svg"
import {base64ToStr} from "@/utils"
export default {
  props: {
    layer: {
      type: Object,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showIcon: base64ToStr(eyeSvg),
      hideIcon: base64ToStr(eyeCloseSvg)
    }
  },
  computed: {
  },
  methods: {
    async onClick() {
      if (this.layer) {
        this.$set(this.layer, 'visible', !this.layer.visible)
        this.$emit('update:layer.visible', this.layer.visible)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  padding: 0;
}
</style>

<template>
  <el-button :disabled="disabled" type="text" @click.stop="onClick">
    <div v-html="layer.visible ? showIcon : hideIcon" />
  </el-button>
</template>

<script>
import eyeSvg from "@/../static/icon/eye.svg"
import eyeCloseSvg from "@/../static/icon/eye-close.svg"
import {Utils} from "ps-wasm-vue2"
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
      showIcon: Utils.base64ToStr(eyeSvg),
      hideIcon: Utils.base64ToStr(eyeCloseSvg)
    }
  },
  computed: {
  },
  methods: {
    async onClick() {
      if (this.layer) {
        this.layer.visible = !this.layer.visible
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

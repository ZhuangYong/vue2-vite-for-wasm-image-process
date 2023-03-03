<template>
  <el-button :disabled="!target" type="text" @click="onClick">
    <div v-html="currentSvg" />
  </el-button>
</template>

<script>
import eyeSvg from "../../../static/icon/eye.svg"
import eyeCloseSvg from "../../../static/icon/eye-close.svg"
import {base64ToStr} from "../../utils"
import BaseFabricComponent from "../BaseFabricComponent"
export default {
  mixins: [BaseFabricComponent],
  props: {
  },
  data() {
    return {
      showIcon: base64ToStr(eyeSvg),
      hideIcon: base64ToStr(eyeCloseSvg)
    }
  },
  watch: {
    target: {
      handler(v) {
      },
      immediate: true
    }
  },
  computed: {
    currentSvg() {
      return this.show ? this.showIcon : this.hideIcon
    },
    show() {
      return (this.target || {visible: true}).visible
    }
  },
  methods: {
    async onClick() {
      if (this.target) {
        this.$set(this.target, 'visible', !this.target.visible)
        this.canvas.renderAll()
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

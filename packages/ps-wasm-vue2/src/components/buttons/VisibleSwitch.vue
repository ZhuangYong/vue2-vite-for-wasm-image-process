<template>
  <el-button v-if="target" type="text" @click="onClick">
    <div v-html="currentSvg" />
  </el-button>
</template>

<script>
import eyeSvg from "../../../static/icon/eye.svg"
import eyeCloseSvg from "../../../static/icon/eye-close.svg"
import {base64ToStr} from "../../utils"
import BaseFabricComponent from "../BaseFabricComponent"
export default {
  inject: ['getTarget'],
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
    target() {
      return this.getTarget ? this.getTarget() : null
    },
    show() {
      return !(this.target || {}).hidden
    }
  },
  methods: {
    async onClick() {
      console.log('--- on hide click--', this.target)
      if (this.target) {
        this.$set(this.target, 'hidden', !this.target.hidden)
        // this.target.hidden = !this.target.hidden
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

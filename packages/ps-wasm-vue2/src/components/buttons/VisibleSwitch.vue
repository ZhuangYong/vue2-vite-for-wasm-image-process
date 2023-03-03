<template>
  <el-button :disabled="!switchTarget" type="text" @click="onClick">
    <div v-html="currentSvg" />
  </el-button>
</template>

<script>
import eyeSvg from "@/../static/icon/eye.svg"
import eyeCloseSvg from "@/../static/icon/eye-close.svg"
import {base64ToStr} from "@/utils"
import BaseFabricComponent from "../BaseFabricComponent"
export default {
  mixins: [BaseFabricComponent],
  props: {
    layer: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showIcon: base64ToStr(eyeSvg),
      hideIcon: base64ToStr(eyeCloseSvg)
    }
  },
  computed: {
    /**
     * 需要操作的对象
     * @returns {Object|*}
     */
    switchTarget() {
      return this.layer || this.target
    },
    currentSvg() {
      return this.show ? this.showIcon : this.hideIcon
    },
    show() {
      return this.layer ? this.layer.visible : this.target ? this.target.visible : false
    }
  },
  methods: {
    async onClick() {
      if (this.switchTarget) {
        if (this.layer) {
          this.$emit('update:layer', this.switchTarget)
        } else {
          this.$set(this.switchTarget, 'visible', !this.switchTarget.visible)
        }
        this.$nextTick(() => this.canvas.renderAll())
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

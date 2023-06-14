<template>
  <el-link :underline="false" :disabled="disabled" @click.stop="onClick">
    <svg-icon v-if="visible" :size="size" name="editor-eye" />
    <svg-icon v-else :size="size" name="editor-eye-close" />
  </el-link>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: '16px'
    }
  },
  computed: {
  },
  methods: {
    async onClick() {
      if (!this.disabled) {
        this.$emit('update:visible', !this.visible)
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

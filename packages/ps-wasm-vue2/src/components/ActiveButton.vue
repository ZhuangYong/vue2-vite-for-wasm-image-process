<template>
  <div class="active-button">
    <slot name="icon" />
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

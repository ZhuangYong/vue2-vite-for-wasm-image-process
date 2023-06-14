<template>
  <div class="content-panel" :class="{bold}">
    <div v-if="title" class="title" :style="{ height: titleHeight }">
      <span>{{ title }}</span>
      <slot name="titleRight" />
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentPanel',
  props: {
    title: {
      type: String,
      default: ''
    },
    titleHeight: {
      type: String,
      default: ''
    },
    bold: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../style/var";
.content-panel {
  .title {
    display: flex;
    height: 50px;
    color: #333333;
    font-weight: 500;
    font-size: 14px;
    align-items: center;
    justify-content: space-between;
  }

  &.bold {
    &>.title {
      padding: 10px;
      font-weight: 600;
      border-top: $border;
      border-bottom: $border;
      background-color: #FAFAFA;
    }
  }
}
</style>

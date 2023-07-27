<template>
  <div class="content-panel" :class="{bold, 'full-height': fullHeight}">
    <div v-if="title || $slots.title" class="title" :style="{ height: titleHeight }">
      <div>
        {{ title }}
        <slot name="title" />
      </div>
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
    },
    fullHeight: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../style/var";
.content-panel {
  display: flex;
  flex-direction: column;

  &.full-height {
    height: 100%;
  }
  .content {
    flex: 1;
    overflow: hidden;
  }
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

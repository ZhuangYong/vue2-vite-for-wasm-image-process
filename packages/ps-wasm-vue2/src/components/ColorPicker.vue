<template>
  <div class="color-picker">
    <div class="color-group">
      <span class="color-choose-item white" :class="backgroundColor === '#ffffff' && 'active'" @click="setBackgroundColor('#ffffff')" />
      <span class="color-choose-item black" :class="backgroundColor === '#000000' && 'active'" @click="setBackgroundColor('#000000')" />
      <span class="color-choose-item red" :class="backgroundColor === '#ff0000' && 'active'" @click="setBackgroundColor('#ff0000')" />
      <span class="color-choose-item transparent" :class="!backgroundColor && 'active'" :style="`background-image: url(${transparentSvg})`" @click="setBackgroundColor('')">
        透明
      </span>
      <el-color-picker v-model="backgroundColor" show-alpha size="mini" />
    </div>
  </div>
</template>

<script>
import transparentSvg from "@/../static/icon/transparent.svg"
export default {
  props: {
    color: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      transparentSvg,
      backgroundColor: ''
    }
  },
  methods: {
    setBackgroundColor(v) {
      this.backgroundColor = v
    }
  },
  watch: {
    color: {
      handler(v) {
        this.backgroundColor = v || ''
      },
      immediate: true
    },
    backgroundColor(v) {
      this.$emit('update:color', v || '')
    }
  },
}
</script>

<style lang="scss" scoped>
$colorChoose: 32px;
.color-picker {
  width: 100%;
}
.color-group {
  width: 100%;
  display: flex;
  height: $colorChoose + 8px;
  align-items: end;
  justify-content: space-between;
  .color-choose-item {
    width: $colorChoose;
    height: $colorChoose - 6px;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all ease 0.2s;
    border: 1px solid #e0e0e0;
    &.active {
      height: $colorChoose;
    }
    &:hover:not(.active) {
      height: $colorChoose - 2px;
    }
    &.red {
      background-color: red;
    }

    &.white {
      background-color: white;
    }

    &.black {
      background-color: black;
    }
  }
}
</style>

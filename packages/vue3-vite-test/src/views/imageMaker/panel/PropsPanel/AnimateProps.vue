<template>
  <ContentPanel title="动效" class="props-panel">
    <div class="animate-list" :class="disabled && 'disabled'">
      <div v-for="animate in animates" :key="animate.key" class="el-button--primary animate-item" :class="`${used(animate.label) && 'el-button--warning'} animate-${animate.key}`" @click="applyAnimate(animate.key)">
        {{ animate.label }}
      </div>
    </div>
  </ContentPanel>
</template>

<script>
import {animates, imageHelper, COMMAND_TYPES, BaseFabricComponent, timeLinePlayer} from 'ps-wasm-vue2'
import ContentPanel from "../ContentPanel.vue"

export default {
  name: 'AnimateProps',
  mixins: [BaseFabricComponent],
  components: {ContentPanel},
  data() {
    return {
      animates,
      usedAnimates: []
    }
  },
  computed: {
    disabled() {
      return !this.target
    },
    // usedAnimates() {
    //   return (timeLinePlayer.findGroupByTarget(this.target) || {}).animates || []
    // }
  },
  watch: {
    disabled() {
      console.log('--------this.target', this.target, (timeLinePlayer.findGroupByTarget(this.target) || {}))
      this.usedAnimates = (timeLinePlayer.findGroupByTarget(this.target) || {}).animates || []
    }
  },
  methods: {
    used(name) {
      return this.usedAnimates.find(item => item.name === name) || ''
    },
    applyAnimate(type) {
      if (!this.disabled) {
        this.waiting(true)
        setTimeout(() => {
          imageHelper
            .handleCommand(COMMAND_TYPES.ANIMATE.APPLY.key, this.target, type)
            .then(() => this.waiting(false))
            .catch(() => this.waiting(false))
        }, 400)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.animate-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  &.disabled {
    .animate-item {
      color: #999999;
      cursor: not-allowed;
    }
  }
  .animate-item {
    margin: 3px;
    font-size: 14px;
    padding: 6px 12px;
    color: #333333;
    min-width: 52px;
    cursor: pointer;
    border-radius: 4px;
    background-color: #f5f6f8ff;
  }
}
</style>

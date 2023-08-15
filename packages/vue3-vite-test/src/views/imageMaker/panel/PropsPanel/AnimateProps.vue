<template>
  <ContentPanel title="动效" class="props-panel">
    <div class="animate-list" :class="disabled && 'disabled'">
      <div v-for="animate in animates" :key="animate.key" class="animate-item"
           :class="`${used(animate.label) && 'apply'} animate__${!disabled && currentKey === animate.key ? animate.key : ''}`"
           @click="applyAnimate(animate.key)" @mouseover="currentKey = animate.key">
      {{ animate.label }}
      </div>
    </div>
  </ContentPanel>
</template>

<script>
import {animates, imageHelper, COMMAND_TYPES, BaseFabricComponent, timeLinePlayer} from 'ps-wasm-vue2'
import ContentPanel from '../ContentPanel.vue'

export default {
  name: 'AnimateProps',
  mixins: [BaseFabricComponent],
  components: {ContentPanel},
  data() {
    return {
      animates,
      currentKey: '',
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
      this.currentKey = ''
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
@import "../../style/animate";
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
    animation-iteration-count: 1;
    animation-duration: 0.6s;
    animation-fill-mode: both;
    background-color: #f5f6f8ff;

    &.apply {
      color: white;
      animation-play-state: paused;
      background-color: #009983;
    }
  }
}
</style>

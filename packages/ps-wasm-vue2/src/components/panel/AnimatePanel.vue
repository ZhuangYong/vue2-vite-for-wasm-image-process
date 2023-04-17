<template>
  <div class="animate-list" :class="disabled && 'disabled'">
    <div v-for="animate in animates" :key="animate.key" class="el-button--primary animate-item" :class="`${used(animate.label) && 'el-button--warning'} animate-${animate.key}`" @click="applyAnimate(animate.key)">
      {{ animate.label }}
    </div>
  </div>
</template>

<script>
import animates from '@/animate'
import imageHelper, {COMMAND_TYPES} from "@/utils/ImageHelper"
import BaseFabricComponent from "@/components/BaseFabricComponent"
import TimeLinePlayer from "@/utils/TimeLinePlayer";

export default {
  name: 'AnimatePanel',
  mixins: [BaseFabricComponent],
  data() {
    return {
      animates
    }
  },
  computed: {
    disabled() {
      return !this.target
    },
    usedAnimates() {
      return (TimeLinePlayer.findGroupByTarget(this.target) || {}).animates || []
    }
  },
  methods: {
    used(name) {
      return this.usedAnimates.find(item => item.name === name) || ''
    },
    applyAnimate(type) {
      imageHelper.handleCommand(COMMAND_TYPES.ANIMATE.APPLY.key, this.target, type)
    }
  }
}
</script>

<style lang="scss" scoped>
.animate-list {
  display: flex;
  flex-wrap: wrap;
  padding: 4px;
  justify-content: space-between;
  &.disabled {
    .animate-item {
      cursor: not-allowed;
      border-color: #a0cfff;
      background-color: #a0cfff;
    }
  }
  .animate-item {
    margin: 3px;
    font-size: 12px;
    padding: 4px 8px;
    color: white;
    width: 40px;
    cursor: pointer;
    border-radius: 4px;
  }
}
</style>

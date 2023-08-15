<template>
  <ContentPanel title="透明度" class="props-opacity-panel">
    <el-slider v-model="opacity" :disabled="disabled" :format-tooltip="formatOpacity" :min="0" :max="1" :step="0.001" @change="onOpacityChange"/>
  </ContentPanel>
</template>

<script>
import { BaseFabricComponent, COMMAND_TYPES, imageHelper } from 'ps-wasm-vue2'
import ContentPanel from '../ContentPanel.vue'

export default {
  name: 'OpacityProps',
  mixins: [BaseFabricComponent],
  components: {ContentPanel},
  data() {
    return {
      opacity: 0
    }
  },
  computed: {
    disabled() {
      return !this.target
    },
  },
  watch: {
    'target.opacity'(v) {
      if (v) {
        this.opacity = typeof v === 'undefined' ? 1 : v
      } else {
        this.opacity = 0
      }
    }
  },
  methods: {
    onOpacityChange(v) {
      imageHelper.handleCommand(COMMAND_TYPES.EDIT.OPACITY.key, this.target, v)
    },

    formatOpacity(opacity) {
      return !opacity ? '0' : `${Number((opacity * 100).toFixed(2))}%`
    }
  }
}
</script>

<style lang="scss" scoped>
.props-opacity-panel {
  .el-slider {
    margin: 0 8px;
    width: calc(100% - 16px);
    --el-slider-height: 4px;
    --el-slider-button-size: 14px;
    --el-slider-main-bg-color: #009983;
    --el-slider-button-wrapper-offset: -16px;
  }
}
</style>

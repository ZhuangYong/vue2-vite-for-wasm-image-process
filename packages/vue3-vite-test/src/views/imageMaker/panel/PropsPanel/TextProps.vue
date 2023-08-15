<template>
  <ContentPanel title="字体及颜色" class="props-panel">
    <div class="props-line">
      <div class="props-item font-family">
        <span class="label" style="width: 41px">字体：</span>
        <el-select v-model="targetProps.fontFamily" :teleported="false" :disabled="disabled">
          <el-option v-for="option in fontOptions" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </div>
      <div class="props-item">
        <el-input v-model="targetProps.fontSize" :disabled="disabled" />
      </div>
    </div>
    <div class="props-line">
      <ColorPicker v-model:color="targetProps.fill" />
    </div>
  </ContentPanel>
</template>

<script>
import ContentPanel from '../ContentPanel.vue'
import {imageHelper, FontHelper, BaseFabricComponent} from 'ps-wasm-vue2'
import ColorPicker from '../../components/ColorPicker.vue'

export default {
  name: 'TextProps',
  components: { ContentPanel, ColorPicker },
  mixins: [BaseFabricComponent],
  data() {
    return {
      fontOptions: FontHelper.fontOptions,
      targetProps: imageHelper.defaultProps,
    }
  },
  computed: {
    disabled() {
      return !this.target
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

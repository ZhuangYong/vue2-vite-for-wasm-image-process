<template>
  <ContentPanel title="位置尺寸" class="props-panel">
    <div class="props-line">
      <div class="props-item">
        <!--<span class="label">W：</span>-->
        <el-input v-model="targetProps.width" :disabled="disabled">
          <template #prefix>W &nbsp;&nbsp;</template>
        </el-input>
      </div>
      <div class="props-item">
        <!--<span class="label">H：</span>-->
        <el-input v-model="targetProps.height" :disabled="disabled">
          <template #prefix>H &nbsp;&nbsp;</template>
        </el-input>
      </div>
    </div>

    <div class="props-line">
      <div class="props-item">
        <!--<span class="label">X：</span>-->
        <el-input v-model="targetProps.left" :disabled="disabled">
          <template #prefix>X &nbsp;&nbsp;</template>
        </el-input>
      </div>
      <div class="props-item">
        <!--<span class="label">Y：</span>-->
        <el-input v-model="targetProps.top" :disabled="disabled">
          <template #prefix>Y &nbsp;&nbsp;</template>
        </el-input>
      </div>
    </div>

    <div class="props-line">
      <div class="props-item">
        <!--<span class="label">∠：</span>-->
        <el-input v-model="targetProps.angle" :disabled="disabled">
          <template #prefix>∠ &nbsp;&nbsp;</template>
        </el-input>
      </div>
      <div class="props-item">
        <!--<span class="label" style="width: 50px;">隐藏：</span>-->
        <VisibleSwitch v-model:visible="targetProps.visible" :disabled="disabled" />
      </div>
    </div>
  </ContentPanel>
</template>

<script>
import { Const, Utils, FontHelper, BaseFabricComponent, imageHelper } from "ps-wasm-vue2"
import VisibleSwitch from "../../components/buttons/VisibleSwitch.vue"
import ContentPanel from "../ContentPanel.vue"

const watchProps = ['showWidth', 'showHeight']
export default {
  name: 'ObjectProps',
  components: {VisibleSwitch, ContentPanel },
  mixins: [BaseFabricComponent],
  props: {
    editMode: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      fontOptions: FontHelper.fontOptions,
      targetProps: imageHelper.defaultProps,
      // showProps: defaultProps
    }
  },
  computed: {
    isText() {
      return Utils.isText((this.target || {}).type)
    },
    disabled() {
      return !this.target
    },

    /**
     * 编辑模式
     * */
    editModes() {
      return Const.EDIT_MODE
    }
  },
  watch: {
    target(v) {
      this.targetProps = imageHelper.watchTarget(v)
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
</style>

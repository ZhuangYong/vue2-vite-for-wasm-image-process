<template>
  <div class="props-panel">
    <template v-if="isText">
      <div class="props-line">
        <div class="props-item font-family">
          <span class="label" style="width: 41px">字体：</span>
          <el-select v-model="targetProps.fontFamily" :popper-append-to-body="false" :disabled="disabled">
            <el-option v-for="option in fontOptions" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
          <!--<el-input v-model="targetProps.fontFamily" :disabled="disabled" size="mini" style="width: 60px" />-->
        </div>
        <div class="props-item">
          <span class="label" style="width: 44px;">字号：</span>
          <el-input v-model="targetProps.fontSize" :disabled="disabled" style="width: 30px" />
        </div>
      </div>
    </template>

    <ContentPanel v-if="editModes.PENCIL.key === editMode" title="位置尺寸">
      <PencilModelPropertyPanel />
    </ContentPanel>
    <ContentPanel v-if="editModes.MOVE.key === editMode" title="位置尺寸">
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
  </div>
</template>

<script>
import { Const, Utils, FontHelper, BaseFabricComponent, imageHelper } from "ps-wasm-vue2"
import VisibleSwitch from "../components/buttons/VisibleSwitch.vue"
import ContentPanel from "./ContentPanel.vue"
// import PencilModelPropertyPanel from "./PencilModelPropertyPanel.vue"

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
$inputHeight: 36px;
$inputWidth: 134px;
.props-panel {
  font-size: 12px;

  .content-panel {
    padding: 0 20px;
  }
  .props-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .props-item {
    display: flex;
    padding: 6px 0;
    margin-bottom: 12px;
    width: $inputWidth;
    height: $inputHeight;
    align-items: center;
    .el-textarea {
      padding: 0 8px;
    }
    .label {
      color: gray;
      min-width: 33px;
      text-align: right;
      white-space: nowrap;
    }
    &.font-family ::v-deep input {
      max-width: 70px;
    }
    ::v-deep {
      .el-input__wrapper {
        box-shadow: none;
      }
      .el-input__icon {
        line-height: 1;
      }
      .el-select-dropdown__item {
        height: 22px;
        font-size: 12px;
        line-height: 22px;
        text-align: left;
        padding: 0 12px;
      }
      input {
        height: 22px;
        padding: 0 2px;
        line-height: 22px;
        font-size: 12px;
      }
    }
  }
}
</style>

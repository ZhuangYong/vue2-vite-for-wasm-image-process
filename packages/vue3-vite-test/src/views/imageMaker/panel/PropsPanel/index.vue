<template>
  <div class="props-main-panel">
    <ObjectProps v-if="editModes.MOVE.key === editMode || editModes.TEXT.key === editMode" />
    <PencilModelProperty v-if="editModes.PENCIL.key === editMode" />
    <TextProps v-if="editModes.TEXT.key === editMode" />
  </div>
</template>

<script>
import { Const, Utils, FontHelper, BaseFabricComponent, imageHelper } from "ps-wasm-vue2"
import VisibleSwitch from "../../components/buttons/VisibleSwitch.vue"
import ContentPanel from "../ContentPanel.vue"
import PencilModelProperty from "./PencilModelProperty.vue"
import ObjectProps from "./ObjectProps.vue"
import TextProps from "./TextProps.vue"

const watchProps = ['showWidth', 'showHeight']
export default {
  name: 'PropsPanel',
  components: {VisibleSwitch, ContentPanel, PencilModelProperty, ObjectProps, TextProps },
  mixins: [BaseFabricComponent],
  props: {
    editMode: {
      type: String,
      default: ''
    }
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
      console.log(">>> w")
      this.targetProps = imageHelper.watchTarget({...v, els: this.$el})
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
$inputHeight: 36px;
$inputWidth: 134px;

.props-main-panel ::v-deep {

  .content-panel {
    font-size: 12px;
    padding: 0 20px;
  }

  .props-line {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .color-picker {
      width: 100%;
    }
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
    &.font-family input {
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

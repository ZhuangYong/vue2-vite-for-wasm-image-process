<template>
  <div class="props-panel">
    <template v-if="isText">
      <div class="props-line">
        <div class="props-item">
          <el-input v-model="text" type="textarea" :autosize="{ minRows: 1, maxRows: 2}" placeholder="请输入文本内容" />
        </div>
      </div>
      <div class="props-line">
        <div class="props-item">
          <span class="label" style="width: 44px;">字号：</span>
          <el-input v-model="targetProps.fontSize" :disabled="disabled" size="mini" style="width: 30px" />
        </div>
        <div class="props-item">
          <span class="label" style="width: 52px">字体：</span>
          <el-input v-model="targetProps.fontFamily" :disabled="disabled" size="mini" style="width: 60px" />
        </div>
      </div>
    </template>

    <div class="props-line">
      <div class="props-item">
        <span class="label">W：</span>
        <el-input v-model="targetProps.width" :disabled="disabled" size="mini" />
      </div>
      <div class="props-item">
        <span class="label">H：</span>
        <el-input v-model="targetProps.height" :disabled="disabled" size="mini" />
      </div>
    </div>

    <div class="props-line">
      <div class="props-item">
        <span class="label">X：</span>
        <el-input v-model="targetProps.left" :disabled="disabled" size="mini" />
      </div>
      <div class="props-item">
        <span class="label">Y：</span>
        <el-input v-model="targetProps.top" :disabled="disabled" size="mini" />
      </div>
    </div>

    <div class="props-line">
      <div class="props-item">
        <span class="label">∠：</span>
        <el-input v-model="targetProps.angle" :disabled="disabled" size="mini" />
      </div>
      <div class="props-item">
        <span class="label" style="width: 45px;">隐藏：</span>
        <VisibleSwitch :layer="targetProps" :disabled="disabled" />
      </div>
    </div>
  </div>
</template>

<script>
import Const from '@/const'
import BaseFabricComponent from "../BaseFabricComponent"
import VisibleSwitch from "../buttons/VisibleSwitch.vue"
const watchProps = ['showWidth', 'showHeight']
export default {
  name: 'ObjectProps',
  components: {VisibleSwitch},
  mixins: [BaseFabricComponent],
  data() {
    return {
      // showProps: defaultProps
    }
  },
  computed: {
    isText() {
      return [Const.FABRIC_TYPE.I_TEXT, Const.FABRIC_TYPE.TEXTBOX].includes((this.target || {}).type)
    },
    disabled() {
      return !this.target
    },
  },
  watch: {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.props-panel {
  font-size: 12px;
  .props-line {
    display: flex;
  }
  .props-item {
    display: flex;
    align-items: center;
    padding: 6px 0;
    .el-textarea {
      padding: 0 8px;
    }
    .label {
      color: gray;
      min-width: 33px;
      text-align: right;
      white-space: nowrap;
    }
    ::v-deep {
      input {
        height: 22px;
        max-width: 60px;
        padding: 0 2px;
        line-height: 22px;
        font-size: 12px;
      }
    }
  }
}
</style>

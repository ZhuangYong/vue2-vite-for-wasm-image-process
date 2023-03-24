<template>
  <div v-if="initialed" class="operation-panel">
    <el-radio-group v-model="currentMode" size="mini" @input="onChange">
      <el-radio-button v-for="item in editModeOptions" :key="item.key" :label="item.value">
        <span v-html="item.icon" />
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
import Const from '@/const'
import BaseFabricComponent from "../BaseFabricComponent";

export default {
  mixins: [BaseFabricComponent],
  props: {
    mode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editMode: Const.EDIT_MODE, // 编辑模式
      editModeOptions: Object.values(Const.EDIT_MODE),
      currentMode: Const.EDIT_MODE.MOVE.value // 当前编辑模式
    }
  },
  watch: {
    mode: {
      handler(v) {
        this.currentMode = v
      },
      immediate: true
    },
    currentMode(v) {
      this.$emit('update:mode', v)
    }
  },
  methods: {
    onChange() {
      this.$set(this.canvas, 'isDrawingMode', this.currentMode === Const.EDIT_MODE.PENCIL.value)
    }
  },
}
</script>

<style lang="scss" scoped>
.operation-panel {
  &::v-deep {
    .el-radio-button__inner {
      padding: 4px 12px;
      svg {
        width: 12px;
        height: 12px;
      }
    }
  }
}
</style>

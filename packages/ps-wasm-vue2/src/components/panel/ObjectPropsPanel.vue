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
          <el-input v-model="fontSize" :disabled="disabled" size="mini" style="width: 30px" />
        </div>
        <div class="props-item">
          <span class="label" style="width: 52px">字体：</span>
          <el-input v-model="fontFamily" :disabled="disabled" size="mini" style="width: 60px" />
        </div>
      </div>
    </template>

    <div class="props-line">
      <div class="props-item">
        <span class="label">W：</span>
        <el-input v-model="showWidth" :disabled="disabled" size="mini" />
      </div>
      <div class="props-item">
        <span class="label">H：</span>
        <el-input v-model="showHeight" :disabled="disabled" size="mini" />
      </div>
    </div>

    <div class="props-line">
      <div class="props-item">
        <span class="label">X：</span>
        <el-input v-model="showX" :disabled="disabled" size="mini" />
      </div>
      <div class="props-item">
        <span class="label">Y：</span>
        <el-input v-model="showY" :disabled="disabled" size="mini" />
      </div>
    </div>

    <div class="props-line">
      <div class="props-item">
        <span class="label">∠：</span>
        <el-input v-model="angle" :disabled="disabled" size="mini" />
      </div>
      <div class="props-item">
        <span class="label" style="width: 45px;">隐藏：</span>
        <VisibleSwitch />
      </div>
    </div>
  </div>
</template>

<script>
import Const from '@/const'
import BaseFabricComponent from "../BaseFabricComponent"
import VisibleSwitch from "../buttons/VisibleSwitch.vue"
const defaultProps = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  scaleX: 1,
  scaleY: 1,
  angle: 0,
  text: '',
  fontSize: 0,
  fontFamily: ''
}
export default {
  name: 'ObjectProps',
  components: {VisibleSwitch},
  mixins: [BaseFabricComponent],
  data() {
    return {
      ...defaultProps
    }
  },
  props: {
    props: {
      type: Object,
      default: () => null
    },
  },
  computed: {
    isText() {
      return [Const.FABRIC_TYPE.I_TEXT, Const.FABRIC_TYPE.TEXTBOX].includes((this.target || {}).type)
    },
    disabled() {
      return !this.target
    },
    showWidth: {
      get() {
        return (this.scaleX * this.width).toFixed(2)
      },
      set(v) {
        const { canvas } = this
        canvas.getActiveObject().scaleX = v / this.width
        canvas.renderAll()
        console.log('set width')
      }
    },
    showHeight: {
      get() {
        return (this.scaleY * this.height).toFixed(2)
      },
      set() {
        console.log('set height')
      }
    },

    showX: {
      get() {
        return (this.left || 0).toFixed(2)
      },
      set() {
        console.log('set width')
      }
    },
    showY: {
      get() {
        return (this.top || 0).toFixed(2)
      },
      set() {
        console.log('set height')
      }
    }
  },
  watch: {
    target: {
      handler(v) {
        if (v) {
          Object.keys(v).forEach(key => {
            if (key !== 'canvas' && this[key] !== v[key]) {
              this[key] = v[key]
            }
          })
        } else {
          Object.keys(defaultProps).forEach(key => (this[key] = defaultProps[key]))
        }
      },
      deep: true,
      immediate: true
    }
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

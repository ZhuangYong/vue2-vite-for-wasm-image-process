<template>
  <ContentPanel title="位置尺寸" class="props-panel">
    <div class="props-line">
      <div class="props-item">
        <!--<span class="label">W：</span>-->
        <el-input v-model="targetProps.width" :data-key="types.ACTIVE_OBJECT_WIDTH.key" :disabled="disabled" @blur="onChange" @keydown.enter.native="onChange">
          <template #prefix>W &nbsp;&nbsp;</template>
        </el-input>
      </div>
      <div class="props-item">
        <!--<span class="label">H：</span>-->
        <el-input v-model="targetProps.height" :data-key="types.ACTIVE_OBJECT_HEIGHT.key" :disabled="disabled" @blur="onChange" @keydown.enter.native="onChange">
          <template #prefix>H &nbsp;&nbsp;</template>
        </el-input>
      </div>
    </div>

    <div class="props-line">
      <div class="props-item">
        <!--<span class="label">X：</span>-->
        <el-input v-model="targetProps.left" :data-key="types.ACTIVE_OBJECT_LEFT.key" :disabled="disabled" @blur="onChange" @keydown.enter.native="onChange">
          <template #prefix>X &nbsp;&nbsp;</template>
        </el-input>
      </div>
      <div class="props-item">
        <!--<span class="label">Y：</span>-->
        <el-input v-model="targetProps.top" :data-key="types.ACTIVE_OBJECT_TOP.key" :disabled="disabled" @blur="onChange" @keydown.enter.native="onChange">
          <template #prefix>Y &nbsp;&nbsp;</template>
        </el-input>
      </div>
    </div>

    <div class="props-line">
      <div class="props-item">
        <!--<span class="label">∠：</span>-->
        <el-input v-model="targetProps.angle" :data-key="types.ACTIVE_OBJECT_ANGLE.key" :disabled="disabled" @blur="onChange" @keydown.enter.native="onChange">
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
import { Const, Utils, FontHelper, BaseFabricComponent, imageHelper, COMMAND_TYPES } from "ps-wasm-vue2"
import VisibleSwitch from "../../components/buttons/VisibleSwitch.vue"
import ContentPanel from "../ContentPanel.vue"

const watchProps = ['showWidth', 'showHeight']
const scaleXtoWidth = ({ scaleX, width }) => (scaleX * width).toFixed(2)
const scaleYtoHeight = ({ scaleY, height }) => (scaleY * height).toFixed(2)
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
      types: COMMAND_TYPES.RESIZE,
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
    target: {
      handler(v) {
        this.refreshProps()
        // this.targetProps = v || {}
        // v.on('modified', () => {console.log('modified >>>>>>', this.targetProps, this.$forceUpdate())})
      },
      deep: true
    },
    'targetProps.visible'(v) {
      imageHelper.handleCommand(COMMAND_TYPES.EDIT.VISIBLE.key, this.target, v)
    }
  },
  mounted() {
    // imageHelper.on('object:modified', this.refreshProps)
  },
  unmounted() {
    // imageHelper.off('object:modified', this.refreshProps)
  },
  methods: {
    refreshProps() {
      const { target:v } = this
      const props = { ...imageHelper.defaultProps }
      v && Object.keys(props).forEach(key => {
        if (key === 'width') {
          props[key] = scaleXtoWidth(v).replace('.00', '')
        } else if (key === 'height') {
          props[key] = scaleYtoHeight(v).replace('.00', '')
        } else if (['left', 'top', 'angle'].includes(key)) {
          props[key] = this.numberFormat(Number(v[key]))
        } else {
          props[key] = v[key]
        }
      })
      this.targetProps = props
    },
    onChange({ target }) {
      if (this.target) {
        imageHelper.handleCommand(target.dataset.key, this.target, Number(target.value) || 0)
      }
    },

    numberFormat(v) {
      return Number((Number(v) || 0).toFixed(2))
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

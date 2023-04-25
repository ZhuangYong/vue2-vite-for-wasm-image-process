<template>
  <div v-show="canvas.originWidth" class="props-panel">
    <template v-if="!target">
      <div class="props-line">
        <div class="props-item">
          <span class="label">画布：</span>
          {{ canvas.originWidth }} x {{ canvas.originHeight }}
        </div>
        <div v-if="canvas.gifMode" class="props-item">
          <span class="label">fps：</span>
          {{ 1000 / timeLinePlayer.frameTime }}
        </div>
      </div>

      <div class="props-line">
        <div class="props-item props-background-color">
          <span class="label">画布背景颜色：</span>
          <ColorPicker :color.sync="backgroundColor" />
        </div>
      </div>
    </template>
    <template v-else>
      <template v-if="isText">
        <!--<div class="props-line">
          <div class="props-item">
            <el-input v-model="targetProps.text" type="textarea" :autosize="{ minRows: 1, maxRows: 2}" placeholder="请输入文本内容" />
          </div>
        </div>-->
        <div class="props-line">
          <div class="props-item font-family">
            <span class="label">字体：</span>
            <el-select v-model="targetProps.fontFamily" size="mini" :popper-append-to-body="false" :disabled="disabled">
              <el-option v-for="option in fontOptions" :key="option.value" :label="option.label" :value="option.value" />
            </el-select>
            <!--<el-input v-model="targetProps.fontFamily" :disabled="disabled" size="mini" style="width: 60px" />-->
          </div>
          <div class="props-item">
            <span class="label">字号：</span>
            <el-input v-model="targetProps.fontSize" :disabled="disabled" size="mini" style="width: 30px" />
          </div>
        </div>
      </template>

      <div class="props-line">
        <div class="props-item">
          <span class="label">W：</span>
          <el-input v-model="targetProps.width" :disabled="disabled" size="mini" @blur="onWidthChange" @keydown.enter.native="onWidthChange" />
        </div>
        <div class="props-item">
          <span class="label">H：</span>
          <el-input v-model="targetProps.height" :disabled="disabled" size="mini" @blur="onHeightChange" @keydown.enter.native="onHeightChange" />
        </div>
      </div>

      <div class="props-line">
        <div class="props-item">
          <span class="label">X：</span>
          <el-input v-model="targetProps.left" :disabled="disabled" size="mini" @blur="onLeftChange" @keydown.enter.native="onLeftChange" />
        </div>
        <div class="props-item">
          <span class="label">Y：</span>
          <el-input v-model="targetProps.top" :disabled="disabled" size="mini" @blur="onTopChange" @keydown.enter.native="onTopChange" />
        </div>
      </div>

      <div class="props-line">
        <div class="props-item">
          <span class="label">∠：</span>
          <el-input v-model="targetProps.angle" :disabled="disabled" size="mini" @blur="onAngleChange" @keydown.enter.native="onAngleChange" />
        </div>
        <div class="props-item">
          <span class="label">隐藏：</span>
          <div style="width: 42px; text-align: left;">
            <VisibleSwitch :layer="targetProps" :disabled="disabled" />
          </div>
        </div>
      </div>
    </template>

    <template v-if="canvas.gifMode">
      <div class="props-line">
        <div class="props-item btn">
          <span class="label">顺序：</span>
          <el-button size="mini" :type="!reverse ? 'primary' : ''" @click="onChangePlayReverse(false)">顺序</el-button>
          <el-button size="mini" :type="reverse ? 'primary' : ''" @click="onChangePlayReverse(true)">倒序</el-button>
        </div>
      </div>

      <div class="props-line">
        <div class="props-item btn">
          <span class="label">倍速：</span>
          <el-button size="mini" :type="speed === 0.5 ? 'primary' : ''" @click="onChangePlaySpeed(0.5)">0.5x</el-button>
          <el-button size="mini" :type="speed === 1.0 ? 'primary' : ''" @click="onChangePlaySpeed(1.0)">1.0x</el-button>
          <el-button size="mini" :type="speed === 1.5 ? 'primary' : ''" @click="onChangePlaySpeed(1.5)">1.5x</el-button>
          <!--<el-button size="mini">2.0x</el-button>-->
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Const from '@/const'
import BaseFabricComponent from "../BaseFabricComponent"
import VisibleSwitch from "../buttons/VisibleSwitch.vue"
import { fontOptions } from '@/utils/FontHelper'
import imageHelper, {COMMAND_TYPES, defaultProps, scaleXtoWidth, scaleYtoHeight} from "@/utils/ImageHelper";
import ColorPicker from "@/components/ColorPicker.vue"
import timeLinePlayer from "@/utils/TimeLinePlayer";

const watchProps = ['showWidth', 'showHeight']
export default {
  name: 'ObjectProps',
  components: {VisibleSwitch, ColorPicker},
  mixins: [BaseFabricComponent],
  data() {
    return {
      imageHelper,
      fontOptions,
      timeLinePlayer,
      backgroundColor: '',
      targetProps: defaultProps,
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
    canvas() {
      return imageHelper.canvas || {}
    },
    reverse() {
      return this.timeLinePlayer.reverse
    },
    speed() {
      return this.timeLinePlayer.speed
    }
  },
  mounted() {
    imageHelper.on('initialized', this.refreshBackgroundColor.bind(this))
    imageHelper.on('object:modified', this.refreshProps)
    this.refreshBackgroundColor()
  },
  watch: {
    target() {
      this.refreshProps()
      // this.targetProps = imageHelper.watchTarget(v)
    },
    backgroundColor(v) {
      this.canvas.backgroundColor = v
      imageHelper.renderAll()
    },
    'targetProps.visible'(v) {
      if (this.target && this.target.visible !== v) {
        imageHelper.handleCommand(COMMAND_TYPES.EDIT.VISIBLE.key, this.target, Boolean(v))
      }
    },
    'targetProps.fontFamily'(v) {
      if (this.target && this.target.fontFamily !== v) {
        imageHelper.handleCommand(COMMAND_TYPES.EDIT.CHANGE_FONT_FAMILY.key, this.target, v)
      }
    }
  },
  methods: {
    refreshProps() {
      const { target:v } = this
      const props = { ...defaultProps }
      v && Object.keys(props).forEach(key => {
        if (key === 'width') {
          props[key] = scaleXtoWidth(v).replace('.00', '')
        } else if (key === 'height') {
          props[key] = scaleYtoHeight(v).replace('.00', '')
        } else if (['left', 'top', 'angle'].includes(key)) {
          props[key] = (Number(v[key]) || 0).toFixed(2).replace('.00', '')
        } else {
          props[key] = v[key]
        }
      })
      this.targetProps = props
    },
    refreshBackgroundColor() {
      this.backgroundColor = this.canvas.backgroundColor
    },
    setBackgroundColor(v) {
      this.backgroundColor = v
      imageHelper.renderAll()
    },

    /**
     * 修改宽
     */
    onWidthChange() {
      if (this.target) {
        imageHelper.handleCommand(COMMAND_TYPES.RESIZE.ACTIVE_OBJECT_WIDTH.key, this.target, this.targetProps.width)
      }
    },

    onHeightChange() {
      if (this.target) {
        imageHelper.handleCommand(COMMAND_TYPES.RESIZE.ACTIVE_OBJECT_WIDTH.key, this.target, this.targetProps.height)
      }
    },

    onTopChange() {
      if (this.target) {
        imageHelper.handleCommand(COMMAND_TYPES.RESIZE.ACTIVE_OBJECT_TOP.key, this.target, Number(this.targetProps.top) || 0)
      }
    },

    onLeftChange() {
      if (this.target) {
        imageHelper.handleCommand(COMMAND_TYPES.RESIZE.ACTIVE_OBJECT_LEFT.key, this.target, Number(this.targetProps.left) || 0)
      }
    },

    onAngleChange() {
      if (this.target) {
        imageHelper.handleCommand(COMMAND_TYPES.RESIZE.ACTIVE_OBJECT_ANGLE.key, this.target, Number(this.targetProps.angle) || 0)
      }
    },

    onChangePlayReverse(bol) {
      if (this.canvas) {
        imageHelper.handleCommand(COMMAND_TYPES.CONTROL.PLAY_REVERSE.key, this.target, bol)
      }
    },

    onChangePlaySpeed(speed) {
      if (this.canvas) {
        imageHelper.handleCommand(COMMAND_TYPES.CONTROL.PLAY_SPEED.key, this.target, speed)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.props-panel {
  font-size: 12px;
  padding: 10px;
  .props-line {
    display: flex;
    justify-content: space-between;
  }
  .props-item {
    display: flex;
    align-items: center;
    padding: 6px 0;
    &.btn {
      button {
        padding: 0;
        width: 40px;
        height: 22px;
        line-height: 22px;
        font-size: 10px!important;
      }
    }
    .el-textarea {
      padding: 0 8px;
    }
    .label {
      color: gray;
      min-width: 20px;
      text-align: right;
      white-space: nowrap;
    }
    &.font-family ::v-deep input {
      max-width: 70px;
    }
    ::v-deep {
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
        max-width: 60px;
        padding: 0 2px;
        line-height: 22px;
        font-size: 12px;
      }
    }
  }

  .props-background-color {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

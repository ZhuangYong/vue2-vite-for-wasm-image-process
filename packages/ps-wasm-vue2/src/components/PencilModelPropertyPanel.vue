<template>
  <el-form label-width="80px" class="pencil-mode-property">
    <el-form-item label="画笔模式：">
      <el-select v-model="drawMode" size="mini" :disabled="disabled" placeholder="请选择" @change="onChange">
        <el-option v-for="item in drawModeOptions" :key="item.label" :label="item.value" :value="item.label">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="画笔颜色：">
      <el-row>
        <el-col :span="15">
          <el-input v-model="props.pencilColor" :disabled="disabled" />
        </el-col>
        <el-col :span="4" :offset="3">
          <el-color-picker v-model="props.pencilColor" :disabled="disabled" size="mini" />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="画笔大小：">
      <el-row>
        <el-col :span="6">
          <el-input v-model="props.size" :disabled="disabled" />
        </el-col>
        <el-col :span="13" :offset="3">
          <el-slider v-model="props.size" :disabled="disabled" :min="1"></el-slider>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="阴影颜色：">
      <el-row>
        <el-col :span="15">
          <el-input v-model="props.shadowColor" :disabled="disabled" />
        </el-col>
        <el-col :span="4" :offset="3">
          <el-color-picker v-model="props.shadowColor" :disabled="disabled" size="mini" />
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item label="阴影大小：">
      <el-col :span="6">
        <el-input v-model="props.shadowSize" :disabled="disabled" />
      </el-col>
      <el-col :span="13" :offset="3">
        <el-slider v-model="props.shadowSize" :disabled="disabled"></el-slider>
      </el-col>
    </el-form-item>
    <el-form-item label="阴影偏移：">
      <el-col :span="6">
        <el-input v-model="props.shadowOffset" :disabled="disabled" />
      </el-col>
      <el-col :span="13" :offset="3">
        <el-slider v-model="props.shadowOffset" :disabled="disabled"></el-slider>
      </el-col>
    </el-form-item>

  </el-form>
</template>

<script>
import Const from '../const'
import testImg from '../../static/images/effect/e1.jpg'
import BaseFabricComponent from "./BaseFabricComponent"


export default {
  inject: ['getCanvas'],
  mixins: [BaseFabricComponent],
  data() {
    return {
      props: {
        size: 3,
        shadowSize: 0,
        shadowOffset: 0,
        pencilColor: '#333333',
        shadowColor: '#333333'
      },
      disabled: true, // 是否禁用
      brushShadow: null, // 阴影
      brushObjects: null,
      drawMode: 'Pencil',
      drawModeOptions: Object.keys(Const.DRAW_MODE).map(key => ({ label: key, value: Const.DRAW_MODE[key] })),
    }
  },
  computed: {
    /**
     * 笔刷
     * */
    freeDrawingBrush() {
      const canvas = this.canvas
      return canvas ? this.canvas.freeDrawingBrush : null
    }
  },
  watch: {
    canvas(v) {
      if (v && !this.brushObjects) {
        this.initialBrush()
      }
    },
    'canvas.isDrawingMode'(v) {
      this.disabled = !v
    },
    freeDrawingBrush(brush) {
      if (brush.getPatternSrc) {
        brush.source = brush.getPatternSrc.call(brush)
      }
      this.refreshBrushShadow(true)
      this.freeDrawingBrush.color = this.props.pencilColor
      this.freeDrawingBrush.width = this.props.size
    },
    /**
     * 画笔属性修改
     */
    props: {
      handler() {
        this.freeDrawingBrush.color = this.props.pencilColor
        this.freeDrawingBrush.width = this.props.size
        this.refreshBrushShadow()
      },
      deep: true
    }
  },
  methods: {
    onChange() {
      let brush
      switch (this.drawMode) {
        case "vLine":
          brush = this.brushObjects.vLinePatternBrush
          break
        case "hLine":
          brush = this.brushObjects.hLinePatternBrush
          break
        case "square":
          brush = this.brushObjects.squarePatternBrush
          break;
        case "diamond":
          brush = this.brushObjects.diamondPatternBrush
          break;
        case "texture":
          brush = this.brushObjects.texturePatternBrush
          break;
        default:
          brush = new fabric[this.drawMode + 'Brush'](this.canvas)
      }
      this.canvas.freeDrawingBrush = brush

    },
    refreshBrushShadow(rest) {
      const blur = parseInt(this.props.shadowSize, 10) || 0
      const offset = parseInt(this.props.shadowOffset, 10) || 0
      if (this.freeDrawingBrush || rest) {
        if (!this.freeDrawingBrush.shadow) {
          this.freeDrawingBrush.shadow = new fabric.Shadow({ blur, offsetX: offset, offsetY: offset, affectStroke: true, color: this.props.shadowColor })
        } else {
          this.freeDrawingBrush.shadow.affectStroke = true
          this.freeDrawingBrush.shadow.blur = blur
          this.freeDrawingBrush.shadow.offsetX = offset
          this.freeDrawingBrush.shadow.offsetY = offset
          this.freeDrawingBrush.shadow.color = this.props.shadowColor
        }
      }
    },
    initialBrush() {
      const { canvas } = this
      const vLinePatternBrush = new fabric.PatternBrush(canvas)
      vLinePatternBrush.getPatternSrc = function() {

        const patternCanvas = fabric.document.createElement('canvas');
        patternCanvas.width = patternCanvas.height = 10;
        const ctx = patternCanvas.getContext('2d');

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.lineTo(10, 5);
        ctx.closePath();
        ctx.stroke();

        return patternCanvas;
      };

      const hLinePatternBrush = new fabric.PatternBrush(canvas);
      hLinePatternBrush.getPatternSrc = function() {

        const patternCanvas = fabric.document.createElement('canvas');
        patternCanvas.width = patternCanvas.height = 10;
        const ctx = patternCanvas.getContext('2d');

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(5, 10);
        ctx.closePath();
        ctx.stroke();

        return patternCanvas;
      };

      const squarePatternBrush = new fabric.PatternBrush(canvas);
      squarePatternBrush.getPatternSrc = function() {

        const squareWidth = 10, squareDistance = 2;

        const patternCanvas = fabric.document.createElement('canvas');
        patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
        const ctx = patternCanvas.getContext('2d');

        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, squareWidth, squareWidth);

        return patternCanvas;
      };

      const diamondPatternBrush = new fabric.PatternBrush(canvas);
      diamondPatternBrush.getPatternSrc = function() {

        const squareWidth = 10, squareDistance = 5;
        const patternCanvas = fabric.document.createElement('canvas');
        const rect = new fabric.Rect({
          width: squareWidth,
          height: squareWidth,
          angle: 45,
          fill: this.color
        });

        const canvasWidth = rect.getBoundingRect().width;

        patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
        rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

        const ctx = patternCanvas.getContext('2d');
        rect.render(ctx);

        return patternCanvas;
      };

      const img = new Image();
      img.src = testImg

      const texturePatternBrush = new fabric.PatternBrush(canvas);
      texturePatternBrush.source = img;

      const brushObjects = {}
      brushObjects['vLinePatternBrush'] = vLinePatternBrush
      brushObjects['hLinePatternBrush'] = hLinePatternBrush
      brushObjects['squarePatternBrush'] = squarePatternBrush
      brushObjects['diamondPatternBrush'] = diamondPatternBrush
      brushObjects['texturePatternBrush'] = texturePatternBrush
      this.brushObjects = brushObjects
    }
  },
}
</script>

<style lang="scss" scoped>
$itemHeight: 28px;
.pencil-mode-property {
  padding-right: 6px;
  ::v-deep {
    .el-input {
      input {
        height: 20px;
        line-height: 20px;
        font-size: 10px;
        padding: 0 2px;
      }
    }
    .el-input__inner {
      height: 24px!important;
    }
    .el-form-item {
      margin: 0;
      height: $itemHeight;
      overflow: hidden;
    }
    .el-form-item__label {
      font-size: 12px;
      height: $itemHeight;
      line-height: $itemHeight;
    }
    .el-form-item__content {
      text-align: left;
      height: $itemHeight;
      line-height: $itemHeight;
    }

    .el-slider__button {
      width: 8px;
      height: 8px;
    }
    .el-slider__runway {
      margin: 10px 0;
    }
  }

}
</style>

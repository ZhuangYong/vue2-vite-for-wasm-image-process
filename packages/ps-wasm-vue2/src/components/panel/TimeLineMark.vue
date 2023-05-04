<template>
  <svg :class="`direction-${direction}`">
    <template v-for="i in length">
      <line v-if="showMark(i)" :key="`mark-${i}`" :x1="x1(i)" :y1="y1(i)" :x2="x2(i)" :y2="y2(i)" :stroke="stroke" stroke-linecap="round" stroke-width="1" />
    </template>
    <template v-for="i in length">
      <text v-if="showLabel(i)" :key="`text-${i}`" :x="textX(i)" :y="textY(i)" :style="{ 'transform-origin': `${transFormText(i)}`, pointerEvents: 'none' }">
        {{ markVal(i) }}
      </text>
    </template>
  </svg>
</template>
<script>
export const RULE_TYPE = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left'
}
export default {
  name: 'TimeLineMark',
  data() {
    return {
      length: 0,
      // offset: 0,
      // zeroPosition: 0,
      // stroke: '',
      // step: '',
      // markStep: '',
      // direction: '',
      width: 0
    }
  },
  props: {
    scale: { type: Number, default: 1 },
    zeroPosition: { type: Number, default: 0 },
    offset: { type: Number, default: 0 },
    stroke: { type: String, default: '#979797' },
    step: { type: Number, default: 10 },
    markStep: { type: Number, default: 5 },
    markLength: { type: Number, default: 4 },
    labelMarkLength: { type: Number, default: 8 },
    direction: {
      type: String,
      default: RULE_TYPE.TOP,
      validator: (str) => Object.values(RULE_TYPE).includes(str)
    }
  },
  computed: {
    markZeroPosition() {
      return this.zeroPosition - (this.offset || 0)
    },
    isVertical() {
      return [RULE_TYPE.LEFT, RULE_TYPE.RIGHT].includes(this.direction)
    },
    isHorizontal() {
      return [RULE_TYPE.TOP, RULE_TYPE.BOTTOM].includes(this.direction)
    }
  },
  watch: {
    offset() {
      this.refresh()
    },
    scale() {
      this.refresh()
    }
  },
  mounted() {
    this.refresh()
    window.addEventListener('resize', this.refresh)
  },
  unmounted() {
    window.removeEventListener('resize', this.refresh)
  },
  methods: {
    refresh() {
      this.width = this.$el.getBoundingClientRect()[this.isHorizontal ? 'width' : 'height']
      this.length = Math.ceil((Math.ceil(this.width / this.step) || 0) / this.scale)
    },

    markVal(index) {
      return ((this.textPosition(index) - this.markZeroPosition) / this.scale).toFixed(0)
    },

    /**
     * 是否显示刻度
     * @param index
     * @returns {boolean} 是否显示
     */
    showMark(index) {
      const markIndex = this.markVal(index) / this.step
      return markIndex % Math.ceil(Math.max(10, this.step) / (this.step * this.scale)) === 0
    },

    /**
     * 是否显示文本
     * @param index
     * @returns {boolean} 是否显示
     */
    showLabel(index) {
      const markIndex = this.markVal(index) / this.step
      return markIndex % (Math.ceil(Math.max(10, this.step) / (this.step * this.scale)) * this.markStep) === 0
    },
    // changeOffset(offset: number) {
    //   this.refresh()
    // }
    x1(i) {
      if (this.isHorizontal) {
        const { width: originWidth, step, offset = 0 } = this
        const width = originWidth / this.scale
        const x1 = (i - 1) * step - (offset / this.scale)
        const multiples = Math.abs(Math.floor(x1 / width))
        const modX1 = (x1 + width * multiples) % width
        return (x1 === modX1 ? x1 : (modX1 - (((step - (width % step)) % step) * (x1 / Math.abs(x1)) * multiples) % step)) * this.scale
      } else {
        return 0
      }
    },

    x2(i) {
      if (this.isHorizontal) {
        return this.x1(i)
      } else {
        return (this.y1(i) - this.markZeroPosition) % (this.markStep * this.step) === 0 ? this.labelMarkLength : this.markLength
      }
    },

    y1(i) {
      if (this.isHorizontal) {
        // return 0
        return 22 - (this.showLabel(i) ? this.markLength + 4 : this.markLength)
      } else {
        const { width, step, offset = 0 } = this
        const x1 = (i - 1) * step - offset
        const multiples = Math.abs(Math.floor(x1 / width))
        const modX1 = (x1 + width * multiples) % width
        return x1 === modX1 ? x1 : modX1 - ((step - ((width % step)) % step) * (x1 / Math.abs(x1)) * multiples) % step
      }
    },

    y2(i) {
      if (this.isHorizontal) {
        // return this.showLabel(i) ? this.markLength + 4 : this.markLength
        return 22
      } else {
        return this.y1(i)
      }
    },

    textPosition(i) {
      return this.isHorizontal ? this.x1(i) : this.y1(i)
    },
    textX(i) {
      if (this.isHorizontal) {
        return this.x1(i) - 2
      } else {
        return 14
      }
    },

    textY(i) {
      if (this.isHorizontal) {
        return 14
      } else {
        return this.y1(i)
      }
    },
    transFormText(i) {
      if (this.direction === RULE_TYPE.LEFT) {
        return `${this.textX(i) - 4}px ${this.textY(i) - 4}px`
      }
      // todo other side
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
svg {
  &.direction-top,
  &.direction-bottom {
    width: 100%;
    height: 22px;
  }
  &.direction-left,
  &.direction-right {
    top: 0;
    width: 22px;
    height: 100%;
    text {
      text-anchor: middle;
    }
  }
  &.direction-left text {
    transform: rotate(270deg);
  }
  line:hover {
    stroke: #0083ab;
  }
  text {
    font-size: 8px;
    font-weight: 200;
    stroke: #b9b9b9;
    text-anchor: end;
    stroke-width: 0.6px;
  }
}
</style>

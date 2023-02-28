<template>
  <div class="props-panel">
    <div class="props-line">
      <div class="props-item">
        <span class="label">W：</span>
        <el-input v-model="showWidth" size="mini" />
      </div>
      <div class="props-item">
        <span class="label">H：</span>
        <el-input v-model="showHeight" size="mini" />
      </div>
    </div>

    <div class="props-line">
      <div class="props-item">
        <span class="label">X：</span>
        <el-input v-model="left" size="mini" />
      </div>
      <div class="props-item">
        <span class="label">Y：</span>
        <el-input v-model="top" size="mini" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ObjectProps',
  data() {
    return {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      scaleX: 1,
      scaleY: 1
    }
  },
  props: {
    target: {
      type: Object,
      default: () => {}
    },
  },
  computed: {
    showWidth() {
      return this.scaleX * this.width
    },
    showHeight() {
      return this.scaleY * this.height
    }
  },
  watch: {
    target: {
      handler(v) {
        const { width, height, top, left, scaleX, scaleY } = v || {}
        this.width = width || 10
        this.height = height || 10
        this.top = top || 0
        this.left = left || 0
        this.scaleX = scaleX || 1
        this.scaleY = scaleY || 1
      },
      immediate: true
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.props-panel {
  padding: 8px;
  font-size: 12px;
  .props-line {
    display: flex;
  }
  .props-item {
    display: flex;
    align-items: center;
    padding: 6px;
    .label {
      width: 32px;
    }
    ::v-deep {
      input {
        padding: 0 2px;
      }
    }
  }
}
</style>

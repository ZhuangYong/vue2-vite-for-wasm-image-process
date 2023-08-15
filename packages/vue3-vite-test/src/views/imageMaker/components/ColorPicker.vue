<template>
  <div class="color-picker">
    <div class="color-group">
      <el-color-picker v-model="backgroundColor" :teleported="false" show-alpha />

      <span>{{ colorInfo.color }}</span>

      <span>{{ colorInfo.opacity * 100 }}%</span>

      <VisibleSwitch v-model:visible="visible" />
    </div>
  </div>
</template>

<script>
import transparentSvg from '@/../static/icon/transparent.svg'
import VisibleSwitch from './buttons/VisibleSwitch.vue'
const defaultBackgroundColor = 'rgba(0, 0, 0, 0)'
export default {
  components: { VisibleSwitch },
  props: {
    color: {
      type: String,
      default: defaultBackgroundColor
    },
  },
  data() {
    return {
      oldOpacity: 1,
      transparentSvg,
      backgroundColor: ''
    }
  },

  computed: {
    colorInfo() {
      const defaultInfo = { color: '#000000', opacity: 0 }
      if (!this.backgroundColor) {
        return defaultInfo
      }
      return this.formatRgbaTo16str(this.backgroundColor) || defaultInfo
    },

    visible: {
      get() {
        return this.colorInfo.opacity !== 0
      },
      set(v) {
        if (!v) {
          this.oldOpacity = this.colorInfo.opacity
          this.resetAlpha(0)
        } else {
          this.resetAlpha(this.oldOpacity)
        }
      }
    }
  },
  watch: {
    color: {
      handler(v) {
        this.backgroundColor = v || ''
      },
      immediate: true
    },
    backgroundColor(v) {
      this.$emit('update:color', v || '')
    }
  },
  methods: {
    setBackgroundColor(v) {
      this.backgroundColor = v
    },

    resetAlpha(val) {
      this.resetColor('a', val)
    },
    resetColor(channel, val) {
      const { backgroundColor } = this
      const arr = backgroundColor.slice(5, backgroundColor.length - 1).split(',')
      let [r, g, b, a] = arr
      r = r || '00'
      g = g || '00'
      b = b || '00'
      a = a || 0
      switch (channel) {
        case 'r':
          this.backgroundColor = `rgba(${val}, ${g}, ${b}, ${a})`
          break
        case 'g':
          this.backgroundColor = `rgba(${r}, ${val}, ${b}, ${a})`
          break
        case 'b':
          this.backgroundColor = `rgba(${r}, ${g}, ${val}, ${a})`
          break
        case 'a':
          this.backgroundColor = `rgba(${r}, ${g}, ${b}, ${val})`
          break
      }
    },

    formatRgbaTo16str(str) {
      let reg = /^(rgba|RGBA)/
      if (!reg.test(str)) {
        return
      }
      // 将str中的数字提取出来放进数组中
      const arr = str.slice(5, str.length - 1).split(',')
      let c = '#'
      for (let i = 0; i < arr.length - 1; i++) {
        // Number() 函数把对象的值转换为数字
        // toString(16) 将数字转换为十六进制的字符表示
        let t = Number(arr[i]).toString(16)
        //如果小于16，需要补0操作,否则只有5位数
        if (Number(arr[i]) < 16) {
          t = '0' + t
        }
        c += t
      }
      return { color: c, opacity: Number(arr[arr.length - 1]) }
    }
  }
}
</script>

<style lang="scss" scoped>
$width: 240px;
$color: #333333;
.color-picker {
  width: $width;
  color: $color;
}
.color-group {
  width: 100%;
  display: flex;
  height: 36px;
  padding: 0 12px;
  align-items: center;
  background-color: #F5F6F8;
  justify-content: space-between;

  :deep(.el-color-picker) {
    .el-color-picker__trigger {
      padding: 0;
      height: 16px;
      width: 16px;
      line-height: 16px;
    }
  }
}
</style>

<template>
  <div class="effect-list">
    <!--<div class="effect-item">
      <el-button @click="fabricBlur">fabric blur</el-button>
    </div>-->
    <div class="effect-item" @click="doFilter('gaussBlur')">
      <img :src="e1" />
      <span>{{ easyReflection.e1 }}</span>
    </div>
    <div class="effect-item">
      <img :src="e2" />
      <span>{{ easyReflection.e2 }}</span>
    </div>
    <div class="effect-item">
      <img :src="e3" />
      <span>{{ easyReflection.e3 }}</span>
    </div>
    <div class="effect-item">
      <img :src="e4" />
      <span>{{ easyReflection.e4 }}</span>
    </div>
    <div class="effect-item">
      <img :src="e5" />
      <span>{{ easyReflection.e5 }}</span>
    </div>
    <div class="effect-item">
      <img :src="e6" />
      <span>{{ easyReflection.e6 }}</span>
    </div>

  </div>
</template>

<script>

// todo 图片与效果替换为动态
import e1 from '../../../static/images/effect/e1.png'
import e2 from '../../../static/images/effect/e2.png'
import e3 from '../../../static/images/effect/e3.png'
import e4 from '../../../static/images/effect/e4.png'
import e5 from '../../../static/images/effect/e1.png'
import e6 from '../../../static/images/effect/e1.png'
const EasyReflection = {
  e1: '美肤',
  e2: "素描",
  e3: "自然增强",
  e4: "紫调",
  e5: "柔焦",
  e6: "复古",
  e7: "黑白",
  e8: "仿lomo",
  e9: "亮白增强",
  e10: "灰白",
  e11: "灰色",
  e12: "暖秋",
  e13: "木雕",
  e14: "粗糙"
}
export default {
  data() {
    return {
      e1,
      e2,
      e3,
      e4,
      e5,
      e6,
      easyReflection: EasyReflection
    }
  },
  mounted() {
    // console.log(this)
  },
  methods: {
    fabricBlur() {
      this.$emit('fabric-filter', 'blur')
    },
    doFilter(type) {
      this.$emit('do-filter', type)
    }
  }
}
</script>

<style lang="scss" scoped>
$itemWidth: 50px;
.effect-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.effect-item {
  width: $itemWidth;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  span {
    font-size: 12px;
  }
  img {
    margin: 4px;
    width: calc(100% - 8px);
    user-select: none;
    -webkit-user-select: none;
    -webkit-user-drag: none;
  }
}
</style>

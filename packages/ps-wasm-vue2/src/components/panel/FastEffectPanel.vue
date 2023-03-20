<template>
  <div class="effect-list">
    <!--<div class="effect-item">
      <el-button @click="fabricBlur">fabric blur</el-button>
    </div>-->
    <div v-for="filter in filters" :key="filter.key" class="effect-item" @click="doFilter(filter.key)">
      <img :src="filter.icon"  :alt="filter.desc"/>
      <span>{{ filter.desc }}</span>
    </div>
    <!--<div class="effect-item" @click="doFilter('gaussBlur')">
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
    </div>-->

  </div>
</template>

<script>
import doFilter, {FAST_FILTERS} from "@/filters"
import BaseFabricComponent from "@/components/BaseFabricComponent";

export default {
  name: 'FastEffectPanel',
  mixins: [BaseFabricComponent],
  data() {
    return {
      filters: Object.values(FAST_FILTERS)
    }
  },
  mounted() {
    // console.log(this)
  },
  methods: {
    fabricBlur() {
      this.$emit('fabric-filter', 'blur')
    },
    doFilter(key) {
      doFilter(this.target, key)
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

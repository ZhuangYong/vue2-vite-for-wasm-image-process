<template>
  <div class="effect-list">
    <div v-for="filter in filters" :key="filter.key" class="effect-item" :class="`${disabled && 'disabled'}`" @click="doFilter(filter.key)">
      <img :src="filter.icon"  :alt="filter.desc"/>
      <span>{{ filter.desc }}</span>
    </div>
  </div>
</template>

<script>
import {filters, BaseFabricComponent} from 'ps-wasm-vue2'
const doFilter = filters.default

export default {
  name: 'FastEffectPanel',
  mixins: [BaseFabricComponent],
  data() {
    return {
      filters: Object.values(filters.FAST_FILTERS)
    }
  },
  computed: {
    disabled() {
      return !this.target
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
      if (this.disabled) {
        return
      }
      doFilter(this.target, key)
    }
  }
}
</script>

<style lang="scss" scoped>
$itemWidth: 10%;
.effect-list {
  display: flex;
  flex-wrap: wrap;
  padding: 12px;
  justify-content: space-around;
}
.effect-item {
  width: $itemWidth;
  display: flex;
  cursor: pointer;
  min-width: 80px;
  flex-direction: column;
  &.disabled {
    filter: grayscale(1);
    cursor: not-allowed;
  }
  span {
    font-size: 12px;
    text-align: center;
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

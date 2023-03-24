<template>
  <div class="effect-list">
    <div v-for="filter in filters" :key="filter.key" class="effect-item" :class="`${disabled && 'disabled'}`" @click="doFilter(filter.key)">
      <img :src="filter.icon"  :alt="filter.desc"/>
      <span>{{ filter.desc }}</span>
    </div>
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
  &.disabled {
    filter: grayscale(1);
    cursor: not-allowed;
  }
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

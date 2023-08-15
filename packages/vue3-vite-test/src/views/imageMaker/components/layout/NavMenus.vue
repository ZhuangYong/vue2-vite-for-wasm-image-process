<template>
  <div class="nav-menu">
    <div v-for="nav in menus" :key="nav.key" :class="{ active: active === nav.key }" class="item" @click="setActive(nav.key)">
      <svg-icon :name="nav.icon" size="24px" />
      <p class="label">{{ nav.label }}</p>
    </div>
  </div>
</template>

<script>

import {resourceType} from '../../utils'

export default {
  name: 'NavMenus',
  props: {
    type: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      menus: resourceType,
      active: resourceType[0].key
    }
  },
  watch: {
    type(v) {
      this.active = v
    }
  },
  methods: {
    setActive(v) {
      this.active = v
      this.$emit('update:type', v)
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../style";

.nav-menu {
  display: flex;
  flex-direction: column;
  .item {
    cursor: pointer;
    display: flex;
    width: $itemWidth;
    height: $itemHeight;
    font-size: $fontSize;
    color: $mainFontColor;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    margin: 10px 6px;
    transition: all ease 0.3s;

    &:hover {
      background-color: $backgroundHover;
    }
    &.active {
      color: $activeColor;
      background-color: $backgroundHover;
      svg {
        color: $activeColor;
      }
    }

    svg {
      margin-bottom: 8px;
      color: $secondaryColor;
    }

    .label {
      line-height: 1;
    }
  }
}
</style>

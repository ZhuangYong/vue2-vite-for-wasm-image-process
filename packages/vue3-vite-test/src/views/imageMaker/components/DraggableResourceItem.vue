<template>
  <DraggableItem>
    <span v-if="detail.type === 'font'" :style="`font-family: ${detail.key};`">{{ detail.label }}</span>
    <img ref="img" v-else :src="detail.url" alt="">
  </DraggableItem>
</template>

<script>
import DraggableItem from './DraggableItem.vue'
export default {
  name: 'DraggableResourceItem',
  components: { DraggableItem },
  props: {
    detail: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
    }
  },

  computed: {
    naturalSize() {
      const { naturalHeight, naturalWidth } = this.$refs.img || {}
      return { naturalHeight, naturalWidth }
    }
  },

  watch: {
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>
.drag-ghost {
  pointer-events: none;
}
</style>

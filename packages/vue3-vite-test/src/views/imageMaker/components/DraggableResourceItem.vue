<template>
  <DraggableItem>
    <slot />
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

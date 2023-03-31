<template>
  <div class="stage">
    <canvas-panel></canvas-panel>
  </div>
</template>

<script>
import CanvasPanel from "@/components/panel/CanvasPanel.vue"

export default {
  name: 'stage',
  components: { CanvasPanel },
  mounted() {
    console.log(1111111)
  }
}
</script>

<style lang="scss" scoped>
.stage {
  width: 100%;
}
</style>

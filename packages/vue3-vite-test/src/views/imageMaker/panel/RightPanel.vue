<template>
  <div class="right-panel">

  </div>
</template>

<script>
import LayerPanel from "./LayerPanel.vue"
import ObjectPropsPanel from "./ObjectPropsPanel.vue"
import ContentPanel from "./ContentPanel.vue"

export default {
  name: 'RightPanel',
  components: { ObjectPropsPanel, LayerPanel, ContentPanel }
}
</script>

<style lang="scss" scoped>

</style>

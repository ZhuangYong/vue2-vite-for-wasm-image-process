<template>
  <div class="layer-panel">
    <div v-for="layer in layers">
      {{ layer.type }}{{layer.type === 'image'}}
    </div>
    <div v-for="layer in layers" class="layer-item" :class="`type-${layer.type}`">
      <VisibleSwitch :layer.sync="layer" />
      <template v-if="layer.type === 'image'">
        <div class="preview-icon">
          <img :src="layer._element.src" alt="">
          <div>

          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import BaseFabricComponent from "@/components/BaseFabricComponent"
import VisibleSwitch from "@/components/buttons/VisibleSwitch.vue"

export default {
  name: 'LayerPanel',
  mixins: [BaseFabricComponent],
  components: {VisibleSwitch},
  computed: {
    layers() {
      return (this.canvas || {})._objects || []
    }
  },
  methods: {
    ttt() {

    }
  },
}
</script>

<style lang="scss" scoped>
.preview-icon {
  img {
    height: 26px;
    max-width: 80px;
  }
}
</style>

<template>
  <div class="layer-panel">
    <div v-for="layer in layers" class="layer-item" :class="`type-${layer.type}`">
      <VisibleSwitch :layer="layer" />
      <template v-if="layer.type === 'image'">
        <div class="preview-icon">
          <img :src="layer._element.src" alt="">
        </div>
        <div class="layer-label">
          {{ layer.type }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import BaseFabricComponent from "@/components/BaseFabricComponent"
import VisibleSwitch from "@/components/buttons/VisibleSwitch.vue"
import imageHelper from "@/utils/ImageHelper";

export default {
  name: 'LayerPanel',
  mixins: [BaseFabricComponent],
  components: {VisibleSwitch},
  computed: {
    layers() {
      return ((this.canvas || {})._objects || []).map(target => {
        const result = imageHelper.watchTarget(target)
        result.type = target.type
        result._element = target._element
        return result
      })
    }
  },
  methods: {
    ttt() {

    }
  },
}
</script>

<style lang="scss" scoped>
.layer-panel {
  padding: 1px 0;
}
.layer-item {
  height: 30px;
  display: flex;
  padding: 0 4px;
  font-size: 12px;
  cursor: pointer;
  align-items: center;
  box-shadow: 0 0 1px gray;
  &.active {
    box-shadow: 0 0 1px #009987 inset;
  }
  &>* {
    margin-right: 6px;
  }
}
.preview-icon {
  display: flex;
  align-items: center;
  img {
    height: 26px;
    max-width: 80px;
  }
}
</style>

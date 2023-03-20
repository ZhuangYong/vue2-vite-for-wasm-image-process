<template>
  <div class="layer-panel">
    <Draggable :list="orderList" :options="{swap: true, forceFallback: true, delay: 100}" class="quick-pick-draggable" @sort="onSort">
      <div v-for="(layer, index) in layers" :key="`${index}_${layer.UUID}`" class="layer-item" :class="`type-${layer.type} ${layer.active && 'active'}`"  @click="onItemClick(layer)">
        <VisibleSwitch :layer="layer" />
        <div class="preview-icon" v-html="layer.preview" />
        <div class="layer-label">
          {{ layer.type }} {{ layer.target.UUID }}
        </div>
      </div>
    </Draggable>
  </div>
</template>

<script>
import BaseFabricComponent from "@/components/BaseFabricComponent"
import VisibleSwitch from "@/components/buttons/VisibleSwitch.vue"
import imageHelper, {COMMAND_TYPES} from "@/utils/ImageHelper";
import {isText} from "@/const";
import textSvg from '@/../static/icon/text.svg'
import {base64ToStr} from "@/utils";
import Draggable from "@/components/Draggable";

export default {
  name: 'LayerPanel',
  mixins: [BaseFabricComponent],
  components: {VisibleSwitch, Draggable},
  data() {
    return {
      orderList: []
    }
  },
  computed: {
    layers() {
      return ((this.canvas || {})._objects || []).map(target => {
        const { UUID, type, left, top, width, height, scaleX = 1, scaleY = 1, text } = target
        const result = imageHelper.watchTarget(target)
        result.type = target.type
        result._element = target._element
        if (isText(type)) {
          result.preview = base64ToStr(textSvg)
        } else {
          result.preview = `<svg viewBox="${left} ${top} ${width * scaleX} ${height * scaleY}">${target.toClipPathSVG()}</svg>`
        }
        if (this.target) {
          result.active = UUID && (this.target.UUID === UUID || (this.target._objects || []).some(item => item.UUID && item.UUID === UUID))
        } else {
          result.active = false
        }
        result.target = target
        return result
      }).reverse()
    }
  },
  watch: {
    layers(v) {
      if (v) {
        this.orderList = v.map(item => item.target.UUID)
      } else {
        this.orderList = []
      }
    }
  },
  methods: {
    onItemClick(layer) {
      this.canvas.setActiveObject(layer.target)
      this.canvas.requestRenderAll()
    },
    onSort({ oldIndex, newIndex }) {
      imageHelper.handleCommand(COMMAND_TYPES.EDIT.SWITCH_INDEX.key, oldIndex, newIndex)
      this.$nextTick(() => {
        this.orderList = ((this.canvas || {})._objects || []).map(item => item.UUID).reverse()
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.layer-panel {
  padding: 1px 0;
}
.layer-item {
  height: 30px!important;
  display: flex;
  padding: 0 4px;
  font-size: 12px;
  cursor: pointer;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #e9e9e9;
  &.sortable-insert-up-highlight {
    position: relative;
    &:before {
      top: 0;
      left: 0;
      width: 100%;
      content: ' ';
      position: absolute;
      border-top: 1px solid #009987;
    }
  }
  &.sortable-insert-down-highlight {
    position: relative;
    &:after {
      bottom: 0;
      left: 0;
      width: 100%;
      content: ' ';
      position: absolute;
      border-bottom: 1px solid #009987;
    }
  }
  &.sortable-fallback {
    opacity: 0.4!important;
  }
  //&:not(.sortable-fallback) {
  //  transition: all ease 0.3s;
  //}
  //&.sortable-fallback {
  //  margin-top: -30px!important;
  //}
  //&.sortable-ghost {
  //  height: 0!important;
  //  border: 1px solid green;
  //  transition: none!important;
  //  * {
  //    display: none!important;
  //  }
  //}
  .preview-icon {
    display: flex;
    width: 32px;
    padding: 2px;
    border: 0.6px dashed #b0b0b0;
    justify-content: center;
    align-items: center;
    ::v-deep svg {
      height: 20px;
      max-width: 80px;
    }
  }
  &:hover {
    background-color: #efefef;
  }
  &.active {
    color: white;
    background-color: #009987;
    ::v-deep svg  {
      color: white;
    }
    .preview-icon {
      border-color: white;
    }
  }
  &>* {
    margin-right: 6px;
  }
}

</style>

<template>
  <div class="layer-panel">
    <Draggable :list="orderList" :options="{forceFallback: true, removeCloneOnHide: false}" class="quick-pick-draggable" :clone="cloneEl" @sort="onSort" @change="onSortChange">
      <div v-for="(layer, index) in layers" :key="`${index}_${layer.UUID}`" class="layer-item" :class="`type-${layer.type} ${layer.active && 'active'}`"  @click="onItemClick(layer)">
        <VisibleSwitch :layer="layer" />
        <div class="preview-icon" v-html="layer.preview" />
        <div class="layer-label">
          {{ layer.type }}
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
    cloneEl(el) {
      console.log(el)
      return el
    },
    onItemClick(layer) {
      this.canvas.setActiveObject(layer.target)
      this.canvas.requestRenderAll()
    },
    onSortChange(e) {
      console.log(e)
    },
    onSort({ oldIndex, newIndex }) {
      imageHelper.handleCommand(COMMAND_TYPES.EDIT.SWITCH_INDEX.key, oldIndex, newIndex)
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
  display: flex!important;
  padding: 0 4px;
  font-size: 12px;
  cursor: pointer;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #e9e9e9;
  &:not(.sortable-fallback) {
    transition: all ease 0.3s;
  }
  &.sortable-fallback {
    margin-top: -30px!important;
  }
  &.sortable-ghost {
    height: 0!important;
    border: 1px solid green;
    transition: none!important;
    * {
      display: none!important;
    }
  }
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

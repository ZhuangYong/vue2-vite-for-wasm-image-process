<template>
  <div class="layer-panel">
    <div class="operator">
      <el-link :underline="false" title="删除" @click="deleteLayer">
        <el-icon size="14px"><Delete /></el-icon>
      </el-link>
      <el-link :underline="false" title="置顶">
        <el-icon size="14px" style="transform: rotate(180deg)"><Download /></el-icon>
      </el-link>
      <el-link :underline="false" title="上移一层">
        <el-icon size="14px"><Top /></el-icon>
      </el-link>
      <el-link :underline="false" title="下移一层">
        <el-icon size="14px"><Bottom /></el-icon>
      </el-link>
      <el-link :underline="false" title="置底">
        <el-icon size="14px"><Download /></el-icon>
      </el-link>
    </div>
    <Draggable :list="orderList" :options="{swap: true}" :swap="true" :delay="100" :force-fallback="true" class="quick-pick-draggable" @sort="onSort">
      <div v-for="(layer, index) in layers" :key="`${index}_${layer.UUID}`" class="layer-item" :class="`type-${layer.type} ${(layer.active || activeTarget.UUID === layer.UUID) && 'active'}`"  @click="onItemClick(layer)">
        <VisibleSwitch v-model:visible="layer.visible" />
        <div class="preview-icon" v-html="layer.preview" />
        <div class="layer-label">
          {{ layer.text || layer.type }}
        </div>
      </div>
    </Draggable>
  </div>
</template>

<script>
import {VueDraggableNext as Draggable, Sortable} from '../components/Draggable'
import VisibleSwitch from "../components/buttons/VisibleSwitch.vue"
import {timeLinePlayer, Utils, BaseFabricComponent, imageHelper, COMMAND_TYPES, Swap} from "ps-wasm-vue2"
import textSvg from '@/../static/icon/text.svg'
import { Download, Top, Bottom, Delete } from '@element-plus/icons-vue'

Sortable.mount(new Swap())

export default {
  name: 'LayerPanel',
  mixins: [BaseFabricComponent],
  components: {VisibleSwitch, Draggable, Download, Top, Bottom, Delete},
  data() {
    return {
      orderList: [],
      activeTarget: {},
      frameGroups: timeLinePlayer.frameGroups
    }
  },
  computed: {
    layers() {
      const { _objects, gifMode } = this.canvas || {}
      if (gifMode) {
        return this.frameGroups.map(frameGroup => this.previewTarget(frameGroup.getFirstObject(), frameGroup)).reverse()
      }
      return (_objects || []).filter(item => !item.ignore).map(target => this.previewTarget(target)).reverse()
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
  mounted() {

  },
  methods: {
    onItemClick(layer) {
      const { gifMode } = this.canvas || {}
      if (gifMode) {
        this.activeTarget = layer
      } else {
        this.canvas.setActiveObject(layer.target)
        this.canvas.requestRenderAll()
      }
    },
    onSort({ oldIndex, newIndex }) {
      imageHelper.handleCommand(COMMAND_TYPES.EDIT.SWITCH_INDEX.key, oldIndex, newIndex)
      this.$nextTick(() => {
        this.orderList = ((this.canvas || {})._objects || []).map(item => item.UUID).reverse()
      })
      timeLinePlayer.requestFrame()
    },

    previewTarget(target, frameGroup) {
      let { UUID, type, width, height, text } = target
      if (frameGroup) {
        let { UUID, type } = frameGroup
      }
      const result = imageHelper.watchTarget(target)
      result._element = target._element
      if (Utils.isText(type)) {
        result.preview = Utils.base64ToStr(textSvg)
      } else {
        result.preview = `<svg viewBox="0 0 ${width} ${height}">${target.toSVG()}</svg>`
      }
      if (this.target) {
        result.active = UUID && (this.target.UUID === UUID || (this.target._objects || []).some(item => item.UUID && item.UUID === UUID))
      } else {
        result.active = false
      }
      result.type = type
      result.UUID = UUID
      result.target = target
      return result
    },

    deleteLayer() {

    }
  },
}
</script>

<style lang="scss" scoped>
.layer-panel {
  padding: 1px 0;
}

.quick-pick-draggable {
  overflow-y: auto;
  height: calc(100% - 40px);
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
  .layer-label {
    text-overflow: ellipsis;
    max-width: calc(100% - 76px);
    overflow: hidden;
  }
  &:hover {
    background-color: #efefef;
  }
  &.active {
    color: white;
    background-color: #009987;
    :deep(svg)  {
      color: white;
    }
    .preview-icon {
      border-color: white;
    }
  }
  &>* {
    margin-right: 6px;
  }
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

  .preview-icon {
    display: flex;
    width: 32px;
    padding: 2px;
    border: 0.6px dashed #b0b0b0;
    justify-content: center;
    align-items: center;
    :deep(svg) {
      height: 20px;
      max-width: 80px;
      path, g {
        transform: none!important;
      }
      image {
        x: 0!important;
        y: 0!important;
        visibility: visible!important;
        transform: none!important;
      }
    }
  }
}

.operator {
  height: 40px;
  display: flex;
  padding: 0 15px;
  align-items: center;
  border-bottom: 1px solid #EBEEF5;
  i {
    margin-right: 30px;
  }
}
</style>

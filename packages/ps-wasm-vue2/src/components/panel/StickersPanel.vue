<template>
  <div class="resource-stickers">
    <el-scrollbar>
      <div v-if="initialed" class="quick-pick">
        <Draggable :sort="false" :list="svgList.slice(0, 13)" :swap="false" :force-fallback="true" class="quick-pick-draggable" @start="onDragstart" @end="onDragend">
          <div v-for="item in svgList.slice(0, 13)" :key="item.key" class="sticker-item">
            <img :src="item.value" :size="calcSvgSize(item.value)"  alt="">
          </div>
        </Draggable>
        <p @click="showPick" class="more-button">更多</p>
      </div>
    </el-scrollbar>
    <el-dialog title="点击选择贴纸" :visible.sync="pickDialogVisible">
      <el-tabs v-model="activeName" type="card" class="left-function-tabs">
        <el-tab-pane label="甜点铺子" name="dessert">
          <div v-for="item in svgList" :key="item.key" class="sticker-item sticker-big-item" @click="addToStage(item)">
            <img :src="item.value" alt="">
            <span class="title">{{ item.key }}</span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="xxxx" name="ttttt">
          ---
        </el-tab-pane>
      </el-tabs>

      <div slot="footer">
        <el-button type="primary" @click="closePick">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Draggable from '../Draggable'
import {isSvgByBase64} from "@/utils";
import imageHelper from "@/utils/ImageHelper"
import BaseFabricComponent from "../BaseFabricComponent"

const svg = require.context('../../../static/svg/', true, /\.svg$/)
const svgList = svg.keys().map(key => ({ key: key.split('/').pop().split('.').shift(), value: svg(key)}))

export default {
  mixins: [BaseFabricComponent],
  components: { Draggable },
  data() {
    return {
      svgList,
      startDrag: false, // 标志开始拖拽
      activeName: 'dessert',
      startDragOffset: {x: 0, y:0}, // 开始拖动作用在对象上的偏移
      pickDialogVisible: false
    }
  },
  methods: {
    calcSvgSize(src) {
      if (isSvgByBase64(src)) {
        try {
          const viewBox = atob(src.split(',')[1]).match('viewBox="([0-9 ]*)"')[1]
          const [x, y, width, height] = viewBox.split(' ').filter(Boolean)
          return width + ',' + height
        } catch (e) {
          return ''
        }
      }
      return ''
    },
    onDragend(e) {
      if (this.startDrag === true) {
        this.startDrag = false
        imageHelper.addStroke(e)
      }
    },
    onDragstart(e) {
      this.startDrag = true
      const { x: itemX, y: itemY } = e.item.getBoundingClientRect()
      const { clientX, clientY } = e.originalEvent
      this.startDragOffset = {x: itemX - clientX, y: itemY - clientY}
    },
    showPick() {
      this.pickDialogVisible = true
    },
    closePick() {
      this.pickDialogVisible = false
    },
    addToStage(item) {
      this.closePick()
      imageHelper.addStroke(item.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.resource-stickers {
  .quick-pick {
    display: flex;
    align-items: center;
    .quick-pick-draggable {
      display: flex;
    }
    .more-button {
      margin: 0;
      padding: 0 12px;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
      text-decoration: underline;
      &:hover {
        color: #009987;
      }
    }
  }
  .sticker-item {
    width: 32px;
    cursor: move;
    margin: 0 4px;
    img {
      max-width: 32px;
      max-height: 32px;
      user-select: none;
      -webkit-user-select: none;
      -webkit-user-drag: none;
    }
  }
  ::v-deep .el-dialog__body {
    padding-top: 0;
  }

  .sticker-big-item {
    width: 82px;
    margin: 8px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    img {
      max-width: 82px;
      max-height: 82px;
    }
    .title {
      font-size: 12px;
    }
  }
  .el-tab-pane {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>

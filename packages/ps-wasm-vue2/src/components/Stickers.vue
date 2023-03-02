<template>
  <div class="resource-stickers">
    <el-scrollbar>
      <div class="quick-pick">
        <Draggable :sort="false" :list="svgList.slice(0, 13)" class="quick-pick-draggable">
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
          <div v-for="item in svgList" :key="item.key" class="sticker-item sticker-big-item">
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
import Draggable from './Draggable'
import {isSvgByBase64} from "../utils";

const svg = require.context('../../static/svg/', true, /\.svg$/)
const svgList = svg.keys().map(key => ({ key: key.split('/').pop().split('.').shift(), value: svg(key)}))

export default {
  components: { Draggable },
  data() {
    return {
      svgList,
      activeName: 'dessert',
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
    showPick() {
      this.pickDialogVisible = true
    },
    closePick() {
      this.pickDialogVisible = false
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

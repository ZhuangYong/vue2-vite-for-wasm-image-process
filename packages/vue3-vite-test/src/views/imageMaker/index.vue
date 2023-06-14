<template>
  <div ref="mainPanel" v-loading="showWaiting" class="main-panel">
    <div class="nav-menu">
      <NavMenus v-model:type="resourceType" />
    </div>
    <div class="main">
      <div class="left-panel">
        <ResourcePanel :type="resourceType" />
      </div>
      <div class="center-panel">
        <SplitPan class="default-theme" horizontal>
          <pane class="center-center-panel">
            <div class="center-top-bar-panel">
              <TopBar :full-screen-el="fullscreenTarget" v-model:edit-mode="editMode" />
            </div>
            <div class="center-canvas-panel">
              <CanvasPanel v-model:current-select-target="currentObject" @initialized="onCanvasInitialized"  />
            </div>
          </pane>
          <pane class="center-bottom-panel">
            <ContentPanel title="时间轴" bold title-height="40px">
              <template #titleRight><PlayStatus /></template>
              <TimeLinePanel :time-line-player="timeLinePlayer" />
            </ContentPanel>
          </pane>
        </SplitPan>
      </div>

      <!--右侧面板-->
      <div class="right-panel">
        <!--属性面板-->
        <ContentPanel title="属性" bold class="top">
          <PropsPanel :edit-mode="editMode" />
        </ContentPanel>

        <!--图层面板-->
        <ContentPanel title="图层" bold class="bottom">
          <LayerPanel />
        </ContentPanel>
      </div>
    </div>

    <Dialogs />
  </div>
</template>

<script>
import { Const, imageHelper, fabric, timeLinePlayer } from "ps-wasm-vue2"
import pane from './components/SplitPan/pane.vue'
import TopBar from './components/layout/TopBar.vue'
import NavMenus from './components/layout/NavMenus.vue'
import SplitPan from './components/SplitPan/index.vue'
import ResourcePanel from './panel/ResourcePanel.vue'
import CanvasPanel from './components/CanvasPanel.vue'
import TimeLinePanel from "./components/TimeLine/TimeLinePanel.vue"
import RightPanel from "./panel/RightPanel.vue"
import ContentPanel from "./panel/ContentPanel.vue"
import PlayStatus from "./panel/PlayStatus.vue"
import PropsPanel from "./panel/PropsPanel/index.vue"
import LayerPanel from "./panel/LayerPanel.vue"
import Dialogs from "./panel/Dialogs.vue"

export default {
  name: 'ImageMaker',
  components: {
    TopBar,
    CanvasPanel,
    SplitPan,
    pane,
    NavMenus,
    ResourcePanel,
    TimeLinePanel,
    RightPanel,
    ContentPanel,
    PlayStatus,
    PropsPanel,
    LayerPanel,
    Dialogs
  },
  provide() {
    return {
      getCanvas: () => this.canvas, // 画布对象
      getTarget: () => this.currentObject, // 当前操作对象
      getEditMode: () => this.editMode, // 编辑模式
      waiting: bol => this.showWaiting = bol // 是否等待
    }
  },
  data() {
    return {
      resourceType: 'resource',
      canvas: null, // 画布对象
      timeLinePlayer, // 时间轴对象
      showWaiting: false, // 显示等待
      fullscreenTarget: null, // 全屏对象
      editMode: Const.EDIT_MODE.TEXT.key, // 编辑模式
      currentObject: null, // 当前选择的编辑对象
    }
  },
  computed: {
  },
  watch: {
    editMode(v) {
      // 如果是画笔，画布设置为可draw
      this.canvas.isDrawingMode = (v === Const.EDIT_MODE.PENCIL.key)
    }
  },
  mounted() {
    // 全屏对象
    this.fullscreenTarget = this.$refs.mainPanel
    // 注册快捷键
    imageHelper.registerKeyEvent(this.$refs.stage)
    // 设置时间轴对象
    imageHelper.timeLinePlayer = this.timeLinePlayer
  },

  methods: {
    name() {

    },

    onCanvasInitialized(canvas) {
      this.canvas = canvas
    }
  },
}
</script>

<style lang="scss" scoped>
@import "style/var";
$topHeight: 110px;

.main-panel {
  height: 100%;
  display: flex;
  background-color: white;

  * {
    user-select: none;
  }
  .nav-menu {
    width: 60px;
  }

  .main {
    display: flex;

    .left-panel {
      flex: 280px 0;
      border-left: $border;
    }

    .center-panel {
      flex: 1;
      border-left: $border;
      border-right: $border;
    }

    .right-panel {
      flex: 340px 0;

      .top {
        height: 340px;

        ::v-deep >.content {
          overflow-y: scroll;
          padding-bottom: 20px;
          height: calc(100% - 50px);
        }
      }
    }
  }
  .center-panel {
    .center-top-bar-panel {
      height: $topHeight!important;
    }
    .center-canvas-panel {
      height: calc(100% - #{$topHeight})!important;
    }
  }
}
</style>

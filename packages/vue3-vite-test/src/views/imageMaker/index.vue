<template>
  <div ref="mainPanel" v-loading="showWaiting" class="main-panel">
    <div class="nav-menu">
      <!--左侧菜单-->
      <NavMenus v-model:type="resourceType" />
    </div>
    <div class="main">
      <div class="left-panel">
        <!--资源面板-->
        <ResourcePanel :type="resourceType" />
      </div>
      <div class="center-panel">
        <SplitPan class="default-theme" horizontal @resize="onCanvasContainerResize">
          <pane class="center-center-panel">
            <div class="center-top-bar-panel">
              <!--顶部-->
              <TopBar ref="topBar" v-model:edit-mode="editMode" :full-screen-el="fullscreenTarget" />
            </div>
            <div class="center-canvas-panel">
              <!--舞台-->
              <CanvasPanel v-model:current-select-target="currentObject" @initialized="onCanvasInitialized" />
            </div>
          </pane>
          <pane class="center-bottom-panel" size="30">
            <!--中间面板-->
            <ContentPanel full-height bold title-height="40px">
              <template #title>
                <el-radio-group v-model="bottomActive" class="bottom-panel-switcher">
                  <el-radio-button v-if="gifMode" label="timeLine">时间轴</el-radio-button>
                  <el-radio-button label="effect">特效</el-radio-button>
                </el-radio-group>
              </template>
              <!--播放状态-->
              <template #titleRight><PlayStatus /></template>
              <!--时间轴-->
              <TimeLinePanel v-if="gifMode && bottomActive === 'timeLine'" style="height: 100%;" />
              <!--特效-->
              <FastEffectPanel v-if="bottomActive === 'effect'" style="height: 100%;" />
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
        <ContentPanel title="图层" full-height bold class="bottom">
          <LayerPanel style="height: 100%;" />
        </ContentPanel>
      </div>
    </div>

    <Dialogs />
  </div>
</template>

<script>
import { Const, imageHelper, timeLinePlayer } from 'ps-wasm-vue2'
import pane from './components/SplitPan/pane.vue'
import TopBar from './components/layout/TopBar.vue'
import NavMenus from './components/layout/NavMenus.vue'
import SplitPan from './components/SplitPan/index.vue'
import ResourcePanel from './panel/ResourcePanel.vue'
import CanvasPanel from './components/CanvasPanel.vue'
import TimeLinePanel from './components/TimeLine/TimeLinePanel.vue'
import ContentPanel from './panel/ContentPanel.vue'
import PlayStatus from './panel/PlayStatus.vue'
import PropsPanel from './panel/PropsPanel/index.vue'
import LayerPanel from './panel/LayerPanel.vue'
import Dialogs from './panel/Dialogs.vue'
import FastEffectPanel from './panel/FastEffectPanel.vue'

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
    FastEffectPanel,
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
      waiting: bol => this.showWaiting = bol, // 是否等待
      pushTip: msg => this.$refs.topBar.$refs.topTip.pushTip(msg) // 提示信息
    }
  },
  data() {
    return {
      bottomActive: 'effect', // 底部当前显示面板：时间轴、特效
      resourceType: 'resource', // 当前资源类型
      canvas: null, // 画布对象
      timeLinePlayer, // 时间轴对象
      showWaiting: false, // 显示等待
      fullscreenTarget: null, // 全屏对象
      editMode: Const.EDIT_MODE.MOVE.key, // 编辑模式
      currentObject: null, // 当前选择的编辑对象
    }
  },
  computed: {
    /**
     * 是否gif模式
     * @return {boolean}
     */
    gifMode() {
      return (this.canvas || {}).gifMode
    }
  },
  watch: {
    /**
     * 编辑模式修改
     * @param v
     */
    editMode(v) {
      // 如果是画笔，画布设置为可draw
      this.canvas.isDrawingMode = (v === Const.EDIT_MODE.PENCIL.key)
    },
    /**
     * gif模式修改
     * @param v
     */
    'gifMode'(v) {
      v && (this.bottomActive = 'timeLine')
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
    /**
     * 当canvas初始化
     * @param canvas
     */
    onCanvasInitialized(canvas) {
      this.canvas = canvas
    },

    /**
     * 舞台大小修改
     */
    onCanvasContainerResize() {
      imageHelper.refreshStageView()
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
      flex: 0;
      min-width: 280px;
      border-left: $border;
    }

    .center-panel {
      flex: 1;
      border-left: $border;
      border-right: $border;

      .center-bottom-panel {
        .bottom-panel-switcher {
          --el-border: none;
          --el-fill-color-blank: transparent;
          --el-text-color-regular: #999999;
          :deep(.is-active) .el-radio-button__inner {
            color: #333333;
            box-shadow: none;
            background-color: transparent;
          }
        }
      }
    }

    .right-panel {
      flex: 0;
      display: flex;
      min-width: 340px;
      overflow: hidden;
      flex-direction: column;
      .top {
        min-height: 340px;
        :deep(.content) {
          overflow-y: scroll;
          padding-bottom: 20px;
          height: calc(100% - 50px);
        }
      }
      .bottom {
        flex: 1;
        overflow: hidden;
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

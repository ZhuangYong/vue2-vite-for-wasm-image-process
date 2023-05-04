<template>
  <div ref="stage" class="stage">
    <waiting v-if="showWaiting" class="full-waiting" />
    <Dialogs />
    <el-container>
      <el-aside width="200px" class="left-function">
        <!--属性-->
        <el-tabs v-model="leftTopTab" type="card" class="left-function-tabs">
          <el-tab-pane label="属性" name="objectProps">
            <div class="target-info">
              <ObjectProps />
            </div>
          </el-tab-pane>
          <el-tab-pane label="画笔" name="pencilProps">
            <PencilModelPropertyPanel />
          </el-tab-pane>
        </el-tabs>

        <!--效果-->
        <el-tabs v-model="leftBottomTab" type="card" class="left-function-tabs">
          <el-tab-pane label="特效" name="fastEffect">
            <FastEffect @fabric-filter="onFabricFilter" />
          </el-tab-pane>
          <el-tab-pane label="动画" name="animate">
            <AnimatePanel />
          </el-tab-pane>
          <!--<el-tab-pane label="调整" name="ttttt">
            &#45;&#45;&#45;&#45;
          </el-tab-pane>-->
          <el-tab-pane label="图层" name="layer">
            <LayerPanel />
          </el-tab-pane>

        </el-tabs>
      </el-aside>

      <!--顶部菜单等-->
      <el-container>
        <el-header height="32px" class="operation-head">
          <div class="left-head">
            <OperationPanel :mode.sync="editMode" />
            <Menus />
          </div>
          <FullscreenButton :el="fullscreenTarget" />
        </el-header>

        <!--画布-->
        <el-main class="main-container">
          <!--<div class="main-stage-container" :class="mainStageClass">
            <CanvasPanel ref="canvasPanel" :current-select-target.sync="currentObject" @initialized="onCanvasInitialized" />
          </div>-->
          <CanvasPanel ref="canvasPanel" :current-select-target.sync="currentObject" @initialized="onCanvasInitialized" />
        </el-main>

        <!--底部贴纸-->
        <div class="bottom-container">
          <PlayStatus />
          <el-tabs v-model="activeResourceName" type="card" class="bottom-function-tabs">
            <el-tab-pane label="贴纸" name="stickers">
              <Stickers />
            </el-tab-pane>
            <el-tab-pane label="时间轴" name="time">
              <TimeLinePanel />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {fabric} from '@/lib/fabric.min'
import FastEffect from '@/components/panel/FastEffectPanel.vue'
import Stickers from '@/components/panel/StickersPanel.vue'
import ObjectProps from "@/components/panel/ObjectPropsPanel.vue"
import imageHelper, {defaultProps} from "@/utils/ImageHelper"
import OperationPanel from "@/components/panel/OperationPanel.vue"
import PencilModelPropertyPanel from "./components/panel/PencilModelPropertyPanel.vue"
import Menus from '@/components/Menus/index.vue'
import Const from "@/const";
import FullscreenButton from "@/components/buttons/FullscreenButton.vue"
import CanvasPanel from "@/components/panel/CanvasPanel.vue"
import LayerPanel from '@/components/panel/LayerPanel.vue'
import TimeLinePanel from "@/components/panel/TimeLinePanel.vue"
import Dialogs from '@/components/panel/Dialogs.vue'
import AnimatePanel from "@/components/panel/AnimatePanel.vue"
import Waiting from "@/components/Waiting.vue"
import PlayStatus from "@/components/panel/PlayStatus.vue"

export default {
  name: 'Stage',
  components: {
    Waiting,
    FastEffect,
    Stickers,
    ObjectProps,
    OperationPanel,
    PencilModelPropertyPanel,
    Menus,
    FullscreenButton,
    CanvasPanel,
    LayerPanel,
    TimeLinePanel,
    Dialogs,
    AnimatePanel,
    PlayStatus
  },
  provide() {
    return {
      getCanvas: () => this.canvas,
      getTarget: () => this.currentObject,
      // getTargetProps: () => this.targetProps,
      getEditMode: () => this.editMode,
      waiting: bol => this.showWaiting = bol
    }
  },
  data() {
    return {
      canvas: null,
      showWaiting: false,
      fullscreenTarget: null,
      editMode: Const.EDIT_MODE.MOVE.value, // 编辑模式
      // targetProps: defaultProps,
      currentObject: null, // 当前选择的编辑对象
      activeResourceName: 'time', // 选择的资源tabs
      leftBottomTab: 'layer',
      leftTopTab: 'objectProps'
    }
  },
  watch: {
    currentObject(target, pre) {
      // this.targetProps = imageHelper.watchTarget(target)
      if (target !== pre && !!target) {
        this.leftTopTab = 'objectProps'
        this.editMode = Const.EDIT_MODE.MOVE.value
      }
    }
  },
  mounted() {
    // 全屏对象
    this.fullscreenTarget = this.$refs.stage
    // 注册快捷键
    imageHelper.registerKeyEvent(this.$refs.stage)
  },
  computed: {
  },
  methods: {
    onFabricFilter(type) {
      switch (type) {
        case 'blur':
          const filter = new fabric.Image.filters.Blur({ webgl: false,
            blur: 0.5
          });
          this.currentObject.filters.push(filter)
          this.currentObject.applyFilters()
          imageHelper.canvas.renderAll()
      }
    },

    onCanvasInitialized(canvas) {
      this.canvas = canvas
    }

  }
}
</script>

<style lang="scss" scoped>
@mixin tabItem {
  ::v-deep .el-tabs__item {
    height: 22px;
    font-size: 12px;
    line-height: 22px;
  }
}
.stage {
  height: 100%;
  position: relative;
  user-select: none;
  background-color: white;
  border: 1px solid #dedede;
  .full-waiting {
    left: 0;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    cursor: wait;
    position: absolute;
    background: #3030300f;
  }
  .el-container {
    height: 100%;
  }
  ::v-deep {
    .el-tabs__header {
      margin-bottom: 6px;
    }
    .el-tabs__content {
      overflow: initial;
    }
  }
}
.main-container {
  padding: 8px;
  .main-stage-container {
    height: 100%;
  }
}
.target-info {
  height: 46%;
}
.left-function {
  border-right: 1px solid #dedede;
}
.left-function-tabs {
  padding-top: 12px;
  @include tabItem;
}
.bottom-function-tabs {
  padding-top: 0;
  @include tabItem;
}

.operation-head {
  display: flex;
  padding: 8px;
  margin-top: 4px;
  align-items: center;
  justify-content: space-between;
  .left-head {
    display: flex;
    align-items: center;
  }
  .operation-panel {
    margin-right: 8px;
  }
}
.el-footer {
  padding: 0 8px 6px 8px;
}
.import-file {
  display: inline-block;
}
.bottom-container {
  padding: 0 6px;
  position: relative;
  .play-status {
    top: 4px;
    left: 166px;
    z-index: 2;
    position: absolute;
  }
}
</style>

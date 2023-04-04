<template>
  <div ref="stage" class="stage">
    <!--<Dialogs />-->
    <el-container>
      <el-aside width="200px" class="left-function">
        <!--属性-->
        <el-tabs v-model="leftTopTab" type="card" class="left-function-tabs">
          <el-tab-pane label="属性" name="objectProps">
            <div class="target-info">
              <!--<ObjectPropsPanel />-->
            </div>
          </el-tab-pane>
          <el-tab-pane label="画笔" name="pencilProps">
            <PencilModelPropertyPanel />
          </el-tab-pane>
        </el-tabs>

        <!--效果-->
        <el-tabs v-model="leftBottomTab" type="card" class="left-function-tabs">
          <el-tab-pane label="特效" name="fastEffect">
            -----
            <!--<FastEffect @fabric-filter="onFabricFilter" />-->
          </el-tab-pane>
          <el-tab-pane label="调整" name="ttttt">
            ----
          </el-tab-pane>
          <el-tab-pane label="图层" name="layer">
            <LayerPanel />
          </el-tab-pane>

        </el-tabs>
        <!--<LayerPanel />-->
      </el-aside>

      <!--顶部菜单等-->
      <el-container>
        <!--<el-header height="32px" class="operation-head">
          <div class="left-head">
            -&#45;&#45;&#45;&#45;
            &lt;!&ndash;<OperationPanel :mode.sync="editMode" />
            <Menus />&ndash;&gt;
          </div>
          <FullscreenButton :el="fullscreenTarget" />
        </el-header>-->

        <!--画布-->
        <el-main class="main-container">
          <CanvasPanel ref="canvasPanel" v-model:current-select-target="currentObject" @initialized="onCanvasInitialized" />
        </el-main>

        <!--底部贴纸-->
        <el-footer height="70px">
          <el-tabs v-model="activeResourceName" type="card" class="bottom-function-tabs">
            <el-tab-pane label="贴纸" name="stickers">
              ------
              <StickersPanel />
            </el-tab-pane>
            <el-tab-pane label="-------" name="---">
              -------
            </el-tab-pane>
          </el-tabs>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { Const, ImageHelper, fabric } from "ps-wasm-vue2"
import CanvasPanel from "@/components/panel/CanvasPanel.vue"
import LayerPanel from '@/components/panel/LayerPanel.vue'
import StickersPanel from '@/components/panel/StickersPanel.vue'
import ObjectPropsPanel from '@/components/panel/ObjectPropsPanel.vue'

export default {
  name: 'Stage',
  components: { CanvasPanel, LayerPanel, StickersPanel, ObjectPropsPanel },
  provide() {
    return {
      getCanvas: () => this.canvas,
      getTarget: () => this.currentObject,
      getEditMode: () => this.editMode
    }
  },
  data() {
    return {
      canvas: null,
      fullscreenTarget: null,
      editMode: Const.EDIT_MODE.MOVE.value, // 编辑模式
      currentObject: null, // 当前选择的编辑对象
      activeResourceName: 'stickers', // 选择的资源tabs
      leftBottomTab: 'layer',
      leftTopTab: 'objectProps'
    }
  },
  watch: {
    currentObject(target, pre) {
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
    ImageHelper.registerKeyEvent(this.$refs.stage)
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
          ImageHelper.canvas.renderAll()
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
  background-color: white;
  border: 1px solid #dedede;
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
</style>

<template>
  <div class="top-bar">
    <div class="bar-line functions">
      <!--编辑模式-->
      <div class="edit-model bar-part left">
        <!--选择-->
        <el-link :underline="false" :class="{ active: editModes.MOVE.key === editMode }" title="选择" @click="changeEditMode(editModes.MOVE.key)">
          <el-icon size="16px">
            <Position style="transform: rotate(-90deg);" />
          </el-icon>
        </el-link>
        <!--画笔-->
        <el-link :underline="false" title="绘画" :class="{ active: editModes.PENCIL.key === editMode }" @click="changeEditMode(editModes.PENCIL.key)">
          <svg-icon name="editor-pencil" size="16px"/>
        </el-link>
        <!--文字-->
        <el-link :underline="false" title="文字" :class="{ active: editModes.TEXT.key === editMode }" @click="changeEditMode(editModes.TEXT.key)">
          <svg-icon name="editor-word" size="12px"/>
        </el-link>
      </div>

      <!--操作-->
      <div class="operator-list bar-part">
        <el-link :underline="false" :disabled="disabledBack" @click="operate(COMMAND_TYPES.EDIT.BACK.key)" title="撤销一步操作">
          <svg-icon name="editor-redo" size="16px" style="transform: rotateY(-180deg)" />
          <span>后撤</span>
        </el-link>
        <el-link :underline="false" :disabled="disabledRedo" @click="operate(COMMAND_TYPES.EDIT.REDO.key)" title="重做上一步操作">
          <svg-icon name="editor-redo" size="16px" />
          <span>重做</span>
        </el-link>
        <FullscreenButton :el="fullScreenEl" />
      </div>

      <!--按钮功能-->
      <div class="btn-list bar-part right">
        <el-button class="plain-green-light" @click="download">下载表情</el-button>
        <el-button class="plain-green-light" @click="favorite">收藏表情</el-button>
        <el-button class="plain-green-light" @click="apply">提交审核</el-button>
      </div>
    </div>

    <div class="bar-line detail">
      <el-form ref="form" class="bar-part left">
        <el-form-item label="表情名称：">
          <el-input v-model="detail.name" placeholder="请输入表情名称" />
        </el-form-item>

        <el-form-item label="背景颜色：">
          <ColorPicker v-model:color="backgroundColor" />
        </el-form-item>

        <el-form-item label="画布大小：">
          {{ canvasSize }}
        </el-form-item>
      </el-form>
    </div>

    <TopTip ref="topTip" />
  </div>
</template>

<script>
import _ from 'lodash'
import ColorPicker from '../ColorPicker.vue'
import FullscreenButton from '../buttons/FullscreenButton.vue'
import { Position } from '@element-plus/icons-vue'
import { Const, imageHelper, COMMAND_TYPES, BaseFabricComponent } from 'ps-wasm-vue2'
import TopTip from "../TopTip.vue"

export default {
  name: 'TopBar',
  mixins: [BaseFabricComponent],
  components: { Position, ColorPicker, FullscreenButton, TopTip },
  props: {
    /**
     * 全屏的对象
     * */
    fullScreenEl: {
      type: [Object, HTMLElement],
      default: () => ({})
    },
    /**
     * 当前编辑模式
     * */
    editMode: {
      type: String,
      default: Const.EDIT_MODE.MOVE.key,
      validator: v => [Const.EDIT_MODE.MOVE.key, Const.EDIT_MODE.PENCIL.key, Const.EDIT_MODE.TEXT.key].includes(v)
    }
  },
  data() {
    return {
      back: [],
      redo: [],
      COMMAND_TYPES,
      detail: { name: '' },
      backgroundColor: ''
    }
  },
  computed: {
    disabledBack() {
      return _.isEmpty(this.back)
    },

    disabledRedo() {
      return _.isEmpty(this.redo)
    },

    /**
     * 编辑模式
     * */
    editModes() {
      return Const.EDIT_MODE
    },

    canvasSize() {
      let { originWidth, originHeight } = this.canvas || {}
      return `${originWidth} * ${originHeight}`
    }
  },
  watch: {
    backgroundColor(v) {
      this.canvas.backgroundColor = v
      imageHelper.renderAll()
    },
  },
  created() {
    imageHelper.back = this.back
    imageHelper.redo = this.redo
  },
  mounted() {
    imageHelper.on('initialized', this.refreshBackgroundColor.bind(this))
    // imageHelper.on('object:modified', this.refreshProps)
    this.refreshBackgroundColor()
  },
  methods: {

    changeEditMode(mode) {
      // this.editMode = mode
      this.$emit('update:editMode', mode)
    },

    operate(command) {
      imageHelper.handleCommand(command, this.target)
    },

    /**
     * 下载
     */
    download() {
      //todo
    },

    /**
     * 收藏
     */
    favorite() {
      this.$refs.topTip.pushTip(`收藏成功, 您可稍后前往“我的-我的收藏”查看, 或者 <a href="#/bbbb"><font color="#009983">立即跳转</font></a>`)
    },

    /**
     * 提交审核
     */
    apply() {
      //todo
    },

    refreshBackgroundColor() {
      this.canvas && (this.backgroundColor = this.canvas.backgroundColor)
    },
    setBackgroundColor(v) {
      this.backgroundColor = v
      imageHelper.renderAll()
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../style";

$barHeight: 50px;
.top-bar {
  @include flex;
  flex-direction: column;
  background-color: white;

  .bar-line {
    @include flex;
    width: 100%;
    padding: 0 20px;
    height: $barHeight;
    justify-content: space-between;
    border-bottom: 1px solid #EBEEF5;

    &.detail {
      height: 60px;
      .bar-part .el-form-item {
        margin-right: 60px;
        white-space: nowrap;
      }
    }
    .bar-part {
      @include flex;
      flex: 33.333% 1;

      &.left {
        justify-content: flex-start;
      }

      &.right {
        justify-content: flex-end;
      }

      .el-form-item {
        margin: 0;
      }
    }

    .edit-model {
      $padding: 6px;
      $between: 20px - $padding;

      .el-link {
        border-radius: 2px;
        padding: $padding;
        margin-right: $between;
        &.active {
          background-color: #F3F5F7;
        }
      }
    }

    .operator-list {
      .el-link {
        font-size: 12px;
        margin: 0 20px;
        white-space: nowrap;
        ::v-deep span {
          margin-left: 4px;
        }
      }
    }

    .btn-list {
      .el-link {
        margin: 0 12px;
      }
    }
  }
}
</style>

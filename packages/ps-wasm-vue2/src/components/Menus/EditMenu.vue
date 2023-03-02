<template>
  <div class="menu-edit">
    <el-dropdown size="mini" trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        编辑<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="back">
          <span>撤销</span>
          <span>(ctrl + z)</span>
        </el-dropdown-item>
        <el-dropdown-item command="redo">
          <span>重做</span>
          <span>(ctrl + y)</span>
        </el-dropdown-item>
        <el-dropdown-item command="copy">
          <span>删除</span>
          <span>(del)</span>
        </el-dropdown-item>
        <el-dropdown-item command="copy">
          <span>复制</span>
          <span>(ctrl + c)</span>
        </el-dropdown-item>
        <el-dropdown-item command="paste">
          <span>粘贴</span>
          <span>(ctrl + v)</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import BaseFabricComponent from "../BaseFabricComponent"
import imageHelper from "../../ImageHelper"
import Canvas2Image from "../../CanvasToImage";

export default {
  name: 'EditMenu',
  mixins: [BaseFabricComponent],
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'export':
          this.onExport()
      }
    },
    onFileAdd(file) {
      imageHelper.uploadImage(file.raw)
    },
    onExport() {
      Canvas2Image.saveAsPNG(this.canvas.toCanvasElement(), this.width, this.height)
    }
  },
}
</script>

<style lang="scss" scoped>
.el-dropdown-link {
  font-size: 12px;
  cursor: pointer;
}
.el-dropdown-menu__item {
  span {
    &:last-child {
      margin-left: 8px;
      color: #999999;
    }
  }
}
</style>

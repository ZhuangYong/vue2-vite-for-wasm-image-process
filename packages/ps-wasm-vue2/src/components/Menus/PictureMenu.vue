<template>
  <div class="menu-edit">
    <el-dropdown size="mini" trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        图像<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="pictureSize">
          <span>图像大小…</span>
        </el-dropdown-item>
        <el-dropdown-item command="canvasSize">
          <span>画布大小…</span>
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

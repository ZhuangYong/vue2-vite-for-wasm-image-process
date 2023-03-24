<template>
  <div class="menu-file">
    <el-dropdown size="mini" trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        文件<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu :append-to-body="false" slot="dropdown">
        <el-dropdown-item command="new">新建</el-dropdown-item>
        <el-dropdown-item command="open">
          <el-upload action="" :auto-upload="false" :show-file-list="false" :on-change="onFileAdd" class="import-file">
            打开
          </el-upload>
        </el-dropdown-item>
        <el-dropdown-item :disabled="true" command="import">导入</el-dropdown-item>
        <el-dropdown-item command="export">导出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import BaseFabricComponent from "../BaseFabricComponent"
import imageHelper from "../../utils/ImageHelper"
import Canvas2Image from "../../utils/CanvasToImage"

export default {
  name: 'FileMenu',
  mixins: [BaseFabricComponent],
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'export':
          this.onExport()
          break
        case 'new':
          this.emit('new')
          break
      }
    },
    onFileAdd(file) {
      imageHelper.uploadImage(file.raw)
    },
    onExport() {
      const zoom = this.canvas.getZoom()
      this.canvas.setZoom(1)
      const width = this.canvas.originWidth || this.width
      const height = this.canvas.originHeight || this.height
      Canvas2Image.saveAsPNG(this.canvas.toCanvasElement(1, {width, height}), width, height)
      this.canvas.setZoom(zoom)
    }
  },
}
</script>

<style lang="scss" scoped>
.el-dropdown-link {
  font-size: 12px;
  cursor: pointer;
}
</style>

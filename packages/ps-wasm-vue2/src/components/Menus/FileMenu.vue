<template>
  <div class="menu-file">
    <el-dropdown size="mini" trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        文件<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu :append-to-body="false" slot="dropdown">
        <el-dropdown-item command="new">新建</el-dropdown-item>
        <el-dropdown-item command="open">
          <el-upload action="" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="onFileAdd" class="import-file">
            打开
          </el-upload>
        </el-dropdown-item>
        <el-dropdown-item command="import">
          <el-upload action="" :auto-upload="false" :show-file-list="false" :on-change="onImportJson" class="import-file">
            导入
          </el-upload>
        </el-dropdown-item>
        <el-dropdown-item command="export">导出</el-dropdown-item>
        <el-dropdown-item command="download">下载</el-dropdown-item>
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
        case 'new':
          this.emit('new')
          break
        case 'download':
          this.onDownload()
          break
        case 'export':
          this.onExport()
          break
      }
    },
    async onImportJson(file) {
      const text = await file.raw.text()
      imageHelper.importFromJson(text)
    },
    onFileAdd(file) {
      imageHelper.uploadImage(file.raw)
    },
    async onDownload() {
      this.waiting(true)
      await imageHelper.download()
      this.waiting(false)
    },
    onExport() {
      imageHelper.downloadJson()
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

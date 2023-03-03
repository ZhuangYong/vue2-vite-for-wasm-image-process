<template>
  <div class="menu-edit">
    <el-dropdown size="mini" trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        图像<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu :append-to-body="false" slot="dropdown">
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
import imageHelper from "../../utils/ImageHelper"

export default {
  name: 'PictureMenu',
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
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

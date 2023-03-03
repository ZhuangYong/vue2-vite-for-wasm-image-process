<template>
  <div class="menu-edit">
    <el-dropdown size="mini" trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        图层<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu :append-to-body="false" slot="dropdown">
        <el-dropdown-item command="new">
          <span>新建</span>
        </el-dropdown-item>
        <el-dropdown-item command="copy">
          <span>复制</span>
        </el-dropdown-item>
        <el-dropdown-item command="paste">
          <span>粘贴</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import BaseFabricComponent from "../BaseFabricComponent"
import imageHelper from "../../utils/ImageHelper"

export default {
  name: 'LayerMenu',
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

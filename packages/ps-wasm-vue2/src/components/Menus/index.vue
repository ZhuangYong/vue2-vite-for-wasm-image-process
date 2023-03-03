<template>
  <div class="menu-list">
    <FileMenu class="menu-item" />
    <EditMenu class="menu-item" />
    <PictureMenu class="menu-item" />
    <LayerMenu class="menu-item" />
  </div>
</template>

<script>
import FileMenu from "./FileMenu.vue"
import EditMenu from "./EditMenu.vue"
import LayerMenu from "./LayerMenu.vue"
import PictureMenu from "./PictureMenu.vue"
export default {
  components: { FileMenu, EditMenu, LayerMenu, PictureMenu},
  data() {
    return {
    }
  },
}
</script>

<style lang="scss" scoped>
.menu-list {
  display: flex;
  .menu-item {
    margin: 0 8px;
    ::v-deep {
      .el-dropdown-link {
        font-size: 12px;
        cursor: pointer;
        &:hover {
          color: #009987;
        }
      }
      .el-dropdown-menu__item {
        display: flex;
        white-space: nowrap;
        justify-content: space-between;
        span {
          &:nth-child(2) {
            color: #999999;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="menu-edit">
    <el-dropdown size="mini" trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        编辑<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item in editOptions" :key="item.key" :command="item.key">
          <span>{{ item.label }}</span>
          <span v-if="item.keyMap">({{ item.keyMap }})</span>
          <span v-else />
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import BaseFabricComponent from "../BaseFabricComponent"
import imageHelper, {COMMAND_TYPES} from "../../utils/ImageHelper"

export default {
  name: 'EditMenu',
  mixins: [BaseFabricComponent],
  data() {
    return {
      editOptions: Object.values(COMMAND_TYPES.EDIT)
    }
  },
  computed: {
    active() {
      return !!this.target
    }
  },
  methods: {
    handleCommand: imageHelper.handleCommand
  }

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

<template>
  <div class="resource-panel" :class="test">
    <el-input v-model="keyWord" class="search-input" placeholder="请输入搜索关键字">
      <template #prefix>
        <el-icon>
          <Search />
        </el-icon>
      </template>
    </el-input>
    <div class="category-list">
      <el-tag v-for="item in categoryList" :key="item.label" :class="{ active: category === item.key }"
              effect="dark" round @click="category = item.key">
        {{ item.label }}
      </el-tag>
    </div>

    <div class="resource-list" :class="`type-${type}`">
      <DraggableResourceItem v-for="item in resourceList" :key="item.key" :detail="{ type, ...item }" />
      <div v-for="index in resourceList.length % 3" :key="index" />
    </div>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import DraggableResourceItem from '../components/DraggableResourceItem.vue'
import {testCategory, testFontList, testImgList, testResourceList} from "../testData";

export default {
  name: 'ResourcePanel',
  components: { DraggableResourceItem, Search },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      keyWord: '', // 搜索关键字
      category: '', // 分类
      resourceList: [], // 资源列表
      categoryList: testCategory // 分类标签
    }
  },
  watch: {
    type: {
      handler(v) {
        switch (v) {
          case 'resource':
            return this.resourceList = testResourceList
          case 'image':
            return this.resourceList = testImgList
          case 'font':
            return this.resourceList = testFontList
          case 'mine':
            return this.resourceList = []
        }
      },
      immediate: true
    }
  },
  computed: {
    test() {
      return 'test computed'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../style/var";

$marginSize: 10px;
$itemSize: 80px;
.resource-panel {
  padding: $marginSize;

  .search-input {
    margin-bottom: $marginSize;
  }

  .el-tag {
    border: none;
    cursor: pointer;
    color: $secondaryColor;
    transition: all ease 0.2s;
    margin: 0 $marginSize $marginSize 0;
    background-color: $lightGrayBackgroundColor;

    &:hover,
    &.active {
      color: $activeColor;
      background-color: $backgroundHover;
    }
  }

  .resource-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    ::v-deep {
      .drag-item {
        display: flex;
        width: $itemSize;
        height: $itemSize;
        align-items: center;
        justify-content: center;
        margin-bottom: $marginSize;

        img {
          width: 100%;
          -webkit-user-drag: none;
        }
      }

      &.type-font {
        .drag-item {
          width: 125px;
          height: 60px;
          border: $border;
        }
      }
    }
  }
}
</style>

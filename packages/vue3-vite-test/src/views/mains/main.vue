<template>
  <el-container>
    <el-aside :style="iszhe?'width:65px':''" width="200px">
      <SideMenu @changeWidth="changeWidth"></SideMenu>
    </el-aside>
    <el-container>
      <el-header>

        <Head></Head>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>
        <Foot></Foot>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
  import Foot from '@/components/mains/Foot.vue'
  import Head from '@/components/mains/Head.vue'
  import SideMenu from '@/components/mains/SideMenu.vue'
  import { ref } from 'vue'
  import { useStore } from 'vuex'
  const store = useStore()
  const iszhe = ref(false)
  // store.dispatch('getUserInfoAsync')

  const changeWidth = (isZhedie) => {
    iszhe.value = isZhedie
  }
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #ccc;
}
.el-aside {
  background-color: #545c64;
  transition: 0.3s;
}
.el-footer {
  background-color: #ccc;
}
.el-aside {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
</style>

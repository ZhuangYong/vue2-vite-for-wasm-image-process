<template>
  <div class="sm">
    <div class="logo-box">
      <img :src="Logo" class="logo" alt="">
    </div>
    <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" :default-active="$route.path" text-color="#fff" unique-opened router :collapse="isZhedie" v-if="userInfo">
      <el-menu-item index="/home">
        <el-icon :size="16">
          <House />
        </el-icon>
        <span>首页</span>
      </el-menu-item>

      <!-- 成绩管理 -->
      <el-sub-menu index="/grade" v-if="userInfo.role==2">
        <template #title>
          <el-icon>
            <Tickets />
          </el-icon>
          <span>成绩管理</span>
        </template>
        <el-menu-item index="/grade/list">
          <el-icon>
            <Tickets />
          </el-icon>
          <span>成绩列表</span>
        </el-menu-item>
        <el-menu-item v-if="userInfo.role>1" index="/grade/set">
          <el-icon>
            <Tickets />
          </el-icon>
          <span>成绩打分</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 项目管理 -->
      <el-sub-menu index="/project" v-if="userInfo.role==1">
        <template #title>
          <el-icon>
            <FolderOpened />
          </el-icon>
          <span>项目管理</span>
        </template>
        <el-menu-item index="/project/create">
          <el-icon>
            <FolderOpened />
          </el-icon>
          <span>提交项目</span>
        </el-menu-item>
        <el-menu-item index="/project/my">
          <el-icon>
            <FolderOpened />
          </el-icon>
          <span>我的项目</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 权限 -->
      <el-sub-menu index="/role" v-if="userInfo.role>2">
        <template #title>
          <el-icon>
            <Lock />
          </el-icon>
          <span>权限管理</span>
        </template>
        <el-menu-item index="/role/list">
          <el-icon>
            <Lock />
          </el-icon>
          <span>权限列表</span>
        </el-menu-item>
        <el-menu-item index="/role/set">
          <el-icon>
            <Lock />
          </el-icon>
          <span>权限设置</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 意见 -->
      <el-sub-menu index="/advise">
        <template #title>
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span>意见管理</span>
        </template>
        <el-menu-item index="/advise/list">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span>意见列表</span>
        </el-menu-item>
        <el-menu-item index="/advise/add">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span>意见添加</span>
        </el-menu-item>
        <el-menu-item index="/advise/data" v-if="userInfo.role>1">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span>意见分析</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 教务 -->
      <el-sub-menu index="/edu" v-if="userInfo.role>2">
        <template #title>
          <el-icon>
            <Message />
          </el-icon>
          <span>教务管理</span>
        </template>
        <el-menu-item index="/edu/xueke">
          <el-icon>
            <Message />
          </el-icon>
          <span>学科管理</span>
        </el-menu-item>
        <el-menu-item index="/edu/class">
          <el-icon>
            <Message />
          </el-icon>
          <span>班级管理</span>
        </el-menu-item>
        <el-menu-item index="/edu/xm">
          <el-icon>
            <Message />
          </el-icon>
          <span>学科项目管理</span>
        </el-menu-item>
        <el-menu-item index="/edu/fenban">
          <el-icon>
            <Message />
          </el-icon>
          <span>学员分班</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 公告  -->
      <el-sub-menu index="/anno">
        <template #title>
          <el-icon>
            <Bell />
          </el-icon>
          <span>公告管理</span>
        </template>
        <el-menu-item index="/anno/add" v-if="userInfo.role>1">
          <el-icon>
            <Bell />
          </el-icon>
          <span>公告新增</span>
        </el-menu-item>
        <el-menu-item index="/anno/list">
          <el-icon>
            <Bell />
          </el-icon>
          <span>公告列表</span>
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/mine">
        <el-icon>
          <User />
        </el-icon>
        <span>个人中心</span>
      </el-menu-item>
    </el-menu>
  </div>
  <div class="zhedie">
    <span @click="isZhe">|||</span>
  </div>
</template>

<script setup>
  import Logo from '@/assets/images/logo.png'
  import {
    Avatar,
    Lock,
    Phone,
    Message,
    House,
    User,
    Bell,
    ChatDotRound,
    FolderOpened,
    Tickets,
  } from '@element-plus/icons-vue'
  import { useStore } from 'vuex'
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  const store = useStore()
  const router = useRouter()
  const userInfo = computed(() => store.state.userInfo)
  let isZhedie = ref(false)
  onMounted(() => {})
  const emit = defineEmits(['changeWidth'])
  const isZhe = () => {
    isZhedie.value = !isZhedie.value
    emit('changeWidth', isZhedie.value)
  }
</script>

<style lang="scss" >
.el-menu {
  border: none;
}
.sm {
  font: 1px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.sm::-webkit-scrollbar {
  width: 0;
  background: none;
}
.zhedie {
  color: #fff;
  font-size: 14px;
  background-color: #545c64;
  height: 40px;
  line-height: 40px;
  flex-shrink: 0;
  text-align: center;
  box-shadow: -2px 0 2px 1px #1f2124;
  span {
    letter-spacing: 2px;
    cursor: pointer;
  }
}
.myside {
  height: 100vh;
  overflow: auto;
  background: #545c64;
  .logo-box {
    padding: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    .smimg {
      width: 50px;
      height: 50px;
    }
  }
}
.logo {
  border-radius: 50%;
  margin: auto;
  width: 50px;
  height: 50px;
}
.logo-box {
  margin: 20px 0;
}
</style>

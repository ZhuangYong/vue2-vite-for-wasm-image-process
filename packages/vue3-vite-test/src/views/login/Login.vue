<template>
  <div class="login">
    <div class="login-box">
      <h2 class="title">千锋成绩管理系统</h2>
      <div class="box">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="用户名登录" name="username">
            <LoginByName ref="info" />
          </el-tab-pane>
          <el-tab-pane label="手机号登录" name="phone">
            <LoginByPhone ref="phone" />
          </el-tab-pane>
        </el-tabs>
        <div class="lastitem">
          <el-button type="success" @click="submitForm" class="btnblock">登录</el-button>
          <el-button type="danger" @click="resetForm" class="btnblock">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import LoginByName from '@/components/login/LoginByName.vue'
  import LoginByPhone from '@/components/login/LoginByPhone.vue'
  import { ref } from 'vue'
  let activeName = ref('username')
  let info = ref()
  let phone = ref()
  const resetForm = () => {
    if (activeName.value == 'username') {
      info.value.resetFields()
    } else {
      phone.value.resetFields()
    }
  }
  const submitForm = () => {
    if (activeName.value == 'username') {
      info.value.submitForm()
    } else {
      phone.value.submitForm()
    }
  }
</script>

<style lang="scss" scoped>
.btnblock {
  width: 100%;
  margin: 10px 0 0 0;
}
</style>

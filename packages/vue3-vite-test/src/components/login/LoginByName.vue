<template>
  <div class="box">
    <el-form label-position="left" class="myform" status-icon :model="loginInfo" ref="myForm" :rules="rules">
      <el-form-item label="用户名称" prop="username">
        <el-input :prefix-icon="User" v-model="loginInfo.username" type="text" placeholder="请输入用户名" autocomplete="off" />
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input :prefix-icon="Key" show-password v-model="loginInfo.password" type="password" placeholder="请输入密码" autocomplete="off" />
      </el-form-item>
      <el-form-item class="lastitem">
        <div class="alinks">
          <router-link to="/register" class="litem color">无账号,去注册</router-link>
          <router-link :to="{name:'findpass'}" class="litem bg">找回密码</router-link>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue'
  import { Key, User } from '@element-plus/icons-vue'
  import { reg } from '@/utils/validate.js'
  import { login1 } from '@/api'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  const loginInfo = reactive({})
  const myForm = ref()

  const router = useRouter()

  const resetFields = () => {
    myForm.resetFields()
  }

  const submitForm = () => {
    myForm.value.validate((valid) => {
      if (valid) {
        // const res = await login1(loginInfo)
        // if (res.code == 200) {
          sessionStorage.setItem('authToken', 'res.token')
          router.push('/main')
        // }
      } else {
        ElMessage.error('请输入正确的信息')
      }
    })
  }

  const rules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 8, message: '请输入3~8位字符', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        pattern: reg.pwd,
        message: '请输入6~18位数组字母的密码',
        trigger: 'blur',
      },
    ],
  }
  defineExpose({
    resetFields,
    submitForm,
  })
</script>

<style lang="scss" scoped>
</style>

<template>
  <div class="login">
    <div class="login-box">
      <h2 class="title">欢迎注册(学员)</h2>
      <div class="box">
        <el-form label-position="left" class="myform" status-icon :model="form" ref="myForm" :rules="rules">
          <el-form-item label="用户名称" prop="username">
            <el-input :prefix-icon="User" v-model="form.username" type="text" placeholder="请输入用户名" autocomplete="off" />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input :prefix-icon="Iphone" v-model="form.phone" type="text" placeholder="请输入手机号" autocomplete="off" />
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input :prefix-icon="Key" @blur="checkdbpass" show-password v-model="form.password" type="password" placeholder="请输入密码" autocomplete="off" />
          </el-form-item>
          <el-form-item label="确认密码" prop="dbpass">
            <el-input :prefix-icon="Key" show-password v-model="form.dbpass" type="password" placeholder="请确认密码" autocomplete="off" />
          </el-form-item>

          <el-form-item class="lastitem">
            <div class="alinks">
              <router-link to="/login" class="litem color">已有账号,去登录</router-link>
              <router-link :to="{name:'findpass'}" class="litem bg">找回密码</router-link>
            </div>
          </el-form-item>

          <el-form-item class="lastitem">
            <el-button type="success" @click="submitForm" class="btnblock">注册</el-button>
            <el-button type="danger" @click="resetForm" class="btnblock">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { Iphone, Key, User } from '@element-plus/icons-vue'
  import { reg } from '@/utils/validate.js'
  import { register } from '@/api/index.js'
  const myForm = ref()
  const form = reactive({})
  const router = useRouter()

  const checkPassEqual = (rule, value, callback) => {
    if (reg.pwd.test(form.password)) {
      if (form.password === form.dbpass) {
        callback()
      } else {
        callback(new Error('两次密码不一致'))
      }
    } else {
      myForm.value.validateField('password')
      callback()
    }
  }

  const rules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 8, message: '请输入3~8位字符', trigger: 'blur' },
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: reg.phone, message: '请输入合法的手机号', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        pattern: reg.pwd,
        message: '请输入6~18位数组字母的密码',
        trigger: 'blur',
      },
    ],
    dbpass: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        pattern: reg.pwd,
        message: '请输入6~18位数组字母的密码',
        trigger: 'blur',
      },
      { validator: checkPassEqual, trigger: 'blur' },
    ],
  }

  const checkdbpass = () => {
    if (reg.pwd.test(form.dbpass) && reg.pwd.test(form.password)) {
      myForm.value.validateField('dbpass')
    }
  }

  const resetForm = () => {
    myForm.value.resetFields()
  }

  const submitForm = () => {
    myForm.value.validate(async (valid) => {
      if (valid) {
        const res = await register(form)
        if (res.code == 200) {
          router.push('/login')
        }
      } else {
        ElMessage.error('请输入正确的信息')
      }
    })
  }
</script>

<style lang="scss" scoped>
</style>

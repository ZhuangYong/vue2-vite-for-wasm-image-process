<template>
  <div class="login">
    <div class="login-box">
      <h2 class="title">找回密码</h2>
      <div class="box">
        <el-form label-position="left" class="myform" status-icon :model="form" ref="myForm" :rules="rules">
          <el-form-item label="手机号码" prop="phone">
            <el-input :prefix-icon="Phone" v-model="form.phone" type="text" placeholder="请输入手机号" autocomplete="off" />
          </el-form-item>
          <el-form-item label="验证码" prop="captcha" :label-width="80">
            <el-row>
              <el-col :span="13">
                <el-input :prefix-icon="Message" v-model="form.captcha" type="text" placeholder="请输入验证码" autocomplete="off" />
              </el-col>
              <el-col :span="10" :offset="1">
                <el-button type="warning" :disabled="disabled" v-if="flag" @click="emitCaptcha">发送验证码</el-button>
                <el-button type="info" disabled v-else>倒计时 {{ time }} S
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="修改密码" prop="password">
            <el-input :prefix-icon="Lock" show-password v-model="form.password" type="password" placeholder="请输入密码" autocomplete="off" />
          </el-form-item>
          <el-form-item label="确认密码" prop="dbpass">
            <el-input :prefix-icon="Lock" show-password v-model="form.dbpass" type="password" placeholder="请输入密码" autocomplete="off" />
          </el-form-item>

          <el-form-item class="lastitem">
            <div class="alinks">
              <router-link to="/register" class="litem color">没有账号,去注册</router-link>
              <router-link to="/login" class="litem color">记得密码,去登录</router-link>
            </div>
          </el-form-item>

          <el-form-item class="lastitem">
            <el-button type="success" @click="submitForm" class="btnblock">确认修改</el-button>
            <el-button type="danger" @click="resetForm" class="btnblock">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import { reg } from '@/utils/validate.js'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { sentcaptcha, findpass } from '@/api'
  import { Phone, Message, Lock } from '@element-plus/icons-vue'
  const myForm = ref()
  const form = reactive({})
  const router = useRouter()
  const flag = ref(true)
  const time = ref(60)
  // 计算属性
  const disabled = computed(() => !reg.phone.test(form.phone))
  let timer = null
  // 倒计时函数
  const timeDown = () => {
    flag.value = false
    time.value--
    timer = setInterval(() => {
      if (time.value > 0) {
        time.value--
      } else {
        clearInterval(timer)
        timer = null
        flag.value = true
        time.value = 60
      }
    }, 1000)
  }

  const emitCaptcha = () => {
    const res = sentcaptcha({ phone: form.phone })
    // if (res.code != 200) {
    //   return
    // }
    flag.value = false
    timer = setInterval(() => {
      if (time.value > 0) {
        time.value--
      } else {
        flag.value = true
        setInterval(timer)
        time.value = 120
      }
    }, 1000)
  }

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

  const rules = reactive({
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: reg.phone, message: '请输入有效的手机号', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        pattern: reg.pwd,
        message: '请输入6-16位数字加字母组合的密码',
        trigger: 'blur',
      },
    ],
    captcha: [
      { required: true, message: '请输入验证码', trigger: 'blur' },
      { pattern: reg.code, message: '请输入4位数字验证码', trigger: 'blur' },
    ],
    dbpass: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        pattern: reg.pwd,
        message: '请输入6-16位数字加字母组合的密码',
        trigger: 'blur',
      },
      { validator: checkPassEqual, trigger: 'blur' },
    ],
  })

  //提交按钮
  const submitForm = () => {
    myForm.value.validate(async (valid) => {
      if (valid) {
        // 校验通过
        let res = await findpass({
          phone: form.phone,
          newPassword: form.password,
          captcha: form.captcha,
        })
        if (res.code == 200) {
          // 校验验证码成功后把新密码传给服务器
          router.push('/login')
        }
      } else {
        // 校验失败
        ElMessage.error('正则校验失败,请重新输入')
      }
    })
  }

  // 重置按钮
  const resetForm = () => {
    myForm.value.resetFields()
  }

  // 发送验证码
</script>

<style scoped>
</style>

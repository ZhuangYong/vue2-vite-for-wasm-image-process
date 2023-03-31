<template>
  <div class="box">
    <el-form label-position="left" class="myform" status-icon :model="form" ref="refForm" :rules="rules">
      <el-form-item label="手机号" prop="phone">
        <el-input :prefix-icon="Phone" v-model="form.phone" type="text" placeholder="请输入手机号" autocomplete="off" />
      </el-form-item>
      <el-form-item label="验证码" prop="captcha">
        <el-row>
          <el-col :span="13">
            <el-input :prefix-icon="Message" v-model="form.captcha" type="text" placeholder="请输入验证码" autocomplete="off" />
          </el-col>
          <el-col :span="10" :offset="1">
            <el-button type="warning" v-if="flag" :disabled="disabled" @click="emitCaptcha">发送验证码</el-button>
            <el-button type="info" v-else disabled>倒计时 {{time}} S </el-button>
          </el-col>
        </el-row>
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
  import { reactive, ref, computed } from 'vue'
  import { reg } from '@/utils/validate.js'
  import { Message, Phone } from '@element-plus/icons-vue'
  import { sentcaptcha, login2 } from '@/api'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  const form = ref({})
  let flag = ref(true)
  let time = ref(120)
  const refForm = ref(null)
  let timer = null
  const router = useRouter()

  const rules = reactive({
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: reg.phone, message: '请输入合法的手机号', trigger: 'blur' },
    ],
    captcha: [
      { required: true, message: '请输入验证码', trigger: 'blur' },
      { pattern: reg.code, message: '请输入4位数字验证码', trigger: 'blur' },
    ],
  })

  const resetFields = () => {
    refForm.value.resetFields()
  }

  const submitForm = () => {
    refForm.value.validate(async (valid) => {
      if (valid) {
        const res = await login2(form.value)
        if (res.code == 200) {
          sessionStorage.setItem('authToken', res.token)
          router.push('/main')
        }
      } else {
        ElMessage.error('请输入正确的信息')
      }
    })
  }

  const disabled = computed(() => !reg.phone.test(form.value.phone))

  const emitCaptcha = () => {
    const res = sentcaptcha({ phone: form.value.phone })
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
  defineExpose({
    resetFields,
    submitForm,
  })
</script>

<style scoped>
</style>
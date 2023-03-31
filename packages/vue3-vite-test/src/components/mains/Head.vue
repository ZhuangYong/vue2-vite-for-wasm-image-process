<template>
  <div class="head">
    <el-row>
      <el-col :span="8" class="flexcenter">
        <h2 class="title">
          -----------------
        </h2>
      </el-col>
      <el-col :span="8" class="flexcenter">
        <div class="info" v-if="userInfo">
          <el-dropdown @command="handleCommand">
            <span class="uname">
              {{userInfo.username}}
              <el-icon :size="16">
                <ArrowDown class="arrow" />
              </el-icon>
            </span>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="home">首页</el-dropdown-item>
                <el-dropdown-item command="mine">个人中心</el-dropdown-item>
                <el-dropdown-item command="advise">意见</el-dropdown-item>
                <el-dropdown-item divided command="password">修改密码</el-dropdown-item>
                <el-dropdown-item divided command="exit">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-tag :color="roleList.find(item=>item.role==userInfo.role).color" class="role ml10" effect="dark"> {{roleList.find(item=>item.role==userInfo.role).label  }} </el-tag>
          <Avatar></Avatar>
        </div>
      </el-col>
    </el-row>

    <el-dialog v-model="show" title="修改密码" width="30%">
      <el-form label-position="left" class="myform" status-icon :model="form" ref="myForm" :rules="rules">

        <el-form-item label="登录密码" prop="password">
          <el-input :prefix-icon="Key" show-password v-model="form.password" type="password" placeholder="请输入登录密码" autocomplete="off" />
        </el-form-item>
        <el-form-item label="修改密码" prop="editpwd">
          <el-input :prefix-icon="Key" show-password v-model="form.editpwd" type="password" placeholder="请输入修改密码" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="dbpass">
          <el-input :prefix-icon="Key" show-password v-model="form.dbpass" type="password" placeholder="请确认密码" autocomplete="off" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="closeDialog">取消</el-button>
          <el-button type="danger" @click="submitForm">确认修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import Avatar from '@/components/mains/Avatar.vue'
  import { useStore } from 'vuex'
  import { computed, reactive, ref } from 'vue'
  import roleList from '@/utils/roleList.js'
  import { ArrowDown, Key } from '@element-plus/icons-vue'
  import { reg } from '@/utils/validate.js'
  import { changepwd } from '@/api'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const store = useStore()
  const form = reactive({})
  const myForm = ref(null)
  const userInfo = computed(() => store.state.userInfo)
  let show = ref(false)
  const handleCommand = (command) => {
    if (command == 'password') {
      show.value = true
    } else if (command == 'exit') {
      ElMessageBox.confirm('是否要退出登录？', '提示', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          sessionStorage.removeItem('authToken')
          store.commit('getuserinfo', null)
          router.replace('/login')
          ElMessage({
            type: 'success',
            message: '退出成功',
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消退出',
          })
        })
    }
  }

  const checkPassEqual = (rule, value, callback) => {
    if (reg.pwd.test(form.editpwd)) {
      if (form.editpwd === form.dbpass) {
        callback()
      } else {
        callback(new Error('两次密码不一致'))
      }
    } else {
      myForm.value.validateField('editpwd')
      callback()
    }
  }

  const submitForm = () => {
    myForm.value.validate(async (valid) => {
      if (valid) {
        const res = await changepwd({
          password: form.password,
          newPassword: form.editpwd,
        })
        if (res.code == 200) {
          sessionStorage.removeItem('authToken')
          store.commit('getuserinfo', null)
          router.replace('/login')
        }
        show.value = false
      } else {
        ElMessage.error('请输入正确的信息')
      }
    })
  }

  const isPasswordEqual = (rule, value, callback) => {
    if (reg.pwd.test(form.password)) {
      if (form.editpwd == form.password) {
        callback(new Error('修改的密码不能和之前的密码一样'))
      } else {
        callback()
      }
    } else {
      myForm.value.validateField('password')
      callback()
    }
  }

  const closeDialog = () => {
    show.value = false
    myForm.value.resetFields()
  }

  const rules = {
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        pattern: reg.pwd,
        message: '请输入6~18位数组字母的密码',
        trigger: 'blur',
      },
    ],
    editpwd: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        pattern: reg.pwd,
        message: '请输入6~18位数组字母的密码',
        trigger: 'blur',
      },
      { validator: isPasswordEqual, trigger: 'blur' },
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
</script>

<style lang="scss" scoped>
.head {
  .flexcenter {
    display: flex;
    align-items: center;
    height: 60px;
  }
  .title {
    color: orangered;
    font-weight: bold;
    font-size: 18px;
  }
  .sitem {
    margin: 0 5px;
    color: darkorange;
    font-size: 14px;
  }
  .info {
    padding-left: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    .ml10 {
      margin-left: 10px;
    }
    .uname {
      display: flex;
      align-items: center;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>

<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>提交项目</el-breadcrumb-item>
    </el-breadcrumb>
    <h2 class="ban" v-if="banji._id">{{banji.banji}}-{{banji.xk[0].title}}班</h2>

    <div v-if="userInfo?.banji">
      <el-row class="mt10">
        <el-col :span="24">
          <el-table :data="showList" border style="width: 100%" center>
            <el-table-column label="序号" type="index" width="180" align="center"></el-table-column>
            <el-table-column label="项目类别" prop="name" align="center"></el-table-column>
            <el-table-column label="项目要求" prop="desc" align="center"></el-table-column>
            <el-table-column label="所属学科" align="center">
              {{banji.xk[0].title}}
            </el-table-column>
            <el-table-column label="项目状态" width="180" align="center" #default="scoped">
              <div v-if="xmlist.some(item=>item.xm ==scoped.row._id)">
                <el-tag>已提交</el-tag>
              </div>
              <div v-else>
                <el-button @click="submitxm(scoped.row)" size="small">点击提交</el-button>
              </div>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total" />

      <el-dialog v-model=" show" title="项目提交" width="30%" :before-close="handleClose">
        <div>
          <el-form label-position="left" class="myform" :model="form" ref="uform" size="default" :rules="rules">
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="form.name" type="text" placeholder="请输入项目名称" autocomplete="off" />
            </el-form-item>
            <el-form-item label="线上地址" prop="dizhi">
              <el-input v-model="form.dizhi" type="text" placeholder="请输入项目线上地址" autocomplete="off" />
            </el-form-item>
            <el-form-item label="项目介绍" prop="jieshao">
              <el-input v-model="form.jieshao" type="textarea" placeholder="请介绍你的项目" autocomplete="off" />
            </el-form-item>
            <el-form-item label="项目文件上传">
              <el-upload :on-error="uploadError" :on-success="uploadSuccess" ref="upload" :action="url" :limit="1" :auto-upload="true" :on-exceed="handleExceed" :headers="headers">
                <el-button type="primary">选择文件</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="info" @click="handleClose">取消</el-button>
            <el-button type="danger" @click="addxm">提交项目</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div v-else>
      未加入班级，请联系管理员进行修改
    </div>
  </div>

</template>

<script setup>
  import { computed, reactive, toRefs, ref, watch } from 'vue'
  import { getbanji, getxm, getxmlistbyuser, addxmlist } from '@/api'
  import { baseURL } from '@/api/request.js'
  import { useStore } from 'vuex'
  import { ElMessage } from 'element-plus'
  const store = useStore()
  const state = reactive({
    banji: {},
    xlist: [],
    form: {},
    xmlist: [],
  })
  let url = computed(() => baseURL + 'api/uploadproject')
  let headers = { token: sessionStorage.getItem('authToken') }
  let show = ref(false)
  let uform = ref(true)
  let upload = ref()
  let currentrow = {}
  const userInfo = computed(() => store.state.userInfo)

  let currentPage = ref(1)
  let pageSize = ref(5)
  let total = computed(() => state.xlist.length)

  let showList = computed(() =>
    state.xlist.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
  )

  const rules = {
    name: [{ required: true, message: '请输入项目类别', trigger: 'blur' }],
    jieshao: [{ required: true, message: '请选择所属学科', trigger: 'blur' }],
    dizhi: [{ required: true, message: '请输入项目要求', trigger: 'blur' }],
  }

  const addxm = () => {
    if (!state.form.xmwj) {
      ElMessage.error('请提交项目文件')
      return
    }
    uform.value.validate(async (valid) => {
      if (valid) {
        const res = await addxmlist({
          ...state.form,
          xm: currentrow._id,
          banji: userInfo.value.banji,
          user: userInfo.value._id,
        })
        if (res.code == 200) {
          handleClose()
          getuersxm()
        }
      } else {
        ElMessage.error('请输入完整信息')
      }
    })
  }

  const submitxm = (row) => {
    show.value = true
    currentrow = { ...row }
    console.log(currentrow)
  }

  const handleClose = () => {
    uform.value.resetFields()
    state.form = {}
    show.value = false
  }
  const handleExceed = () => {
    ElMessage.error('只支持上传一个文件，请打包上传')
  }
  const uploadSuccess = (res) => {
    if (res.code == 200) {
      state.form.xmwj = res.path
    }
  }
  const uploadError = (err) => {
    ElMessage.error('上传失败，请重新上传')
  }
  const getbj = async () => {
    const res = await getbanji()
    if (res.code == 200) {
      state.banji = res.result.find((item) => item._id == userInfo.value.banji)
      getxiangmu()
      getuersxm()
    }
  }
  const getxiangmu = async () => {
    const res = await getxm({ xueke: state.banji.xueke })
    if (res.code == 200) {
      state.xlist = res.result
    }
  }
  const getuersxm = async () => {
    const res = await getxmlistbyuser({ user: userInfo.value._id })
    if (res.code == 200) {
      state.xmlist = res.result
    }
  }
  watch(
    userInfo,
    (value) => {
      if (value) {
        getbj()
      }
    },
    { immediate: true }
  )
  // getbj()
  const { banji, xlist, form, xmlist } = toRefs(state)
</script>

<style lang="scss" scoped>
.el-tag {
  width: 72px;
  height: 26px;
}
.ban {
  margin: 20px 0;
}
</style>
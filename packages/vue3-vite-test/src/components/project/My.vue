<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的项目</el-breadcrumb-item>
    </el-breadcrumb>

    <div v-if="userInfo?.banji">

      <el-row class="mt10">
        <el-col :span="24">
          <el-table :data="showList" border style="width: 100%" center>
            <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
            <el-table-column label="项目名称" prop="name" align="center"></el-table-column>
            <el-table-column label="项目介绍" prop="jieshao" align="center"></el-table-column>
            <el-table-column label="线上地址" prop="dizhi" align="center"></el-table-column>
            <el-table-column label="项目类别" align="center">
              <template #default="scoped">
                {{(xmlist.find(item=>item._id == scoped.row.xm))?.name}}
              </template>
            </el-table-column>
            <el-table-column label="项目要求" align="center">
              <template #default="scoped">
                {{(xmlist.find(item=>item._id == scoped.row.xm))?.desc}}
              </template>
            </el-table-column>
            <el-table-column label="项目分数" align="center">
              <template #default="scoped">
                <div v-if="!scoped.row.fenshu">
                  待批改~
                </div>
                <div v-else>
                  <el-tag :type="dengji[scoped.row.fenshu].type">{{dengji[scoped.row.fenshu].desc}}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="项目评述" align="center">
              <template #default="scoped">
                {{scoped.row.pinjia||'待评述~'}}
              </template>
            </el-table-column>
            <el-table-column label="项目查看" align="center">
              <template #default="scoped">
                <a target="_blank" :href="baseURL+scoped.row.xmwj.replace('public','')">下载</a>
              </template>
            </el-table-column>
            <el-table-column label="项目操作" align="center">
              <template #default="scoped">
                <el-popconfirm title="你真的打算删除这个数据吗?" @confirm="confirmdelete(scope.row)">
                  <template #reference>
                    <el-button type="danger" :disabled="scoped.row.fenshu" size="small">删除</el-button>
                  </template>
                </el-popconfirm>
                <el-button type="info" :disabled="scoped.row.fenshu" size="small" @click="updateItem(scoped.row)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total" />

      <el-dialog v-model=" show" title="修改项目" width="30%" :before-close="handleClose">
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
            <el-form-item label="修改项目文件">
              <el-upload :on-error="uploadError" :on-success="uploadSuccess" ref="upload" :action="url" :limit="1" :auto-upload="true" :on-exceed="handleExceed" :headers="headers">
                <el-button type="primary">选择文件</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="info" @click="handleClose">取消</el-button>
            <el-button type="danger" @click="exitxm">修改项目</el-button>
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
  import { computed, reactive, ref, toRefs, watch } from 'vue'
  import { useStore } from 'vuex'
  import { getxmlistbyuser, getxm, deluserxm, updataxmlist } from '@/api'
  import { baseURL } from '@/api/request'
  import { ElMessage } from 'element-plus'
  const store = useStore()
  const userInfo = computed(() => store.state.userInfo)
  let show = ref(false)
  let uform = ref()
  let url = computed(() => baseURL + 'api/uploadproject')
  let headers = { token: sessionStorage.getItem('authToken') }
  const dengji = {
    1: {
      type: 'info',
      desc: 'E',
    },
    2: {
      type: 'success',
      desc: 'D',
    },
    3: {
      type: 'warning',
      desc: 'C',
    },
    4: {
      type: '',
      desc: 'B',
    },
    5: {
      type: 'danger',
      desc: 'A',
    },
  }
  const rules = {
    name: [{ required: true, message: '请输入项目类别', trigger: 'blur' }],
    jieshao: [{ required: true, message: '请选择所属学科', trigger: 'blur' }],
    dizhi: [{ required: true, message: '请输入项目要求', trigger: 'blur' }],
  }
  const state = reactive({
    myxm: [],
    xmlist: [],
    form: {},
  })

  let currentPage = ref(1)
  let pageSize = ref(5)
  let total = computed(() => state.myxm.length)

  let showList = computed(() =>
    state.myxm.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
  )
  const exitxm = () => {
    if (!state.form.xmwj) {
      ElMessage.error('请提交项目文件')
      return
    }
    uform.value.validate(async (valid) => {
      if (valid) {
        const res = await updataxmlist(state.form)
        if (res.code == 200) {
          handleClose()
          getmyxm()
        }
      } else {
        ElMessage.error('请输入完整信息')
      }
    })
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
  const updateItem = (row) => {
    show.value = true
    state.form = { ...row }
  }
  const confirmdelete = async (row) => {
    const res = await deluserxm({ user: userInfo._id, xm: row.xm })
    if (res.code == 200) {
      getmyxm()
    }
  }
  const getmyxm = async () => {
    const res = await getxmlistbyuser({ user: userInfo._id })
    if (res.code == 200) {
      state.myxm = res.result
    }
  }
  const getxms = async () => {
    const res = await getxm()
    if (res.code == 200) {
      state.xmlist = res.result
    }
  }
  watch(
    userInfo,
    (value) => {
      if (value) {
        getmyxm()
      }
    },
    { immediate: true }
  )
  // getmyxm()
  getxms()
  const { myxm, xmlist, form } = toRefs(state)
</script>

<style lang="scss" scoped>
.el-table {
  margin: 20px 0;
}
</style>
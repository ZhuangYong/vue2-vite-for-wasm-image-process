<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      <el-breadcrumb-item>公告列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="mt10">
      <el-col :span="7">
        <el-input placeholder="请输入公告关键字" v-model="search.keyword"></el-input>
      </el-col>
      <el-col :span="7" class="ml10">
        <el-select v-model="search.type" placeholder="请选择公告类型">
          <el-option v-for="(l, i) in AnnoTypeList" :key="i" :value="l.value" :label="l.label">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="7" class="ml10">
        <el-button type="success" @click="todoSearch">搜索</el-button>
        <el-button type="danger" @click="resetSearch">重置</el-button>
      </el-col>
    </el-row>
    <el-row class="mt10">
      <el-col :span="24">
        <el-table :data="showList" border style="width: 100%" center>
          <el-table-column label="ID" type="index" width="180" align="center"></el-table-column>
          <el-table-column label="公告标题" width="180" align="center">
            <template #default="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="公告内容" width="300" align="center">
            <template #default="scope">
              <span> {{ scope.row.content }} </span>
            </template>
          </el-table-column>
          <el-table-column label="公告类别" width="180" align="center">
            <template #default="scope">
              <el-tag :color="AnnoTypeList.find(item=>item.value==scope.row.type).color">{{AnnoTypeList.find(item=>item.value==scope.row.type).label }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="图片描述" width="180" align="center">
            <template #default="scope">
              <div class="img" v-if="scope.row.desc">
                <img :src="scope.row.desc.replace(/public/,baseURL)" class="desc" alt="">
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-popconfirm title="你真的要删除吗?" @confirm="todoDelanno(scope.row)">
                <template #reference>
                  <el-button type="danger" :icon="Delete" circle />
                </template>
              </el-popconfirm>

              <el-button type="primary" @click="showDialog2(scope.row)" :icon="Edit" circle />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog v-model="show2" title="修改班级" width="30%" :before-close="handleClose2">
      <div>
        <el-form label-position="top" class="myform" status-icon :model="form" ref="uform2" size="default" :rules="rules">
          <el-form-item label="公告标题" prop="title">
            <el-input v-model="form.title" type="text" placeholder="请输入公告标题" autocomplete="off" />
          </el-form-item>
          <el-form-item label="公告内容" prop="content">
            <el-input :prefix-icon="Message" v-model="form.content" type="textarea" placeholder="请输入公告内容" autocomplete="off" />
          </el-form-item>
          <el-form-item label="公告类别" prop="type">
            <el-select style="width: 100%" :prefix-icon="Message" v-model="form.type" placeholder="请选择公告类别">
              <el-option v-for="(l, i) in AnnoTypeList" :key="i" :value="l.value" :label="l.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公告图片" prop="desc">
            <input type="file" ref="file" class="file" @change="uploadFile" />
            <el-tooltip effect="dark" content="点击切换" placement="bottom-end" v-if="form.desc">
              <img :src="form.desc.replace(/public/, baseURL)" @click="todoUpload" class="desc1" alt="" />
            </el-tooltip>

            <el-button v-else type="primary" @click="todoUpload">点击上传公告图片描述</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="handleClose2">取消</el-button>
          <el-button type="danger" @click="confirmModify">确认修改</el-button>
        </span>
      </template>
    </el-dialog>
    <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total" />
  </div>
</template>

<script setup>
  import { baseURL } from '@/api/request'
  import { computed, onMounted, reactive, ref, toRefs } from 'vue'
  import { annolist, annodel, uploadfiles, annoupdate } from '@/api'
  import { ElMessage } from 'element-plus'
  import { Delete, Edit, Message } from '@element-plus/icons-vue'
  import AnnoTypeList from '@/utils/annoTypeList.js'
  const form2 = ref({})
  const search = ref({})
  const uform2 = ref()
  const file = ref()
  const show2 = ref(false)
  const state = reactive({
    annoList: [],
    form: {},
  })

  const rules = reactive({
    type: [{ required: true, message: '请选择公告类型', trigger: 'blur' }],
    title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
  })

  let nowrow = null
  const showDialog2 = (row) => {
    show2.value = true
    state.form = { ...row }
  }

  const confirmModify = () => {
    uform2.value.validate(async (valid) => {
      console.log(state.form)
      const res = await annoupdate(state.form)
      if (res.code == 200) {
        show2.value = false
        getAnnoList()
      }
    })
  }

  const handleClose2 = () => {
    show2.value = false
    state.form = {}
    uform2.value.resetFields()
  }

  const todoUpload = () => {
    file.value.click()
  }
  const uploadFile = async () => {
    let filedata = file.value.files[0]
    let data = new FormData()
    data.append('file', filedata)

    let res = await uploadfiles(data)
    if (res.code == 200) {
      state.form.desc = res.path
    }
  }

  const todoDelanno = async (row) => {
    const res = await annodel(row)
    console.log(res)
    if (res.code == 200) {
      getAnnoList()
    }
  }

  const getAnnoList = async (payload = {}) => {
    let res = await annolist(payload)
    if (res.code == 200) {
      state.annoList = res.result
    }
  }
  getAnnoList()

  // 搜索
  const todoSearch = () => {
    getAnnoList(search.value)
  }

  // 重置
  const resetSearch = () => {
    search.value = {}
    getAnnoList(search.value)
  }

  // 前端分页
  let currentPage = ref(1)
  let pageSize = ref(5)
  let total = computed(() => state.annoList.length)

  let showList = computed(() =>
    state.annoList.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
  )

  const { annoList, form } = toRefs(state)
</script>

<style lang="scss" scoped>
.img {
  img {
    margin: auto;
  }
}
.desc {
  width: 100px;
  height: 100px;
  border-radius: 10px;
}
.file {
  display: none;
}
.desc1 {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
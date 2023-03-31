<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button class="mt10" type="danger" @click="showDialog">添加学科项目</el-button>
    <el-row class="mt10">
      <el-col :span="7">
        <el-input placeholder="请输入项目关键字" v-model="search.keyword"></el-input>
      </el-col>
      <el-col :span="7" class="ml10">
        <el-select v-model="search.xueke" placeholder="请选择学科分类">
          <el-option v-for="(item, index) in xlist" :key="index" :value="item._id" :label="item.title">
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
          <el-table-column label="序号" type="index" width="180" align="center"></el-table-column>
          <el-table-column label="项目类别" prop="name" align="center"></el-table-column>
          <el-table-column label="项目要求" prop="desc" align="center"></el-table-column>
          <el-table-column label="所属学科" align="center" #default="scoped">
            {{(xlist.find(item=> item._id ==scoped.row.xueke )).title }}
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
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
    <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total" />

    <el-dialog v-model="show" title="添加学科项目" width="30%" :before-close="handleClose">
      <div>
        <el-form label-position="left" class="myform" :model="form" ref="uform" size="default" :rules="rules">
          <el-form-item label="所属学科" prop="xueke">
            <el-select style="width: 100%" v-model="form.xueke" placeholder="请选择项目所所属学科">
              <el-option v-for="(item, index) in xlist" :key="index" :value="item._id" :label="item.title">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目类别" prop="name">
            <el-input v-model="form.name" type="text" placeholder="请输入项目类别" autocomplete="off" />
          </el-form-item>
          <el-form-item label="项目要求" prop="desc">
            <el-input v-model="form.desc" type="textarea" placeholder="请输入项目要求" autocomplete="off" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="handleClose">取消</el-button>
          <el-button type="danger" @click="add">添加项目</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="show1" title="修改学科项目" width="30%" :before-close="handleClose1">
      <div>
        <el-form label-position="left" class="myform" :model="form1" ref="uform1" size="default" :rules="rules">
          <el-form-item label="项目类别" prop="name">
            <el-input v-model="form1.name" type="text" placeholder="请输入项目类别" autocomplete="off" />
          </el-form-item>
          <el-form-item label="项目要求" prop="desc">
            <el-input v-model="form1.desc" type="textarea" placeholder="请输入项目要求" autocomplete="off" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="handleClose1">取消</el-button>
          <el-button type="danger" @click="edit">修改项目</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { reactive, ref, toRefs, computed } from 'vue'
  import { getxueke, addxm, getxm, delxm, updatexm } from '@/api'
  import { ElMessage } from 'element-plus'
  import { Delete, Edit, Message } from '@element-plus/icons-vue'

  let show = ref(false)
  let show1 = ref(false)
  const uform = ref()
  const uform1 = ref()
  const state = reactive({
    form: {},
    form1: {},
    xlist: [],
    search: {},
    xmlist: [],
  })

  let currentPage = ref(1)
  let pageSize = ref(5)
  let total = computed(() => state.xmlist.length)

  let showList = computed(() =>
    state.xmlist.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
  )

  const rules = {
    name: [{ required: true, message: '请输入项目类别', trigger: 'blur' }],
    xueke: [{ required: true, message: '请选择所属学科', trigger: 'blur' }],
    desc: [{ required: true, message: '请输入项目要求', trigger: 'blur' }],
  }

  const showDialog2 = (row) => {
    show1.value = true
    console.log(row)
    state.form1 = { ...row }
  }

  const todoDelanno = async (row) => {
    const res = await delxm({ _id: row._id })
    if (res.code == 200) {
      getxiangmu()
    }
  }

  const edit = () => {
    uform1.value.validate(async (valid) => {
      if (valid) {
        const res = await updatexm(state.form1)
        if (res.code == 200) {
          handleClose1()
          getxiangmu()
        }
      } else {
        ElMessage.error('请完整填写表单')
      }
    })
  }
  const todoSearch = () => {
    getxiangmu()
  }
  const resetSearch = () => {
    state.search = {}
    if (state.xlist.length) {
      state.search.xueke = state.xlist[0]._id
    }
    getxiangmu()
  }

  const showDialog = () => {
    show.value = true
  }

  const getxiangmu = async () => {
    const res1 = await getxm(state.search)
    if (res1.code == 200) {
      state.xmlist = res1.result
    }
  }

  const getx = async () => {
    const res = await getxueke()
    if (res.code == 200) {
      state.xlist = res.result
      state.search.xueke = res.result[0]._id
      getxiangmu()
    }
  }
  const add = () => {
    uform.value.validate(async (valid) => {
      if (valid) {
        const res = await addxm(state.form)
        if (res.code == 200) {
          handleClose()
          getxiangmu()
        }
      } else {
        ElMessage.error('请完整填写表单')
      }
    })
  }
  const handleClose = () => {
    uform.value.resetFields()
    show.value = false
  }
  const handleClose1 = () => {
    uform1.value.resetFields()
    show1.value = false
  }
  getx()

  let { form, xlist, search, xmlist, form1 } = toRefs(state)
</script>

<style lang="scss" scoped>
</style>
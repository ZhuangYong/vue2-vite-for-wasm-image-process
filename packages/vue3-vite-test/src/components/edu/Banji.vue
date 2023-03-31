<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button class="mt10" type="danger" @click="showDialog">添加班级</el-button>
    <el-row class="serach">
      <el-input v-model="kw" placeholder="请输入班级"></el-input>
      <el-button @click="serachBtn">搜索</el-button>
    </el-row>

    <el-row class="mt10">
      <el-table :data="showList" border style="width: 100%" center>
        <el-table-column type="index" width="180" label="序号ID" align="center" />
        <el-table-column prop="banji" label="班级名称" width="180" align="center" />
        <el-table-column label="学科" align="center">
          <template #default="scoped">
            <span>{{scoped.row.xk[0].title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="日期" align="center">
          <template #default="scoped">
            <span>{{scoped.row.year.split('T')[0]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="老师" align="center">
          <template #default="scoped">
            <span>{{scoped.row.ls[0].username}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-popconfirm title="你真的打算删除这个数据吗?" @confirm="confirmdelete(scope.row)">
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
            <el-button type="info" size="small" @click="updateItem(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 40]" layout="total, sizes, prev, pager, next, jumper" :total="total" />

    <el-dialog v-model="show" title="添加班级" width="30%" :before-close="handleClose">
      <div>
        <el-form label-position="left" class="myform" status-icon :model="form" ref="uform" size="default" :rules="rules">
          <el-form-item label="班级" prop="banji">
            <el-input class="name" v-model="form.banji" type="text" placeholder="请输入班级名称" autocomplete="off" />
          </el-form-item>
          <el-form-item label="学科" prop="xueke">
            <el-select v-model="form.xueke" class="ml10" placeholder="请选择学科">
              <el-option v-for="item in xlist" :key="item._id" :label="item.title" :value="item._id" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期" prop="year">
            <div class="year">
              <el-date-picker prefix-icon="" v-model="form.year" type="date" placeholder="请选择日期" />
            </div>
          </el-form-item>
          <el-form-item label="老师" prop="teacher">
            <el-select v-model="form.teacher" class="ml10" placeholder="请选择老师">
              <el-option v-for="item in tlist" :key="item._id" :label="item.username" :value="item._id" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="handleClose">取消</el-button>
          <el-button type="danger" @click="confirmAction">添加班级</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="isShow" title="修改班级" width="30%" :before-close="handleClose1">
      <div>
        <el-form label-position="left" class="myform" status-icon :model="form1" ref="uform1" size="default" :rules="rules">
          <el-form-item label="班级" prop="banji">
            <el-input class="name" v-model="form1.banji" type="text" placeholder="请输入班级名称" autocomplete="off" />
          </el-form-item>
          <el-form-item label="学科" prop="xueke">
            <el-select v-model="form1.xueke" class="ml10" placeholder="请选择学科">
              <el-option v-for="item in xlist" :key="item._id" :label="item.title" :value="item._id" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期" prop="year">
            <div class="year">
              <el-date-picker prefix-icon="" v-model="form1.year" type="date" placeholder="请选择日期" />
            </div>
          </el-form-item>
          <el-form-item label="老师" prop="teacher">
            <el-select v-model="form1.teacher" class="ml10" placeholder="请选择老师">
              <el-option v-for="item in tlist" :key="item._id" :label="item.username" :value="item._id" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="handleClose1">取消</el-button>
          <el-button type="danger" @click="confirmAction1">修改</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>


<script setup>
  import { computed, onMounted, reactive, ref, toRefs } from 'vue'
  import {
    ArrowDown,
    Delete,
    Remove,
    Coin,
    Lock,
    ArrowLeft,
    ArrowRight,
  } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import {
    getxueke,
    getusers,
    addbanji,
    getbanji,
    delbanji,
    updatebanji,
  } from '@/api'
  let show = ref(false)
  let isShow = ref(false)
  let kw = ref('')
  const form = reactive({})
  const uform = ref(null)
  const uform1 = ref(null)
  let pageSize = ref(10)
  let currentPage = ref(1)
  let total = computed(() => state.blist.length)
  let showList = computed(() => {
    return state.blist.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
  })
  let state = reactive({
    xlist: [],
    tlist: [],
    blist: [],
    form1: {},
  })

  const rules = reactive({
    banji: [{ required: true, message: '请输入班级', trigger: 'blur' }],
    xueke: [{ required: true, message: '请选择学科', trigger: 'blur' }],
    year: [{ required: true, message: '请选择日期', trigger: 'blur' }],
    teacher: [{ required: true, message: '请选择老师', trigger: 'blur' }],
  })

  const confirmdelete = async (data) => {
    const res = await delbanji({ _id: data._id })
    if (res.code == 200) {
      getdata()
    }
  }
  const confirmAction1 = async () => {
    uform1.value.validate(async (valid) => {
      if (valid) {
        const { _id, banji, teacher, xueke, year } = state.form1
        const res = await updatebanji({ _id, banji, teacher, xueke, year })
        if (res.code == 200) {
          isShow.value = false
          uform1.value.resetFields()
          state.form1 = {}
          getdata()
        }
      } else {
        ElMessage.error('请完整填写表格')
      }
    })
  }

  const updateItem = (data) => {
    isShow.value = true
    state.form1 = { ...data }
  }

  const serachBtn = () => {
    getdata({ kw: kw.value })
  }

  const showDialog = () => {
    show.value = true
  }
  const getxk = async () => {
    const res = await getxueke()
    if (res.code == 200) {
      state.xlist = res.result
    }
  }
  const handleClose = () => {
    uform.value.resetFields()
    show.value = false
  }
  const handleClose1 = () => {
    uform1.value.resetFields()
    state.form1 = {}
    isShow.value = false
  }
  const confirmAction = () => {
    uform.value.validate(async (valid) => {
      if (valid) {
        const year = form.year.setHours(8)
        const res = await addbanji(form)
        if (res.code == 200) {
          show.value = false
          uform.value.resetFields()
          getdata()
        }
      } else {
        ElMessage.error('请完整填写表格')
      }
    })
  }
  const getdata = async (data) => {
    const res = await getbanji(data)
    if (res.code == 200) {
      state.blist = res.result
    }
  }
  const getTeachers = async () => {
    const res = await getusers()
    if (res.code == 200) {
      state.tlist = res.result.filter((item) => item.role == 2)
    }
  }
  getxk()
  getTeachers()
  getdata()
  let { xlist, tlist, blist, form1 } = toRefs(state)
</script>

<style lang="scss" scoped>
.year {
  :deep(.el-input__prefix) {
    display: none !important;
  }
}
.name {
  width: 218px;
}
.year,
.name {
  margin-left: 10px;
}
.serach {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 600px;
  margin-top: 20px;
  .el-button {
    margin-left: 10px;
  }
}
</style>
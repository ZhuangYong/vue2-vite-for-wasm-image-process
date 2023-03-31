<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>学科管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button class="mt10" type="danger" @click="showDialog">添加学科</el-button>
    <el-row class="serach">
      <el-input v-model="kw" placeholder="请输入学科"></el-input>
      <el-button @click="serachBtn">搜索</el-button>
    </el-row>

    <el-row class="mt10">
      <el-table :data="showList" border style="width: 100%" center>
        <el-table-column type="index" width="180" label="序号ID" align="center" />
        <el-table-column prop="title" label="学科名称" width="180" align="center" />
        <el-table-column label="IDS" align="center">
          <template #default="scope">
            <el-tag>{{scope.row._id }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bianhao" label="学科编码" width="180" align="center" />

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

    <el-dialog v-model="show" title="添加学科" width="30%" :before-close="handleClose">
      <div>
        <el-form label-position="left" class="myform" status-icon :model="form" ref="uform" size="default" :rules="rules">
          <el-form-item label="学科名称" prop="name">
            <el-input :prefix-icon="Coin" v-model="form.name" type="text" placeholder="请输入学科名称" autocomplete="off" />
          </el-form-item>
          <el-form-item label="学科编码" prop="value">
            <el-input :prefix-icon="Coin" v-model="form.value" type="text" placeholder="请输入学科编码" autocomplete="off" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="handleClose">取消</el-button>
          <el-button type="danger" @click="confirmAction">添加学科</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="isShow" title="学科修改" width="30%" :before-close="handleClose1">
      <div>
        <el-form label-position="left" class="myform" status-icon :model="form1" ref="uform1" size="default" :rules="rules">
          <el-form-item label="学科名称" prop="name">
            <el-input :prefix-icon="Coin" v-model="form1.name" type="text" placeholder="请输入学科名称" autocomplete="off" />
          </el-form-item>
          <el-form-item label="学科编码" prop="value">
            <el-input :prefix-icon="Coin" v-model="form1.value" type="text" placeholder="请输入学科编码" autocomplete="off" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="handleClose1">取消</el-button>
          <el-button type="danger" @click="confirmAction1">修改学科</el-button>
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
  import { addxueke, getxueke, delxueke, updatexueke } from '@/api'
  const show = ref(false)
  const form = ref({})
  const uform = ref()
  const isShow = ref(false)
  const form1 = ref({})
  const uform1 = ref()
  let pageSize = ref(10)
  let currentPage = ref(1)
  let kw = ref('')
  let oldform = null
  let state = reactive({
    xlist: [],
  })
  let total = computed(() => state.xlist.length)
  let { xlist } = toRefs(state)
  const rules = reactive({
    name: [{ required: true, message: '请输入学科名称', trigger: 'blur' }],
    value: [{ required: true, message: '请输入学科编码', trigger: 'blur' }],
  })
  let showList = computed(() => {
    return state.xlist.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
  })
  const serachBtn = () => {
    console.log(kw.value)
    if (kw.value == '') {
      getXuekeList()
    } else {
      getXuekeList({ kw: kw.value })
    }
  }
  const updateItem = (data) => {
    isShow.value = true
    form1.value = {
      name: data.title,
      value: data.bianhao,
    }
    oldform = { ...form1.value, _id: data._id }
  }
  const showDialog = () => {
    show.value = true
  }
  const handleClose = () => {
    uform.value.resetFields()
    show.value = false
  }
  const handleClose1 = () => {
    uform1.value.resetFields()
    isShow.value = false
  }
  const confirmAction1 = () => {
    uform1.value.validate(async (valid) => {
      if (valid) {
        if (
          oldform.value == form1.value.value &&
          oldform.name == form1.value.name
        ) {
          ElMessage.error('无修改')
          return
        }
        const res = await updatexueke({
          title: form1.value.name,
          bianhao: form1.value.value,
          _id: oldform._id,
        })
        if (res.code == 200) {
          state.xlist.some((item) => {
            if (item._id == oldform._id) {
              item.title = form1.value.name
              item.bianhao = form1.value.value
            }
            return false
          })
          isShow.value = false
          oldform = null
        }
      } else {
        ElMessage.error('请输入有效的学科信息')
      }
    })
  }
  const getXuekeList = async (data) => {
    let res = await getxueke(data)
    state.xlist = res.result
  }
  const confirmdelete = async (data) => {
    const res = await delxueke({ _id: data._id })
    if (res.code == 200) {
      state.xlist = state.xlist.filter((item) => item._id != data._id)
    }
  }
  getXuekeList()
  const confirmAction = () => {
    uform.value.validate(async (valid) => {
      if (valid) {
        // ajax
        let res = await addxueke({
          title: form.value.name,
          bianhao: form.value.value,
        })
        if (res.code == 200) {
          state.xlist.push(res.result)
          handleClose()
        }
      } else {
        ElMessage.error('请输入有效的学科信息')
      }
    })
  }
</script>

<style lang="scss" scoped>
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
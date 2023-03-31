<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教务管理</el-breadcrumb-item>
      <el-breadcrumb-item>学员分班</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row class="mt10">
      <el-col :span="7">
        <el-input placeholder="请输入学院信息关键字" v-model="search.keyword"></el-input>
      </el-col>
      <el-col :span="7" class="ml10">
        <el-select v-model="search.banji" placeholder="请选择班级分类">
          <el-option v-for="(item, index) in blist" :value="item._id" :key="index" :label="item.xk[0].title+'-'+item.banji+'-'+item.ls[0].username">
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
        <el-table :data="xylist" border style="width: 100%" center>
          <el-table-column label="序号" type="index" width="180" align="center"></el-table-column>
          <el-table-column label="姓名" prop="username" align="center"></el-table-column>
          <el-table-column label="手机号" prop="phone" align="center"></el-table-column>
          <el-table-column label="入学时间" prop="time" align="center"></el-table-column>
          <el-table-column label="班级" align="center">
            <template #default="scoped">
              <el-select v-model="scoped.row.banji" @change="updatebanji(scoped.row)" placeholder="请选择班级">
                <el-option v-for="(item, index) in blist" :key="index" :value="item._id" :label="item.xk[0].title+'-'+item.banji+'-'+item.ls[0].username">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total" />

  </div>
</template>

<script setup>
  import { getusers, getbanji, updateuserbanji } from '@/api'
  import { reactive, toRefs, ref, computed } from 'vue'

  let currentPage = ref(1)
  let pageSize = ref(5)
  let total = computed(() => state.xylist.length)

  let showList = computed(() =>
    state.xmlist.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
  )

  const state = reactive({
    xylist: [],
    blist: [],
    search: {},
  })

  const todoSearch = () => {
    getxy()
  }
  const resetSearch = () => {
    state.search = {}
    getxy()
  }

  const updatebanji = async (row) => {
    const res = await updateuserbanji({ _id: row._id, banji: row.banji })
    if (!res.code == 200) {
      row.banji = ''
    }
  }

  const getxy = async () => {
    const res = await getusers(state.search)
    if (res.code == 200) {
      state.xylist = res.result.filter((item) => item.role == 1)
    }
  }
  const getbj = async () => {
    const res = await getbanji()
    if (res.code == 200) {
      state.blist = res.result
    }
  }
  getxy()
  getbj()
  const { xylist, blist, search } = toRefs(state)
</script>

<style scoped>
</style>
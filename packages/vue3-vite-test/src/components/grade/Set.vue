<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
      <el-breadcrumb-item>成绩打分</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="mt10">
      <el-col :span="4" class="ml10">
        <el-select @change="bjchange" v-model="search.banji" placeholder="请选择班级">
          <el-option v-for="(item, index) in bjlist" :key="index" :value="item._id" :label="item.banji">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5" class="ml10">
        <el-select v-model="search.xm" placeholder="请选择项目">
          <el-option v-for="(item, index) in xmlist.filter(item=>item.xueke == (state.bjlist.find((item) => item._id == state.search.banji)?.xueke) )" :key="index" :value="item._id" :label="item.name">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4" class="ml10">
        <el-button type="success" @click="todoSearch">搜索</el-button>
        <el-button type="danger" @click="resetSearch">重置</el-button>
      </el-col>
    </el-row>

    <el-row class="mt10">
      <el-col :span="24">
        <el-table :data="showList" border style="width: 100%" center>
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="项目名称" prop="name" align="center"></el-table-column>
          <el-table-column label="学员姓名" align="center">
            <template #default="scoped">
              {{users.find(item=>item._id == scoped.row.user).username}}
            </template>
          </el-table-column>
          <el-table-column label="项目分类" prop="dizhi" align="center">
            <template #default="scoped">
              {{xmlist.find(item=>item._id == scoped.row.xm).name}}
            </template>
          </el-table-column>
          <el-table-column label="项目要求" prop="dizhi" align="center">
            <template #default="scoped">
              {{xmlist.find(item=>item._id == scoped.row.xm).desc}}
            </template>
          </el-table-column>
          <el-table-column label="项目介绍" prop="jieshao" align="center"></el-table-column>
          <el-table-column label="项目地址" prop="dizhi" align="center"></el-table-column>
          <el-table-column label="项目地址" prop="dizhi" align="center"></el-table-column>
          <el-table-column label="项目查看" align="center">
            <template #default="scoped">
              <a target="_blank" :href="baseURL+scoped.row.xmwj.replace('public','')">下载</a>
            </template>
          </el-table-column>
          <el-table-column label="项目评述" align="center">
            <template #default="scoped">
              {{scoped.row.pinjia? scoped.row.pinjia : '待评价~'}}
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
          <el-table-column label="操作" align="center" #default="scoped">
            <el-button @click="dafen(scoped.row)">打分</el-button>
          </el-table-column>

        </el-table>
      </el-col>
    </el-row>

    <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total" />

    <el-dialog v-model=" show" title="修改项目" width="30%" :before-close="handleClose">
      <div class="pingfen">
        <span>评分</span>
        <el-rate v-model="form.fenshu" />
      </div>
      <div class="p">
        <h2>评述</h2>
        <el-input v-model="form.pinjia" type="textarea"></el-input>
      </div>
      <el-button type="info" @click="handleClose">取消</el-button>
      <el-button type="danger" @click="submit">提交</el-button>
    </el-dialog>

  </div>
</template>

<script setup>
  import { computed, reactive, ref, toRefs, watch } from 'vue'
  import { useStore } from 'vuex'
  import {
    getbanjibyteacher,
    getxm,
    getxmlistbyuser,
    getusers,
    updataxms,
  } from '@/api'
  import { baseURL } from '@/api/request'
  import { ElMessage } from 'element-plus'
  const store = useStore()
  const show = ref(false)
  const userInfo = computed(() => store.state.userInfo)

  const state = reactive({
    search: {},
    bjlist: [],
    xmlist: [],
    xmslist: [],
    users: [],
    form: {},
  })

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

  let currentPage = ref(1)
  let pageSize = ref(5)
  let total = computed(() => state.xmslist.length)

  let showList = computed(() =>
    state.xmslist.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
  )
  const resetSearch = () => {
    state.search = {
      banji: state.bjlist[0]._id,
      xm: '',
    }
    console.log(state.search.xm)
    getxms()
  }
  const getbj = async () => {
    const res = await getbanjibyteacher({ teacher: store.state.userInfo._id })
    if (res.code == 200) {
      state.bjlist = res.result
      state.search.banji = res.result[0]._id
      getxms()
    }
  }
  const bjchange = () => {
    state.search.xm = ''
  }
  const todoSearch = () => {
    getxms()
  }
  const submit = async () => {
    const { fenshu, pinjia, _id } = state.form
    if (!fenshu || !pinjia) {
      ElMessage.error('请评价')
      return
    }
    const res = await updataxms({
      _id,
      fenshu,
      pinjia,
    })
    if (res.code == 200) {
      getxms()
      handleClose()
    }
  }
  const dafen = (row) => {
    state.form = { ...row }
    show.value = true
  }
  const handleClose = () => {
    state.form = {}
    show.value = false
  }
  const getxms = async () => {
    const { banji, xm, keyword } = state.search
    let obj = {}
    if (banji) {
      obj.banji = banji
    }
    if (xm) {
      console.log(xm)
      obj.xm = xm
    }
    const res = await getxmlistbyuser(obj)
    if (res.code == 200) {
      state.xmslist = res.result
    }
  }
  const getuser = async () => {
    const res = await getusers()
    if (res.code == 200) {
      state.users = res.result
    }
  }
  const getxiangmu = async () => {
    const res = await getxm()
    if (res.code == 200) {
      state.xmlist = res.result
    }
  }
  getuser()
  getxiangmu()
  watch(
    userInfo,
    (value) => {
      if (value) {
        getbj()
      }
    },
    { immediate: true }
  )

  const { search, bjlist, xmlist, xmslist, users, form } = toRefs(state)
</script>

<style lang="scss" scoped>
.p {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px 0;
  h2 {
    width: 40px;
  }
}
.pingfen {
  display: flex;
  align-items: center;
  span {
    margin-right: 10px;
  }
}
</style>
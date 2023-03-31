<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      <el-breadcrumb-item>公告新增</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="mt10">
      <el-col :span="9">
        <el-form label-position="top" class="myform" status-icon :model="form" ref="aform" size="default" :rules="rules">
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
              <img :src="form.desc.replace(/public/, baseURL)" @click="todoUpload" class="desc" alt="" />
            </el-tooltip>

            <el-button v-else type="primary" @click="todoUpload">点击上传公告图片描述</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="warning" @click="addAnnoOne">添加公告</el-button>
            <el-button type="info" @click="resetFields">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue'
  import { baseURL } from '@/api/request'
  import { annoadd, uploadfiles } from '@/api'
  import { ElMessage } from 'element-plus'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import { Message } from '@element-plus/icons-vue'
  import AnnoTypeList from '@/utils/annoTypeList.js'
  const store = useStore()
  const router = useRouter()
  const form = reactive({})
  const aform = ref()
  const file = ref()
  const rules = reactive({
    type: [{ required: true, message: '请选择公告类型', trigger: 'blur' }],
    title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
  })

  // 添加公告
  const addAnnoOne = () => {
    aform.value.validate(async (valid) => {
      if (valid) {
        form.userInfo = store.state.userInfo
        let res = await annoadd(form)
        if (res.code == 200) {
          router.push('/anno/list')
        }
      } else {
        ElMessage.error('请输入有效的公告')
      }
    })
  }

  // 重置
  const resetFields = () => {
    aform.value.resetFields()
  }

  // 文件上传
  const todoUpload = () => {
    file.value.click()
  }
  const uploadFile = async () => {
    let filedata = file.value.files[0]
    let data = new FormData()
    data.append('file', filedata)

    let res = await uploadfiles(data)
    if (res.code == 200) {
      form.desc = res.path
    }
  }
</script>

<style lang="scss" scoped>
.file {
  display: none;
}
.desc {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
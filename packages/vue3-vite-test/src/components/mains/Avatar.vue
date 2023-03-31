<template>
  <div class="ml10 avatar">
    <el-avatar @click="upload" :size="35" :src="userInfo.avatar? userInfo.avatar.replace('public',baseURL): circleUrl" />
    <input @change="uploadFile" type="file" class="file" ref="file">
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useStore } from 'vuex'
  import { uploadfiles, changeuserinfo } from '@/api'
  import { baseURL } from '@/api/request.js'
  const file = ref(null)
  const store = useStore()
  let userInfo = computed(() => store.state.userInfo)
  const circleUrl = ref(
    'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  )

  const upload = () => {
    file.value.click()
  }

  const uploadFile = async () => {
    console.log(1)
    const fileData = file.value.files[0]
    const data = new FormData()
    data.append('file', fileData)
    const res = await uploadfiles(data)
    if (res.code == 200) {
      const res1 = await changeuserinfo({ avatar: res.path })
      console.log(res1)
      if (res1.code == 200) {
        const obj = store.state.userInfo
        obj.avatar = res.path
        store.commit('getuserinfo', obj)
      }
    }
  }
</script>

<style lang="scss" scoped>
.file {
  display: none;
}
</style>
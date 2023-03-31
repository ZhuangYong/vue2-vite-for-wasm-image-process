<template>
    <div>
        <h2>----</h2>
        <el-row class="mt10">
          <stage />
        </el-row>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { stage } from 'ps-wasm-vue3'
</script>

<style lang="scss" scoped>
.chatbox{
    width:100%;
    height:500px;
    border:1px solid #ddd;
    border-radius: 15px;
}
</style>

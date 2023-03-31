<template>
  <div class="errorpage" ref="bgstar">
    <div class="dao" @click="gotoLogin">
      <el-progress type="circle" :percentage="percentage" status="" :width="80" :stroke-width="4" />
    </div>
    <img class="myimg" :src="pic" alt="">
    <span class="spandot" v-for="(item,index) in spanNum" :key="index" :style="item"></span>
  </div>
</template>

<script setup>
  import pic from '@/assets/images/503.png'
  import { onMounted, reactive, ref, toRefs } from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  let timer = null
  const bgstar = ref()
  let percentage = ref(0)
  const state = reactive({
    spanNum: [],
  })
  const { spanNum } = toRefs(state)

  const gotoLogin = () => {
    router.push('/login')
  }

  const timeDown = () => {
    timer = setInterval(() => {
      if (percentage.value < 100) {
        percentage.value++
      } else {
        clearInterval(timer)
        timer = null
        gotoLogin()
      }
    }, 50)
  }

  const spanStarInit = () => {
    const width = bgstar.value.clientWidth
    const height = bgstar.value.clientHeight
    for (let i = 0; i < 520; i++) {
      const left = Math.random() * width
      const top = Math.random() * height
      const scaler = Math.random() * 1.5
      const rate = Math.random() * 2.5

      const r = Math.random() * 255
      const g = Math.random() * 255
      const b = Math.random() * 255
      const a = Math.random()

      state.spanNum.push({
        top: top + 'px',
        left: left + 'px',
        animationDelay: rate + 's',
        transform: `scale(${scaler})`,
        background: `rgba(${r},${g},${b},${a})`,
      })
    }
  }

  onMounted(() => {
    timeDown()
    spanStarInit()
  })
</script>

<style lang="scss" scoped >
// scope 独立的css作用域
.errorpage {
  width: 100%;
  height: 100%;
  background: #000;
  position: relative;
  padding: 0 !important;
  overflow: hidden;
  .dao {
    position: absolute;
    top: 20px;
    right: 20px;
    :deep(.el-progress__text) {
      color: #fff !important;
    }
  }
  .myimg {
    width: 270px;
    height: 270px;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    z-index: 10;
  }
  .spandot {
    position: absolute;
    z-index: 100;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    animation: flash 3s infinite alternate;
  }
  @keyframes flash {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.5;
    }
  }
}
</style>
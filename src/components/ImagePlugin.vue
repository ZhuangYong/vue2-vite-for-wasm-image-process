<template>
  <div>
    <div class="stage-inside">
      <stage />
    </div>
  </div>
</template>

<script>
  import { stage } from 'ps-wasm-vue2'
  export default {
    components: { stage },
    data() {
      return {
        msg: 1
      }
    },
    mounted() {
      this.name()
    },
    methods: {
      name() {
        console.log(stage)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .stage-inside {
    width: 800px;
    margin: auto;
  }
</style>

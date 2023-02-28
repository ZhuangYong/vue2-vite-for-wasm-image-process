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
    name: 'ImagePlugin',
    components: { stage },
    data() {
      return {
        msg: 1
      }
    },
    mounted() {
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  .stage-inside {
    width: 800px;
    margin: auto;
  }
</style>

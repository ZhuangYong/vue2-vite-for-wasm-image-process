<template>
  <ContentPanel title="倍速">
    <div class="props-line">
      <div class="props-item btn">
        <el-button v-for="change in speeds" :type="speed === change ? 'primary' : ''" @click="onChangePlaySpeed(change)">{{ change }}x</el-button>
      </div>
    </div>
  </ContentPanel>
</template>

<script>
import {animates, imageHelper, COMMAND_TYPES, BaseFabricComponent, timeLinePlayer} from 'ps-wasm-vue2'
import ContentPanel from "../ContentPanel.vue"

export default {
  name: 'PlayProps',
  mixins: [BaseFabricComponent],
  components: {ContentPanel},
  data() {
    return {
      timeLinePlayer,
      speeds: [0.5, 1, 1.5, 2]
    }
  },
  computed: {
    speed() {
      return this.timeLinePlayer.speed
    }
  },
  methods: {
    onChangePlaySpeed(speed) {
      if (this.canvas) {
        imageHelper.handleCommand(COMMAND_TYPES.CONTROL.PLAY_SPEED.key, this.target, speed)
      }
    },
  }
}
</script>

<style lang="scss" scoped>

</style>

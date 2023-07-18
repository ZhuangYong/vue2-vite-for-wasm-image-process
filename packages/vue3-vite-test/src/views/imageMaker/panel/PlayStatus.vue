<template>
  <div class="play-status">
    <span v-if="timeLinePlayer.duration" class="time-status">{{ timeLinePlayer.currentTime }} / {{ timeLinePlayer.duration }} ms</span>
    <CutButton class="play-btn" />
    <PreButton class="play-btn" />
    <Play class="play-btn" />
    <NextButton class="play-btn" />
  </div>
</template>

<script>
import Play from "../components/buttons/Play.vue"
import CutButton from "../components/buttons/CutButton.vue"
import { timeLinePlayer } from 'ps-wasm-vue2'
import NextButton from "../components/buttons/NextButton.vue"
import PreButton from "../components/buttons/PreButton.vue"

export default {
  name: 'PlayStatus',
  components: { Play, CutButton, NextButton, PreButton },
  data() {
    return {
      timeLinePlayer
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.play-status {
  color: gray;
  display: flex;
  font-size: 12px;
  height: 16px;
  align-items: center;

  .time-status {
    margin-right: 12px;
  }
  .play-btn {
    margin-left: 0;
    margin-right: 12px;
  }
}
</style>

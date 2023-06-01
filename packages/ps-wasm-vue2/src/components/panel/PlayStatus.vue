<template>
  <div class="play-status">
    <CutButton class="play-btn" />
    <PreButton class="play-btn" />
    <Play class="play-btn" />
    <NextButton class="play-btn" />
    <span v-if="timeLinePlayer.duration">{{ timeLinePlayer.currentTime }} / {{ timeLinePlayer.duration }}</span>
  </div>
</template>

<script>
import Play from "@/components/buttons/Play.vue"
import CutButton from "@/components/buttons/CutButton.vue"
import timeLinePlayer from '@/utils/TimeLinePlayer'
import NextButton from "@/components/buttons/NextButton.vue"
import PreButton from "@/components/buttons/PreButton.vue"

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
  .play-btn {
    margin-left: 0;
    margin-right: 12px;
  }
}
</style>

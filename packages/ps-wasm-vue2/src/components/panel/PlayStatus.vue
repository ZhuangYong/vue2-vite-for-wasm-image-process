<template>
  <div class="play-status">
    <Play :play="timeLinePlayer.start" :disabled="!timeLinePlayer.duration" @change="onPlayChange" />
    <span v-if="timeLinePlayer.duration">{{ timeLinePlayer.currentTime }} / {{ timeLinePlayer.duration }}</span>
  </div>
</template>

<script>
import Play from "@/components/buttons/Play.vue"
import timeLinePlayer from '@/utils/TimeLinePlayer'

export default {
  name: 'PlayStatus',
  components: { Play },
  data() {
    return {
      timeLinePlayer
    }
  },
  methods: {
    onPlayChange(v) {
      v ? timeLinePlayer.play() : timeLinePlayer.stop()
    }
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
  .play-button {
    margin-right: 12px;
  }
}
</style>

<template>
  <div class="play-button" :class="`${status} ${disabled && 'disabled'}`" :style="`width: ${size * 0.82}px; height: ${size}px; font-size: ${size}px;`" @click="togglePlay">
    <span class="line stay" />
    <span class="line first" />
    <span class="line second" />
    <span class="line third" />
  </div>
</template>

<script>
import { imageHelper, timeLinePlayer, COMMAND_TYPES } from 'ps-wasm-vue2'

export default {
  name: 'Play',
  props: {
    size: {
      type: Number,
      default: 12
    }
  },
  data() {
    return {
      status: 'pause',
      timeLinePlayer
    }
  },
  computed: {
    disabled() {
      return !this.timeLinePlayer.duration
    },
    play() {
      return this.timeLinePlayer.start
    }
  },
  watch: {
    play(v) {
      this.status = v ? 'play' : 'pause'
    }
  },
  methods: {
    togglePlay() {
      if (!this.disabled) {
        this.status = this.status === 'pause' ? 'play' : 'pause'
        // this.$emit('update:play', this.status === 'play')
        // this.$emit('change', this.status === 'play')
        // timeLinePlayer.togglePlay()
        imageHelper.handleCommand(COMMAND_TYPES.CONTROL.PLAY_OR_STOP.key)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.play-button {
  cursor: pointer;
  position: relative;

  &:hover .line {
    &:not(.disabled) {
      background-color: #009983;
    }
  }

  .line {
    width: 0.22em;
    height: 1em;
    display: block;
    position: absolute;
    border-radius: 0.22em;
    background-color: #333333;
    transition: all 0.4s cubic-bezier(0.8, 0, 0.33, 1);
    &.stay {
      transform: scale(0) translateY(0.5em) translateX(0.6em);
    }
    &.first {
      transform: scale(1) rotate(-55deg) translateY(0.12em) translateX(0.4em);
    }
    &.third {
      transform: scale(1) rotate(55deg) translateY(-0.12em) translateX(0.4em);
    }
  }
  &.play {
    .line {
      &.stay {
        transform: scale(1) translateY(0) translateX(0);
      }
      &.second {
        transform: translateX(0.6em);
      }
      &.first {
        transform: scale(0) translateX(0.6em);
      }
      &.third {
        transform: scale(0) translateX(0.6em);
      }
    }
  }
  &.disabled {
    cursor: not-allowed;
    .line {
      background-color: #d0d0d0;
    }
  }
}
</style>

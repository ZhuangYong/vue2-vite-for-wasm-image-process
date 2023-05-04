<template>
  <div class="play-button" :class="`${status} ${disabled && 'disabled'}`" :style="`width: ${size * 0.82}px; height: ${size}px; font-size: ${size}px;`" @click="togglePlay">
    <span class="line stay" />
    <span class="line first" />
    <span class="line second" />
    <span class="line third" />
  </div>
</template>

<script>
export default {
  name: 'Play',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 12
    },
    play: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      status: 'pause'
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
        this.$emit('update:play', this.status === 'play')
        this.$emit('change', this.status === 'play')
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.play-button {
  cursor: pointer;
  position: relative;
  .line {
    width: 0.22em;
    height: 1em;
    display: block;
    position: absolute;
    border-radius: 0.22em;
    background-color: #409EFF;
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

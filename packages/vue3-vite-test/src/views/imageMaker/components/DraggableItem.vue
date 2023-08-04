<template>
  <div ref="dragItem" class="drag-item" @mousedown="onMousedown">
    <slot />
  </div>
  <div ref="dragGhost" v-if="onDrag" v-html="ghostHtml" :style="ghostStyle" class="drag-ghost" />
</template>

<script>

import {CUSTOM_EVENT} from "../utils";

export default {
  name: 'DraggableItem',
  data() {
    return {
      onDrag: false,
      startInfo: null,
      moveInfo: null,
      ghostHtml: '',
      startEvent: null
    }
  },

  watch: {
    onDrag(v) {
      this.ghostHtml = v ? this.$refs.dragItem.outerHTML : ''
    }
  },

  computed: {
    ghostInfo() {
      if (!this.onDrag) {
        return {}
      }
      const { clientX: startX, clientY: startY, offsetX, offsetY, width, height } = this.startInfo
      const { clientX: moveX, clientY: moveY } = this.moveInfo || {}
      return {
        width,
        height,
        offsetX,
        offsetY,
        moveX: moveX - startX,
        moveY: moveY - startY,
        left: startX - offsetX,
        top: startY - offsetY
      }
    },

    ghostStyle() {
      if (!this.onDrag) {
        return {}
      }
      const { left, top, moveX, moveY } = this.ghostInfo
      return { left: `${left}px`, top: `${top}px`, transform: `translate(${moveX}px, ${moveY}px)` }
    }
  },
  created() {
    window.addEventListener('mouseup', this.onMouseup)
    window.addEventListener('mousemove', this.onMousemove)
  },
  beforeUnmount() {
    window.removeEventListener('mouseup', this.onMouseup)
    window.removeEventListener('mousemove', this.onMousemove)
  },
  methods: {
    onMousedown(e) {
      const { clientX, clientY } = e
      this.startEvent = e
      this.onDrag = true
      const startInfo = { clientX, clientY }
      const { x, y, width, height } = this.$refs.dragItem.getBoundingClientRect()
      startInfo.offsetX = clientX - x
      startInfo.offsetY = clientY - y
      startInfo.width = width
      startInfo.height = height
      this.moveInfo = this.startInfo = startInfo
      this.changeCursor('copy')
    },

    onMousemove(e) {
      const { clientX, clientY } = e
      if (this.onDrag) {
        this.moveInfo = { clientX, clientY }
        const customEvent = new CustomEvent(CUSTOM_EVENT.DRAG_RESOURCE, {
          detail: { resource: { ...this.$parent.detail, naturalSize: this.$parent.naturalSize }, ghostInfo: { ...this.ghostInfo } },
          bubbles: true,
          cancelable: true,
          pageX: clientX,
          pageY: clientY,
          screenX: clientX,
          screenY: clientY, clientX, clientY
        })
        window.dispatchEvent(customEvent)
      }
    },

    onMouseup() {
      this.onDrag = false
      this.resetCursor()
    },

    changeCursor(type) {
      document.body.oldCursor = document.body.style.cursor
      document.body.style.cursor = type
    },

    resetCursor() {
      document.body.style.cursor = document.body.oldCursor
    }
  }
}
</script>

<style lang="scss" scoped>
.drag-ghost {
  z-index: 2001;
  opacity: 0.6;
  position: fixed;
  cursor: copy;
  pointer-events: none;
}
</style>

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
      const info = {}
      const { clientX: startX, clientY: startY } = this.startInfo
      const { clientX: moveX, clientY: moveY } = this.moveInfo || {}
      info.x = moveX - startX
      info.y = moveY - startY
      return info
    },

    ghostStyle() {
      if (!this.onDrag) {
        return {}
      }
      const { clientX: left, clientY: top, offsetX, offsetY } = this.startInfo
      const { x, y } = this.ghostInfo
      return { left: `${left - offsetX}px`, top: `${top - offsetY}px`, transform: `translate(${x}px, ${y}px)` }
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
      const { x, y } = this.$refs.dragItem.getBoundingClientRect()
      startInfo.offsetX = clientX - x
      startInfo.offsetY = clientY - y
      this.moveInfo = this.startInfo = startInfo
      this.changeCursor('copy')
    },

    onMousemove(e) {
      const { clientX, clientY } = e
      if (this.onDrag) {
        this.moveInfo = { clientX, clientY }
        const customEvent = new MouseEvent(CUSTOM_EVENT.DRAG_RESOURCE, {
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

<template>
  <div class="message-tip">
    <div v-for="(item, index) in showList" :key="index + item.id" class="message-item" :class="{ show: !item.closed && item.show, closed: item.closed }" @mouseover="onMouseover(item)">
      <div v-html="item.msg" class="message-item-content" />
      <i class="el-icon el-dialog__close" @click="close(item)">
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor"
                d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path>
        </svg>
      </i>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  components: { },
  data() {
    return {
      minShow: 500,
      maxShow: 10 * 1000,
      nextTimer: null,
      messageList: []
    }
  },
  computed: {
    showList() {
      return this.messageList
    }
  },
  methods: {
    pushTip(msg) {
      this.messageList.unshift({id: Math.random(), msg, show: false, close: false , time: Date.now() })
      if (this.messageList.length > 10) {
        this.messageList.pop()
      }
      this.nextDelayMsg()
    },

    close(item) {
      item.closed = true
      this.nextMsg()
    },

    onMouseover(item) {
      item.time = Date.now() - this.maxShow * 0.7
    },

    nextMsg() {
      const preItem = this.messageList.filter(item => !!item.show && !item.closed)
      if (!_.isEmpty(preItem)) {
        preItem.forEach(item => (item.closed = true))
      }
      for (let i = this.messageList.length - 1; i >= 0; i--) {
        const msg = this.messageList[i]
        if (!msg.show) {
          msg.show = true
          return
        }
      }
    },

    nextDelayMsg() {
      const cur = this.messageList.find(item => !!item.show && !item.closed)
      const next = this.messageList.find(item => !item.show && !item.closed)
      !this.nextTimer && (this.nextTimer = setTimeout(() => {
        this.nextTimer = null
        if (!cur) {
          this.nextMsg()
        } else {
          const delay = Date.now() - cur.time
          const limit = next ? this.minShow : this.maxShow
          if (delay >= limit) {
            this.nextMsg()
          }
        }
        this.nextDelayMsg()
      }, this.minShow))
    }
  }
}
</script>

<style lang="scss" scoped>
$itemHeight: 24px;
$animateTime: 0.5s;
$backgroundColor: #dbede9;
.message-tip {
  width: 100%;
  z-index: 1;
  position: relative;

  .message-item {
    left: 0;
    height: 0;
    display: flex;
    width: 100%;
    line-height: 1;
    font-size: 12px;
    color: #333333;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    background-color: $backgroundColor;
    transition: all $animateTime ease;

    .message-item-content {
      flex: 1;
      text-align: center;
    }

    .el-dialog__close {
      flex: 16px 0;
      cursor: pointer;
    }
  }

  .show {
    height: $itemHeight;
    border-bottom: 1px solid darken($backgroundColor, 10%);
  }

  .closed {
    height: 0;
    transition: all $animateTime ease;
    background-image: linear-gradient(darken($backgroundColor, 8%), $backgroundColor);
  }
}
</style>

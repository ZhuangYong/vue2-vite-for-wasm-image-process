// import Vue from 'vue'
// const EventBus = new Vue()
import EventBus from '@/utils/Event'

export default {
  inject: ['getCanvas', 'getTarget', 'waiting'],
  computed: {
    canvas: {
      get() { return this.getCanvas ? this.getCanvas() : null },
      set() { console.error('can not set canvas direct!') }
    },

    target: {
      get() {
        return this.getTarget ? this.getTarget() : null
      },
      set() { console.error('can not set target direct!') }
    },
    // targetProps: {
    //   get() {
    //     return this.getTargetProps ? this.getTargetProps() : {}
    //   },
    //   set() { console.error('can not set targetProps direct!') }
    // },

    /**
     * 是否初始化过
     * */
    initialed() {
      return (this.canvas || {}).originWidth
    }
  },
  methods: {
    on() {
      return EventBus.on(...arguments)
    },
    emit(type, ...args) {
      return EventBus.trigger(type, ...args)
    }
  },
}

export const eventBus = EventBus

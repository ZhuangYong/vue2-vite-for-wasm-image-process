export default {
  inject: ['getCanvas', 'getTarget'],
  computed: {
    canvas: {
      get() {
        return this.getCanvas ? this.getCanvas() : null
      },
      set() {
        console.error('can not set canvas direct!')
      }
    },

    target: {
      get() {
        return this.getTarget ? this.getTarget() : null
      },
      set() {
        console.error('can not set target direct!')
      }
    }
  }
}

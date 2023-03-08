export default {
  inject: ['getCanvas', 'getTarget', 'getTargetProps'],
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
    targetProps: {
      get() {
        return this.getTargetProps ? this.getTargetProps() : {}
      },
      set() { console.error('can not set targetProps direct!') }
    }
  },
  watch: {
  }
}

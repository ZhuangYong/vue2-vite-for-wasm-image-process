export class Event {
  _eventData = null

  on(name, func) {
    this._eventData = this._eventData || {}
    this._eventData[name] = this._eventData[name] || []
    let listened = false
    this._eventData[name].forEach(fun => {
      if (fun === func) {
        listened = true
        return false
      }
    })
    if (!listened) {
      this._eventData[name].push(func)
    }
  }

  off(name, func) {
    this._eventData = this._eventData || {}
    if (!this._eventData[name] || !this._eventData[name].length) {
      return
    }
    if (func) {
      this._eventData[name] = this._eventData[name].filter(fun => fun !== func)
    } else {
      this._eventData[name] = []
    }
  }

  trigger(name) {
    this._eventData = this._eventData || {}
    if (!this._eventData[name] || !this._eventData[name].length) {
      return
    }
    const args = this._eventData[name].slice.call(arguments, 1)
    let preventDefault = false
    this._eventData[name].forEach(fun => {
      preventDefault = fun.apply(this, args) || preventDefault
    })

    return !preventDefault
  }
}

export default new Event()

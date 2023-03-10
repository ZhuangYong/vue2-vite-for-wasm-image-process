/**
 * #函数调用
 * this.loadWebAssembly ('path/to/name.wasm')
 * .then(instance => {
 *   const methodName = instance.exports.methodName
 *   this.result = methodName(args)
 * })
 * @param path
 * @param imports
 * @returns {Promise<WebAssembly.Instance>}
 */
export function loadWebAssembly(path, imports = {}) {
  return fetch(path) // 加载文件
    .then(response => response.arrayBuffer()) // 转成 ArrayBuffer
    .then(buffer => WebAssembly.compile(buffer))
    .then(module => onLoadSuccess(module, imports))
}

export function loadBlobWebAssembly(blob, imports = {}) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function(e) {
      WebAssembly.compile(e.target.result)
        .then(module => resolve(onLoadSuccess(module, imports)))
    }
    reader.readAsArrayBuffer(blob);
  })
}

function onLoadSuccess (module, imports) {
  imports.env = imports.env || {}
  // 开辟内存空间
  imports.env.memoryBase = imports.env.memoryBase || 0
  if (!imports.env.memory) {
    imports.env.memory = new WebAssembly.Memory({ initial: 256 })
  }
  // 创建变量映射表
  imports.env.tableBase = imports.env.tableBase || 0
  if (!imports.env.table) {
    // 在 MVP 版本中 element 只能是 "anyfunc"
    imports.env.table = new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
  }
  // 创建 WebAssembly 实例
  return WebAssembly.instantiate(module, imports)
}


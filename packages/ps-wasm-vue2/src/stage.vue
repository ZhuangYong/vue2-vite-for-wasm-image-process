<template>
  <div class="stage">
    <el-container>
      <el-aside width="200px">

      </el-aside>
      <el-container>
        <el-header>
          <el-upload action="" :auto-upload="false" :show-file-list="false" :on-change="onFileAdd">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-header>
        <el-main>
          <canvas id="imgRect" />
          <div class="painting" />
        </el-main>
        <el-footer>

        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { addImage } from "./utils"
import { fabric } from './lib/fabric.min'
import {loadBlobWebAssembly} from "./wasmHelper"
import add from './lib/add.wasm'

export default {
  data() {
    return {
      canvas: null
    }
  },
  mounted() {
    loadBlobWebAssembly(add).then(instance => {
      console.warn('测试 wasm 方法（add），333 + 555 =', instance.exports.add(333, 555))
    })
    const canvas = new fabric.Canvas('imgRect');
    const rect = new fabric.Rect({
      left: 100,
      top: 50,
      fill: 'yellow',
      width: 200,
      height: 100,
      objectCaching: false,
      stroke: 'lightgreen',
      strokeWidth: 4,
    })

    canvas.add(rect)
    canvas.setActiveObject(rect)

    this.canvas = canvas
  },
  methods: {
    onFileAdd(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function() {
        const img = new Image()
        img.src = this.result
        img.onload = function(){
          addImage(img)
        }
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.stage {
  border: 1px solid #dedede;
}
.el-aside {
  background-color: #dedede;
}
</style>

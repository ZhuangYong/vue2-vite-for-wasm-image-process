<template>
  <div class="dialogs">

    <!--修改canvas尺寸-->
    <el-dialog :visible.sync="editCanvasSizeDialog" width="300px" title="画布大小">
      <el-form label-width="46px">
        <p class="title">当前大小</p>
        <div class="inline-block">
          <div>宽： {{ (canvas || {}).originWidth || 0 }}</div>
          <div>高： {{ (canvas || {}).originHeight || 0 }}</div>
        </div>
        <p class="title">新建大小</p>
        <div class="block">
          <el-form-item label="宽：">
            <el-input v-model="sizeForm.width" />
          </el-form-item>
          <el-form-item label="高：">
            <el-input v-model="sizeForm.height" />
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer">
        <el-button size="small" type="primary" @click.stop.prevent="changeCanvasSize">确定</el-button>
      </div>
    </el-dialog>

    <!--新建-->
    <el-dialog :visible.sync="newDialog" width="300px" title="新建图片">
      <el-form label-width="46px">
        <p class="title">新建大小</p>
        <div class="block">
          <el-form-item label="宽：">
            <el-input v-model="sizeForm.width" />
          </el-form-item>
          <el-form-item label="高：">
            <el-input v-model="sizeForm.height" />
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer">
        <el-button size="small" type="primary" @click.stop.prevent="newPicture">确定</el-button>
      </div>
    </el-dialog>

    <!--输入文字-->
    <el-dialog :visible.sync="textDialog" title="文字" width="600px">
      <el-form>
        <el-form-item label="">
          <el-input v-model="editText" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入文本内容" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" type="primary" @click.stop.prevent="onEditTextSure">确定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import BaseFabricComponent from "../BaseFabricComponent"
import imageHelper from "@/utils/ImageHelper"
import {fontOptions} from "@/utils/FontHelper";

export default {
  name: 'Dialogs',
  mixins: [BaseFabricComponent],
  data() {
    return {
      editText: '', // 文字编辑内容
      textDialog: false,
      newDialog: false,
      editCanvasSizeDialog: false,
      sizeForm: {width: 0, height: 0},
      currentMouseDownPoint: {x: 0, y: 0} // 鼠标按下坐标
    }
  },
  created() {
    this.on('resizeCanvas', this.showChangeCanvasSize)
    this.on('addText', this.showAddTextShow)
    this.on('new', this.showNewPicture)
  },
  methods: {
    onFileAdd(file) {
      imageHelper.uploadImage(file.raw)
    },

    showAddTextShow(e) {
      if (!this.textDialog) {
        this.currentMouseDownPoint = e
        this.textDialog = true
      }
    },

    onEditTextSure() {
      if ((this.editText || '').replace(/ /g, '')) {
        const { x: left, y: top } = this.currentMouseDownPoint
        imageHelper.addText(this.editText, {left, top, fontFamily: fontOptions[0].value })
        this.editText = ''
        this.textDialog = false
      }
    },

    showNewPicture() {
      this.sizeForm.width = 300
      this.sizeForm.height = 300
      this.newDialog = true
    },

    newPicture() {

    },

    /**
     * 显示画布尺寸修改
     */
    showChangeCanvasSize() {
      const {originWidth: width, originHeight: height} = this.canvas || {}
      this.sizeForm.width = width || 0
      this.sizeForm.height = height || 0
      this.editCanvasSizeDialog = true
    },

    /**
     * 修改画布尺寸
     */
    changeCanvasSize() {
      this.editCanvasSizeDialog = false
      const { width, height } = this.sizeForm
      this.canvas.originWidth = width
      this.canvas.originHeight = height
      this.canvas.setDimensions({ width: width * this.canvas.viewScale, height: height * this.canvas.viewScale })
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__body {
    padding-top: 0;
  }
}
.block {
  border: 1px solid #dedede;
  border-radius: 4px;
  padding: 12px;
  .el-form-item {
    margin-bottom: 6px;
  }
}
.inline-block {
  display: flex;
  padding: 12px 0 ;
  border-bottom: 1px solid #dedede;
  &>* {
    margin-right: 12px;
  }
}
.title {
  text-align: left;
  margin-bottom: 4px;
}
</style>

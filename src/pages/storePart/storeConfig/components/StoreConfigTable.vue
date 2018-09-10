<template>
  <div class="tablePage">

    <el-dialog title="编辑" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="subTitle">
        <div class="subsubTitle">名称:</div>
        <el-input style="width: 200px" placeholder="输入设备ID" v-model="editingPublicDevice.facilityName" clearable>
        </el-input>
      </div>
      <div class="uploadBox">
        <el-upload ref="upload" class="avatar-uploader" action="http://api-control.test.hxsapp.com/admin/Upload/uploadBase64" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture-card" :auto-upload="true" :http-request="upLoadImg" :show-file-list="false" :before-upload="beforeUploadImg">
          <img v-if="uploadImgUrl" :src="uploadImgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon imgborder"></i>
        </el-upload>
        <div class="uploadTips">
          <div>尺寸: 40X40</div>
          <div>支持JPG/PNG格式</div>
          <div>大小不超过1M</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm(editingPublicDevice)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="删除" :visible.sync="dialogVisible_remove" width="30%" :before-close="handleClose">
      确认删除后, 用户APP相关展示信息将会同步删除且不可恢复!
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_remove = false">取 消</el-button>
        <el-button type="primary" @click="confirm2(editingPublicDevice)">确 定</el-button>
      </span>
    </el-dialog>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="ID" prop="id">
      </el-table-column>
      <el-table-column label="名称" prop="facilityName">
      </el-table-column>

      <el-table-column label="图片(40X40)">
        <template slot-scope="scope">
          <div class="tablePic" :style="`background-image: url(${scope.row.facilityIconUrl}); background-size: 100% 100%`"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click.native="showDialog(scope.row)" size="small" v-permission="'c284f6ce-effb-4183-bede-b696153e2792'">编辑</el-button>
          <!-- <el-button @click.native="showDialog2(scope.row)" size="small">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import { deepCopy } from 'common/utils';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogVisible_remove: false,
      editingPublicDevice: {},
      fileList2: [],
      uploadImgUrl: '',
      isLoadingImgSuccess: false // 是否加载成功图片
    };
  },
  methods: {
    ...mapActions([
      'storeConfigUploadImg',
      'updateStoreConfigPublicDevice',
      'getStoreConfigPublicDevice'
    ]),
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handlePreview(file) {
      // console.log(file);
    },
    beforeUploadImg(file) {
      // 检测图片格式及大小
      // console.log(file.type);
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$notify.error('上传图片只能是 JPG或PNG 格式!');
      }
      if (!isLt1M) {
        this.$notify.error('上传图片大小不能超过 1MB!');
      }
      return isJPG && isLt1M;
      return true;
    },
    upLoadImg(content) {
      // console.log(content);
      this.$notify.warning('图片正在上传, 请耐心等待');
      const _this = this;
      let img_base64 = '';
      var reader = new FileReader();
      reader.readAsDataURL(content.file);
      reader.onloadend = function() {
        img_base64 = this.result;
        let arr = content.file.name.split('.');
        let suffix = arr[arr.length - 1];
        _this
          .storeConfigUploadImg({
            imageBase64: img_base64,
            type: suffix
          })
          .then(url => {
            _this.uploadImgUrl = url;
            _this.isLoadingImgSuccess = true;
            _this.$notify.success('图片加载成功');
          })
          .catch(error => {
            _this.$notify.error('图片加载失败, 请重试');
            _this.isLoadingImgSuccess = false;
          });
      };
    },
    showDialog(row) {
      // console.log(row);
      this.editingPublicDevice = deepCopy(row);
      this.uploadImgUrl = deepCopy(row).facilityIconUrl;
      this.dialogVisible = true;
    },
    showDialog2(row) {
      // console.log(row);
      this.editingPublicDevice = deepCopy(row);
      this.dialogVisible_remove = true;
    },
    handleClose(done) {
      this.editingPublicDevice = {};
      done();
    },
    confirm(item) { // 确认编辑
      this.updateStoreConfigPublicDevice({
        id: item.id,
        name: item.facilityName,
        imageUrl: this.uploadImgUrl,
        typeStr: item.facilityType
      })
        .then(() => {
          this.$notify.success(`公共设备[${item.id}]更新成功`);
          this.dialogVisible = false;
          this.getStoreConfigPublicDevice();
        })
        .catch(() => {
          this.$notify.error(`公共设备[${item.id}]更新失败, 请重试`);
          this.dialogVisible = false;
        });
    },
    confirm2(item) {
      this.$notify.error('无此接口')
      this.dialogVisible_remove = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.tablePage {
  width: 100%;
}
.tablePic {
  width: 40px;
  height: 40px;
}

.subTitle {
  @include flexbox;
  @include align-items(center);
  margin: {
    bottom: 20px;
  }
  .subsubTitle {
    margin: {
      right: 10px;
    }
  }
}

.uploadBox {
  width: 100%;
  @include flexbox;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 100%;
  display: block;
}

.uploadTips {
  box-sizing: border-box;
  padding: {
    left: 15px;
    top: 20px;
  }
}
</style>

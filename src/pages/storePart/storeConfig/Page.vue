<template>
  <div class="protalPage">
    <el-dialog title="添加" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="subTitle">
        <div class="subsubTitle">名称:</div>
        <el-input style="width: 200px" placeholder="输入名称" v-model="facilityName" clearable>
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
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>

    <div class="storeConfigPage">
      <div class="title">门店配置</div>
      <div class="tableTitle">
        <div class="subTitle">公共设备标签</div>
        <el-button type="primary" @click.native="addPublicDevice" v-permission="'e1b7ed1e-270a-4b82-8858-976b9f595ce7'">添加</el-button>
      </div>
      <div class="tableBox" v-loading="isFetchingData">
        <store-config-table :tableData="storeConfigPublicDevice" v-permission="'a9647377-9fbc-4024-b350-3060b2e9162c'"></store-config-table>
      </div>
    </div>
  </div>
</template>

<script>
import StoreConfigTable from './components/StoreConfigTable';

import { mapState, mapActions } from 'vuex';

export default {
  components: {
    StoreConfigTable
  },
  data() {
    return {
      dialogVisible: false,
      facilityName: '',
      uploadImgUrl: ''
    };
  },
  computed: {
    ...mapState({
      storeConfigPublicDevice: state =>
        state.storeConfig.storeConfigPublicDevice,
      isFetchingData: state => state.storeConfig.isFetchingData
    })
  },
  methods: {
    ...mapActions(['getStoreConfigPublicDevice', 'storeConfigUploadImg', 'updateStoreConfigPublicDevice']),
    handleClose(done) {
      done();
    },
    addPublicDevice() {
      this.dialogVisible = true;
    },
    handlePreview() {},
    handleRemove() {},
    submitUpload() {
      this.$refs.upload.submit();
    },
    upLoadImg(content) {
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
    confirm() {
      // 添加
      this.updateStoreConfigPublicDevice({
        name: this.facilityName,
        imageUrl: this.uploadImgUrl,
        typeStr: '0'
      })
        .then(() => {
          this.$notify.success(`公共设备[${this.facilityName}]添加成功`);
          this.dialogVisible = false;
          this.getStoreConfigPublicDevice();
        })
        .catch(() => {
          this.$notify.error(`公共设备[${this.facilityName}]添加失败, 请重试`);
          this.dialogVisible = false;
        });
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.getStoreConfigPublicDevice();
      });
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.getStoreConfigPublicDevice();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.storeConfigPage {
  width: 100%;
  min-height: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 20px;
  .title {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
    }
  }
}
.tableTitle {
  @include flexbox;
  @include justify-content(space-between);
  box-sizing: border-box;
  padding: {
    left: 10px;
    right: 20px;
    top: 30px;
  }
  .subTitle {
    font-size: 18px;
    font-weight: 600;
  }
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

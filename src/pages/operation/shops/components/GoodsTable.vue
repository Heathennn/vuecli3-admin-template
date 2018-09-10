<template>
  <div class="shopsTable">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="400px" :before-close="handleClose">
      <div class="item">
        <div class="subTitle">名称</div>
        <el-input placeholder="输入名称" v-model="goodName" clearable style="width: 200px">
        </el-input>
      </div>

      <div class="item">
        <div class="subTitle">规格</div>
        <el-input placeholder="输入规格" v-model="goodsStandard" clearable style="width: 200px">
        </el-input>
      </div>

      <div class="item">
        <div class="subTitle">进货价</div>
        <el-input placeholder="输入规格" v-model="priceBuyer" clearable style="width: 200px">
        </el-input>
      </div>

      <div class="item">
        <div class="subTitle">售价</div>
        <el-input placeholder="输入售价" v-model="priceSaler" clearable style="width: 200px">
        </el-input>
      </div>

      <div class="uploadBox item">
        <div class="subTitle">图片</div>
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
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-table :data="datas" style="width: 100%" :header-cell-style="headStyle">
      <el-table-column label="商品ID" prop="id">
      </el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <div :style="`width: 40px; height: 40px;background-image: url(${scope.row.minPicUrl}); background-size: 100% 100%`"></div>
        </template>
      </el-table-column>
      <el-table-column label="商品类型" prop="goodsType">
      </el-table-column>
      <el-table-column label="商品名称" prop="goodsName">
      </el-table-column>
      <el-table-column label="规格" prop="goodsStandard">
      </el-table-column>
      <el-table-column label="入货价(元)" prop="priceBuyer">
      </el-table-column>
      <el-table-column label="售价(元)" prop="priceSaler">
      </el-table-column>
      <el-table-column label="已售数量" prop="saleNumber">
      </el-table-column>
      <el-table-column label="状态" prop="goodsStatus">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span @click="editGood(scope.row)" v-permission="'b0a8721a-e7ca-44ed-9618-d994d0c8b45d'">编辑</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { deepCopy } from 'common/utils';

import { mapState, mapActions } from 'vuex';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach((item, index) => {
        item.priceBuyer = (item.priceBuyer / 100).toFixed(2);
        item.priceSaler = (item.priceSaler / 100).toFixed(2);
        item.goodsType =
          item.goodsType == 1
            ? '饮料'
            : item.goodsType == 2 ? '减肥餐' : '其他';
        item.goodsStatus =
          item.goodsStatus == 1
            ? '待上架'
            : item.goodsStatus == 2 ? '已上架' : '其他';
      });
      return list;
    }
  },
  data() {
    return {
      headStyle: {
        // "text-align": 'center',
        // color: 'red'
      },
      editingItem: {},
      dialogTitle: '编辑',
      dialogVisible: false,
      goodName: '',
      goodsStandard: '',
      priceBuyer: '',
      priceSaler: '',
      uploadImgUrl: ''
    };
  },
  methods: {
    ...mapActions(['storeConfigUploadImg', 'saveGoodInfo']),
    handleClose(done) {
      // console.log('清除');
      this.resetEditingData();
      done();
    },
    cancel() {
      this.dialogTitle = '编辑';
      this.dialogVisible = false;
      this.resetEditingData();
    },
    createGood() {
      this.dialogTitle = '添加';
      this.dialogVisible = true;
    },
    confirm() {
      // 编辑商品
      this.dialogVisible = false;
      let params;
      if (this.dialogTitle === '添加') {
        params = {
          goodsName: this.goodName,
          goodsPicMin: this.uploadImgUrl,
          goodsStandard: this.goodsStandard,
          priceBuyer: this.priceBuyer * 100,
          priceSaler: this.priceSaler * 100
        };
      } else {
        params = {
          id: this.editingItem.id,
          goodsName: this.goodName,
          goodsPicMin: this.uploadImgUrl,
          goodsStandard: this.goodsStandard,
          priceBuyer: this.priceBuyer * 100,
          priceSaler: this.priceSaler * 100
        };
      }
      this.saveGoodInfo(params)
        .then(() => {
          this.$notify.success('修改商品信息成功');
          this.$emit('fetchGoodsData');
        })
        .catch(() => {
          this.$notify.error('修改商品信息失败');
          this.$emit('fetchGoodsData');
        });
      this.resetEditingData();
    },
    resetEditingData() {
      this.goodName = '';
      this.goodsStandard = '';
      this.priceBuyer = '';
      this.priceSaler = '';
      this.uploadImgUrl = '';
    },
    editGood(item) {
      // console.log(item);
      this.dialogTitle = '编辑';
      this.editingItem = item;
      this.goodName = item.goodsName;
      this.goodsStandard = item.goodsStandard;
      this.uploadImgUrl = item.minPicUrl;
      this.priceBuyer = item.priceBuyer;
      this.priceSaler = item.priceSaler;
      this.dialogVisible = true;
    },
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
        // console.log(img_base64)
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.item {
  @include flexbox;
  @include align-items(center);
  box-sizing: border-box;
  padding: {
    bottom: 5px;
  }
}
.subTitle {
  width: 60px;
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

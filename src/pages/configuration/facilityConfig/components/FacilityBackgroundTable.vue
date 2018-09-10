<template>
  <div>
    <el-dialog title="编辑" center :visible.sync="dialogVisible" width="70%">
      <div class="dialog_item">
        <div class="dialog_subtitle">设备类型</div>
        <div>{{dialog_sportType == 1 ? '无氧设备' : dialog_sportType == 2 ? '有氧设备' : ''}}</div>
      </div>
      <div class="dialog_item">
        <div class="dialog_subtitle">设备名称</div>
        <div>{{dialog_facilityName}}</div>
      </div>
      <div class="dialog_item">
        <div class="dialog_subtitle">设备背景图</div>
        <el-upload class="upload-demo" drag :action="actionApi" :show-file-list="false" key="sqebsg" :on-success="successUpload" :on-error="failedUpload" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="sportType" label="设备类型">
        <template slot-scope="scope">
          {{scope.row.sportType == 1 ? '无氧运动' : scope.row.sportType == 2 ? '有氧运动' : ''}}
        </template>
      </el-table-column>
      <el-table-column prop="facilityName" label="设备名称"></el-table-column>
      <el-table-column label="背景图片">
        <template slot-scope="scope">
          <img :src="scope.row.backgroundPicUrl" alt="" style="width: 100px;" v-if="scope.row.backgroundPicUrl">
          <span v-else>空</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="score2" label="大小"></el-table-column> -->
      <el-table-column prop="backgroundPicUrl" label="输出地址">
        <template slot-scope="scope">
          <span v-if="scope.row.backgroundPicUrl">{{scope.row.backgroundPicUrl}}</span>
          <span v-else>空</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="editImage(scope.row)" v-permission="'b3b80205-e76c-4cb0-b1cb-ff81d4a2dd39'">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
 <script>
import { uploadFileApi } from 'common/common';
import { updateFacilityConfig } from 'api/configuration/facilityConfig';

export default {
  data() {
    return {
      id: '',
      dialog_facilityType: '',
      dialogVisible: false,
      dialog_sportType: '',
      dialog_facilityName: '',
      imageUrl: '',
      actionApi: uploadFileApi,
      isOverUploading: true
    };
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    this.$nextTick( () => {
      // console.log(this.tableData)
    })
  },
  methods: {
    beforeAvatarUpload(file) {
      this.isOverUploading = false;
      const isMP4 = file.type === 'image/png' || file.type === 'image/jpeg';
      const isLt20M = file.size / 1024 / 1024 > 0;

      if (!isMP4) {
        this.$notify.error('上传图片只能是 JPG/PNG 格式!');
      }
      if (!isLt20M) {
        this.$notify.error('上传图片大小不能超过 1MB!');
      }
      if (isMP4 && isLt20M) {
        this.isOverUploading = true;
      }
      return isMP4 && isLt20M;
    },
    successUpload(response, file, filelist) {
      this.imageUrl = response.data['oss-request-url'];
      this.isOverUploading = true;
    },
    failedUpload(err, file, filelist) {
      this.$notify.error('文件上传失败, 请重新上传');
      this.isOverUploading = true;
    },
    editImage(row) {
      this.id = row.id;
      this.dialog_facilityType = row.facilityType;
      this.dialog_sportType = row.sportType;
      this.dialog_facilityName = row.facilityName;
      this.imageUrl = row.backgroundPicUrl;
      this.dialogVisible = true;
    },
    confirm() {
      if (!this.isOverUploading) {
        return this.$notify.warning('请等待文件上传成功');
      } 
      this.dialogVisible = false;
      updateFacilityConfig({
        id: this.id,
        facilityName: this.dialog_facilityName,
        facilityType: this.dialog_facilityType,
        sportType: this.dialog_sportType,
        backgroundPicUrl: this.imageUrl
      }).then( (res) => {
        if (res.data.code == 200) {
          this.$notify.success('编辑设备配置成功');
          this.$emit('refreshData')
          return;
        } else {
          this.$notify.error('编辑设备配置失败');
        }
      }).catch( () => {
        this.$notify.error('编辑设备配置失败');
      })
    }
  }
};
</script>
 <style lang="scss" scoped>
@import '~assets/style/utils';
.avatar-uploader .el-upload {
  width: 100%;
  height: 100%;
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.dialog_item {
  @include flexbox;
  padding: {
    top: 10px;
    bottom: 10px;
  }
}
.dialog_subtitle {
  width: 120px;
}
</style>
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
        <div class="dialog_subtitle">视频</div>
        <el-upload ref="upload" class="upload-demo" :action="actionApi" :limit="1" :on-success="successUpload" :on-error="failedUpload" :before-upload="beforeAvatarUpload" :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div style="font-size:10px;color:red">(出现<span style="color:green">绿色对号<i class="el-icon-circle-check"></i></span>标识时为上传成功!)</div>
        </el-upload>
        <!-- <el-upload class="upload-demo" :action="actionApi" :on-success="successUpload" :on-error="failedUpload" :before-upload="beforeAvatarUpload" :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button> 
        </el-upload> -->
      </div>
      <div class="dialog_item">
        <div class="dialog_subtitle">当前视频</div>
        <div>{{videoName}}</div>
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
      <el-table-column prop="typeVideoUrl" label="视频">
        <template slot-scope="scope">
          <span v-if="scope.row.typeVideoUrl">{{scope.row.typeVideoUrl}}</span>
          <span v-else>空</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="editIcon(scope.row)" v-permission="'d577f782-6609-4179-9d08-08298a604c62'">编辑</el-button>
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
      videoName: 'xx',
      fileList: [],
      videoUrl: '',
      actionApi: uploadFileApi,
      isOverUploading: false
    };
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      const isMP4 = file.type === 'video/mp4';
      const isLt20M = file.size / 1024 / 1024 > 0;

      if (!isMP4) {
        this.$notify.error('上传视频只能是 MP4 格式!');
      }
      if (!isLt20M) {
        this.$notify.error('上传视频大小不能超过 20MB!');
      }
      return isMP4 && isLt20M;
    },
    successUpload(response, file, filelist) {
      this.videoUrl = response.data['oss-request-url'];
      this.videoName = file.name;
      this.isOverUploading = true;
    },
    failedUpload(err, file, filelist) {
      this.$notify.error('文件上传失败, 请重新上传');
      this.isOverUploading = true;
    },
    editIcon(row) {
      this.id = row.id;
      this.dialog_facilityType = row.facilityType;
      this.videoUrl = row.typeIconUrl;
      this.videoName = row.typeVideoUrl;
      this.dialog_sportType = row.sportType;
      this.dialog_facilityName = row.facilityName;
      this.filelist = [];
      this.dialogVisible = true;
      this.$nextTick( () => {
        this.$refs.upload.clearFiles();
      })
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
        typeVideoUrl: this.videoUrl
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
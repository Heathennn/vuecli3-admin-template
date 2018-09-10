<template>
  <div class="trainingLevelPage">
    <div class="trainingLevel_header">
      <sub-title title="训练难度等级设置"></sub-title>
      <el-button type="primary" @click="create" v-permission="'4aeb955b-4580-4d4a-ac6f-293d673f8d3a'">新增</el-button>
    </div>

    <el-dialog :title="isCreate ? '新增训练难度等级': '编辑训练难度等级'" :visible.sync="dialogVisible" width="50%" center :before-close="handleClose">
      <div class="dialog_trainingType">
        <div class="dialog_item">
          <div class="dialog_subtitle">强度等级</div>
          <el-input placeholder="强度等级" v-model="strengthLevel" style="width: 250px"></el-input>
        </div>
        <div class="dialog_item">
          <div class="dialog_subtitle">对应训练等级</div>
          <el-input placeholder="对应训练等级" v-model="fitnessBaseLv" style="width: 250px"></el-input>
        </div>
        <div class="dialog_item">
          <div class="dialog_subtitle">提示文案</div>
          <el-input placeholder="提示文案(30字内)" v-model="rankDesc" style="width: 400px" type="textarea" maxlength="30"></el-input>
        </div>
        <div class="dialog_item">
          <div class="dialog_subtitle">ICON</div>
          <el-upload v-loading="isUploading" class="upload-demo" drag :action="actionApi" :show-file-list="false" :on-success="successUpload" :on-error="failedUpload" :before-upload="beforeAvatarUpload">
            <img v-if="iconUrl" :src="iconUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdate">确 定</el-button>
      </span>
    </el-dialog>

    <div class="trainingLevel_table" v-loading="isLoading" v-permission="'d4b6e4a7-8a1b-40be-96f0-6e7085cd6eb6'">
      <el-table :data="rank" style="width: 100%">
          <el-table-column label="ID" prop="id">
          </el-table-column>
          <el-table-column label="训练强度等级" prop="fitnessBaseLv">
          </el-table-column>
          <el-table-column label="对应训练等级" prop="strengthLv">
          </el-table-column>
          <el-table-column label="ICON" prop="iconUrl">
            <template slot-scope="scope">
              <img :src="scope.row.iconUrl" alt="" style="max-width: 100px;">
            </template>
          </el-table-column>
          <el-table-column label="提示文案" prop="rankDesc">
          </el-table-column>
          <el-table-column label="操作" prop="time" width="300">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="editLevel(scope.row)" v-permission="'0f38c832-6f2c-4f6a-89c2-349394f55bf4'">编辑</el-button>
              <el-button type="danger" plain @click="removeLevel(scope.row)" v-permission="'c3d41bb7-8320-48e4-8a53-9377c6c62b6f'">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import { getPlanRank, updatePlanRank, removePlanRank } from 'api/training/trainingLevel';

import { uploadFileApi } from 'common/common';

export default {
  data() {
    return {
      actionApi: uploadFileApi,
      iconUrl: '',
      isLoading: false,
      isUploading: false,
      rank: [],
      editingId: 0,
      isCreate: false,
      dialogVisible: false,
      strengthLevel: '', // 强度等级
      fitnessBaseLv: '',  // 训练等级
      rankDesc: '', // 提示文案
    }
  },
  components: {
    SubTitle
  },
  methods: {
     beforeAvatarUpload(file) {
      // console.log(file);
      this.isUploading = true;
      const isMP4 = file.type === 'image/png' || file.type === 'image/jpeg';
      const isLt20M = file.size / 1024 / 1024 < 1;

      if (!isMP4) {
        this.$notify.error('上传ICON只能是 JPG/PNG 格式!');
        this.isUploading = false;
      }
      if (!isLt20M) {
        this.$notify.error('上传ICON大小不能超过 1MB!');
        this.isUploading = false;
      }
      return isMP4 && isLt20M;
    },
    successUpload(response, file, filelist) {
      this.iconUrl = response.data['oss-request-url'];
      this.isUploading = false;
    },
    failedUpload(err, file, filelist) {
      this.$notify.error('文件上传失败, 请重新上传');
      this.isUploading = false;
    },
    editLevel(row) {
      this.isCreate = false;
      this.dialogVisible = true;
      this.iconUrl = row.iconUrl;
      this.editingId = row.id;
      this.strengthLevel = row.strengthLv;
      this.fitnessBaseLv = row.fitnessBaseLv;
      this.rankDesc = row.rankDesc;
    },
    create() {
      this.isCreate = true;
      this.iconUrl = '';
      this.editingId = null;
      this.strengthLevel = '';
      this.fitnessBaseLv = '';
      this.rankDesc = '';
      this.dialogVisible = true;
    },
    handleClose(done) {
      done()
    },
    fetchRank() {
      this.isLoading = true;
      getPlanRank().then( (res) => {
        // console.log(res);
        this.rank = res.data.data.list;
        this.isLoading = false;
      }).catch( () => {
        this.isLoading = false;
      })
    },
    confirmUpdate() {
      this.dialogVisible = false;
      if (this.isCreate) {
        updatePlanRank({
          iconUrl: this.iconUrl,
          rankDesc: this.rankDesc,
          strengthLv: this.strengthLevel,
          fitnessBaseLv: this.fitnessBaseLv
        }).then( (res) => {
          if (res.data.code == 200) {
            this.$notify.success('新增训练难度等级成功');
            this.fetchRank();
            return;
          } else {
            this.$notify.error('新增训练难度等级失败');
          }
        }).catch( () => {
          this.$notify.error('新增训练难度等级失败');
        })
      } else {
        updatePlanRank({
          id: this.editingId,
          iconUrl: this.iconUrl,
          rankDesc: this.rankDesc,
          strengthLv: this.strengthLevel,
          fitnessBaseLv: this.fitnessBaseLv
        }).then( (res) => {
          if (res.data.code == 200) {
            this.$notify.success('修改训练难度等级成功');
            this.fetchRank();
            return;
          } else {
            this.$notify.error('修改训练难度等级失败');
          }
        }).catch( () => {
          this.$notify.error('修改训练难度等级失败');
        })
      }
    },
    removeLevel(row) {
      if (confirm('确认要删除吗')) {
        removePlanRank({
          id: row.id
        }).then( (res) => {
          if ( res.data.code == 200) {
            this.$notify.success('删除等级成功');
            this.fetchRank();
            return
          } else {
            this.$notify.error('删除等级失败');
            return;
          }
        }).catch( () => {
          this.$notify.error('删除等级失败');
        })  
      }
    }
  },
  mounted() {
    this.$nextTick( () => {
      this.fetchRank();
    })
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.trainingLevel_header {
  @include flexbox;
  @include justify-content(space-between);
  @include align-items(center);
}

.dialog_item {
  @include flexbox;
  @include align-items(center);
  padding: {
    bottom: 10px;
  }
}
.dialog_subtitle {
  width: 100px;
}

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

</style>


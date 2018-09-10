<template>
  <div class="newPlanPage">
    <div class="title">训练类型和计划</div>

    <div class="trainingType" v-permission="'19d9d3de-3efc-4a6d-9c40-37c5673a8b0a'">
      <div class="trainingType_header">
        <sub-title title="训练类型"></sub-title>
        <el-button type="primary" @click="createTrainingType" v-permission="'5ca9a3c5-6d4b-40d9-895a-0291097681f4'">新建训练类型版块</el-button>
      </div>
      <!-- 新建训练类型 -->

      <el-dialog :title="isCreate ? '新建' : '编辑'" :visible.sync="dialogVisible" width="50%" center :before-close="handleClose">
        <div class="dialog_trainingType">
          <div class="dialog_subTitle">训练类型</div>
          <el-input v-model="trainingType" style="width: 250px" maxlength="8" placeholder="8个汉字内"></el-input>
        </div>
        <div class="tipContent">
          <div class="dialog_subTitle">提示文案</div>
          <el-input v-model="tipContent" type="textarea" style="width: 350px" maxlength="30" placeholder="30汉字内"></el-input>
        </div>
        <div class="uploadFile">
          <div class="dialog_subTitle">ICON</div>
          <el-upload v-loading="isUploading" class="upload-demo" drag :action="actionApi" :show-file-list="false" :on-success="successUpload" :on-error="failedUpload" :before-upload="beforeAvatarUpload">
            <img v-if="iconUrl" :src="iconUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="BMIconfig">
          <div class="dialog_subTitle">BMI最小值</div>
          <el-input v-model="bmiMinValue" style="width: 200px" placeholder="BMI最小值"></el-input>
        </div>
        <div class="BMIconfig">
          <div class="dialog_subTitle">BMI最大值</div>
          <el-input v-model="bmiMaxValue" style="width: 200px" placeholder="BMI最大值"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmUpdateType">确 定</el-button>
        </span>
      </el-dialog>
      <div class="trainingTypeTable" v-loading="isLoadingTrainingType" v-permission="'006f1449-3e14-4218-919f-5969645e8060'">
        <el-table :data="trainingTypeList" style="width: 100%">
          <el-table-column label="ID" prop="id">
          </el-table-column>
          <el-table-column label="训练类型" prop="name">
          </el-table-column>
          <el-table-column label="提示文案" prop="typeDesc">
          </el-table-column>
           <el-table-column label="ICON" prop="iconUrl">
            <template slot-scope="scope">
              <!-- <drop-down-image :source="scope.row.iconUrl"></drop-down-image> -->
              <img :src="scope.row.iconUrl" alt="" style="max-width: 100px">
            </template>
          </el-table-column>
          <el-table-column label="前端显示" prop="displayStatus">
            <template slot-scope="scope">
              <el-switch v-permission="'067af995-fb7f-4fc5-b1ee-8c6e4bac64b2'" v-model="scope.row.displayStatus" :active-value="1" :inactive-value="2" @change="switchChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="time" width="300">
            <template slot-scope="scope">
              <div style="padding-top: 7px;"> 
              <el-badge :value="scope.row.isSetDif == 0 ? '待设置' : ''" v-permission="'4d06bedc-e34e-4213-9e27-42aa513fb32b'">
                <el-button type="primary" plain @click="jumpToDifficultyConfig(scope.row)" v-permission="'4d06bedc-e34e-4213-9e27-42aa513fb32b'">设置难度</el-button>
              </el-badge>
              <el-button type="primary" plain @click="editType(scope.row)" v-permission="'5f57b9a5-2a4a-436e-8487-610a959de3d6'">编辑</el-button>
              <el-button type="danger" plain @click="removeType(scope.row)" v-permission="'438c34a6-aaa6-4109-b1ae-7c1aedda863e'">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="trainingPart" v-permission="'f2cbfbf6-4532-4311-abec-78d2c5db4ba7'">
      <div class="trainingPart_header">
        <sub-title title="训练部位计划"></sub-title>
      </div>
      <div class="trainingPartTabs" v-if="trainingTypeList && trainingTypeList.length > 0" v-loading="isLoading">
        <el-tabs v-model="activeType" type="card" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in trainingTypeList" :key="index" :label="item.name" :name="item.id + ''">
            <training-plan-table :tableData="trainingPartList"
                                 :tabName="item.name" 
                                 :planTypeId="item.id"
                                 @refreshData="fetchTrainingPartList"
                                 v-permission="'ebf19857-d6f4-4eb2-8483-c321f4149828'"> </training-plan-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import TrainingPlanTable from './components/TrainingPlanTable';

import DropDownImage from 'components/DropDownImage';

import { uploadFileApi } from 'common/common';

import { getTrainingTypeList, getTrainingPartList, updateTrainingType, removeTrainingType } from 'api/training/newPlan';

export default {
  data() {
    return {
      iconUrl: '',
      actionApi: uploadFileApi,
      activeType: '2',
      bmiMinValue: '',
      bmiMaxValue: '',
      isCreate: true,
      currentId: null,
      trainingType: '', // 新增/修改 训练类型
      tipContent: '', // 新增/修改 提示文案
      dialogVisible: false,
      trainingTypeList: [],
      trainingPartList: [],
      isLoading: false,
      isLoadingTrainingType: false,
      isUploading: false,
    };
  },
  components: {
    SubTitle,
    TrainingPlanTable,
    DropDownImage
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchTrainingType().then(() => {
        vm.activeType = vm.trainingTypeList[0]
          ? vm.trainingTypeList[0].id + ''
          : '0';
        vm.fetchTrainingPartList(vm.activeType);
      });
      });
    })
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
    verifyData() {
      if (!this.trainingType || !this.tipContent) return false;
      return true;
    },
    jumpToDifficultyConfig(row) {
      this.$router.push({path: `/training/DifficultyConfig?planTypeId=${row.id}&planType=${row.name}`})
    },
    handleClose(done) {
      this.resetData();
      done();
    },
    editType(row) {
      this.iconUrl = row.iconUrl;
      this.trainingType = row.name;
      this.tipContent = row.typeDesc;
      this.bmiMinValue = row.mixBmi;
      this.bmiMaxValue = row.maxBmi;
      this.dialogVisible = true;
      this.currentId = row.id;
      this.isCreate = false;
    },
    removeType(row) {
      removeTrainingType({
        id: row.id
      }).then( (res) => {
        if (res.data.code == 200) {
          this.$notify.success('删除成功');
          this.fetchTrainingType();
          return;
        }
        this.$notify.error('删除失败');
      }).catch( () => {
        this.$notify.error('删除失败')
      })
    },
    createTrainingType() {
      this.trainingType = '';
      this.tipContent = '';
      this.currentId = null;
      this.isCreate = true;
      this.dialogVisible = true;
    },
    resetData() {
      this.dialogVisible = false;
      this.tipContent = '';
      this.trainingType = '';
      this.currentId = null;
    },
    confirmUpdateType() {
      if (this.isCreate) {
        if (!this.verifyData()) {
          this.$notify.warning('训练类型或提示文案不能为空');
          return;
        }
        updateTrainingType({
          name: this.trainingType,
          typeDesc: this.tipContent,
          iconUrl: this.iconUrl,
          minBmi: this.bmiMinValue,
          maxBmi: this.bmiMaxValue
        }).then( (res) => {
          if (res.data.code == 200) {
            this.$notify.success('创建训练类型成功');
            this.resetData();
            this.fetchTrainingType();
            return;
          }
          this.$notify.error('创建失败');
          this.resetData();
        }).catch( () => {
          this.$notify.error('创建失败');
          this.resetData();
        })
      } else {
        if (!this.verifyData()) {
          this.$notify.warning('训练类型或提示文案不能为空');
          return;
        }
        updateTrainingType({
          id: this.currentId,
          name: this.trainingType,
          typeDesc: this.tipContent,
          iconUrl: this.iconUrl,
          minBmi: this.bmiMinValue,
          maxBmi: this.bmiMaxValue
        }).then( (res) => {
          if (res.data.code == 200) {
            this.$notify.success('编辑训练类型成功');
            this.resetData();
            this.fetchTrainingType();
            return;
          }
          this.$notify.error('编辑失败');
          this.resetData();
        }).catch( () => {
          this.$notify.error('编辑失败');
          this.resetData();
        })
      }
    },
    switchChange(row) {
      updateTrainingType({
        id: row.id,
        displayStatus: row.displayStatus
        }).then( (res) => {
          if (res.data.code == 200) {
            this.$notify.success('修改显示状态成功');
            this.fetchTrainingType();
            return;
          }
          this.$notify.error('修改显示状态失败');
        }).catch( () => {
          this.$notify.error('修改显示状态失败');
        })
    },
    handleClick(tab) {
      this.fetchTrainingPartList(tab.name);
    },
    fetchTrainingType() {
      this.isLoadingTrainingType = true;
      return new Promise((resolve, reject) => {
        getTrainingTypeList({
          page: 1,
          size: 100
        })
          .then(res => {
            // console.log(res);
            this.trainingTypeList = res.data.data.list;
            this.isLoadingTrainingType = false;
            resolve();
          })
          .catch(() => {
            this.isLoadingTrainingType = false;
            reject();
          });
      });
    },
    fetchTrainingPartList(id) {
      this.isLoading = true;
      getTrainingPartList({
        page: 1,
        size: 100,
        planTypeId: id
      }).then(res => {
        this.trainingPartList = res.data.data.list;
        this.isLoading = false;
      }).catch( () => {
        this.isLoading = false;
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchTrainingType().then(() => {
        this.activeType = this.trainingTypeList[0]
          ? this.trainingTypeList[0].id + ''
          : '0';
        this.fetchTrainingPartList(this.activeType);
      });
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.newPlanPage {
  background-color: #ffffff;
  width: 100%;
  min-height: 100%;
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

.trainingType {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #e5e5e5;
  margin: {
    top: 10px;
  }
}
.trainingPart {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #e5e5e5;
  margin: {
    top: 10px;
  }
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
.trainingType_header {
  @include flexbox;
  @include align-items(center);
  @include justify-content(space-between);
}
.dialog_trainingType {
  @include flexbox;
  @include align-items(center);
  margin: {
    bottom: 20px;
  }
}
.uploadFile {
  @include flexbox;
   margin: {
    top: 20px;
  }
}
.dialog_subTitle {
  width: 100px;
}
.tipContent {
  @include flexbox;
  @include align-items(center);
}
.BMIconfig {
  @include flexbox;
  @include align-items(center);
  margin: {
    top: 10px;
    bottom: 10px;
  }
}
.trainingPartTabs {
  margin: {
    top: 20px;
  }
}
</style>

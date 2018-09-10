<template>
  <div class="fatigueLevelPage">
    <div class="level" v-permission="'c947f28e-625d-45bc-9317-c0317ebee80b'">
      <div class="level_header" v-permission="'c947f28e-625d-45bc-9317-c0317ebee80b'">
        <sub-title title="疲劳评价"></sub-title>
        <el-button type="primary" @click="createFatigue" v-permission="'0243f807-bbfa-472e-b4cd-418878136a81'">新增</el-button>
      </div>
     <!-- 新增/修改疲劳评价 -->
      <el-dialog :title="isCreate ? '新建' : '编辑'" :visible.sync="dialogVisible" width="50%" center :before-close="handleClose">
        <div class="dialog_trainingType dialog_item">
          <div class="dialog_subTitle">疲劳评价</div>
          <el-input v-model="dialog_fatigueName" style="width: 250px"></el-input>
        </div>
        <div class="uploadFile dialog_item">
          <div class="dialog_subTitle">ICON</div>
          <el-upload v-loading="isUploading" class="upload-demo" drag :action="actionApi" :show-file-list="false" :on-success="successUpload" :on-error="failedUpload" :before-upload="beforeAvatarUpload">
            <img v-if="iconUrl" :src="iconUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmUpdateType">确 定</el-button>
        </span>
      </el-dialog>

      <el-table :data="fatigueList" style="width: 100%" v-permission="'c2b6eeeb-6578-4e28-a6dd-5f302401339a'">
        <el-table-column label="ID" prop="id">
        </el-table-column>
        <el-table-column label="疲劳评价" prop="name">
        </el-table-column>
         <el-table-column label="ICON" prop="iconUrl">
           <template slot-scope="scope">
             <img :src="scope.row.iconUrl" alt="" style="max-width: 100px;">
           </template>
        </el-table-column>  
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="editFatigue(scope.row)" v-permission="'ad92eef2-cb07-441e-abe0-e98cd8475680'">编辑</el-button>
            <el-button type="danger" plain @click="remove(scope.row)" v-permission="'ba4e37d4-7fc6-49f0-9d3e-06fe51dcf614'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    

    <div class="level_affect" v-permission="'a8c437d2-1dc2-4614-9fbe-6dd0dadf55ae'"> 
      <div class="level_affect_header">
        <sub-title title="疲劳评价影响"></sub-title>
      </div>
       <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-permission="'e236aff1-b47e-4874-82bc-8d2d5f7e1b84'">
        <el-tab-pane label="第M次反馈" name="m">
          <affect-table :tableData="affectList" @refreshData="fetchAffectList_M"></affect-table>
        </el-tab-pane>
        <el-tab-pane label="第N次反馈" name="n">
          <affect-table :tableData="affectList" @refreshData="fetchAffectList_N"></affect-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 阈值设置 -->
     <el-dialog title="阈值设置" :visible.sync="thresholdVisible" width="50%" center>
        <div class="dialog_item">
          <div class="dialog_subTitle" style="width: 80px;">设备名称</div>
          <div>{{dialog_facilityName}}</div>
        </div>
        <div v-for="(item, index) in dialog_unitInfoVos" :key="index" class="dialog_units dialog_item">
          <div style="width: 80px;">{{item.unitName}}</div> 
          <div>最低 <el-input v-model="item.minValue" style="width: 120px">
            <span slot="append">{{item.unitSymbol}}</span>
            </el-input></div>
          <div>最高 <el-input v-model="item.maxValue" style="width: 120px">
            <span slot="append">{{item.unitSymbol}}</span>
          </el-input></div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="thresholdVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmThreshold">确 定</el-button>
        </span>
      </el-dialog>
    <div class="threshold_list">
      <div style="margin-top: 20px; margin-bottom: 20px">
        <sub-title title="疲劳评价阈值"></sub-title>
      </div>
      <el-table :data="thresholdList" style="width: 100%">
        <el-table-column label="分类" prop="sportType">
          <template slot-scope="scope">
            {{scope.row.sportType == 1 ? '无氧设备' : scope.row.sportType == 2 ? '有氧设备': ''}}
          </template>
        </el-table-column>
        <el-table-column label="设备名称" prop="facilityName">
        </el-table-column>
        <el-table-column label="疲劳评价" prop="unitInfoVos">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.unitInfoVos" :key="index">
              <span>{{item.unitName}}</span>:<span>最低{{item.minValue}}{{item.unitSymbol}};</span><span>最高{{item.maxValue}}{{item.unitSymbol}}</span>;
            </div>
          </template>
        </el-table-column> 
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="configThreshold(scope.row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import AffectTable from './components/AffectTable';

import { getFatigueLevelAffectList, getFatigueList, updateFatigueName, removeFatigue, updateFatigueAffect, getFatigueThresholdList, updateThresholdConfig } from 'api/training/fatigueLevel';

import { uploadFileApi } from 'common/common';

export default {
  data() {
    return {
      activeName: 'm',
      affectList: [],
      fatigueList: [],
      isCreate: false,
      dialogVisible: false,
      affectVisible: false,
      dialog_fatigueName: '',
      dialog_id: '',
      thresholdList: [],
      dialog_item: null,
      dialog_facilityName: '',
      dialog_unitInfoVos: [],
      thresholdVisible: false,
      isUploading: false,
      actionApi: uploadFileApi,
      iconUrl: ''
    }
  },
  components: {
    SubTitle,
    AffectTable
  },
  methods: {
    beforeAvatarUpload(file) {
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
    configThreshold(row) {
      this.dialog_item = row;
      this.dialog_facilityName = row.facilityName
      this.dialog_unitInfoVos = row.unitInfoVos ? JSON.parse(JSON.stringify(row.unitInfoVos)) : []
      this.thresholdVisible = true;
    },
    confirmThreshold() {
      this.dialog_item.unitInfoVos = this.dialog_unitInfoVos;
      let params = [];
      let facilityName = this.dialog_item.facilityName;
      let facilityType = this.dialog_item.facilityType;
      this.dialog_item.unitInfoVos.forEach( (item) => {
        let param = {};
        param.facilityName = facilityName;
        param.facilityType = facilityType;
        param.unitId = item.unitId;
        param.mixValue = item.minValue;
        param.maxValue = item.maxValue;
        params.push(param);
      })
      params = JSON.stringify(params);
      this.thresholdVisible = false;
      updateThresholdConfig({
        param: params
      }).then( (res) => {
        if (res.data.code == 200) {
          this.$notify.success('上传疲劳阈值成功');
          this.fetchThresholdList();
          return;
        } else {
          this.$notify.error('上传疲劳阈值失败');
        }
      }).catch( () => {
        this.$notify.error('上传疲劳阈值失败');
      })
    },
    remove(row) {
      if (confirm('确认删除吗?')) {
        removeFatigue({
          id: row.id
        }).then( (res) => { 
          if (res.data.code == 200) {
            this.$notify.success('删除成功');
            this.fetchFatigue();
            return;
          } else {
            this.$notify.error('删除失败');
          }
        }).catch( () => {
          this.$notify.error('删除失败');
        })
      }
    },
    createFatigue() {
      this.isCreate = true;
      this.dialog_fatigueName = '';
      this.dialogVisible = true;
    },
    confirmUpdateType() {
      this.dialogVisible = false;
      if (this.isCreate) {
        updateFatigueName({name: this.dialog_fatigueName, iconUrl: this.iconUrl}).then( (res) => {
          if (res.data.code == 200) {
            this.$notify.success('新建疲劳评价成功');
            this.fetchFatigue();
          } else {
            this.$notify.error('新建疲劳评价失败');
          }
        }).catch( () => {
          this.$notify.error('新建疲劳评价失败');
        })
      } else {
        updateFatigueName({id: this.dialog_id,name: this.dialog_fatigueName, iconUrl: this.iconUrl}).then( (res) => {
          if (res.data.code == 200) {
            this.$notify.success('修改疲劳评价成功');
            this.fetchFatigue();
          } else {
            this.$notify.error('修改疲劳评价失败');
          }
        }).catch( () => {
          this.$notify.error('修改疲劳评价失败');
        })
      }
    },
    editFatigue(row) {
      this.isCreate = false;
      this.dialog_fatigueName = row.name;
      this.dialog_id = row.id;
      this.dialogVisible = true;
    },
    handleClose(done) {
      done();
    },  
    handleClick(tab, event) {
      // console.log(tab)
      if( tab.name == 'm') {
        this.fetchAffectList_M()
      } else {
        this.fetchAffectList_N()
      }
    },
    fetchAffectList_M() {
      getFatigueLevelAffectList({
        frequency: 1 // 奇数
      }).then( (res) => {
        this.affectList = res.data.data;
      })
    },
    fetchFatigue() {
      getFatigueList({
        page: 1,
        size: 100
      }).then( (res) => {
        this.fatigueList = res.data.data.list;
      })
    },
    fetchAffectList_N() {
      getFatigueLevelAffectList({
        frequency: 2 // 偶数
      }).then( (res) => {
        this.affectList = res.data.data;
      })
    },
    fetchThresholdList() {
      getFatigueThresholdList().then( (res) => {
        // console.log(res);
        res.data.data.forEach( (item) => {

        }) 
        this.thresholdList = res.data.data;
      })
    }
  },
  mounted() {
    this.$nextTick( () => {
      this.fetchThresholdList();
      this.fetchAffectList_M();
      this.fetchFatigue();
    })
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.fatigueLevelPage {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}
.level {
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid #e5e5e5;
  margin: {
    bottom: 20px;
  }
}
.level_affect {
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid #e5e5e5;
}
.level_header {
  @include flexbox;
  @include justify-content(space-between);
  @include align-items;
  margin: {
    bottom: 20px;
  }
}
.level_affect_header {
  margin: {
    bottom: 20px;
  }
}

.threshold_list {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  border: 1px solid #e5e5e5;
  margin: {
    top: 20px;
  }
}
.dialog_item {
  @include flexbox;
  @include align-items(center);
  margin: {
    top: 10px;
    bottom: 10px;
  }
}

.dialog_subTitle {
  width: 80px;
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


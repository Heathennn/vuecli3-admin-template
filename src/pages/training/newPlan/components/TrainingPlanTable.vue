<template>
  <div class="trainingPlanPage">
    <el-button type="primary" plain @click="createPlan">+训练部位计划</el-button>

    <el-dialog :title="isCreate?'新建':'编辑'" :visible.sync="dialogVisible" width="50%" center :before-close="handleClose">
      <div class="dialog_item">
        <div class="dialog_subTitle">训练类型</div>
        <el-input v-model="dialog_type" disabled style="width: 200px;"></el-input>
      </div>
      <div class="dialog_item">
        <div class="dialog_subTitle">训练计划名称</div>
        <el-input v-model="dialog_planname" style="width: 300px" maxlength="5" placeholder="限五个字"></el-input>
      </div>
      <div class="dialog_item">
        <div class="dialog_subTitle">选择训练部位</div>
        <div class="dialog_checkboxs">
          <el-checkbox-group v-model="dialog_parts" style="width: 100%">
            <el-checkbox v-for="city in parts" :label="city.id" :key="city.id" border style="margin-bottom: 10px">{{city.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="dialog_item">
        <div class="dialog_subTitle">关联图片</div>
        <el-upload class="avatar-uploader" 
                   style="width: 178px;"
                 drag 
                 :action="apiUrl"
                 :on-success="successUpload"
                 :on-error="failedUpload"
                 :before-upload="beforeAvatarUpload"
                 :limit="1"
                 :show-file-list="false"
                 >
          <img v-if="dialog_imgUrl" :src="dialog_imgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmUpdate">确 认</el-button>
        </span>
    </el-dialog>

    <el-table :data="datas" style="width: 100%">
      <el-table-column label="ID" prop="id">
      </el-table-column>
      <el-table-column label="训练计划名称" prop="planName">
      </el-table-column>
      <el-table-column label="训练计划部位" prop="planPart">
      </el-table-column>
      <el-table-column label="关联图片" prop="bodyImg">
        <template slot-scope="scope">
          <!-- <drop-down-image :source="scope.row.bodyImg"></drop-down-image> -->
          <img :src="scope.row.bodyImg" alt="" style="max-width: 100px">
        </template>
      </el-table-column>
      <el-table-column label="训练课程" prop="courseNum">
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime">
      </el-table-column>
      <el-table-column label="状态" prop="displayStatus">
        <template slot-scope="scope">
          {{scope.row.displayStatus == 1 ? '启用' : scope.row.displayStatus == 2 ? '禁用' : ''}}
        </template>
      </el-table-column>
      <el-table-column label="前端显示" prop="displayStatus">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.displayStatus" :active-value="1" :inactive-value="2" :disabled="scope.row.courseNum == 0" @change="switchChange(scope.row)" v-permission="'0604b63c-8efc-4930-a967-57200a691693'">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170px">
        <template slot-scope="scope">
          <div style="padding-top: 10px;padding-right: 10px;display: flex;justify-content: center;flex-direction: column;align-items: center">
            <el-badge :value="scope.row.courseNum == 0 ? '待设置' : ''" class="item">
              <el-button type="primary" plain @click="editCourse(scope.row)" style="margin-bottom: 5px;" v-permission="'b1383105-d560-49ff-8065-28adbec7efbd'">编辑课程</el-button>
            </el-badge>
            <el-button type="primary" plain @click="editPlan(scope.row)" style="margin-bottom: 5px;" v-permission="'4ca77024-2728-4012-b46d-28f499d28f57'">修改</el-button>
            <el-button type="danger" plain @click="removePlan(scope.row)" style="margin-left: 0;margin-bottom: 5px;" v-permission="'0f9fb069-36af-426f-a7a1-fccdc0bd14bc'">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  removeTrainingPartPlan,
  updateTrainingPartPlan
} from 'api/training/newPlan';

import DropDownImage from 'components/DropDownImage';

import { getTrainingParts } from 'api/training/trainingParts';

const URL_DEVELOPMENT = 'http://api-control.test.hxsapp.com/admin/Upload/uploadFile';

const URL_PRODUCTION = 'http://api-control.hxsapp.com/admin/Upload/uploadFile';

const HOST_DEVELOPMENT = 'admin-gym.test.hxsapp.com';

const HOST_PRODUCTION = 'admin-gym.hxsapp.com';

const HOST = window.location.host;

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    tabName: {
      type: String,
      default: () => ''
    },
    planTypeId: {
      type: Number,
      default: 0
    }
  },
  components: {
    DropDownImage
  },
  data() {
    return {
      active: 1,
      isCreate: false,
      dialogVisible: false,
      dialog_id: 0,
      dialog_type: this.tabName,
      dialog_planname: '',
      dialog_imgUrl: '',
      dialog_parts: [],
      parts: [],
      parts_name: []
    };
  },
  computed: {
    apiUrl() {
      return HOST === HOST_PRODUCTION ? URL_PRODUCTION : URL_DEVELOPMENT
    },
    datas() {
      let list = this.tableData.concat();
      list.forEach((item, index) => {
        item.planPart = item.bodyList ? item.bodyList.map(item => item.name).join('、') : '' ;
        item.planPartIds = item.bodyList ? item.bodyList.map(item => item.id).join('-') : '';
        item.createTime = this.moment(item.createTime).format(
          'YYYY-MM-DD HH:mm'
        );
      });
      return list;
    },
  },
  methods: {
    beforeAvatarUpload(file) {
      this.isUploading = true;
      const isMP4 = file.type === 'image/png' || file.type === 'image/jpeg';
      const isLt20M = file.size / 1024 / 1024 < 1;

      if (!isMP4) {
        this.$notify.error('上传图片只能是 JPG/PNG 格式!');
        this.isUploading = false;
      }
      if (!isLt20M) {
        this.$notify.error('上传图片大小不能超过 1MB!');
        this.isUploading = false;
      }
      return isMP4 && isLt20M;
    },
    switchChange(row) {
      updateTrainingPartPlan({
          id: row.id,
          planTypeId: row.planTypeId,
          displayStatus: row.displayStatus
        }).then( (res) => {
          if ( res.data.code == 200) {
            this.$notify.success('修改训练计划显示状态成功');
            this.$emit('refreshData', this.planTypeId)
            return;
          }
          this.$notify.error('修改训练计划显示状态失败')
        }).catch( () => {
          this.$notify.error('修改训练计划显示状态失败')
        })
    },
    geteditingIds() {
      let ids = [];
      this.parts_name.forEach( (name_item) => {
        this.parts.forEach( (part_item) => {
          if (part_item.name == name_item.name) {
            ids.push(part_item.id);
            return;
          }
        })
      })
      return ids;
    },
    removePlan(row) {
      if (confirm('确认要删除吗')) {
      removeTrainingPartPlan({
        id: row.id
      })
        .then(res => {
          if (res.data.code == 200) {
            this.$notify.success('删除成功');
            this.$emit('refreshData', row.planTypeId);
            return;
          }
          this.$notify.error('删除失败');
        })
        .catch(() => {
          this.$notify.error('删除失败');
        });
      }
    },
    resetDialog() {
      this.isCreate = false;
      this.dialog_type = this.tabName;
      this.dialog_planname = '';
      this.dialog_imgUrl = '';
      this.dialog_parts = []
      this.dialogVisible = false;
      this.dialog_id = 0,
      this.parts_name = []
    },
    successUpload(response) {
      this.dialog_imgUrl = response.data['oss-request-url']
    },
    failedUpload(error) {
      // console.log(error)
    },
    handleClose(done) {
      this.resetDialog();
      done();
    },
    createPlan() {
      this.resetDialog();
      this.isCreate = true;
      this.dialogVisible = true;
    },
    editPlan(row) {
      // console.log(row)
      this.isCreate = false;
      this.dialog_planname = row.planName;
      this.parts_name = row.bodyList ? row.bodyList : [];
      this.dialog_imgUrl = row.bodyImg;
      this.dialog_id = row.id;
      this.dialog_parts = this.geteditingIds();
      this.dialogVisible = true;
    },
    editCourse(row) {
      this.$router.push({path: `/training/courseConfig?id=${row.id}&planTypeId=${row.planTypeId}&planPart=${row.planPart}&type=${this.tabName}&planName=${row.planName}&bodyIds=${row.planPartIds}`})
    },
    confirmUpdate() {
      if (this.isCreate) {
        this.dialogVisible = false;
        updateTrainingPartPlan({
          planTypeId: this.planTypeId,
          planName: this.dialog_planname,
          bodyIds: this.dialog_parts.join(','),
          bodyImg: this.dialog_imgUrl
        }).then( (res) => {
          if ( res.data.code == 200) {
            this.$notify.success('添加训练计划成功');
            this.$emit('refreshData', this.planTypeId)
            this.resetDialog();
            return;
          }
          this.$notify.error('添加训练计划失败')
          this.resetDialog();
        }).catch( () => {
          this.$notify.error('添加训练计划失败')
          this.resetDialog();
        })
      } else {
        this.dialogVisible = false;
        updateTrainingPartPlan({
          id: this.dialog_id,
          planTypeId: this.planTypeId,
          planName: this.dialog_planname,
          bodyIds: this.dialog_parts.join(','),
          bodyImg: this.dialog_imgUrl
        }).then( (res) => {
          if ( res.data.code == 200) {
            this.$notify.success('修改训练计划成功');
            this.$emit('refreshData', this.planTypeId)
            this.resetDialog();
            return;
          }
          this.$notify.error('修改训练计划失败')
          this.resetDialog();
        }).catch( () => {
          this.$notify.error('修改训练计划失败')
          this.resetDialog();
        })
      }
    },
    fetchParts() {
      getTrainingParts({page: 1, size: 100}).then( (res) => {
        if ( res.data.code == 200 && res.data.data) {
          this.parts = res.data.data.list;
        } else {
          this.parts = []
        }
      }).catch( () => {
        this.parts = []
      })
    }
  },
  mounted() {
    this.$nextTick( () => {
      this.fetchParts()
    })
  }

};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.dialog_item {
  @include flexbox;
  @include align-items(center);
  padding: {
    top: 10px;
    bottom: 10px;
  }
}

.dialog_subTitle{
  width: 120px;
}
.dialog_checkboxs {
  flex: 1;
  width: 100%;
  @include flexbox;
  @include flex-wrap(wrap);
  @include align-items(center);
  @include justify-content(space-around);
}
.el-upload-dragger {
  width: 178px;
}
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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
    width: 100%;

    display: block;
  }
</style>

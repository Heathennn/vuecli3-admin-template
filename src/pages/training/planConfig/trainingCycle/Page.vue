<template>
  <div class="trainingCycle">
    <div class="cycle">
      <div class="cycle_header" v-permission="'2a2c5f3c-ec4c-42e2-a910-0aa1480692c0'">
        <sub-title title="训练周数"></sub-title>
        <el-button type="primary" @click="createCycle" v-permission="'66894b94-106b-4d38-bd23-94f051c0b92f'">新增</el-button>
      </div>
      <!-- 设置训练周数列表 -->
      <el-dialog :title="isCreate ? '新增': '编辑'" :visible.sync="dialogVisible" width="50%" center :before-close="handleClose">
        <div class="dialog_item">
          <div class="dialog_subtitle">训练周期</div>
          <el-input placeholder="训练周期" v-model="dialog_cycle" style="width: 250px">
            <template slot="append">周</template>
          </el-input>
        </div>
        <div class="dialog_item">
          <div class="dialog_subtitle">提示文案</div>
          <el-input placeholder="提示文案(30字以内)" v-model="dialog_tip" style="width: 300px" type="textarea" maxlength="30"></el-input>
        </div>

        <div class="dialog_item uploadFile">
          <div class="dialog_subtitle">ICON</div>
          <el-upload v-loading="isUploading" class="upload-demo" drag :action="actionApi" :show-file-list="false" :on-success="successUpload" :on-error="failedUpload" :before-upload="beforeAvatarUpload">
            <img v-if="iconUrl" :src="iconUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmUpdate">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 每周训练日数 -->
      <el-dialog title="设置" :visible.sync="cyclenumVisible" width="50%" center>
        <div class="dialog_item">
          <div class="dialog_subtitle">每周训练日</div>
          <el-checkbox-group v-model="selectedDays">
            <el-checkbox v-for="part in weekDays" :label="part.value" :key="part.value" border>{{part.label}}</el-checkbox>
          </el-checkbox-group>
        </div>
          <div>最少运动{{selectedDays.length}}天;已选:
            <span v-for="(item, index) in selectedValues" :key="index">{{item}};</span>
          </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cyclenumVisible = false">取 消</el-button>
          <el-button type="primary" @click="cycleConfig">确 定</el-button>
        </span>
      </el-dialog>

      <el-table :data="cycleList" style="width: 100%" v-permission="'c4dfa1b5-d128-4ada-b0e9-45134cd03713'">
        <el-table-column label="ID" prop="id">
        </el-table-column>
        <el-table-column label="周数选择" prop="cycleNum">
          <template slot-scope="scope">
            {{scope.row.cycleNum}}周
          </template>
        </el-table-column>
        <el-table-column label="提示文案" prop="tipText">
        </el-table-column>
        <el-table-column label="ICON" prop="iconUrl">
          <template slot-scope="scope">
            <img :src="scope.row.iconUrl" alt="" style="max-width: 100px">
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="time" width="300">
          <template slot-scope="scope">
            <el-button type="primary" @click="editCycle(scope.row)" plain v-permission="'77767639-9c70-46bb-b22a-178a5d449518'">编辑</el-button>
            <el-button type="danger" @click="removeCycle(scope.row)" plain v-permission="'93f4662c-a409-4182-ac16-9ff495d35792'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="cycle_days" v-permission="'bb98f2d0-26c2-49e1-909c-a145186b3f86'">
      <sub-title title="每周训练日数"></sub-title>
      <div class="least_days">每周训练日: 最少{{trainDay}}天
        <a class="hyperlink" @click="editConfig" v-permission="'e3021ead-8b2c-4b19-991b-52ae14f77eda'">设置</a>
      </div>
    </div>
  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import {
  getTrainingCycle,
  updateTrainingCycle,
  removeTrainingCycle
} from 'api/training/trainingCycle';

import {
  getTrainingConfig,
  updateTrainingConfig
} from 'api/training/trainingConfig';

import { uploadFileApi } from 'common/common';

export default {
  data() {
    return {
      actionApi: uploadFileApi,
      isUploading: false,
      leastDays: 3,
      cycleList: [],
      isCreate: false,
      cyclenumVisible: false,
      dialogVisible: false,
      dialog_cycle: 0,
      dialog_tip: '',
      dialog_id: 0,
      iconUrl: '',
      trainDay: '',
      cycles: [],
      selectedDays: [],
      weekDays: [
        {
          value: 1,
          label: '周一'
        },
        {
          value: 2,
          label: '周二'
        },
        {
          value: 3,
          label: '周三'
        },
        {
          value: 4,
          label: '周四'
        },
        {
          value: 5,
          label: '周五'
        },
        {
          value: 6,
          label: '周六'
        },
        {
          value: 0,
          label: '周日'
        }
      ]
    };
  },
  watch: {
    
  },
  computed: {
    selectedValues() {
      let values = [];
      this.selectedDays.forEach(selectedItem => {
        this.weekDays.forEach(week => {
          if (week.value == selectedItem) {
            values.push(week.label);
          }
        });
      });
      
      return values.sort();
    }
  },
  components: {
    SubTitle
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
    editConfig() {
      this.selectedDays = this.cycles;
      this.cyclenumVisible = true;
    },
    cycleConfig() {
      if (this.selectedDays.length < 3) {
        return this.$notify.warning('最少选择三天');
      }
      this.cyclenumVisible = false;
      updateTrainingConfig({
        confType: 'trainDay',
        confValue: this.selectedDays.join(',')
      }).then(res => {
        if (res.data.code == 200) {
          this.$notify.success('修改配置成功');
          this.fetchConfig();
          return;
        } else {
          this.$notify.error('修改配置失败');
        }
      }).catch( () => {
        this.$notify.error('修改配置失败');
      })
    },
    removeCycle(row) {
      if (confirm('确认要删除吗')) {
        removeTrainingCycle({
          id: row.id
        })
          .then(res => {
            if (res.data.code == 200) {
              this.$notify.success('删除成功');
              this.fetchCycles();
            } else {
              this.$notify.error('删除失败');
            }
          })
          .catch(() => {
            this.$notify.error('删除失败');
          });
      }
    },
    resetDialog() {
      this.dialog_cycle = 0;
      this.dialog_tip = '';
      this.isCreate = false;
    },
    createCycle() {
      this.isCreate = true;
      this.dialog_id = null;
      this.dialog_cycle = '';
      this.dialog_tip = '';
      this.iconUrl = '';
      this.dialogVisible = true;
    },
    editCycle(row) {
      this.isCreate = false;
      this.iconUrl = row.iconUrl;
      this.dialog_cycle = row.cycleNum;
      this.dialog_tip = row.tipText;
      this.dialog_id = row.id;
      this.dialogVisible = true;
    },
    handleClose(done) {
      this.resetDialog();
      done();
    },
    confirmUpdate() {
      this.dialogVisible = false;
      if (this.isCreate) {
        updateTrainingCycle({
          tipText: this.dialog_tip,
          cycleNum: this.dialog_cycle,
          iconUrl: this.iconUrl,
        })
          .then(res => {
            if (res.data.code == 200) {
              this.$notify.success('创建成功');
              this.fetchCycles();
              return;
            } else {
              this.$notify.error('创建失败');
            }
          })
          .catch(() => {
            this.$notify.error('创建失败');
          });
      } else {
        updateTrainingCycle({
          id: this.dialog_id,
          tipText: this.dialog_tip,
          cycleNum: this.dialog_cycle,
          iconUrl: this.iconUrl,
        })
          .then(res => {
            if (res.data.code == 200) {
              this.$notify.success('编辑成功');
              this.fetchCycles();
              return;
            } else {
              this.$notify.error('编辑失败');
            }
          })
          .catch(() => {
            this.$notify.error('编辑失败');
          });
      }
    },
    fetchCycles() {
      getTrainingCycle().then(res => {
        this.cycleList = res.data.data.list;
      });
    },
    fetchConfig() {
      getTrainingConfig({
        confType: 'trainDay'
      }).then(res => {
        this.cycles = res.data.data.confValue.split(',').map((item) => Number(item))
        this.trainDay = this.cycles.length;
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchConfig();
      this.fetchCycles();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.cycle {
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid #e5e5e5;
}
.cycle_header {
  @include flexbox;
  @include justify-content(space-between);
  @include align-items(center);
  margin: {
    bottom: 20px;
  }
}
.cycle_days {
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid #e5e5e5;
  margin: {
    top: 20px;
  }
  .least_days {
    background-color: #e5e5e5;
    margin: {
      top: 20px;
    }
    padding: {
      top: 25px;
      bottom: 25px;
      left: 10px;
      right: 10px;
    }
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
.dialog_item {
  @include flexbox;
  @include align-items(center);
  margin: {
    top: 10px;
    bottom: 10px;
  }
}
.dialog_subtitle {
  width: 100px;
}
</style>



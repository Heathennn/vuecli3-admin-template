<template>
  <div class="4mtestPage">
    <el-dialog title="4M测试结果" :visible.sync="resultVisible" width="50%" center>
      <div class="dialog_item">
        <div class="dialog_subtitle">全部动作次数</div>
        <el-input v-model="dialog_minValue" style="width: 100px;"></el-input>至
        <el-input v-model="dialog_maxValue" style="width: 100px;"></el-input>
      </div>
      <div class="dialog_item">
        <div class="dialog_subtitle">训练难度</div>
        <div>{{dialog_trainingLevel}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resultVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmResult">确 定</el-button>
      </span>
    </el-dialog>
    <div class="test_result" v-permission="'80619835-75b5-44fc-9e21-dad301e3f14c'">
      <sub-title title="4M测试结果"></sub-title>
      <el-table :data="resultList" style="width: 100%" v-permission="'ebf44516-39f6-481c-92eb-984cef846a47'">
        <el-table-column label="训练强度" prop="rankInfo.strengthLv">
        </el-table-column>
        <el-table-column label="全部动作总次数">
          <template slot-scope="scope">
            {{scope.row.mixValue}}-{{scope.row.maxValue}}次
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="time">
          <template slot-scope="scope">
            <el-button type="primary" @click="editResult(scope.row)" v-permission="'ff2ee805-b971-40dc-9dbb-eca4434614a0'">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="test_threshold" v-permission="'b552a3a8-916d-4d22-bec8-576fb3bfd976'">
      <div class="test_threshold_title">
        <sub-title title="4M动作数量阈值"></sub-title>
        <el-button v-if="isEditing" type="primary" style="margin-left: 20px" @click="updateFmNum" v-permission="'8de25571-f366-459c-b7ac-807d388a5770'">确认修改</el-button>
      </div>
      <div class="threshold" style="margin-top: 20px;margin-bottom:20px; font-size: 14px">
        <div>单项4M测试动作反馈区间</div>
        <div class="test_threshold_item" v-permission="'9cdb0815-e982-4d91-93e9-d2d8db5a1b99'">
          <span v-if="!isEditing"><a href="javascript:;" class="hyperlink" @click="editFm">{{fm_minValue}}</a></span>
          <el-input v-model="fm_minValue" style="width: 80px" v-else v-permission="'8de25571-f366-459c-b7ac-807d388a5770'"></el-input>
           -
          <span v-if="!isEditing"><a href="javascript:;" class="hyperlink" @click="editFm">{{fm_maxValue}}</a></span>
          <el-input v-model="fm_maxValue" style="width: 80px" v-else v-permission="'8de25571-f366-459c-b7ac-807d388a5770'"></el-input>
          个
        </div>
      </div>
      <div class="default" style="font-size: 14px">
        <div>未填默认数值</div>
        <div v-if="!isEditing"><a href="javascript:;" class="hyperlink" @click="editFm">{{fm_default}}</a></div>
        <el-input v-else v-model="fm_default" style="width: 80px;" v-permission="'8de25571-f366-459c-b7ac-807d388a5770'"></el-input>
        个
      </div>
    </div>

    <el-dialog title="4M动作解析" :visible.sync="actionVisible" width="50%" center>
      <div class="dialog_item">
        <div class="dialog_subtitle">动作名称</div>
        <el-input v-model="dialog_name" style="width: 220px;" placeholder="输入动作名称"></el-input>
      </div>
      <div class="dialog_item">
        <div class="dialog_subtitle">动作解释</div>
        <el-input v-model="dialog_description" style="width: 400px;" type="textarea" placeholder="输入动作解释"></el-input>
        <!-- <div>{{dialog_description}}</div> -->
      </div>
        <el-upload class="upload-demo" 
                 drag 
                 action="http://api-control.test.hxsapp.com/admin/Upload/uploadFile" 
                 multiple
                 :limit="1"
                 :on-success="successUpload"
                 :on-error="failedUpload"
                 :before-upload="beforeAvatarUpload"
                 >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em><div style="color: red;font-size: 10px">(出现<span style="color:green">绿色对号<i class="el-icon-circle-check"></i></span>标识时为上传成功!)</div>
        </div>
      </el-upload>
      <div class="dialog_upload dialog_item">
        <div class="dialog_subtitle">视频文件</div>
        <div>{{video_name ? video_name : '无'}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="actionVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAction">确 定</el-button>
      </span>
    </el-dialog>

    <div class="test_record" v-permission="'53b6ae41-e5fc-44ab-bb9d-ab94536849c6'">
      <div class="test_record_header">
        <sub-title title="4M动作记录"></sub-title>
        <el-button @click="createFm" type="primary">新增</el-button>
      </div>
      <el-table :data="historyList" style="width: 100%" v-permission="'2af71bc5-eb54-4de0-9ecb-167589c682c0'">
        <el-table-column label="序号" prop="createTime">
        </el-table-column>
        <el-table-column label="动作" prop="name">
        </el-table-column>
        <el-table-column label="动作解析" prop="descText">
        </el-table-column>
        <el-table-column label="视频文件" prop="videoName">
        </el-table-column>
        <el-table-column label="视频大小" prop="videoSize">
          <template slot-scope="scope">
            <span v-if="scope.row.videoSize">{{scope.row.videoSize}}MB</span> <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="time">
          <template slot-scope="scope">
            <el-button type="primary" @click="editAction(scope.row)" v-permission="'42e023c9-036d-448d-bb86-7755f8640572'">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import {
  getFmtestList,
  updateFmtest,
  getFmResultList,
  updateFmResult
} from 'api/training/fmtest';

import {
  getTrainingConfig,
  updateTrainingConfig
} from 'api/training/trainingConfig';

export default {
  data() {
    return {
      isEditing: false,
      historyList: [],
      resultList: [],
      id: '',
      planRankId: '',
      resultVisible: false,
      actionVisible: false,
      dialog_minValue: '',
      dialog_maxValue: '',
      dialog_trainingLevel: '',
      dialog_name: '',
      dialog_description: '',
      historyId: '',
      video_url: '',
      video_name: '',
      video_size: '',
      isOverUploading: true,
      isChangingVideo: false,
      fm_default: '0',
      fm_minValue: '0',
      fm_maxValue: '0'
    };
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchResultList();
        vm.fetchHistoryList();
        vm.fetchConfig();
      });
    })
  },
  components: {
    SubTitle
  },
  methods: {
    editFm() {
      this.isEditing = true;
    },
    verifyDout(string) {
      var reg = /^\d+$/;
      return reg.test(string);
    },
    updateFmNum() {
      if (!this.fm_default || !this.fm_minValue || !this.fm_maxValue) {
        this.$notify.warning('输入不能为空');
        return;
      }
     if (!this.verifyDout(this.fm_default.toString()) || !this.verifyDout(this.fm_minValue.toString()) || !this.verifyDout(this.fm_maxValue.toString())) {
        this.$notify.warning('请输入整数');
        return;
      }
      this.isEditing = false;
      updateTrainingConfig({
        confType: 'fmDefault',
        confValue: this.fm_default
      }).then( (res) => {
        updateTrainingConfig({
          confType: 'fmMixValue',
          confValue: this.fm_minValue
        }).then( (res) => {
          updateTrainingConfig({
            confType: 'fmMaxValue',
            confValue: this.fm_maxValue
          }).then( (res) => {
            if (res.data.code == 200) {
              this.$notify.success('修改配置成功');
              this.levelId = this.dialog_level;
              this.fetchConfig();
              return;
            } else {
               this.$notify.error('修改配置失败');
            }
          })
        })
      }).catch( () => {
        this.$notify.error('修改配置失败');
      })
    },
    editResult(row) {
      this.dialog_trainingLevel = row.rankInfo.strengthLv;
      this.dialog_minValue = row.mixValue;
      this.dialog_maxValue = row.maxValue;
      this.id = row.id;
      this.planRankId = row.planRankId;
      this.resultVisible = true;
    },
    editAction(row) {
      this.dialog_name = row.name;
      this.historyId = row.id;
      this.dialog_description = row.descText;
      this.video_url = row.videoUrl;
      this.video_name = row.videoName;
      this.actionVisible = true;
    },
    createFm() {
      this.dialog_name = '';
      this.historyId = null;
      this.dialog_description = '';
      this.video_url = '';
      this.video_name = '';
      this.actionVisible = true;
    },
    beforeAvatarUpload(file) {
      this.isOverUploading = false;
      const isMP4 = file.type === 'video/mp4';
      const isLt20M = file.size / 1024 / 1024 < 20;

      if (!isMP4) {
        this.$notify.error('上传视频只能是 MP4 格式!');
      }
      if (!isLt20M) {
        this.$notify.error('上传视频大小不能超过 20MB!');
      }
      if (isMP4 && isLt20M) {
        this.isOverUploading = true;
      }
      return isMP4 && isLt20M;
    },
    successUpload(response, file, filelist) {
      this.video_url = response.data['oss-request-url'];
      this.video_name = file.name;
      this.video_size = file.size;
      this.isOverUploading = true;
      this.isChangingVideo = true;
    },
    failedUpload(err, file, filelist) {
      this.$notify.error('文件上传失败, 请重新上传');
      this.isOverUploading = true;
    },
    confirmAction() {
      if(!this.isOverUploading) {
        this.$notify.warning('文件上传未完成, 请稍后');
        return;
      }
      if (!this.dialog_description) {
        this.$notify.warning('动作解释不能为空');
        return;
      }
      if (!this.dialog_name) {
        this.$notify.warning('动作名称不能为空');
        return;
      }
      if (!this.video_url) {
        this.$notify.warning('请上传视频');
        return;
      }
      this.actionVisible = false;
      let params = {};
      if (this.historyId) {
        if (this.isChangingVideo) {
          params = {
            id: this.historyId,
            name: this.dialog_name,
            descText: this.dialog_description,
            videoName: this.video_name,
            videoSize: (this.video_size/1024/1024).toFixed(2),
            videoUrl: this.video_url
          }
        } else {
          params = {
            id: this.historyId,
            name: this.dialog_name,
            descText: this.dialog_description,
          }
        }
      } else {
        if (this.isChangingVideo) {
          params = {
            name: this.dialog_name,
            descText: this.dialog_description,
            videoName: this.video_name,
            videoSize: (this.video_size/1024/1024).toFixed(2),
            videoUrl: this.video_url
          }
        } else {
          params = {
            name: this.dialog_name,
            descText: this.dialog_description,
          }
        }
      }
      updateFmtest(params).then((res) => {
        if (res.data.code == 200) {
          this.$notify.success('动作记录配置成功');
          this.fetchHistoryList();
          return;
        } else {
          this.$notify.error('动作记录配置失败');
        }
      }).catch( () => {
        this.$notify.error('动作记录配置失败');
      })
    },
    confirmResult() {
      if (isNaN(Number(this.dialog_minValue)) || isNaN(Number(this.dialog_maxValue)) || !/^\d+$/.test(this.dialog_minValue) ||  !/^\d+$/.test(this.dialog_maxValue)) {
        this.$notify.error('请输入整数');
        return;
      }
      this.resultVisible = false;
      updateFmResult({
        id: this.id,
        planRankId: this.planRankId,
        mixValue: this.dialog_minValue,
        maxValue: this.dialog_maxValue
      })
        .then(res => {
          if (res.data.code == 200) {
            this.$notify.success('编辑4M测试结果成功');
            this.fetchResultList();
          } else {
            this.$notify.error('编辑4M测试结果失败');
          }
        })
        .catch(() => {
          this.$notify.error('编辑4M测试结果失败');
        });
    },
    fetchResultList() {
      getFmResultList().then(res => {
        // console.log(res);
        this.resultList = res.data.data;
      });
    },
    fetchHistoryList() {
      getFmtestList({
        page: 1,
        size: 100
      }).then(res => {
        this.historyList = res.data.data.list;
      });
    },
    fetchConfig() {
      getTrainingConfig({
        confType: 'fmDefault'
      }).then( (res) => {
        this.fm_default = res.data.data.confValue ? res.data.data.confValue : 0;
      })
      getTrainingConfig({
        confType: 'fmMixValue'
      }).then( (res) => {
        this.fm_minValue = res.data.data.confValue ? res.data.data.confValue : 0;
      })
      getTrainingConfig({
        confType: 'fmMaxValue'
      }).then( (res) => {
        this.fm_maxValue = res.data.data.confValue ? res.data.data.confValue : 0;
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchConfig();
      this.fetchResultList();
      this.fetchHistoryList();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.test_result {
  padding: 20px;
  border: 1px solid #e5e5e5;
}
.test_record_header {
  @include flexbox;
  @include justify-content(space-between);
}
.test_threshold {
  padding: 20px;
  border: 1px solid #e5e5e5;
  margin: {
    top: 20px;
  }
}
.test_record {
  padding: 20px;
  border: 1px solid #e5e5e5;
  margin: {
    top: 20px;
  }
}
.test_threshold_title {
  @include flexbox;
  @include align-items(center);
}
.test_threshold_item {
  @include flexbox;
  @include align-items(center);
}
.threshold {
  @include flexbox;
}

.default {
  @include flexbox;
}

.dialog_item {
  @include flexbox;
  @include align-items(center);
  padding: {
    bottom: 10px;
  }
  margin: {
    top: 10px;
  }
  .dialog_subtitle {
    width: 120px;
  }
}
</style>


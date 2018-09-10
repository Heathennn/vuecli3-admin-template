<template>
  <div class="errorDetailPage">
    <div class="handleStatus">
      处理状态: {{handleStatus == 1 ? '待处理' : handleStatus == 2 ? '处理中' : handleStatus == 3 ? '已处理' : ''}}
    </div>
    <div class="error_device" v-if="deviceDetail">
      <div class="subTitle">
        基本信息
      </div>
      <div class="device_detail">
        <div class="device_item">
          <div class="item_subTitle">设备类型</div>{{deviceDetail.facilityKind == 1 ? '运动设备': deviceDetail.facilityKind == 2 ? '弱电设备' : deviceDetail.facilityKind == 3 ? '其他设备' : '未知类型的设备' }}</div>
        <div class="device_item">
          <div class="item_subTitle">设备名称</div>{{ deviceDetail.facilityName}}</div>
        <div class="device_item">
          <div class="item_subTitle">设备ID</div>{{ deviceDetail.id }}</div>
        <div class="device_item">
          <div class="item_subTitle">设备厂商</div>{{ deviceDetail.facilityFirm}}</div>
        <div class="device_item">
          <div class="item_subTitle">入库时间</div>{{deviceDetail.createTime}}</div>
        <div class="device_item">
          <div class="item_subTitle">绑定时间</div>{{deviceDetail.bindingTime ? deviceDetail.bindingTime : ''}}</div>
        <div class="device_item">
          <div class="item_subTitle">所属门店</div>{{deviceDetail.storeName}}</div>
        <div class="device_item">
          <div class="item_subTitle">已运行</div>{{deviceDetail.runningTime}}分钟</div>
        <div class="device_item">
          <div class="item_subTitle">异常报备</div>{{deviceDetail.abnormalCount}}次</div>
        <div class="device_item">
          <div class="item_subTitle">已维修</div>{{deviceDetail.repairedCount}}次</div>
      </div>
    </div>
    <div class="error_device" v-else>暂无设备信息及异常信息</div>
    <div class="error_device">
      <div class="subTitle">
        上报异常信息
      </div>
      <div class="error_detail" v-for="(item, index) in errorDetail" :key="index">
        <div class="detail_left">
          <div class="error_header" :style="errorDetail.length == 1 || index === 0 ? 'background-color: #0066FF; color: #ffffff' : ''">{{item.source == 1 ? '系统' : item.source == 2 ? '店长' : item.source == 3 ? '用户' : ''}}</div>
          <div class="left_line" v-if="errorDetail.length !== 0 && index !== errorDetail.length - 1"></div>
        </div>
        <div class="error_content">
          <div class="error_item">
            <div class="item_subTitle">上报时间</div>{{item.createTime}}</div>
          <div class="error_item">
            <div class="item_subTitle">上报路径</div>{{item.source == 1 ? '系统' : item.source == 2 ? '店长' : item.source == 3 ? '用户' : ''}} <span style="font-size: 14px;color: #666666">{{item.userInfo ? '(昵称:' + item.userInfo.nickname + ',ID:' + item.userInfo.userId + ')': item.source == 2 ? '(店长:' + item.manegeName + ',ID:' + item.manegeId + ')' : ''}}</span></div>
          <div class="error_item">
            <div class="item_subTitle">异常代码</div>{{item.abnormalCode}}</div>
          <div class="error_item">
            <div class="item_subTitle">异常描述</div>{{item.abnormalDescribe}}</div>
          <div class="error_item">
            <div class="item_subTitle" style="height: 100%">上传图片</div>
            <div class="pics" style="display: inline-block" v-for="(item, index) in item.abnormalPic.split(';')" :key="index">
              <img :src="item" alt="" style="width: 100px; height: 100px; margin-right: 20px;cursor: pointer" @click="showImg(item)">
            </div>
          </div>
        </div>
      </div>
    </div>

<el-dialog title="图片" :visible.sync="dialogVisible" :before-close="handleClose">
  <div :style="``" >
    <img :src="currentUrl" alt="">
  </div>
</el-dialog>

    <div class="error_process" style="margin-top: 20px">
      <div class="subTitle" style="margin-bottom: 20px">维修流程</div>
      <div class="process_steps" :style="`height: ${processStream.length*100}px`" v-if="processStream && processStream.length > 0">
        <admin-step v-for="(item, index) in processStream" :key="index" :currentNum="index"                     :stepNum="processStream.length"
        :stepTime="item.createTime"
        :stepHandleUserInfo="`${item.handleUserType == 1 ?'店长' :item.handleUserType == 2 ? '系统' : ''} : ${item.handleAgent} ID:${item.handleUserId}`"
        :stepHandleRemark="`说明: ${item.handleResult ? item.handleResult : '无'} 进度: ${item.handleType== 1 ? '跟进': item.handleType == 2 ? '处理完成' : '无'}`">
        </admin-step>
      </div>
      <div v-else>暂无处理流程</div>
    </div>

    <div class="errorLog">
      <div class="subTitle" style="margin-bottom: 20px">处理记录日志</div>
      <div style="width: 400px; margin-bottom: 30px">

      <el-input type="textarea" placeholder="记录日志" v-model="logs" style="width: 400px; row: 5">
      </el-input>
      </div>
      <el-button type="primary" @click="addLog" :disabled="processStream[0] && processStream[0].handleType == 2">提交</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

// import moment from 'moment';

import AdminStep from 'components/AdminStep';

export default {
  data() {
    return {
      logs: '',
      id: '',
      deviceDetail: {},
      errorDetail: [],
      processStream: [],
      input: '',
      handleStatus: 1,
      abnormalId: 0,
      abnormalCode: 0,
      dialogVisible: false,
      currentUrl: ''
    };
  },
  components: {
    AdminStep
  },
  computed: {
    ...mapState({
      userInformation: state => state.auth.userInformation
    }),
    _screenHeight() {
      return window.document.body.offsetHeight
    }
  },
  watch: {
    $route(val) {
      this.id = val.query.errorDetail;
    },
    id() {
      this.getErrorDetail({
        id: this.id
      }).then(res => {
        this.deviceDetail = Object.assign({}, res.facilityResult, {
          createTime: moment(res.facilityResult.createTime).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          bindingTime: res.facilityResult.bindingTime
            ? moment(res.facilityResult.bindingTime).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            : '无'
        });
        this.handleStatus = res.abnormalResult.handleStatus;
        res.facilityHandleResult.list.forEach((item, index) => {
          item.createTime = moment(item.createTime)
            .format('YYYY-MM-DD HH:mm:ss')
            .toString();
        });
        this.processStream = res.facilityHandleResult.list;
      });

      this.getErrorInfoList({ abnormalId: this.id }).then( (res) => {
        res.forEach( (item, index) => {
          item.createTime = this.moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        })
        this.errorDetail = res;

      }).catch( (error) => {
        this.$notify.error(error);
      })
    }
  },
  created() {
    this.id = this.$route.query.errorDetail;
    // this.id = ids[0];
    // this.facilityId = ids[1];
    // console.log(this.id);
  },
  methods: {
    ...mapActions(['getErrorDetail', 'getErrorInfoList','addErrorLog']),
    handleClose(done) {
      done();
    },
    showImg(url) {
      this.currentUrl = url;
      this.dialogVisible = true;
    },
    addLog() {
      if (!this.logs) return this.$notify.error('处理日志内容不能为空');
      this.addErrorLog({
        facilityId: this.deviceDetail.id,
        abnormalId: this.abnormalId,
        abnormalCode: this.abnormalCode,
        userId: this.userInformation.id,
        userName: this.userInformation.username,
        handleResult: this.logs
      }).then( (res) => {
        this.$notify.success('操作成功');
        this.getErrorDetail({
          id: this.id
        }).then(res => {
          this.deviceDetail = Object.assign({}, res.facilityResult, {
            createTime: moment(res.facilityResult.createTime).format(
              'YYYY-MM-DD HH:mm:ss'
            ),
            bindingTime: res.facilityResult.bindingTime
              ? moment(res.facilityResult.bindingTime).format(
                  'YYYY-MM-DD HH:mm:ss'
                )
              : '无'
          });
          this.handleStatus = res.abnormalResult.handleStatus;
          res.facilityHandleResult.list.forEach((item, index) => {
            item.createTime = moment(item.createTime)
              .format('YYYY-MM-DD HH:mm:ss')
              .toString();
          });
          this.processStream = res.facilityHandleResult.list;
        });
      }).catch( (message) => {
        this.$notify.error('操作失败');
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getErrorDetail({ id: this.id }).then(res => {
        this.deviceDetail = Object.assign({}, res.facilityResult, {
          createTime: moment(res.facilityResult.createTime).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          bindingTime: res.facilityResult.bindingTime
            ? moment(res.facilityResult.bindingTime).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            : '无'
        });
        this.handleStatus = res.abnormalResult.handleStatus;
        this.abnormalId = res.abnormalResult.id;
        this.abnormalCode = res.abnormalResult.abnormalCode;
        // this.errorDetail = Object.assign({}, res.abnormalResult, {
        //   createTime: moment(res.abnormalResult.createTime).format(
        //     'YYYY-MM-DD HH:mm:ss'
        //   )
        // });
        res.facilityHandleResult.list.forEach((item, index) => {
          item.createTime = moment(item.createTime)
            .format('YYYY-MM-DD HH:mm:ss')
            .toString();
        });
        this.processStream = res.facilityHandleResult.list;
      });
      this.getErrorInfoList({ abnormalId: this.id }).then( (res) => {
        res.forEach( (item, index) => {
          item.createTime = this.moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        })
        this.errorDetail = res;
      }).catch( (error) => {
        this.$notify.error(error);
      })
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.errorDetailPage {
  // background-color: #ffffff;
  width: 100%;
  height: 120%;
  box-sizing: border-box;
  // overflow-y: scroll;
  padding: {
    bottom: 30px;
  }
}
.subTitle {
  font-size: 22px;
  height: 50px;
  line-height: 50px;
  border: {
    bottom: 1px solid #e5e5e5;
  }
}
.handleStatus {
  padding: 20px;
  font-weight: 600;
  background-color: #ffffff;
  margin: {
    bottom: 20px;
  }
}
.errorDetailTitle {
  font-size: 30px;
  height: 50px;
  line-height: 50px;
  border: {
    bottom: 1px solid #999999;
  }
}
.device_detail {
  width: 100%;
  @include flexbox;
  @include flex-wrap(wrap);
  padding: {
    top: 20px;
  }
  .device_item {
    height: 50px;
    line-height: 50px;
    width: 50%;
    line-height: 50px;
    .item_subTitle {
      height: 100%;
      display: inline-block;
      width: 120px;
      color: #666666;
    }
  }
}
.error_detail {
  background-color: #ffffff;
  width: 100%;
  margin: {
    top: 20px;
    // bottom: 20px;
  }
  @include flexbox;
  .detail_left {
    @include flexbox;
    @include flex-direction(column);
    // @include justify-content(center);
    @include align-items(center);
    margin: {
      right: 50px;
    }
    .left_line {
      width: 1px;
      flex: 1;
      margin: {
        top: 15px;
      }
      border: {
        left: 1px dashed #666666;
      }
    }
  }
  .error_header {
    text-align: center;
    line-height: 50px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #e5e5e5;
  }
  .error_item {
    line-height: 50px;
    .item_subTitle {
      height: 100%;
      display: inline-block;
      width: 120px;
      color: #666666;
    }
    .pics{
      @include flexbox;
    }
  }
}

.error_device {
  background-color: #ffffff;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  margin: {
    top: 20px;
  }
  border: {
    bottom: 1px solid #e5e5e5;
  }
  // @include flexbox;
}

.error_process {
  background-color: #ffffff;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}

.errorLog {
  background-color: #ffffff;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  margin: {
    top: 20px;
    bottom: 60px;
  }
}
// .processTitle {
//   font-size: 30px;
//   height: 50px;
//   line-height: 50px;
//   border: {
//     bottom: 1px solid #999999;
//   }
// }
</style>

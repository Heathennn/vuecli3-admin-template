<template>
  <div class="feebackDetailPage">
      <div class="handleStatus">处理状态:  {{detail.dealStatus == 1 ? '待处理' : detail.dealStatus == 2 ? '已处理' : '无'}}</div>
    <div class="feedbackInfo">
      <div class="info_left">
        <div class="info_item">
          <div class="item_subTitle">所属门店</div>{{detail.storeName}}</div>
        <div class="info_item">
          <div class="item_subTitle">反馈时间</div> {{detail.createTime}}</div>
        <div class="info_item">
          <div class="item_subTitle">设备类型</div> {{detail.facilityType == 1 ? '运动设备' : detail.facilityType == 2 ? '弱电设备' : ''}}</div>
        <div class="info_item">
          <div class="item_subTitle">设备名称</div> {{detail.facilityName}}</div>
        <div class="info_item">
          <div class="item_subTitle">异常类型</div> {{detail.abnormalType}}</div>
        <div class="info_item">
          <div class="item_subTitle">异常描述</div> <span>{{detail.abnormalDescribe}}</span></div>
        <div class="info_item">
          <div class="item_subTitle">反馈用户</div><a href="javascript:;" @click="jumpToUserDetail">{{detail.userInfo ? detail.userInfo.nickname : ''}}</a></div>
        <div class="info_item">
          <div class="item_subTitle">用户ID</div> {{detail.userId}}</div>
        <div class="info_item">
          <div class="item_subTitle">联系电话</div> {{detail.userInfo ? detail.userInfo.mobile : ''}}</div>
      </div>
    </div>

    <el-dialog title="图片" :visible.sync="dialogVisible" :before-close="handleClose">
      <div :style="``" >
        <img :src="currentUrl" alt="">
      </div>
    </el-dialog>


    <div class="info_image">
      <div style="line-height: 30px; padding: 20px;color: #666666;">提供图片:</div>
      <div class="imgBox">
        <div class="info_pics" v-for="(item, index) in detail.abnormalPic" :key="index" :style="`background-image: url(${item}); background-size: 100% 100%;margin-right: 10px; border: 1px dashed #666666`" @click="checkImage(item)"></div>
      </div>
    </div>

    <div class="dealContent" v-if="detail.dealCode == 0" style="background-color: #ffffff; padding: 20px">
      处理备注:
      <el-input v-model="content" placeholder="" :disabled="detail.dealCode != 0"></el-input>
    </div>
    <div class="feedbackButtons" style="padding: 20px; background-color: #ffffff" v-if="detail.dealCode == 0">
      <el-button type="primary" @click="dealFeedback(1)" :disabled="detail.dealCode == 1">有效反馈</el-button>
      <el-button @click="dealFeedback(2)" :disabled="detail.dealCode == 2">无效反馈</el-button>
    </div>

    <div class="dealCode" v-if="detail.dealCode != 0" style="width: 100%;margin-top: 20px; background-color: #ffffff; box-sizing: border-box; padding: 20px">
      <div style="font-size: 18px; font-weight: 600">{{detail.dealCode == 1 ? '有效反馈' : detail.dealCode == 2 ? '无效反馈' : ''}}</div>
      <div style="padding-bottom: 20px">处理备注: &nbsp;{{detail.dealRemark}}</div>
      <div style="color: #666666;font-size:10px;border-top:1px solid #666666">操作&nbsp;用户名:admin 时间:{{detail.updateTime}}</div>
    </div>

    <div class="feedbackTip" style="color: #666666; font-size: 10px;background-color: #ffffff; padding: 20px;">
      <div>*说明</div>
      <div>有效反馈，系统给予反馈用户相应的信用加分项。</div>
      <div>无效反馈，暂无后续操作。</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

// import moment from 'moment';

import { updateUploadErrorStatus } from 'api/service/feedback';

export default {
  data() {
    return {
      id: '',
      detail: {},
      content: '',
      currentUrl: '',
      dialogVisible: false,
    };
  },
  methods: {
    ...mapActions(['getUploadErrorDetail']),
    jumpToUserDetail() {
      this.$router.push({path: `/user/userList?userDetail=${this.detail.userId}`})
    },
    dealFeedback(status) {
      if (!this.content.trim()) {
        return this.$notify.error('请输入处理备注');
      }
      updateUploadErrorStatus({
        id: this.id,
        dealCode: status,
        dealRemark: this.content
      })
        .then(res => {
          if (res.data.code == 200) {
            this.$notify.success('修改反馈状态成功');
            this.$emit('refreshUploadErrorList')
            this.getUploadErrorDetail({
              id: this.id
            }).then(res => {
              // console.log(res);
              res.createTime = moment(res.createTime).format(
                'YYYY-MM-DD HH:mm:ss'
              );
              res.updateTime = moment(res.updateTime).format('YYYY-MM-DD HH:mm:ss');
              res.abnormalPic = res.abnormalPic.split(';');
              this.content = res.dealRemark;
              this.detail = res;
            });
            return;
          } else {
            return this.$notify.error(res.data.message);
          }
        })
        .catch(() => {
          return this.$notify.error('修改反馈状态失败');
        });
    },
    handleClose(done) {
      done();
    },
    checkImage(url) {
      this.currentUrl = url;
      this.dialogVisible = true;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.id = this.$route.query.uploadErrorDetail;
      this.getUploadErrorDetail({
        id: this.id
      }).then(res => {
        // console.log(res);
        res.createTime = moment(res.createTime).format('YYYY-MM-DD HH:mm:ss');
        res.updateTime = moment(res.updateTime).format('YYYY-MM-DD HH:mm:ss');
        res.abnormalPic = res.abnormalPic.split(';');
        this.content = res.dealRemark;
        this.detail = res;
      });
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.feebackDetailPage {
  // background-color: #ffffff;
  width: 100%;
  min-height: calc(100% - 60px);
  box-sizing: border-box;
  // padding: 20px;
  // overflow-y: scroll;
  .feedbackDetailTitle {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
    }
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
.feedbackInfo {
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 20px;
  padding: {
    top: 30px;
  }
}
.info_left {
  @include flexbox;
  @include flex-wrap(wrap);
  padding: {
    right: 100px;
  }
  .info_item {
    width: 50%;
    // height: 50px;
    // line-height: 50px;
    box-sizing: border-box;
    padding: {
      left: 20px;
      top: 20px;
      bottom: 10px;
    }
    .item_subTitle {
      display: inline-block;
      width: 120px;
      color: #666666;
    }
  }
}
.imgBox {
  @include flexbox;
}
.info_image  {
  @include flexbox;
  background-color: #ffffff;
  padding: 20px;
}
.info_pics {
  width: 100px;
  height: 100px;
}
.feedbackInfo {
  @include flexbox;
}
</style>

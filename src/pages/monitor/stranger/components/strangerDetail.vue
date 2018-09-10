<template>
  <div class="wraper">
    <div class="handleStatus">状态:  {{currentDetail.dealStatus == 1 ? '待处理' : currentDetail.dealStatus == 2 ? '已处理' : ''}}</div>
    <div class="detail">
      <div class="subTitle">
        基本信息
      </div>
      <div class="top">
        <div class="info_item">
          <div class="item_subTitle">所属门店</div>{{currentDetail.storeName}}</div>
        <div class="info_item">
          <div class="item_subTitle">记录时间</div>{{currentDetail.createTime}}</div>
        <div class="info_item">
          <div class="item_subTitle">异常代码</div>{{currentDetail.alarmCode}}</div>
        <div class="info_item">
          <div class="item_subTitle">事件类型</div>{{currentDetail.alarmName}}</div>
        <div class="info_item">
          <div class="item_subTitle">问题描述</div>{{currentDetail.alarmDesc}}</div>
        <div class="info_item">
          <div class="item_subTitle">监控录像</div>（此功能暂没开通）
        </div>
        <div class="info_item">
          <div class="item_subTitle">闯入用户</div>{{currentDetail.userInfo ? currentDetail.userInfo.nickname : ''}}</div>
        <div class="info_item">
          <div class="item_subTitle">用户ID</div>   {{currentDetail.userId}}</div>
        <div class="info_item">
          <div class="item_subTitle">联系电话</div>{{currentDetail.userInfo ? currentDetail.userInfo.mobile : ''}}</div>
        <div class="info_item">
          <div class="item_subTitle">订单号码</div>{{currentDetail.orderSn}}</div>
        <div class="info_item">
          <div class="item_subTitle">预约时间</div>{{currentDetail.startTime}}至{{currentDetail.endTime}}</div>
      </div>
      <div class="bottom">
          <div class="info_item">
            人脸对比照片：
          </div>
          <div class="comparison">
      <div class="comparison_item new" title="新人脸记录">
        <img :src="currentDetail.newFace" alt=""  class="face_img"/>
        <span style="text-align: center; color: #999999">新人脸记录</span>
      </div>
      <div class="comparison_item ever" title="初始人脸记录">
        <img :src="currentDetail.originalFace" alt="" class="face_img">
        <span style="text-align: center; color: #999999">初始人脸记录</span>
      </div>
    </div>
      </div>
    </div>
    <div class="dealContent" v-if="detail.dealResult == 0">
      处理备注:
      <el-input v-model="content" placeholder="" :disabled="detail.dealResult != 0"></el-input>
    </div>
    <div class="feedbackButtons" style="background-color: #ffffff;padding: 20px" v-if="detail.dealResult == 0">
      <el-button type="primary" @click="report(1)" :disabled="detail.dealResult == 1">有效举报</el-button>
      <el-button @click="report(2)">无效举报</el-button>
    </div>

    <div class="dealResult" v-if="detail.dealResult != 0" style="width: 100%; background-color: #ffffff; box-sizing: border-box; padding: 20px">
      <div style="font-size: 18px; font-weight: 600">{{detail.dealResult == 1 ? '有效举报' : detail.dealResult == 2 ? '无效举报' : ''}}</div>
      <div style="padding-bottom: 20px;">处理备注: &nbsp;{{detail.dealRemark}}</div>
      <div style="color: #666666;font-size:10px;border-top:1px solid #666666">操作&nbsp;用户名:admin 时间:{{currentDetail.updateTime}}</div>
    </div>
    <div class="tips" :style="`color: #666666`">
      <div>*说明</div>
      <div>有效反馈，系统给予反馈用户相应的信用加分项。</div>
      <div>无效反馈，暂无后续操作。</div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';

import { deepCopy } from 'common/utils';

// import moment from 'moment';

import { failureUpdate } from 'api/monitor/stranger';

export default {
  computed: {
    ...mapState({
      strangerDetailList: state => state.stranger.strangerDetailList, //详情页接口
      userInformation: state => state.auth.userInformation
    }),
    currentDetail() {
      let detail = Object.assign({}, this.strangerDetailList);

      detail.createTime = moment(detail.createTime).format(
        'YYYY-MM-DD HH:mm:ss'
      );
      detail.updateTime = moment(detail.updateTime).format(
        'YYYY-MM-DD HH:mm:ss'
      );
      detail.startTime = moment(detail.startTime).format('YYYY-MM-DD HH:mm:ss');
      detail.endTime = moment(detail.endTime).format('YYYY-MM-DD HH:mm:ss');
      return detail;
    }
  },
  methods: {
    ...mapActions(['getStrangerDetailList']),
    report(status) {
      if (!this.content) {
         return this.$notify.error("请输入处理备注");
      }
      failureUpdate({
        dealRemark: this.content,
        dealStatus: 2,
        dealResult: status,
        operateId: this.userInformation.id,
        operateType: 2,
        userId: this.currentDetail.userId,
        id: this.detail.id
      }).then( (res) => {
        if (res.data.code == 200) {
          this.fetchData();
          return this.$notify.success('更新申诉状态成功')
        }
        return this.$notify.error('更新申诉状态失败')
      }).catch( (error) => {
        return this.$notify.error('更新申诉状态失败')
      })
    },
    fetchData() {
      this.getStrangerDetailList({
        id: this.id
      }).then( () => {
        this.detail = Object.assign({}, this.strangerDetailList);
      })
    }
  },
  data() {
    return {
      content: '',
      id: null,
      detail: {}
    };
  },
  watch: {
    '$route'(val) {
      this.id = val.query.strangerTotal;
    },
    id() {
      this.fetchData();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.id = this.$route.query.strangerTotal;
      this.fetchData();
    });
  }
};
</script>
<style lang="scss" scoped>
@import '~assets/style/utils';

.wraper {
  // background: white;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  // padding: 20px;
  .title {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
    }
  }
  .detail {
    background-color: #ffffff;
    box-sizing: border-box;
    padding: 20px;
    // display: flex;
    .top {
      width: 100%;
      @include flexbox;
      @include flex-wrap(wrap);
      .info_item {
        width: 50%;
        height: 50px;
        line-height: 50px;
      }
      .item_subTitle {
        display: inline-block;
        width: 120px;
        color: #666666;
      }
    }
    .bottom {
      padding: {
        top: 10px;
      }
      .info_item {

          display: inline-block;
          width: 120px;
          color: #666666;
      }
    }
  }
  .comparison {
    display: flex;
    justify-content: space-around;
  }
  .comparison_item {
    @include flexbox;
    @include flex-direction(column);
  }
  .textarea {
    margin: 10px 0;
  }
  .button {
    display: flex;
    justify-content: space-around;
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
.dealContent{
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 20px;
}
.dealResult{
  background-color: #ffffff;
}
.face_img {
  width: 200px;
  height: 200px;
}

.tips {
  font-size: 10px;
  background-color: #ffffff;
  padding: 20px;
}
</style>

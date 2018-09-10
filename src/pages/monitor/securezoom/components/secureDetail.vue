<template>
    <div class="wraper">
      <div class="title">
        闯入事件-详情
      </div>
      <div>
        <p>所属门店：{{currentDetail.storeName}}</p>
        <p>记录时间：{{currentDetail.createTime}}</p>
        <p>异常代码：{{currentDetail.alarmCode}}</p>
        <p>事件类型：{{currentDetail.alarmType ? currentDetail.alarmType == 1 ? '陌生人入场' : currentDetail.alarmType == 2 ?  '安全画面' : '' : '' }}</p>
        <p>问题描述：{{currentDetail.alarmDesc}}</p>
        <p>处理建议：{{currentDetail.alarmDesc}}</p>
        <p>监控录像：
          <el-button type="primary">监控录像</el-button>
        </p>
        <p>抓拍图片：<img :src="currentDetail.picUrl" alt="" style="width: 70%; height: 300px"></p>
      </div>
    </div>

</template>
<script>
// getMonitorDetailList
import { mapState, mapActions } from 'vuex';

import { deepCopy } from 'common/utils';

// import moment from 'moment';
export default {
  computed: {
    ...mapState({
      monitorDetailList: state => state.securezoom.monitorDetailList //详情页接口
    }),
    currentDetail() {
      let detail = deepCopy(this.monitorDetailList);
      detail.createTime = moment(detail.createTime).format(
        'YYYY-MM-DD HH:mm:ss'
      );
      return detail;
    }
  },
  methods: {
    ...mapActions(['getMonitorDetailList'])
  },
  watch: {
    '$route'(val) {
      this.id = val.query.ZoomDetail;
    },
    id() {
      this.getMonitorDetailList({
        id: this.$route.query.ZoomDetail
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.id = this.$route.query.ZoomDetail;
      this.getMonitorDetailList({
        id: this.$route.query.ZoomDetail
      });
    });
  },
  data() {
    return {
      id: null
    };
  }
};
</script>
<style lang="scss" scoped>
.wraper {
  background: white;
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
</style>

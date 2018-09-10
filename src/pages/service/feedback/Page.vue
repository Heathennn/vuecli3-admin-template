<template>
  <div class="protalPage" v-if="isLoadSubPage">
    <div class="feedbackPage">
      <div class="title">
        用户反馈
      </div>
      <div class="feedbackTabs">
        <el-radio-group v-model="status">
          <el-radio-button label="建议反馈" v-permission="'a26135c3-3fb8-4d74-8bbe-8c747b2f068a'"></el-radio-button>
          <el-radio-button label="故障上报" v-permission="'42c69537-7bfb-4362-8167-397caf18c874'"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="selects" v-if="status === '建议反馈'">

        <div class="subTitle">类型</div>
        <div class="statusSelect">
          <el-select v-model="curDealStatus" placeholder="请选择" style="width: 120px">
            <el-option v-for="item in dealStatusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="subTitle">日期</div>
        <div class="timeSelect">
          <el-date-picker v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </div>
      </div>
      <div class="selects" v-if="status === '故障上报'">
        <div class="subTitle">类型</div>
        <div class="statusSelect">
          <el-select v-model="curDealStatus2" placeholder="请选择" style="width: 120px">
            <el-option v-for="item in dealStatusOptions2" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="timeSelect">
          <el-date-picker v-model="time2" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </div>
      </div>
      <div class="messageTableBox" v-if="status === '建议反馈'" v-loading="isFetchingFeedbackDatas" v-permission="'994915e3-b3bd-4b53-9173-bead88688518'">
        <feed-back-table :tableData="feedbackList"></feed-back-table>
      </div>
      <div class="uploadError" v-if="status === '故障上报'" v-loading="isFetchingUploadErrorDatas" v-permission="'2122e89e-685e-46ef-ae67-fd8efb5562e6'">
        <upload-error-table :tableData="uploadErrorList"></upload-error-table>
      </div>
      <div class="paginationBox" v-if="status === '建议反馈'" v-permission="'994915e3-b3bd-4b53-9173-bead88688518'">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage1" :page-sizes="pageSizes1" :page-size="curPageSize1" layout="total, sizes, prev, pager, next, jumper" :total="curTotal1">
        </el-pagination>
      </div>
      <div class="paginationBox" v-if="status === '故障上报'" v-permission="'2122e89e-685e-46ef-ae67-fd8efb5562e6'">
        <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="currentPage2" :page-sizes="pageSizes2" :page-size="curPageSize2" layout="total, sizes, prev, pager, next, jumper" :total="curTotal2">
        </el-pagination>
      </div>
    </div>
  </div>
  <feedback-sub-page v-else :subPageInfo="routeQuery"
                     @refreshUploadError="fetchUploadErrorData"
                     @refreshFeedback="fetchFeedbackData"></feedback-sub-page>
</template>

<script>
import FeedBackTable from './components/FeedBackTable';

import UploadErrorTable from './components/UploadErrorTable';

import FeedbackSubPage from './components/FeedBackSubPage';

import { mapState, mapActions } from 'vuex';

export default {
  components: {
    FeedBackTable,
    UploadErrorTable,
    FeedbackSubPage
  },
  computed: {
    ...mapState({
      total1: state => state.feedback.total1,
      pageSize1: state => state.feedback.pageSize1,
      pageNum1: state => state.feedback.pageNum1,
      total2: state => state.feedback.total2,
      pageSize2: state => state.feedback.pageSize2,
      pageNum2: state => state.feedback.pageNum2,
      feedbackList: state => state.feedback.feedbackList,
      uploadErrorList: state => state.feedback.uploadErrorList,
      isFetchingFeedbackDatas: state => state.feedback.isFetchingFeedbackDatas,
      isFetchingUploadErrorDatas: state =>
        state.feedback.isFetchingUploadErrorDatas
    }),
    routeQuery() {
      return (
        Object.keys(this.$route.query)[0] +
        '=' +
        this.$route.query[Object.keys(this.$route.query)[0]]
      );
    },
    isLoadSubPage() {
      if (Object.keys(this.$route.query)[0]) {
        return false;
      } else {
        return true;
      }
    }
  },
  data() {
    return {
      time: [],
      time2: [],
      currentPage1: 1,
      pageSizes1: [10, 20, 30, 40],
      curPageSize1: 10,
      curTotal1: 0,
      currentPage2: 1,
      pageSizes2: [10, 20, 30, 40],
      curPageSize2: 10,
      curTotal2: 0,
      status: '建议反馈',
      deviceStatus: '已绑设备',
      input: '',
      dealStatusOptions: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 1,
          label: '待处理'
        },
        {
          value: 2,
          label: '已处理'
        }
      ],
      dealStatusOptions2: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 1,
          label: '待处理'
        },
        {
          value: 2,
          label: '已处理'
        }
      ],
      curDealStatus: 'all',
      curDealStatus2: 'all'
    };
  },
  watch: {
    curDealStatus() {
      this.getFeedbackList(this.createParams()).then(() => {
        this.mapPagination1();
      });
    },
    time(val) {
      this.getFeedbackList(this.createParams()).then(() => {
        this.mapPagination1();
      });
    },
    curDealStatus2(val) {
      // console.log(val)
      this.getUploadErrorList(this.createParams2()).then(() => {
        this.mapPagination2();
      });
    },
    time2(val) {
      // console.log(val)
      this.getUploadErrorList(this.createParams2()).then(() => {
        this.mapPagination2();
      });
    }
  },
  methods: {
    ...mapActions(['getFeedbackList', 'getUploadErrorList']),
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.curPageSize1 = val;
      this.getFeedbackList(this.createParams()).then(() => {
        this.mapPagination1();
      });
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage1 = val;
      this.getFeedbackList(this.createParams()).then(() => {
        this.mapPagination1();
      });
    },
    handleSizeChange2(val) {
      // console.log(`每页 ${val} 条`);
      this.curPageSize2 = val;
      this.getUploadErrorList(this.createParams2()).then(() => {
        this.mapPagination2();
      });
    },
    handleCurrentChange2(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage2 = val;
      this.getUploadErrorList(this.createParams2()).then(() => {
        this.mapPagination2();
      });
    },
    createParams() {
      let params = {};
      params.page = this.currentPage1;
      params.size = this.curPageSize1;
      if (this.curDealStatus !== 'all') {
        params.dealStatus = this.curDealStatus;
      }
      if (this.time.length > 0) {
        params.beginTime = this.time[0];
        params.endTime = this.time[1];
      }
      return params;
    },
    createParams2() {
      let params = {};
      params.page = this.currentPage2;
      params.size = this.curPageSize2;
      if (this.curDealStatus2 !== 'all') {
        params.dealStatus = this.curDealStatus2;
      }
      if (this.time2.length > 0) {
        params.beginTime = this.time2[0];
        params.endTime = this.time2[1];
      }
      return params;
    },
    mapPagination1() {
      this.currentPage1 = this.pageNum1;
      this.curTotal1 = this.total1;
      this.curPageSize1 = this.pageSize1;
    },
    mapPagination2() {
      this.currentPage2 = this.pageNum2;
      this.curTotal2 = this.total2;
      this.curPageSize2 = this.pageSize2;
    },
    fetchFeedbackData() {
      this.getFeedbackList(this.createParams()).then(() => {
        this.mapPagination1();
      });
    },
    fetchUploadErrorData() {
      this.getUploadErrorList(this.createParams2()).then(() => {
        this.mapPagination2();
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchFeedbackData();
        vm.fetchUploadErrorData();
      });
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchFeedbackData();
      this.fetchUploadErrorData();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.feedbackTabs {
  padding: {
    top: 30px;
  }
}
.feedbackPage {
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
  .selects {
    @include flexbox;
    @include align-items(center);
    box-sizing: border-box;
    padding: {
      top: 20px;
      bottom: 20px;
    }
  }
  .subTitle {
    width: 60px;
  }
  .selectTitle {
    line-height: 40px;
    margin: {
      right: 10px;
    }
  }
  .statusSelect {
    margin: {
      right: 20px;
    }
  }
  .timeSelect {
    margin: {
      right: 100px;
    }
  }
  .paginationBox {
    padding: {
      top: 20px;
    }
  }
}
</style>

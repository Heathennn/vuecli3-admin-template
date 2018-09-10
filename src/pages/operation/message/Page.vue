<template>
  <div class="protalPage" v-if="isLoadSubPage">
    <div class="messagePage">
      <div class="title">
        消息推送
      </div>
      <div class="selects">
        <div class="statusSelect">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="timeSelect">
          <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <div class="buttons">
          <el-button type="primary" @click.native="createMessage" v-permission="'b22a32af-f476-40d1-90ef-a4e82b5c4cdd'">新建消息</el-button>
        </div>
      </div>
      <div class="messageTableBox" v-loading="isFetchingData" v-permission="'a8bf2d59-0195-44b8-8fac-003373eb0c82'">
        <message-table :tableData="messageList"></message-table>
        <div class="paginationBox">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
  <message-sub-page v-else :subPageInfo="routeQuery"
                    @refreshMessage="fetchData"></message-sub-page>
</template>

<script>
import MessageTable from './components/MessageTable';

import MessageSubPage from './components/MessageSubPage';

import {
  mapState,
  mapActions
} from 'vuex';

export default {
  components: {
    MessageTable,
    MessageSubPage
  },
  data() {
    return {
      time: [],
      currentPage4: 1,
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      curTotal: 0,
      deviceStatus: '已绑设备',
      input: '',
      options: [
        {
          value: 'all',
          label: '全部类型'
        },
        {
          value: 1,
          label: '短信'
        },
        {
          value: 2,
          label: 'app推送'
        },
        {
          value: 3,
          label: '系统消息'
        }
      ],
      value: 'all'
    };
  },
  computed: {
    ...mapState({
      messageList: state => state.message.messageList,
      isFetchingData: state => state.message.isFetchingData,
      pageSize: state => state.message.pageSize,
      pageNum: state => state.message.pageNum,
      total: state => state.message.total
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
  watch: {
    time(val) {
      // console.log(val)
      this.fetchData();
    },
    value() {
      this.fetchData();
    }
  },
  methods: {
    ...mapActions(['getMessageList']),
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.curPageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage4 = val;
      this.fetchData();
    },
    mapPagination() {
      this.currentPage4 = this.pageNum;
      this.curTotal = this.total;
      this.curPageSize = this.pageSize;
    },
    computeParams() {
      let params = {};
      if (this.value !== 'all') {
        params.sendType = this.value;
      }
      if (this.time.length > 0) {
        params.beginTime = this.time[0] + ' 00:00:00';
        params.endTime = this.time[1] + ' 23:59:59';
      }
      params.page = this.currentPage4;
      params.size = this.curPageSize;
      return params;
    },
    createMessage() {
      this.$router.push({ path: '/operation/message?createMessage'});
    },
    fetchData() {
      this.getMessageList(this.computeParams()).then( () => {
        this.mapPagination();
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchData();
      });
    })
  },
  mounted() {
    this.$nextTick( () => {
      this.fetchData();
    })
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.messagePage {
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
    box-sizing: border-box;
    padding: {
      top: 20px;
      bottom: 20px;
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
  .messageTableBox {
    width: 100%;
    overflow-x: hidden;
  }
}
</style>

<template>
  <div class="protalPage">
    <div class="wraper">
      <div class="title">
        渠道汇总
      </div>
      <div class="sportOrderTop">
        <!-- 选择时间和日期 -->
        <div class="block">
          <el-date-picker v-model="time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </div>
      </div>
      <!-- 表格部分 -->
      <div class="sportOrderBotom">
        <div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="收入" name="first" v-permission="'06aa5acc-f687-43f7-bed8-b88b01e2dee3'">
              <channels-tab :tableData="channelsList" v-permission="'1ab54b3b-7597-4c12-a96e-636f6a47487a'"></channels-tab>
            </el-tab-pane>
            <el-tab-pane label="退款" name="second">
              <span v-permission="'c9115b0a-4574-4de2-9388-2cf83758efa9'">暂无</span>
              <!-- <channels-refund :tableData="channelsRefundList"></channels-refund> -->
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import channelsTab from './components/channelsTab';

import channelsRefund from './components/channelsRefund';

import { mapState, mapActions } from 'vuex';

// import moment from 'moment';

export default {
  computed: {
    ...mapState({
      channelsList: state => state.channels.channelsList,
      channelsRefundList: state => state.channels.channelsRefundList
    })
  },
  components: {
    channelsTab,
    channelsRefund
  },
  watch: {
    time(val) {
      this.fetchData();
    },
  },
  methods: {
    ...mapActions(['getChannelsList', 'getChannelsRefundList']),
    computeParams() {
      let params = {};
      if (this.time.length > 0) {
        params.beginTime = this.time[0];
        params.endTime = this.time[1];
      }
      return params;
    },
    handleClick(tab, event) {
    },
    setDefaultDate() {
      const end = moment().format('YYYY-MM-DD HH:mm:ss')
      const start = moment(end).add(-30, 'days').format('YYYY-MM-DD HH:mm:ss')
      this.time = [start, end];
    },
    fetchData() {
      this.getChannelsList(this.computeParams());
      this.getChannelsRefundList(this.computeParams());
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchData();
      });
    })
  },
  data() {
    return {
      pickerOptions2: {
        shortcuts: [
          {
            text: '本周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '本月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '本年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      activeName: 'first',
      time: ''
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setDefaultDate();
      this.fetchData();
    });
  }
};
</script>

<style lang="scss" scoped>
.wraper {
  background: white;
  width: 100%;
  height: 100%;
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

  .sportOrderTop {
    display: -webkit-flex;
    justify-content: space-between;
    margin: 20px 0;
  }
  .sportOrderBotom {
    .paging {
      margin-top: 30px;
    }
  }
}
</style>

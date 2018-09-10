<template>
  <div class="user_sport">
    <div class="userSportInfo">
      <div class="body_hight">
        <div class="body_title">运动总时长
          <span style="color: #666666; font-size: 10px">(分钟)</span>
        </div>
        <div class="sport_value">{{(totalData.sportLength / 60).toFixed(2)}}</div>
      </div>
      <div class="body_weight">

        <div class="body_title">运动总消耗
          <span style="color: #666666; font-size: 10px">(kcal)</span>
        </div>
        <div class="sport_value">{{(!totalData.sportCalorie ? 0 : totalData.sportCalorie/1000).toFixed(3)}}</div>
      </div>
      <div class="body_lost_weight">

        <div class="body_title">运动总次数</div>
        <div class="sport_value">{{totalData.times}}</div>
      </div>
      <div class="body_weight_number">

        <div class="body_title">运动频率
          <span style="color: #666666; font-size: 10px">(次/每周)</span>
        </div>
        <div class="sport_value">{{totalData.weekToTime}}/周</div>
      </div>
    </div>
    <div class="timeSelect">
      <el-date-picker v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
    </div>
    <div class="sportChartBox">
      <sport-chart :chartData="userSportChart"></sport-chart>
    </div>
    <div class="userSportTable" style="margin-top: 20px; margin-bottom: 20px">
      <user-sport-list :tableData="userSportTable"></user-sport-list>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="currentSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
      </el-pagination>
    </div>

    <div class="useDeviceChart">
      <user-device-chart :chartData="devicesData"></user-device-chart>
    </div>
  </div>
</template>

<script>
import SportChart from './SportChart';

import UserSportList from './UserSportList';

import UserDeviceChart from './UserDeviceChart';

import { mapActions } from 'vuex';

// import moment from 'moment';

const today = moment().format('YYYY-MM-DD HH:mm:ss');

export default {
  props: {
    userId: {
      type: String
    }
  },
  data() {
    return {
      currentPage: 1,
      currentSize: 10,
      curTotal: 0,
      pageSizes: [10, 20, 30, 40],
      totalData: {
        times: 0,
        sportCalorie: 0,
        sportLength: 0,
        weekToTime: 0
      },
      userSportTable: [], // 运动列表
      userSportChart: {}, // 运动图表
      devicesData: {}, // 各设备数据
      time: [],
      today: today,
      start: moment(today)
        .add(-15, 'days')
        .format('YYYY-MM-DD HH:mm:ss')
    };
  },
  computed: {
    datas() {
      return [];
    }
  },
  watch: {
    time() {
      this.fetchData();
    },
    times() {
      this.fetchData();
    }
  },
  components: {
    SportChart,
    UserSportList,
    UserDeviceChart
  },
  methods: {
    ...mapActions([
      'getUserTotalSportData',
      'getUserSportChartData',
      'getUserSportDataList',
      'getUserSportChartByDeviceType'
    ]),
    handleSizeChange(val) {
      this.currentSize = val;
      this.fetchSportList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchSportList();
    },
    setDefaultDate() {
      const end = moment().format('YYYY-MM-DD HH:mm:ss');
      const start = moment(end)
        .add(-30, 'days')
        .format('YYYY-MM-DD HH:mm:ss');
      this.time = [start, end];
    },
    checkout() {},
    handleSelectionChange() {},
    fetchSportList() {
      this.getUserSportDataList({
        // 列表
        page: this.currentPage,
        size: this.currentSize,
        userId: this.userId,
        beginTime: this.time[0],
        endTime: this.time[1]
      }).then(res => {
        // console.log('用户数据列表', res);
        this.userSportTable = res.list;
        this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
        this.currentSize = res.pageSize;
        this.curTotal = res.total;
      });
    },
    fetchData() {
      this.fetchSportList();
      this.getUserTotalSportData({
        // 总数据
        userId: this.userId
      }).then(res => {
        // console.log('运动总数据',res)
        this.totalData = res;
      });
      this.getUserSportChartData({
        // 图表
        userId: this.userId,
        beginTime: this.time[0],
        endTime: this.time[1]
      }).then(res => {
        let sportChart = {};
        res.statisticDate = res.statisticDate.replace(/-/g, '');
        let keys = Object.keys(res);
        for (let index in keys) {
          sportChart[keys[index]] = JSON.parse(res[keys[index]]);
        }
        sportChart.sportCalorie.forEach((item, index) => {
          sportChart.sportCalorie[index] = item / 1000;
        });
        this.userSportChart = sportChart;
        // console.log(sportChart);
      });

      // 各设备使用
      this.getUserSportChartByDeviceType({
        userId: this.userId,
        beginTime: this.time[0],
        endTime: this.time[1],
      }).then(res => {
        let devicesData = {};
        res.facilityTypeName = res.facilityTypeName.replace(/\[/g, '');
        res.facilityTypeName = res.facilityTypeName.replace(/\]/g, '');
        let keys = Object.keys(res);
        for (let index in keys) {
          if (keys[index] !== 'facilityTypeName') {
            devicesData[keys[index]] = JSON.parse(res[keys[index]]);
          }
        }
        devicesData.facilityTypeName = res.facilityTypeName.split(',');
        this.devicesData = devicesData;
      });
    }
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
@import '~assets/style/utils';

.user_sport {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}
.sportChartBox {
  width: 100%;
}

.userSportInfo {
  width: 100%;
  @include flexbox;
  @include align-items(center);
  @include justify-content(space-around);
}

.timeSelect {
  @include flexbox;
  @include justify-content(center);
  @include align-items(center);
  padding: {
    top: 30px;
  }
  margin: {
    bottom: 10px;
  }
}
.useDeviceChart {
  width: 100%;
}
.userSportTable {
  width: 900px;
}
.sport_value {
  font-size: 30px;
  font-weight: 600;
}
</style>

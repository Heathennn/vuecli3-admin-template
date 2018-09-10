<template>
  <div class="appointmentPage">
    <div class="appointmentHeader">
      <el-radio-group v-model="selectedDate" v-permission="'cdbf94a6-987e-43bf-a168-a7992ae317fe'">
        <el-radio-button :label="today"></el-radio-button>
        <el-radio-button :label="tomorrow"></el-radio-button>
        <el-radio-button :label="afterTomorrow"></el-radio-button>
      </el-radio-group>

    </div>
    <!-- <el-button @click="fetchData">刷新</el-button> -->

    <el-dialog :title="activeInterval + '预约订单'" :visible.sync="dialogVisible" width="70%" center :before-close="handleClose">
      <el-table :data="orderTable" style="width: 100%" height="300" v-permission="'de45b541-fa7a-4b9a-8d09-3309dd0d8e08'">
        <el-table-column label="预约时段" prop="intervalDate">
        </el-table-column>
        <el-table-column label="用户" prop="username">
        </el-table-column>
        <el-table-column label="手机" prop="mobile">
        </el-table-column>
        <el-table-column label="订单号" prop="orderSn">
          <template slot-scope="scope">
            <a href="javascript:;" @click="jumpToOrderDetail(scope.row.id)">{{scope.row.orderSn}}</a>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="orderStatus">
        </el-table-column>
      </el-table>
    </el-dialog>

    <div class="timePicker" v-permission="'cdbf94a6-987e-43bf-a168-a7992ae317fe'">
      <div class="timeBox" v-for="(item, index) in timeDetail" :key="index">
        <div class="insideBox" @click="checkoutOrder(item)">
          <card :timeInfo="item" :currentDate="selectedDate"></card>
        </div>
      </div>

    </div>
    <div class="timeTotalInfo" v-permission="'cdbf94a6-987e-43bf-a168-a7992ae317fe'">
      <div class="totalAppointment totalItem">今天总预约({{totalOrder}})</div>
      <div class="totalOvertime totalItem">今天总超时({{totalOvertime}})</div>
      <div class="totalCancel totalItem">今天总取消({{totalCancel}})</div>
    </div>

    <div v-permission="'cdbf94a6-987e-43bf-a168-a7992ae317fe'" class="timePicker" style="padding-left: 10px" v-if="!timeDetail && timeDetail.length < 1">无时段信息</div>
  </div>
</template>

<script>
import Card from './Card';

import { mapState, mapActions } from 'vuex';

// import moment from 'moment';

const today = moment().format('YYYY-MM-DD');

export default {
  data() {
    return {
      dialogVisible: false,
      selectedDate: today,
      today: today,
      tomorrow: moment(today)
        .add(1, 'days')
        .format('YYYY-MM-DD'),
      afterTomorrow: moment(today)
        .add(2, 'days')
        .format('YYYY-MM-DD'),
      activeInterval: '00:00-00:00',
      orderTable: []
    };
  },
  computed: {
    ...mapState({
      defaultStore: state => state.board.defaultStore,
      timeDetail: state => state.board.timeDetail,
      totalOrder: state => state.board.totalOrder,
      totalOvertime: state => state.board.totalOvertime,
      totalCancel: state => state.board.totalCancel
    })
  },
  methods: {
    ...mapActions([
      'getStoreTimeDetail',
      'getTotalOrder',
      'getBoardOrderTable'
    ]),
    jumpToOrderDetail(id) {
      this.dialogVisible = false;
      this.$router.push({ path: `/order/sportOrder?orderDetail=${id}` });
    },
    fetchData(storeInfo, date) {
      this.getStoreTimeDetail({
        storeId: storeInfo.id,
        intervalDate: date
      });
      this.getTotalOrder({
        storeId: storeInfo.id,
        currentTime: date + ' 23:59:59'
      });
    },
    checkoutOrder(timeInfo) {
      this.dialogVisible = true;
      this.activeInterval = timeInfo.intervalLable;
      // 获取预约订单
      this.getBoardOrderTable({
        beginTime: this.moment(timeInfo.startTime).format(
          'YYYY-MM-DD HH:mm:ss'
        ),
        endTime: this.moment(timeInfo.endTime).format('YYYY-MM-DD HH:mm:ss'),
        storeId: timeInfo.storeId,
        page: 1,
        size: 100
      })
        .then(res => {
          res.forEach((item, index) => {
            item.intervalDate =
              this.moment(item.startTime).format('YYYY-MM-DD HH:mm:ss') +
              '-' +
              this.moment(item.endTime).format('YYYY-MM-DD HH:mm:ss');
            item.username = item.userInfo.nickname;
            item.mobile = item.userInfo.mobile;
            item.orderStatus =
              item.orderStatus == 1
                ? '待使用'
                : item.orderStatus == 2
                  ? '使用中'
                  : item.orderStatus == 3
                    ? '已完成'
                    : item.orderStatus == 4 ? '已取消' : '';
          });
          this.orderTable = res;

          console.log(this.orderTable);
        })
        .catch(() => {});
    },
    handleClose(done) {
      this.activeInterval = '00:00-00:00';
      this.orderTable = [];
      done();
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {
        vm.fetchData(this.defaultStore.id, selectedDate);
      });
    });
  },
  watch: {
    defaultStore(value) {
      // console.log(value.id)
      this.fetchData(value, this.selectedDate);
    },
    selectedDate(value) {
      // console.log(value)
      this.fetchData(this.defaultStore, value);
    }
  },
  components: {
    Card
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.appointmentHeader {
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  padding: 15px;

  @include flexbox;
  .title {
    padding: {
      right: 50px;
    }
  }
}

.timePicker {
  width: 100%;
  @include flexbox;
  @include flex-wrap(wrap);
  // @include justify-content(space-around);
  .timeBox {
    width: 180px;
    height: 180px;
    box-sizing: border-box;
    padding: 10px;
    .insideBox {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
    }
  }
}

.timeTotalInfo {
  @include flexbox;
  width: 100%;
  box-sizing: border-box;
  padding: {
    top: 20px;
    bottom: 30px;
    left: 20px;
  }
  .totalItem {
    border: 1px solid #e5e5e5;
    box-sizing: border-box;
    font-size: 12px;
    color: #666666;
    padding: {
      top: 5px;
      bottom: 5px;
      left: 25px;
      right: 25px;
    }
  }
}
</style>

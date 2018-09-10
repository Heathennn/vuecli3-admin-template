<template>
  <div class="presentDetail">
    <div class="date_time_picker">
      <div style="padding-right:10px">日期</div>
      <el-date-picker v-model="time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
      </el-date-picker>

      <el-input placeholder="搜索用户昵称" v-model="nickname" style="width: 150px; margin-right: 20px; margin-left: 20px"></el-input>
      <el-input placeholder="搜索订单号" v-model="orderSn" style="width: 180px; margin-right: 20px"></el-input>
      <el-button type="primary" @click="fetchPresentList">搜索</el-button>
    </div>

    <el-table :data="couponList" style="width: 100%">
      <el-table-column label="时间" prop="createTime">
        <template slot-scope="scope">
          {{moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column prop="storeName" label="门店">
      </el-table-column>
      <el-table-column prop="orderSn" label="订单号">
        <template slot-scope="scope">
          <a href="javascript:;" class="hyperlink" @click="jumpTo(scope.row)">
            {{scope.row.orderSn}}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="userInfo.nickname" label="用户">
      </el-table-column>
      <el-table-column prop="consumeType" label="消费类型">
        <template slot-scope="scope">
          {{scope.row.consumeType == 1 ? '运动消费' : ''}}
        </template>
      </el-table-column>
      <el-table-column prop="couponType" label="优惠券类型">
        <template slot-scope="scope">
          {{scope.row.couponType == 1 ? '现金优惠券' : scope.row.couponType == 2 ? '折扣优惠券' : scope.row.couponType == 3 ? '次抵用优惠券' : scope.row.couponType == 4 ? '小时抵用优惠券' : ''}}
        </template>
      </el-table-column>
      <el-table-column label="优惠券" prop="couponTitle">
      </el-table-column>
      <el-table-column label="抵用金额" prop="deductionMoney">
        <template slot-scope="scope">
          {{(scope.row.deductionMoney / 100).toFixed(2)}}
        </template>
      </el-table-column>
    </el-table>

    <div class="total" style="margin-top: 30px">
      <el-table :data="couponTotal" style="width: 100%">
        <el-table-column label="时间">
          <template slot-scope="scope">
            {{time[0] + '至' + time[1]}}
          </template>
        </el-table-column>
        <el-table-column prop="storeNum" label="门店数量">
        </el-table-column>
        <el-table-column prop="orderNum" label="累计订单量">
        </el-table-column>
        <el-table-column prop="userNum" label="累计用户量">
        </el-table-column>
        <el-table-column prop="consumeTypeNum" label="累计消费类型">
        </el-table-column>
        <el-table-column prop="couponTypeNum" label="累计优惠券类型">
        </el-table-column>
        <el-table-column label="累计优惠券" prop="couponNum">
        </el-table-column>
        <el-table-column label="累计抵用金额" prop="discountMoneyTotal">
          <template slot-scope="scope">
            {{(scope.row.discountMoneyTotal / 100).toFixed(2)}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  getPresentListDetail,
  getPresentTotalDetail
} from 'api/finance/couponPresent';

export default {
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
      time: [],
      couponList: [],
      couponTotal: [],
      nickname: '',
      orderSn: ''
    };
  },
  computed: {
    storeId() {
      return this.$route.query.storeId;
    }
  },
  watch: {
    time() {
      this.fetchPresentList();
      this.fetchPresentTotal();
    }
  },
  methods: {
    jumpTo(row) {
      this.$router.push({path: `/order/sportOrder?orderSn=${row.orderSn}`})
    },
    setDefaultDate() {
      const end = this.moment().format('YYYY-MM-DD');
      const start = this.moment(end)
        .add(-30, 'days')
        .format('YYYY-MM-DD');
      this.time = [start, end];
    },
    yieldParams() {
      let params = {};
      params.beginTime = this.time[0];
      params.endTime = this.time[1];
      params.storeId = this.storeId;
      if (this.nickname) {
        params.userName = this.nickname;
      }
      if (this.orderSn) {
        params.orderSn = this.orderSn;
      }
      return params;
    },
    fetchPresentList() {
      getPresentListDetail(this.yieldParams()).then(res => {
        this.couponList = res.data.data.list;
      });
    },
    fetchPresentTotal() {
      getPresentTotalDetail({
        beginTime: this.time[0],
        endTime: this.time[1],
        storeId: this.storeId
      }).then(res => {
        this.couponTotal = [res.data.data]
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setDefaultDate();
      this.fetchPresentList();
      this.fetchPresentTotal();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.presentDetail {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}
.date_time_picker {
  @include flexbox;
  @include align-items(center);
}
</style>

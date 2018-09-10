<template>
  <div class="couponPresentPage">
    <sub-title title="赠送消耗"></sub-title>
    <div class="date_time_picker" style="margin-top: 30px;margin-bottom: 10px;">
      <el-date-picker v-model="time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
      </el-date-picker>
    </div>
  
     <el-table :data="couponPresentList" style="width: 100%" v-permission="'2455e031-2471-40cd-9f76-f5d2026f6127'">
      <el-table-column label="排名" prop="sortNum">
      </el-table-column>
      <el-table-column prop="storeName" label="门店">
      </el-table-column>
      <el-table-column label="优惠券使用张数" prop="couponCount">
      </el-table-column>
      <el-table-column label="总抵用金额" prop="discountMoney">
        <template slot-scope="scope">
          {{scope.row.discountMoney / 100 + '元'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primay" plain @click="jumpTo(scope.row)" v-permission="'b35d87ba-79d4-434a-9eee-7bce76e982c9'">查看操作</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="totalCoupon" style="margin-top: 20px">
      <el-table :data="couponTotal" style="width: 100%">
      <el-table-column label="  ">
        <template slot-scope="scope">
          总计
        </template>
      </el-table-column>
      <el-table-column prop="storeNum" label="门店总数">
      </el-table-column>
      <el-table-column label="优惠券使用张数" prop="couponCount">
      </el-table-column>
      <el-table-column label="总抵用金额" prop="discountMoney">
        <template slot-scope="scope">
          {{scope.row.discountMoneyTotal / 100 + '元'}}
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script>
import { getCouponPresentList, getPresentTotal } from 'api/finance/couponPresent';

import SubTitle from 'components/SubTitle';

export default {
  components: {
    SubTitle
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
      time: [],
      couponPresentList: [],
      couponTotal: []
    }
  },
  watch: {
    time() {
      this.fetchPresentList();
      this.fetchCouponTotal();
    }
  },
  methods: {
    setDefaultDate() {
      const end = this.moment().format('YYYY-MM-DD')
      const start = this.moment(end).add(-30, 'days').format('YYYY-MM-DD')
      this.time = [start, end];
    },
    jumpTo(row) {
      this.$router.push({path: `/finance/presentDetail?storeId=${row.storeId}`})
    },
    fetchPresentList() {
      getCouponPresentList({
        page: 1,
        size: 10,
        beginTime: this.time[0],
        endTime: this.time[1]
      }).then( (res) => {
        this.couponPresentList = res.data.data.list;
      })
    },
    fetchCouponTotal() {
      getPresentTotal({
        beginTime: this.time[0],
        endTime: this.time[1]
      }).then( (res) => {
        // console.log(res);
        this.couponTotal = [res.data.data]
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchPresentList();
        vm.fetchCouponTotal();
      })
    })
  },
  mounted() {
    this.$nextTick( () => {
      this.setDefaultDate();
      this.fetchPresentList();
      this.fetchCouponTotal();
    })
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.couponPresentPage {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}

.date_time_picker {
  width: 100%;
}
</style>

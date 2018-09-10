<template>
  <div class="wraper">
    <div class="title">钱包明细</div>
    <div style="height: 30px; line-height: 30px; padding-bottom: 10px; padding-top: 20px;">用户: {{userName}} &nbsp;&nbsp;ID:{{userId}}</div>
    <div class="block">
      <el-date-picker v-model="time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
      </el-date-picker>
    </div>
    <div class="userWalletAllData" v-if="userWalletAll">
      <div class="userRecharge item shadow">
        <div class="subTitle">充值</div>
        <div class="subItem">微信充值{{(userWalletAll.rechargeWeixin / 100).toFixed(2)}}</div>
        <div class="subItem">支付宝充值{{(userWalletAll.rechargeAliPay / 100).toFixed(2)}}</div>
        <div class="subItem">充值总额{{(userWalletAll.rechargeTotal / 100).toFixed(2)}}</div>
      </div>

      <div class="user item shadow">
        <div class="subTitle">消费</div>
        <div class="subItem">预约运动{{(userWalletAll.consumeSport / 100).toFixed(2)}}</div>
        <div class="subItem">售货机商品{{(userWalletAll.consumeGoods / 100).toFixed(2)}}</div>
        <div class="subItem">消费总额{{(userWalletAll.consumeTotal / 100).toFixed(2)}}</div>
      </div>
        
      <div class="userRecharge item shadow">
        <div class="subTitle">退款</div>
        <div class="subItem">预约运动{{(userWalletAll.refundSport / 100).toFixed(2)}}</div>
        <div class="subItem">售货机商品{{(userWalletAll.refundGoods / 100).toFixed(2)}}</div>
        <div class="subItem">退款总额{{(userWalletAll.refundTotal / 100).toFixed(2)}}</div>
      </div>

      <div class="userRecharge item shadow">
        <div class="subTitle">余额</div>
        <div class="subItem">消费支出{{(userWalletAll.balanceExpend / 100).toFixed(2)}}</div>
        <div class="subItem">消费退款{{(userWalletAll.balanceRefund / 100).toFixed(2)}}</div>
        <div class="subItem">余额{{(userWalletAll.balance / 100).toFixed(2)}}</div>
      </div>

      <div class="userRecharge item shadow">
        <div class="subTitle">优惠券</div>
        <div class="subItem">已领数量{{(userWalletAll.couponReceive)}}</div>
        <div class="subItem">已用数量{{(userWalletAll.couponUsed)}}</div>
        <div class="subItem">可用数量{{(userWalletAll.couponUsable)}}</div>
      </div>
    </div>
    <div>
      <div>
        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
          <el-tab-pane label="充值明细" name="first">
            <recharge-sheet :tableData="walletRechargeList"></recharge-sheet>
          </el-tab-pane>
          <el-tab-pane label="消费明细" name="second">
            <consumption :tableData="walletConsumeList"></consumption>
          </el-tab-pane>
          <el-tab-pane label="退款明细" name="third">
            <refundDetail :tableData="walletRefundList"></refundDetail>
          </el-tab-pane>
          <el-tab-pane label="优惠券明细" name="fourth">
            <coupon :tableData="walletCouponList"></coupon>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import coupon from './coupon';

import rechargeSheet from './rechargeSheet';

import consumption from './consumption';

import refundDetail from './refundDetail';

import { mapState, mapActions } from 'vuex';

// import moment from 'moment';

export default {
  props: {
    userInfo: {
      type: String
    }
  },
  components: {
    // walletTabs,
    coupon,
    rechargeSheet,
    consumption,
    refundDetail
  },
  watch: {
    time() {
      this.getUserWalletAll();
    }
  },
  methods: {
    ...mapActions([
      'getWalletRechargeList',
      'getWalletConsumeList',
      'getWalletRefundList',
      'getWalletCouponList',
      'getUserWalletDetail' // 总计
    ]),
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    setDefaultDate() {
      const end = moment().format('YYYY-MM-DD')
      const start = moment(end).add(-30, 'days').format('YYYY-MM-DD')
      this.time = [start, end];
    },
    createParams() {
      let params = {};
      params.userId = this.userId;
      params.beginTime = this.time[0] + ' 00:00:00';
      params.endTime = this.time[1] + ' 23:59:59';
      return params;
    },
    getUserWalletAll() {
      this.getUserWalletDetail(this.createParams()).then( (res) => {
        this.userWalletAll = res;
      });
      this.getWalletRechargeList(this.createParams());
      this.getWalletConsumeList(this.createParams());
      this.getWalletRefundList(this.createParams());
      this.getWalletCouponList(this.createParams());
    }
  },
  computed: {
    ...mapState({
      walletRechargeList: state => state.userWallet.walletRechargeList, //充值
      walletConsumeList: state => state.userWallet.walletConsumeList, //消费
      walletRefundList: state => state.userWallet.walletRefundList, //退款
      walletCouponList: state => state.userWallet.walletCouponList //优惠券
    })
  },
  data() {
    return {
      activeName2: 'first',
      userWalletAll: null,
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
      time: [],
      userId: '',
      userName: ''
    };
  },
  mounted() {
    this.$nextTick(() => {
      let arr = this.$route.query.userWalletDetail.split('-');
      this.userId = arr[0];
      this.userName = arr[1];
      this.setDefaultDate();
      this.getUserWalletAll(); // 获取总计
      // this.getWalletRechargeList(this.createParams());
      // this.getWalletConsumeList(this.createParams());
      // this.getWalletRefundList(this.createParams());
      // this.getWalletCouponList(this.createParams());
    });
  }
};
</script>
<style lang="scss" scoped>
@import '~assets/style/utils';

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
  .block {
    margin: 20px 0;
  }
}
.subTitle {
  font-size: 20px;
  font-weight: 600;
}

.subItem {
  font-size: 15px;
  line-height: 24px;
  color: #666666;
}
.item {
  box-sizing: border-box;
  width: 18%;
  height: 160px;
  padding: 10px;
  border: 1px solid #666666;
  @include flexbox;
  @include flex-direction(column);
  @include justify-content(flex-start);
  @include align-items(left);
}
.userWalletAllData {
  @include flexbox;
  width: 100%;
  @include justify-content(space-around);
  @include align-items(center);
  margin: {
    bottom: 30px;
  }
}
</style>

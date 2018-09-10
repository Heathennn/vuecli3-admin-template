<template>
  <div>
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="充值明细" name="first">
        <recharge-sheet :tableData="walletRechargeList"></recharge-sheet>
      </el-tab-pane>
      <el-tab-pane label="消费明细" name="second">
        <consumption></consumption>
      </el-tab-pane>
      <el-tab-pane label="退款明细" name="third">
        <refundDetail></refundDetail>
      </el-tab-pane>
      <el-tab-pane label="优惠券明细" name="fourth">
        <coupon></coupon>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
//
import coupon from './coupon';

import rechargeSheet from './rechargeSheet';

import consumption from './consumption';

import refundDetail from './refundDetail';

import { mapState, mapActions } from 'vuex';

export default {
  ...mapActions(['getWalletRechargeList']),
  components: {
    coupon,
    rechargeSheet,
    consumption,
    refundDetail
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  },
  computed: {
    walletRechargeList: state => state.userWallet.walletRechargeList //充值
  },
  data() {
    return {
      activeName2: 'first'
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getWalletRechargeList();
    });
  }
};
</script>
<style lang="scss" scoped>

</style>

<template>
  <el-table :data="datas" style="width: 100%">
    <el-table-column prop="balanceInitialTotal" label="期初余额">
    </el-table-column>
    <el-table-column prop="currentRechargeTotal" label="累加充值">
    </el-table-column>
    <el-table-column prop="currentConsumeTotal" label="累加消费">
    </el-table-column>
    <el-table-column prop="currentRefundTotal" label="累加退款">
    </el-table-column>
    <el-table-column prop="balanceFinalTotal" label="期末余额">
    </el-table-column>
     <el-table-column prop="userTotal" label="交易用户总数">
    </el-table-column>
    <el-table-column prop="statsNum" label="交易单总量">
    </el-table-column>
  </el-table>
</template>

  <script>
import { deepCopy } from 'common/utils';
export default {
  methods: {},
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    $route(to, from) {
      // console.log(to)
    }
  },
  computed: {
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach((item, index) => {
        item.balanceInitialTotal = ( item.balanceInitialTotal / 100 ).toFixed(2) + '元';
        item.currentRechargeTotal = ( item.currentRechargeTotal / 100 ).toFixed(2)  + '元';
        item.currentConsumeTotal = ( item.currentConsumeTotal / 100 ).toFixed(2)  + '元';
        item.currentRefundTotal = ( item.currentRefundTotal / 100 ).toFixed(2)  + '元';
        item.balanceFinalTotal = ( item.balanceFinalTotal / 100 ).toFixed(2)  + '元';
        item.userTotal = item.userTotal + '个';
      });
      return list;
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

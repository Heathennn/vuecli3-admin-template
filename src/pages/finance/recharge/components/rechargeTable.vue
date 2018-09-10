<template>
  <div class="table" style="width: 100%">
    <el-table :data="datas" style="width: 100%" align="center" show-summary>
      <el-table-column prop="channelType" label="充值方式">
      </el-table-column>
      <el-table-column prop="rechargeUserTotal" label="充值用户数(个)">
      </el-table-column>
      <el-table-column prop="rechargeTotal" label="充值笔数（笔）">
      </el-table-column>
      <el-table-column prop="rechargeMoneyTotal" label="充值总额（元）">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div @click="shopRouter(scope.$index, scope.row)" v-permission="'f45e8cc4-97ef-4cd3-8ef6-50715e236ed6'">查看明细</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { deepCopy } from 'common/utils';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    shopRouter(index, row) {
      // console.log("112",row);
      let type = row.channelType === '支付宝' ? 1 : row.channelType === '微信' ? 2 : ''
      this.$router.push({ path: `/finance/recharge?rechargeDetail=${type}`});
    }
  },
  // computed:{

  // },
  computed: {
    id() {
      return this.$route.query.shopTab;
    },
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach((item, index) => {
        item.rechargeMoneyTotal = (item.rechargeMoneyTotal / 100).toFixed(2);
        item.channelType =
          item.channelType == 1
            ? '支付宝'
            : item.channelType == 2 ? '微信' : '';
      });
      return list;
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.getRechargeDetailList({
    //    userId: this.id
    //   });
    // });
  }
};
</script>
<style lang="scss" scoped>

</style>

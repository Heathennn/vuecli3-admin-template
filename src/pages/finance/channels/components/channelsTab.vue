<template>
  <div style="width: 100%">
    <el-table :data="datas" style="width: 100%" align="center" show-summary :summary-method="getSummaries">
      <el-table-column prop="incomeType" label="收入类型">
      </el-table-column>
      <el-table-column prop="incomeWeichat" label="微信收入(元)">
      </el-table-column>
      <el-table-column prop="incomeZhifubao" label="支付宝收入(元)">
      </el-table-column>
      <el-table-column prop="incomeBalance" label="余额收入(元)">
      </el-table-column>
      <el-table-column prop="incomeTotal" label="小计(元)">
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
  watch: {
    $route(to, from) {
      // console.log(to)
    }
  },
  data() {
    return {};
  },
  computed: {
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach((item, index) => {
        item.incomeTotal = item.incomeTotal / 100;
        item.incomeZhifubao = item.incomeZhifubao / 100;
        item.incomeWeichat = item.incomeWeichat / 100;
        item.incomeBalance = item.incomeBalance / 100;
        item.incomeType =
          item.incomeType == 1
            ? '充值'
            : item.incomeType == 2 ? '商品销售' : '押金';
      });
      return list;
    }
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => {
          return Number(item[column.property]);
        });
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (prev * 100 + curr * 100) / 100
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '-';
        }
      });

      return sums;
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

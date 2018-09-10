<template>
  <div style="width: 100%">
    <el-table :data="datas" style="width: 100%" align="center" show-summary :summary-method="getSummaries">
      <el-table-column prop="refundType" label="退款类型">
      </el-table-column>
      <el-table-column prop="refundWeichat" label="微信退款额(元)">
      </el-table-column>
      <el-table-column prop="refundZhifubao" label="支付宝退款额(元)">
      </el-table-column>
      <el-table-column prop="refundTotal" label="小计(元)">
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
        item.refundWeichat = (item.refundWeichat / 100).toFixed(2);
        item.refundTotal = (item.refundTotal / 100).toFixed(2);
        item.refundZhifubao = (item.refundZhifubao / 100).toFixed(2);
        item.refundType =
          item.refundType == 1 ? '充值' : item.refundType == 2 ? '商品销售' : '押金';
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
              return ((prev * 100 + curr * 100) / 100).toFixed(2);
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

<template>
  <div style="width: 100%">
    <el-table :data="datas" style="width: 100%" show-summary :summary-method="getSummaries">
      <el-table-column type="index" :index="indexMethod" label="排名">
      </el-table-column>
      <el-table-column prop="storeName" label="门店">
      </el-table-column>
      <el-table-column label="预约运动">
        <el-table-column prop="sportOrder" label="笔数(笔)">
        </el-table-column>
        <el-table-column prop="sportIncome" label="收入(元)">
        </el-table-column>
      </el-table-column>
      <el-table-column label="商品销售">
        <el-table-column prop="goodsOrder" label="笔数(笔)">
        </el-table-column>
        <el-table-column prop="goodsIncome" label="收入(元)">
        </el-table-column>
      </el-table-column>
      <el-table-column prop="totalMoney" label="小计(元)">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div @click="getIncome(scope.$index, scope.row)" v-permission="'43504dc6-9cd7-45c4-8b69-291dcd5753d8'">查看明细</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { deepCopy } from 'common/utils';
export default {
  watch: {
    $route(to, from) {
      // console.log(to)
    }
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    getIncome(index, row) {
      // console.log(row)
      this.$router.push({ path: `/finance/income?account=${row.storeId}` });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index].toFixed(2);
        } else {
          sums[index] = '';
        }
      });

      return sums;
    }
  },
  computed: {
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach((item, index) => {
        item.sportIncome = (item.sportIncome / 100).toFixed(2);
        item.goodsIncome = (item.goodsIncome / 100).toFixed(2);
        item.totalMoney = (item.totalMoney / 100).toFixed(2);
      });
      return list;
    }
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  }
};
</script>
<style lang="sass" scoped>

</style>

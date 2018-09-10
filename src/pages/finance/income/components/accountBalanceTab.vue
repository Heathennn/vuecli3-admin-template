<template>
  <div style="width: 100%">
    <el-table :data="tableData" style="width: 100%" show-summary center>
      <el-table-column prop="storeName" label="门店">
      </el-table-column>
      <el-table-column label="预约运动">
        <el-table-column label="笔数(笔)" prop="sportOrder">
        </el-table-column>
        <el-table-column label="收入(元)" prop="sportIncome">
        </el-table-column>
      </el-table-column>
      <el-table-column prop="date" label="商品销售">
        <el-table-column label="笔数(笔)" prop="goodsOrder">
        </el-table-column>
        <el-table-column label="收入(元)" prop="goodsIncome">
        </el-table-column>
      </el-table-column>
      <el-table-column label="小计(元)" prop="totalMoney">
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
  computed: {
    // datas() {
    //   let list = deepCopy(this.tableData);
    //   list.forEach((item, index) => {
    //     item.sportOrder = item.sportOrder + '笔';
    //     item.sportIncome = item.sportIncome + '元';
    //     item.goodsOrder = item.goodsOrder + '笔';
    //     item.goodsIncome = item.goodsIncome + '元';
    //     item.totalMoney = item.totalMoney + '元';
    //   });
    //   console.log('111', list);
    //   return list;
    // }
  },

  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>

</style>

<template>
  <div style="width: 100%">
    <el-table :data="tableData" style="width: 100%" show-summary>
      <el-table-column prop="storeId" label="排名">
      </el-table-column>
      <el-table-column prop="storeName" label="门店">
      </el-table-column>
      <el-table-column label="预约运动退款">
        <el-table-column prop="sportOrder" label="微信">
        </el-table-column>
        <el-table-column prop="sportIncome" label="支付宝">
        </el-table-column>
      </el-table-column>
      <el-table-column label="商品销售">
        <el-table-column prop="goodsOrder" label="微信">
        </el-table-column>
        <el-table-column prop="goodsIncome" label="支付宝">
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div @click="handleEdit(scope.$index, scope.row)">查看明细</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
    props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleEdit(index, row) {
      this.$router.push({ path: '/finance/refund?particulars' });
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

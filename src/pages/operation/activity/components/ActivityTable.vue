<template>
  <div class="couponTable">
    <el-table :data="[]" style="width: 100%" :header-cell-style="headStyle">
      <el-table-column label="ID" prop="id">
      </el-table-column>
      <el-table-column label="活动时间" prop="couponClass">
      </el-table-column>
      <el-table-column label="活动名称" prop="name">
      </el-table-column>
       <el-table-column label="关联优惠券" prop="expiry">
      </el-table-column>
      <el-table-column label="优惠券类型" prop="expiry">
      </el-table-column>
      <el-table-column label="发行总量" prop="expiry">
      </el-table-column>
      <el-table-column label="已领取" prop="expiry">
      </el-table-column>
       <el-table-column label="状态" prop="status">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a href="###" v-permission="'ba5f19bd-e95d-4be9-9151-178639d739ac'">查看详情</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headStyle: {
        // "text-align": 'center',
        // color: 'red'
      },
      tableData: [
        {
          id: '001',
          couponClass: '抵用券',
          name: '新手体验券',
          expiry: '领取后15天内有效',
          activity: '新手注册',
          status: '有效'
        }
      ]
    };
  },
  methods: {
    handleEdit1(index, row) {
      // console.log(index, row);
    },
    handleEdit2(index, row) {
      // console.log(index, row);
    },
    handleEdit3(index, row) {
      // console.log(index, row);
    },
    handleEdit4(index, row) {
      // console.log(index, row);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.item {
  margin-top: 10px;
  margin-right: 40px;
}

</style>

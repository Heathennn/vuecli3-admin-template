<template>
  <div class="couponTable pageTable">
    <el-table :data="tableData" style="width: 100%" :header-cell-style="headStyle">
      <el-table-column label="券ID" prop="id">
      </el-table-column>
      <el-table-column label="券类型" prop="couponClass">
      </el-table-column>
      <el-table-column label="名称" prop="name">
      </el-table-column>
       <el-table-column label="有效期" prop="expiry">
      </el-table-column>
       <el-table-column label="关联活动" prop="activity">
      </el-table-column>
       <el-table-column label="状态" prop="status">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a href="###">查看详情</a>
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

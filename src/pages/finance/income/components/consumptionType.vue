<template>
  <div class="sportOrderTop">
    <div class="wraper">
      <!-- 搜索框/下拉列表 -->
      <div class="select">
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-input placeholder="请输入内容" v-model="input23">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="日期">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="paging">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    }
  },
  data() {
    return {
      currentPage4: 4,
      input23: '',
      value: 'all',
      options: [
        {
          value: 'all',
          label: '全部'
        }
      ],
      tableData: [
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.sportOrderTop {
  width: 100%;
  .wraper {
    display: -webkit-flex;
    justify-content: space-start;
    margin: 20px 0;
    .select {
      margin-right: 20px;
    }
  }
  .paging {
    margin-top: 30px;
  }
}
</style>

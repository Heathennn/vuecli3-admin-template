<template>
  <div class="protalPage">
    <div class="depositPage">
      <div class="title">
        押金管理
      </div>
      <div class="deposit">
        <div class="header">
          <div class="subtitle">押金金额: {{money}}</div>
          <el-button type="primary">修改</el-button>
        </div>
        <div class="musicTable">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="日期" width="180">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
          </el-table>
        </div>
        <div class="paginationBox">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="4000">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MusicTable from './components/MusicTable';

export default {
  components: {
    MusicTable
  },
  data() {
    return {
      currentPage4: 10,
      money: 99,
      tableData: [
       
      ]
    };
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.depositPage {
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .title {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
    }
  }
  
  .subtitle {
    font-size: 20px;
    font-weight: 600;
    padding: {
      right: 30px;
    }
  }
  .header {
    @include flexbox;
    @include align-items(center);
    box-sizing: border-box;
    padding: {
      top: 30px;
      bottom: 30px;
    }
  }
  .paginationBox {
    padding: {
      top: 20px;
    }
  }
}
</style>

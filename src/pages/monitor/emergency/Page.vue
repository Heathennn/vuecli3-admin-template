<template>
  <div class="box protalPage">
    <div class="wraper">
      <div class="title">
        应急处理
      </div>
      <div class="sportOrderTop">
        <!-- 选择时间和日期 -->
        <div class="block">
          <el-date-picker v-model="value1" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <!-- 搜索框 -->
        <div>
          <el-input placeholder="订单号/用户/门店" suffix-icon="el-icon-search" v-model="input21">
          </el-input>
        </div>
      </div>
      <!-- 表格部分 -->
      <div class="sportOrderBotom">
        <div  style="width: 100%">
          <el-table :data="tableData"  style="width: 100%">
            <el-table-column prop="date" label="上报时间" sortable>
            </el-table-column>
            <el-table-column prop="OrderID" label="门店">
            </el-table-column>
            <el-table-column prop="name" label="疑似人员摄像">
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="paging">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[20, 40, 60, 80]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="3">
            </el-pagination>
          </div>
        </div>
      </div>
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
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    }
  },
  data() {
    return {
      value: '',
      options1: [
        {
          value11: '选项1',
          label11: '全部'
        },
        {
          value11: '选项2',
          label11: '已完成'
        },
        {
          value11: '选项3',
          label11: '待使用'
        },
        {
          value11: '选项4',

          label11: '待支付'
        },
        {
          value11: '选项5',
          label11: '已取消'
        },
        {
          value11: '选项6',
          label11: '使用中'
        }
      ],
      value11: '',
      pickerOptions1: {},
      value1: '',
      value2: '',
      input21: '',
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          state: '完成订单',
          OrderID: '65463168431846',
          shop: '荔湾店',
          time: '60分钟',
          abstract: '正常预约',
          tag: '已完成'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          state: '预约订单',
          OrderID: '65463168431846',
          shop: '荔湾店',
          time: '60分钟',
          abstract: '正常预约',
          tag: '待使用'
        },
        {
          date: '2016-05-06',
          name: '王小虎',
          state: '预约订单',
          OrderID: '65463168431846',
          shop: '荔湾店',
          time: '60分钟',
          abstract: '异常订单',
          tag: '已取消'
        }
      ],
      currentPage4: 1
    };
  }
};
</script>

<style lang="scss" scoped>
.wraper {
  background: white;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .sportOrderTop {
    display: -webkit-flex;
    justify-content: space-between;
    margin: 20px 0;
  }
  .title {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
     width: 100%;
    border: {
      bottom: 1px solid #999999;
    }
  }
  .sportOrderBotom {
    .paging {
      margin-top: 30px;
    }
  }
}
</style>
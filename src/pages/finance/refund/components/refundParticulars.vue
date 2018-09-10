<template>
  <div class="particulars">
    <div class="protalPage">
      <div class="wraper">
        <div class="title">
          荔湾区好享瘦智能健身房-退款明细
        </div>
        <div class="time">
          选择时间：
          <el-date-picker v-model="value4" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
          </el-date-picker>
        </div>
        <!-- 第一个表 -->
        <div style="width: 100%">
          <el-table :data="tableData" style="width: 100%" show-summary>
            <el-table-column prop="storeName" label="门店">
            </el-table-column>
            <el-table-column label="预约运动">
              <el-table-column label="笔数" prop="sportOrder">
              </el-table-column>
              <el-table-column label="收入" prop="sportIncome">
              </el-table-column>
            </el-table-column>
            <el-table-column prop="date" label="商品销售">
              <el-table-column label="笔数" prop="goodsOrder">
              </el-table-column>
              <el-table-column label="收入" prop="goodsIncome">
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <!--选择/搜索框-->
        <consumption-Type></consumption-Type>
        <!-- 第二个表 -->
        <total-Table></total-Table>
      </div>
    </div>
  </div>
</template>
<script>
import consumptionType from './consumptionType';
import totalTable from './totalTable';
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  components: {
    consumptionType,
    totalTable
  },
  data() {
    return {
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      value4: ''
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
  .title {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
    }
  }
  .time {
    margin: 20px 0;
  }
  .paging {
    margin-top: 30px;
  }
}
</style>


  <template>
  <el-table :data="datas" style="width: 100%" :show-summary="true" :summary-method="getSummaries">
    <el-table-column prop="payChannel" label="退款方式">
    </el-table-column>
    <el-table-column prop="userTotal" label="退款用户数">
    </el-table-column>
    <el-table-column prop="orderTotal" label="退款笔数">
    </el-table-column>
    <el-table-column prop="moneyTotal" label="退款总额">
    </el-table-column>
    <el-table-column label="操作">
     <template slot-scope="scope">
        <el-button @click="getDetail(scope.row)">查看明细</el-button>
      </template>
    </el-table-column>
  </el-table>
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
        item.orderTotal = item.orderTotal + '笔';
        item.userTotal = item.userTotal + '人';
        item.moneyTotal = item.moneyTotal + '元';
        item.payChannel =
          item.payChannel == 1 ? '微信' : item.payChannel == 2 ? '支付宝' : '';
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
          return parseInt(item[column.property]);
        });
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '-';
        }
      });
      return sums;
    },
    getDetail(row) {
      let type = row.payChannel === '微信' ? 1 : row.payChannel === '支付宝' ? 2 : '';
      let query = type === 1 ? 'depositDetail1' : type === 2 ? 'depositDetail2' : '';
      this.$router.push({
        path: `/finance/userDeposit?${query}=${type}`,
      });
    }
  }
};
</script>
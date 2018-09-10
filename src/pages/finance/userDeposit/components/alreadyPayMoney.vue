  <template>
  <el-table :data="datas" style="width: 100%" :show-summary="true" :summary-method="getSummaries">
    <el-table-column prop="payChannel" label="支付方式">
    </el-table-column>
    <el-table-column prop="userTotal" label="支付用户数(人)">
    </el-table-column>
    <el-table-column prop="orderTotal" label="支付笔数(笔)">
    </el-table-column>
    <el-table-column prop="moneyTotal" label="支付总额(元)">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <div @click="getDetail(scope.$index, scope.row)" v-permission="'ee88f953-bfa6-484c-b1b1-6d68a064a5df'">查看明细</div>
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
  methods: {
    getDetail(index, row) {
      let type = row.payChannel === '微信' ? 1 : row.payChannel === '支付宝' ? 2 : '';
      let query = type === 1 ? 'depositDetail1' : type === 2 ? 'depositDetail1' : '';
      this.$router.push({
        path: `/finance/userDeposit?${query}=${type}`,
      });
    },
   getSummaries(param) { // 统计算法
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => {
          return Number(item[column.property]);
        });
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              if (index == 3) {
                return ((prev * 100 + curr * 100) / 100).toFixed(2);
              }
              return ((prev * 100 + curr * 100) / 100);
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '-';
        }
      });

      return sums;
    }
  },
  data() {
    return {};
  },
  computed: {
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach((item, index) => {
        item.orderTotal = item.orderTotal;
        item.userTotal = item.userTotal;
        item.moneyTotal = (item.moneyTotal / 100).toFixed(2);
        item.payChannel =
          item.payChannel == 1 ? '微信' : item.payChannel == 2 ? '支付宝' : '';
      });
      return list;
    }
  }
};
</script>
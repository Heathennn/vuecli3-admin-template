  <template>
  <div>
    <el-table :data="datas" style="width: 100%">
      <el-table-column prop="payDate" label="交押金日期">
      </el-table-column>
      <el-table-column prop="recordSn" label="单号">
      </el-table-column>
      <el-table-column prop="userInfo.nickname" label="用户">
      </el-table-column>
      <el-table-column prop="depositMoney" label="押金">
      </el-table-column>
      <el-table-column prop="payChannel" label="支付路径">
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
  data() {
    return {};
  },
  computed: {
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach((item, index) => {
        item.depositMoney = (item.depositMoney / 100).toFixed(2) + '元'
        item.payChannel =
          item.payChannel == 1 ? '支付宝' : item.payChannel == 2 ? '微信' : '';
      });
      return list;
    }
  }
};
</script>
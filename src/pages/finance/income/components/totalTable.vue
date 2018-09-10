  <template>
  <div class="table">
    <el-table :data="datas" style="width: 100%">
      <el-table-column prop="incomeDate" label="日期">
      </el-table-column>
      <el-table-column prop="orderSn" label="单号">
      </el-table-column>
      <el-table-column prop="storeName" label="门店">
      </el-table-column>
      <el-table-column prop="userInfo.nickname" label="用户">
      </el-table-column>
      <el-table-column prop="consumeType" label="消费类型">
      </el-table-column>
      <el-table-column prop="orderMoney" label="发生金额">
      </el-table-column>
      <el-table-column prop="discountMoney" label="优惠金额">
      </el-table-column>
      <el-table-column prop="payMoney" label="实收金额">
      </el-table-column>
      <el-table-column prop="payChannel" label="支付方式">
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
  computed: {
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach((item, index) => {
        item.payChannel = item.payChannel == 1 ? '余额' : ''
        item.consumeType =
          item.consumeType == 1
            ? '预约运动'
            : item.consumeType == 2 ? '商品销售' : '';
            item.orderMoney = (item.orderMoney / 100).toFixed(2) + '元';
            item.discountMoney = (item.discountMoney / 100).toFixed(2) + '元';
            item.payMoney = (item.payMoney / 100).toFixed(2) + '元';
      });
      return list;
    }
  },

  data() {
    return {};
  }
};
</script>
<style lang="scss">
.table {
  margin-top: 30px;
  width: 100%;
}
</style>

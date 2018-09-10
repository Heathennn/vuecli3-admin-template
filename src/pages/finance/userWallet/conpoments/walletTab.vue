  <template>
  <el-table :data="datas" style="width: 100%">
    <el-table-column prop="userId" label="用户ID">
    </el-table-column>
    <el-table-column prop="userInfo.nickname" label="用户昵称">
    </el-table-column>
    <el-table-column prop="totalRecharge" label="充值(元)">
    </el-table-column>
    <el-table-column prop="totalConsume" label="消费(元)">
    </el-table-column>
    <el-table-column prop="totalRefund" label="退款(元)">
    </el-table-column>
    <el-table-column prop="balance" label="余额(元)">
    </el-table-column>
    <el-table-column prop="deposit" label="押金(元)">
    </el-table-column>
    <el-table-column prop="couponAmount" label="有效优惠券">
    </el-table-column>
    <el-table-column label="操作">
        <template slot-scope="scope">
          <div @click="checkDetail(scope.$index, scope.row)" v-permission="'a0e13d24-1632-460b-9379-8c607ee2f365'">查看明细</div>
        </template>
    </el-table-column>
  </el-table>
</template>

  <script>
import { deepCopy } from 'common/utils';
export default {
  methods:{
      checkDetail(index, row) {
        // console.log(row)
      this.$router.push({ path: `/finance/userWallet?userWalletDetail=${row.userId}-${row.userInfo.nickname}` });
    }
  },
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
        item.totalRecharge = (item.totalRecharge / 100).toFixed(2)
        item.totalConsume = (item.totalConsume / 100).toFixed(2)
        item.totalRefund = (item.totalRefund / 100).toFixed(2)
        item.balance = (item.balance / 100).toFixed(2)
        item.deposit = (item.deposit / 100).toFixed(2)
      });
      return list;
    }
  },
  data() {
    return {};
  }
};
</script>
  <style lang="scss" scoped>

</style>
  
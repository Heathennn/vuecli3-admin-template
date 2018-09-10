  <template>
  <div>
    <div class="detailTab">
      <el-table :data="datas" style="width: 100%">
        <el-table-column prop="createTime" label="日期">
        </el-table-column>
        <el-table-column prop="recordSn" label="单号">
        </el-table-column>
        <el-table-column prop="username" label="用户">
        </el-table-column>
        <el-table-column prop="rechargeMoney" label="充值金额">
        </el-table-column>
        <el-table-column prop="rechargeChannel" label="支付方式">
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>

<script>
// import moment from 'moment';

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
      list.forEach( (item, index) => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        item.username = item.userInfo.nickname;
        item.rechargeChannel = item.rechargeChannel == 1 ? '支付宝' : item.rechargeChannel == 2 ? '微信' : '',
         item.rechargeMoney = (item.rechargeMoney / 100).toFixed(2);
      });
      return list;
    }
  },
  data() {
    return {
    };
  },
  mounted() {
    this.$nextTick(() => {
      // console.log('充值明细',this.tableData)
    });
  }
};
</script>
<style lang="scss" scoped>
.detailTab {
  margin-bottom: 30px;
}
</style>


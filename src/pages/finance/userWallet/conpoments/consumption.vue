<template>
  <div>
    <el-table :data="datas" style="width: 100%">
      <el-table-column prop="createTime" label="日期">
      </el-table-column>
      <el-table-column prop="recordSn" label="单号">
      </el-table-column>
      <el-table-column prop="username" label="用户">
      </el-table-column>
      <el-table-column prop="orderMoney" label="消费金额">
      </el-table-column>
      <el-table-column prop="consumeChannel" label="支付方式">
      </el-table-column>
      <el-table-column prop="address" label="摘要">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { deepCopy } from 'common/utils';

// import moment from 'moment';

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
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        item.orderMoney = (item.orderMoney / 100).toFixed(2);
        item.username = item.userInfo.nickname;
        item.consumeChannel =
          item.consumeChannel == 1
            ? '支付宝'
            : item.consumeChannel == 2 ? '微信' : '余额';
      });
      // console.log('aa', list);
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

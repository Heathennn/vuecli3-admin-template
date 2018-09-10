<template>
  <div>
    <el-table :data="datas" style="width: 100%">
      <el-table-column prop="createTime" label="时间">
      </el-table-column>
      <el-table-column prop="balanceInitial" label="期初余额">
      </el-table-column>
      <el-table-column prop="currentRecharge" label="本次充值">
      </el-table-column>
      <el-table-column prop="currentConsume" label="本次消费">
      </el-table-column>
      <el-table-column prop="currentRefund" label="本次退款">
      </el-table-column>
      <el-table-column prop="balanceFinal" label="期末余额">
      </el-table-column>
      <el-table-column prop="userInfo.nickname" label="交易用户">
      </el-table-column>
      <el-table-column prop="orderSn" label="交易单号">
        <template slot-scope="scope">
          <a href="javascript:;" class="hyperlink" v-if="scope.row.consumeType == 1 || scope.row.consumeType == 2" @click="jumpTo(scope.row)">
            {{scope.row.orderSn}}
          </a>
          <span v-else>{{scope.row.orderSn}}</span>
        </template>
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
  watch: {
    $route(to, from) {
      // console.log(to)
    }
  },
  data() {
    return {
      time : ''
    };
  },
  methods: {
    jumpTo(row) {
      if(row.consumeType == 1) {
        this.$router.push({path: `/order/sportOrder?orderSn=${row.orderSn}`})
      }
      if (row.consumeType == 2) {
        this.$router.push({path: `/order/shopsOrder?orderSn=${row.orderSn}`})
      }
    }
  },  
  computed: {
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach((item, index) => {
        item.balanceInitial = (item.balanceInitial / 100 ).toFixed(2) + '元';
        item.currentRecharge = (item.currentRecharge / 100 ).toFixed(2) + '元';
        item.currentConsume = '-' + (item.currentConsume / 100 ).toFixed(2) + '元';
        item.currentRefund = (item.currentRefund / 100 ).toFixed(2) + '元';
        item.balanceFinal = (item.balanceFinal / 100 ).toFixed(2) + '元';
        item.createTime = this.moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      });
      return list;
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

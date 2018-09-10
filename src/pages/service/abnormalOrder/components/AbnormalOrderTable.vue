<template>
  <div class="errorTable">
    <el-table :data="datas" style="width: 100%" :header-cell-style="headStyle">
      <el-table-column label="下单时间" prop="createTime">
      </el-table-column>
      <el-table-column label="订单号" prop="orderSn">
      </el-table-column>
      <el-table-column label="用户" prop="username">
      </el-table-column>
      <el-table-column label="运动门店" prop="storeName">
      </el-table-column>
       <el-table-column label="超时" prop="exceedMinute">
      </el-table-column>
       <el-table-column label="状态" prop="payStatus">
      </el-table-column>
      <el-table-column label="申诉" prop="appealSign">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="checkDetail(scope.row)" v-permission="'70f2ad42-07fb-4490-9412-61fdee35805c'">详情</el-button>
        </template>
         <!-- <template slot-scope="scope">
          <div class="tablePic" :style="`background-image: url(${scope.row.facilityIconUrl}); background-size: 100% 100%`"></div>
        </template> -->
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
      list.forEach( (item, index) => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        item.exceedMinute = item.exceedMinute + '分钟';
        // 0：待支付，1：已支付，2：超时未支付，3：已取消',
        item.payStatus = item.overtimePayStatus == 1 ? '未支付' : item.overtimePayStatus == 2 ? '已支付' : '';
        item.appealSign = item.appealSign == 1 ? '已申诉' : item.appealSign == 2 ? '未申诉' : '无';
        item.username = item.userInfo ? item.userInfo.nickname : '';
      })
      return list;
    }
  },
  data() {
    return {
      headStyle: {
        // "text-align": 'center',
        // color: 'red'
      },
      // tableData: [
      //   { 
      //     time: '2010-01-01 12:00',
      //     id: '001',
      //     couponClass: '抵用券',
      //     name: '跑步机',
      //     storebelong: '荔枝湾',
      //     expiry: '领取后15天内有效',
      //     activity: '新手注册',
      //     status: '系统'
      //   }
      // ]
    };
  },
  methods: {
    handleEdit1(index, row) {
      // console.log(index, row);
    },
    handleEdit2(index, row) {
      // console.log(index, row);
    },
    handleEdit3(index, row) {
      // console.log(index, row);
    },
    handleEdit4(index, row) {
      // console.log(index, row);
    },
    checkDetail(row) {
      this.$router.push({ path: `/service/abnormalOrder?orderDetail=${row.id}`})
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.item {
  margin-top: 10px;
  margin-right: 40px;
}

</style>

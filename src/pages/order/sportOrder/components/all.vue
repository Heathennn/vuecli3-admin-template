  <template>
  <div>
    <el-table :data="datas" style="width: 100%">
      <el-table-column prop="createTime" label="下单时间">
      </el-table-column>
      <el-table-column prop="orderSn" label="订单号">
      </el-table-column>
      <el-table-column prop="userInfo.nickname" label="用户">
      </el-table-column>
      <el-table-column prop="storeName" label="运动门店">
      </el-table-column>
      <el-table-column prop="duration" label="预约时长">
      </el-table-column>
      <el-table-column prop="overtimeStatus" label="摘要">
      </el-table-column>
      <el-table-column prop="orderStatus" label="状态">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="checkDetail(scope.row)" v-permission="'c1cdc723-242b-4531-9095-fae113f72665'">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>

</template>

  <script>
import { deepCopy } from 'common/utils';

import { mapState, mapActions } from 'vuex';

// import moment from 'moment';
// import { mapActions } from 'vuex';
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState({
      userInformation: state => state.auth.userInformation
    }),
    datas() {
      let duration = '';
      let list = deepCopy(this.tableData);
      list.forEach((item, index) => {
        // aaa = moment(item.endTime - item.startTime).format('YYYY-MM-DD HH:mm:ss');
        duration = (item.endTime - item.startTime)/60/1000 + "分钟";
        item.duration = duration;
        item.payStatus =
          item.payStatus == 1
            ? '待支付'
            : item.payStatus == 2
              ? '已支付'
              : item.payStatus == 3
                ? '已取消' : '';

        item.appealSign =
          item.appealSign == 1 ? '申诉' : item.appealSign == 2 ? '未申诉' : '';

        item.overtimeStatus =
          item.overtimeStatus == 1 ? '正常预约' : item.overtimeStatus == 2 && item.exceedMinute > 15 ? '超时预约' : '正常预约' 
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        item.motionDuration = (item.endTime - item.startTime)/60/1000+"分钟";
        item.orderMoney = (item.orderMoney / 100).toFixed(2) + '元'
        item.startTime = moment(item.startTime).format('YYYY-MM-DD HH:mm:ss');
        item.endTime = moment(item.endTime).format('YYYY-MM-DD HH:mm:ss');
        item.leaveStore = item.leaveStore ? moment(item.leaveStore).format('YYYY-MM-DD HH:mm:ss') : '';
        item.intoStore = item.intoStore ? moment(item.intoStore).format('YYYY-MM-DD HH:mm:ss') : '';
        item.exceedMinute = item.exceedMinute + '分钟';
        item.exceedMoney = (item.exceedMoney / 100).toFixed(2) + '元';
        item.deductionMoney = (item.deductionMoney / 100).toFixed(2) + '元';
        item.payMoney = (item.payMoney / 100).toFixed(2) + '元';
         item.orderStatus =
          item.orderStatus == 1
            ? '待使用'
            : item.orderStatus == 2
              ? '使用中'
              : item.orderStatus == 3
                ? '已完成'
                : item.orderStatus == 4 ? '已取消'  : '';
      });
      return list;

    }
  },
  data() {
    return {
      centerDialogVisible: false,
      currentDetail: {}
    };
  },
  methods: {
    ...mapActions(['getSportOrderDetail', 'cancelOrder']),
    checkDetail(row) {
      // console.log(row);
      this.centerDialogVisible = true;
      this.currentDetail = row;
      this.$router.push({path: `/order/sportOrderDetail?orderDetail=${row.id}`})
      this.getSportOrderDetail({
        orderId: row.id
      })
    },
    _cancelOrder() {
      this.centerDialogVisible = false;
      this._cancelOrder({
        orderId: this.currentDetail.id,
        adminId: this.userInformation.id
      })
        .then(() => {
          this.$notify.success('取消订单成功');
        })
        .catch(() => {
          this.$notify.error('取消订单失败');
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

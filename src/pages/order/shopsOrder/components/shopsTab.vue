<template>
  <div class="table" style="width: 100%">
    <el-table :data="datas" style="width: 100%">
      <el-table-column prop="createTime" label="下单时间" sortable>
      </el-table-column>
      <el-table-column prop="orderSn" label="订单号">
      </el-table-column>
      <el-table-column prop="userInfo.nickname" label="用户">
      </el-table-column>
      <el-table-column prop="storeName" label="所属门店">
      </el-table-column>
      <el-table-column prop="goodsName" label="购买商品">
      </el-table-column>
      <el-table-column prop="payMoney" label="价格">
      </el-table-column>
      <el-table-column prop="payStatus" label="状态">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="checkDetail(scope.row)" v-permission="'91b81634-20d8-4116-9b86-e842a8d1f257'">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="50%" center :before-close="handleClose">
      <template slot-scope="scope">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="订单状态">
            <span>{{currentDetail.payStatus}}</span>
          </el-form-item>
          <el-form-item label="所属门店">
            <span>{{currentDetail.storeName}}</span>
          </el-form-item>
          <el-form-item label="下单时间">
            <span>{{currentDetail.createTime}}</span>
          </el-form-item>
          <el-form-item label="订单号">
            <span>{{currentDetail.orderSn}}</span>
          </el-form-item>
          <el-form-item label="售货机ID">
            <span>{{currentDetail.facilityNo}}</span>
          </el-form-item>
          <el-form-item label="购买商品">
            <span>{{currentDetail.goodsName}}</span>
          </el-form-item>
          <el-form-item label="数量">
            <span>{{currentDetail.amount}}</span>
          </el-form-item>
          <el-form-item label="单价">
            <span>{{currentDetail.payMoney}}</span>
          </el-form-item>
          <hr/>
          <el-form-item label="总价">
            <span>{{currentDetail.payMoney}}</span>
          </el-form-item>
          <el-form-item label="实付金额">
            <span>{{currentDetail.payMoney}}</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { deepCopy } from 'common/utils';

import { mapState, mapActions } from 'vuex';

// import moment from 'moment';
export default {
  methods: {
    handleClose(done) {
      done();
      this.showDialog = false;
    },
    ...mapActions(['getOrderDetailList']),
    checkDetail(row) {
      this.centerDialogVisible = true;
      this.currentDetail = row;
    }
    // checkMessageDetail(row) {
    //   this.showDialog = true;
    //   // this.isFetchingDetail = true;
    //   console.log('qqqq', row);
    //   let id = row.id;
    //   this.getOrderDetailList({
    //     id: id
    //   });
    //   // .then(() => {
    //   //   this.isFetchingDetail = false;
    //   // })
    //   // .catch(() => {
    //   //   this.isFetchingDetail = false;
    //   // });
    // }
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentDetail: {},
      showDialog: false,
      centerDialogVisible: false,
      createTime: '',
      payStatus: '',
      storeName: '',
      orderSn: '',
      goodsName: '',
      amount: '',
      payMoney: ''
    };
  },
  computed: {
    ...mapState({
      orderDetailList: state => state.shopsOrder.orderDetailList
    }),
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach((item, index) => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        // item.payMoney = item.payMoney + '元';
        item.payMoney = (item.payMoney / 100).toFixed(2) +'元';
        item.payStatus =
          item.payStatus == 0 ? '未支付' : item.payStatus == 1 ? '已支付' : '';
      });
      return list;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getOrderDetailList();
    });
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

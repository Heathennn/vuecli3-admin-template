<template>
  <div class="orderDetail">
    <div class="handleStatus">
      <span>订单状态: {{orderStatus}} &nbsp;&nbsp;&nbsp;支付状态: {{orderStatus == '已取消' ? '已退款' :payStatus}} </span><el-button v-if="orderStatus ==='使用中' || orderStatus ==='待使用' " type="primary" @click="cancel">取消订单</el-button>
    </div>

    <el-dialog title="取消订单" center :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div>取消备注(必填)</div>
      <el-input type="textarea" v-model="cancelRemark"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </span>
    </el-dialog>
    <div class="orderInfo">
      <div class="subTitle">
        基本信息
      </div>
      <div class="info_left">
        <div class="info_item">
          <div class="item_subTitle">订单号</div> {{orderSn}}</div>

        <div class="info_item">
          <div class="item_subTitle">用户昵称</div> <a href="javascript:;" @click="jumpToUserDetail">{{username}}</a></div>

        <!-- <div class="info_item">
          <div class="item_subTitle">用户Id</div> {{userId}}</div> -->
        <div class="info_item">
          <div class="item_subTitle">订单类型</div>运动预约</div>

        <div class="info_item">
          <div class="item_subTitle">联系电话</div> {{userPhone}}</div>

        <div class="info_item">
          <div class="item_subTitle">预约门店</div>{{storeName}}</div>

        <div class="info_item">
          <div class="item_subTitle">下单时间</div> {{createTime}}</div>

        <div class="info_item">
          <div class="item_subTitle">预约时段</div> {{intervalLabel}}</div>

        <div class="info_item">
          <div class="item_subTitle">进店时间</div> {{startTime}}</div>

          <div class="info_item">
            <div class="item_subTitle">预约价格</div>{{(reservationPrice / 100).toFixed(2)}}/分钟</div>

            <div class="info_item">
              <div class="item_subTitle">离店时间</div> {{endTime}}</div>
        <div class="info_item">
          <div class="item_subTitle">预约时长</div> {{orderTime}}分钟</div>

        <div class="info_item">
          <div class="item_subTitle">超时时长</div> {{overTime}}分钟</div>
        <div class="info_item">
          <div class="item_subTitle">申诉状态</div> <a href="javascript:;" :style="appealSign == 2 ? 'text-decoration: none; color: black': ''" @click="jumpToOrderDetail(appealSign)">{{appealSign == 1 ? '已申诉' : '未申诉'}}</a></div>
      </div>
    </div>

    <div class="orderMoney">
      <div class="subTitle">
        费用信息
      </div>
      <div class="moneyInfo">
        <div class="normalMoney">
            <div class="normalMoneyTitle money_title">正常预约费用</div>
            <div class="info_item">
              <div class="item_subTitle">商品单价</div>{{(reservationPrice / 100).toFixed(2)}}/分钟</div>
            <div class="info_item">
              <div class="item_subTitle">预约时长</div>{{orderTime}}分钟</div>
            <div class="info_item">
              <div class="item_subTitle">订单总价</div>{{(orderMoney / 100).toFixed(2)}}</div>
            <div class="info_item">
              <div class="item_subTitle">订单优惠</div>-{{(deductionMoney / 100).toFixed(2)}}</div>
            <div class="info_item">
              <div class="item_subTitle">应付金额</div>{{( (orderMoney - deductionMoney) / 100).toFixed(2)}}</div>
            <div class="info_item">
              <div class="item_subTitle">支付方式</div>余额</div>
            <div class="pay_status">
              <div :style="markStyle"></div>
              <div>已支付</div>
            </div>
        </div>
        <div class="overtimeMoney" v-if="overtimeStatus == 2 && overTime > 15" :style="overtimePayStatus == 1 ? 'border: 1px solid red': 'border: 1px solid #e5e5e5'">
          <div class="overtimeMoneyTitle money_title">超时预约费用</div>
          <div class="info_item">
            <div class="item_subTitle">商品单价</div>{{(reservationPrice / 100).toFixed(2)}}/分钟</div>
          <div class="info_item">
            <div class="item_subTitle">超时时长</div>{{overTime}}分钟</div>
          <div class="info_item">
            <div class="item_subTitle">订单总价</div>{{(overMoney/100).toFixed(2)}}</div>
          <div class="info_item">
            <div class="item_subTitle">订单优惠</div>-{{appealSign == 1 && appealResult == 1 ? (overMoney/100).toFixed(2) : '0.00'}}</div>
          <div class="info_item" style="color: red">
            <div class="item_subTitle">应付金额</div>{{appealSign == 1 && appealResult == 1 ? 0.00 : (overMoney/100).toFixed(2) }}</div>
          <div class="info_item">
            <div class="item_subTitle">支付方式</div>{{overtimePayStatus == 1 ? '-': '余额'}}</div>

          <div class="pay_status">
            <div :style="overtimePayStatus == 2 ? markStyle : imarkStyle"></div>
            <div>{{overtimePayStatus == 2 ? '已支付': '未支付'}}</div>
          </div>
        </div>
      </div>
      <div class="realPayMoney">订单实收: {{(realPayMoney / 100).toFixed(2)}}</div>
    </div>
    <div class="operationInfo">
      <div class="subTitle">
        操作信息
      </div>
      <div class="operationTable">
        <el-table :data="logDatas" style="width: 100%">
          <el-table-column prop="operatType" label="操作者">
          </el-table-column>
          <el-table-column prop="createTime" label="操作时间">
          </el-table-column>
          <el-table-column prop="orderStatus" label="订单状态">
          </el-table-column>
          <el-table-column prop="payStatus" label="付款状态">
          </el-table-column>
          <el-table-column prop="operatMemo" label="备注">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { updateAppealStatus } from 'api/service/abnormalOrder';

import markIcon from 'assets/mark.svg';

import iMarkIcon from 'assets/imark.svg';

export default {
  name: 'sportOrderDetail',
  data() {
    return {
      id: '',
      dialogVisible: false,
      cancelRemark: '',
      logs: [],
      appealSign: 2,
      content: '',
      orderId: null,
      createTime: '',
      username: '',
      userId: '',
      orderTime: '',
      storeName: '', // 时长
      appealCode: '', // 申诉结果
      appealId: null, // 申诉传id
      orderSn: '',
      intervalLabel: '',
      startTime: '',
      endTime: '',
      overTime: 0,
      overMoney: 0,
      orderMoney: 0, // 订单总价
      orderStatus: 0, // 订单状态
      payStatus: 0, // 支付状态
      overtimeStatus: 1, // 是否超时 1 未超时 2 超时
      overtimePayStatus: 1, // 超时支付状态
      payMoney: 0,
      deductionMoney: 0, // 抵扣金额
      userPhone: '',
      appealInfo: {}, // 用户申诉
      reservationPrice: 0,
      markStyle: {
        width: '40px',
        height: '40px',
        backgroundImage: `url(${markIcon})`,
        backgroundSize: '100% 100%'
      },
      imarkStyle: {
        width: '40px',
        height: '40px',
        backgroundImage: `url(${iMarkIcon})`,
        backgroundSize: '100% 100%'
      }
    };
  },
  computed: {
    ...mapState({
      userInformation: state => state.auth.userInformation
    }),
    realPayMoney() {
      if (this.overtimePayStatus == 2) {
        return this.payMoney + this.overMoney;
      } else {
        return this.payMoney
      }
    },
    logDatas() {
      let target = [];
      this.logs.forEach( (item, index) => {
        let obj = {};
        obj.operatType = item.operatType == 1 ? '用户' : item.operatType == 2 ? '管理员' : item.operatType == 3 ? '系统' : '';
        obj.createTime = this.moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        obj.orderStatus = item.orderStatus == 1 ? '待使用' : item.orderStatus == 2 ? '使用中' : item.orderStatus == 3 ? '已完成' : item.orderStatus == 4 ? '已取消' : '';
        obj.payStatus = item.payStatus == 1 ? '待支付' : item.payStatus == 2 ? '已支付' : item.payStatus == 3 ? '已退款' : '';
        obj.operatMemo = item.operatMemo;
        target.push(obj);
      })
      return target;
    }
  },
  watch: {
    $route(val) {
      this.orderId = val.query.orderId;
    },
    orderId() {
      this.getSportOrderDetail({
        orderId: this.orderId
      }).then(res => {
        // console.log(res);
        this.mapOrderInfo(res);
      });
    }
  },
  methods: {
    ...mapActions(['getSportOrderDetail', 'getOrderOperationLog', 'cancelOrder']),
    jumpToUserDetail() {
      this.$router.push({path: `/user/userList?userDetail=${this.userId}`});
    },
    jumpToOrderDetail(status) {
      if ( status == 1 ) {
        this.$router.push({path: `/service/abnormalOrder?orderDetail=${this.id}`});
      }
    },
    handleClose(done) {
      done();
    },
    cancel() {
      this.dialogVisible = true;
    },
    confirm() {
      if (!this.cancelRemark) {
        return this.$notify.error('取消备注不能为空');
      }
      this.dialogVisible = false;
      //orderId	int	Y	订单ID
      //adminId	int	Y	管理员ID
      this.cancelOrder({
        orderId: this.orderId,
        adminId: this.userInformation.id,
        remark: this.cancelRemark
      }).then( () => {
        this.$notify.success('取消订单成功');
        this.getSportOrderDetail({
          orderId: this.orderId
        }).then(res => {
          // console.log(res);
          this.mapOrderInfo(res);
        });
      }).catch( (error) => {
        this.$notify.error(error || '取消订单失败');
      })
    },
    mapOrderInfo(apiData) {
      this.id = apiData.id;
      this.createTime = this.moment(apiData.createTime).format(
        'YYYY-MM-DD HH:mm:ss'
      ); // 下单时间
      this.payStatus =
        apiData.payStatus == 1
          ? '待支付'
          : apiData.payStatus == 2
            ? '已支付'
            : apiData.payStatus == 3
              ? '已取消' : ''; // 支付状态
      this.userId = apiData.userId;
      this.username = apiData.userInfo.nickname;
      this.storeName = apiData.storeName;
      this.orderSn = apiData.orderSn;
      this.intervalLabel =
        this.moment(apiData.startTime).format('YYYY-MM-DD HH:mm:ss') +
        '-' +
        this.moment(apiData.endTime).format('YYYY-MM-DD HH:mm:ss');
      this.startTime = apiData.intoStore
        ? this.moment(apiData.intoStore).format('YYYY-MM-DD HH:mm:ss')
        : '';
      this.endTime = apiData.leaveStore
        ? this.moment(apiData.leaveStore).format('YYYY-MM-DD HH:mm:ss')
        : '';
      this.orderTime = (apiData.endTime - apiData.startTime) / 1000 / 60; // 时长
      this.overTime = apiData.exceedMinute; // 超时时长
      this.orderMoney = apiData.orderMoney; // 订单总价
      this.overMoney = apiData.exceedMoney; // 超时金额
      this.payMoney = apiData.payMoney; // 实付金额
      this.overtimeStatus = apiData.overtimeStatus; // 是否超时 1 未超时 2 超时
      this.overtimePayStatus = apiData.overtimePayStatus // 超时支付状态
      this.reservationPrice = apiData.reservationPrice; // 商品单价
      this.deductionMoney = apiData.deductionMoney;
      this.userPhone = apiData.userInfo.mobile;
      this.appealSign = apiData.appealSign; // 用户是否申诉 1 已申诉 2 未申诉
      this.appealInfo = apiData.appealInfo[0] ? apiData.appealInfo[0] : {}; // 申诉内容状态等
      this.appealCode = apiData.appealInfo[0]
        ? apiData.appealInfo[0].dealCode
        : 0; // 申诉结果 1 申诉通过 2 申诉不通过
      this.appealId = apiData.id; // 申诉接口传的id
      this.orderStatus = apiData.orderStatus == 1
        ? '待使用'
        : apiData.orderStatus == 2
          ? '使用中'
          : apiData.orderStatus == 3
            ? '已完成'
            : apiData.orderStatus == 4 ? '已取消'  : '';
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.orderId = this.$route.query.orderDetail;
      this.getSportOrderDetail({
        orderId: this.orderId
      }).then(res => {
        // console.log(res);
        this.mapOrderInfo(res);
        this.getOrderOperationLog({
          orderSn: this.orderSn,
          page: 1,
          size: 100
        }).then( (res) => {
          this.logs = res.list;
        }).catch( (error) => {

        })
      });

    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.orderDetail {
  // background-color: #ffffff;
  width: 100%;
  min-height: calc(100% - 60px);
  box-sizing: border-box;
  // padding: 20px;
  // overflow-y: scroll;
}

.subTitle {
  font-size: 22px;
  height: 50px;
  line-height: 50px;
  border: {
    bottom: 1px solid #e5e5e5;
  }
}

.orderMoney {
  // @include flexbox;
  background-color: #ffffff;
  padding: 20px;
  margin: {
    top: 20px;
  }
  .money_left {
    padding: {
      right: 30px;
    }
    margin: {
      right: 30px;
    }
  }
}

.handleStatus {
  @include flexbox;
  @include justify-content(space-between);
  padding: 20px;
  font-weight: 600;
  height: 80px;
  line-height: 40px;
  box-sizing: border-box;
  background-color: #ffffff;
  margin: {
    bottom: 20px;
  }
}
.pay_status {
  @include flexbox;
  @include flex-direction(column);
  @include justify-content(center);
  @include align-items(center);
  padding: {
    top: 20px;
  }
}
.orderInfo {
  background-color: #ffffff;
  padding: 20px;
  // @include flexbox;
  .info_left {
    @include flexbox;
    @include flex-wrap(wrap);
  }
  .info_item {
    width: 50%;
    height: 50px;
    line-height: 50px;
  }
  .item_subTitle {
    display: inline-block;
    width: 120px;
    color: #666666;
  }
}
.operationInfo {
  background-color: #ffffff;
  padding: 20px;
  margin: {
    top: 20px;
  }
}
.moneyInfo {
  @include flexbox;
  // @include justify-content(space-around);
  @include align-items(center);
  padding: {
    top: 20px;
    bottom: 20px;
  }
  .normalMoney,
  .overtimeMoney {
    width: 350px;
    height: 450px;
    border: 1px solid #e5e5e5;
    margin: {
      left: 20px;
      right: 20px;
    }
    .info_item {
      width: 100%;
      height: 50px;
      line-height: 50px;
      box-sizing: border-box;
      padding: {
        left: 20px;
      }
      .item_subTitle {
        display: inline-block;
        width: 120px;
        color: #666666;
      }
    }
  }
  .overtimeMoney {
    // border: 2px solid red;
  }
}

.realPayMoney {
  height: 50px;
  line-height: 50px;
  text-align: center;
  width: 100%;
  font-size: 20px;
  background-color: #e5e5e5;
}

.money_title {
  text-align: center;
  background-color: #e5e5e5;
  height: 50px;
  line-height: 50px;
}
.orderMoney {
  // @include flexbox;
  background-color: #ffffff;
  padding: 20px;
  margin: {
    top: 20px;
  }
  .money_left {
    padding: {
      right: 30px;
    }
    margin: {
      right: 30px;
    }
  }
}

.createTime {
  @include flexbox;
  @include align-items(center);
}

.realTime {
  @include flexbox;
  @include align-items(center);
}
.reasonDescribe {
  @include flexbox;
  @include align-items(center);
}

.reasonSubTitle {
  display: inline-block;
  width: 150px;
  color: #666666;
}
.reasonTitle {
  font-size: 20px;
  font-weight: 600;
  padding: {
    bottom: 10px;
  }
}

.userReason {
  background-color: #ffffff;
  padding: 20px;
  margin: {
    top: 20px;
  }
}

.reasonItem {
  width: 100%;
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
}
.orderDetailTitle {
  font-size: 30px;
  height: 50px;
  line-height: 50px;
  border: {
    bottom: 1px solid #999999;
  }
}

.tips {
  font-size: 10px;
}
</style>

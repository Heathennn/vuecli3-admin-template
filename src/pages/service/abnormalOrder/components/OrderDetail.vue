<template>
  <div class="orderDetail">
    <div class="handleStatus">
      订单状态: {{orderStatus == 1 ? '待使用':orderStatus == 2 ? '使用中': orderStatus == 3 ? '已完成':orderStatus == 4 ? '已取消' : ''}} &nbsp;&nbsp; <span>支付状态: {{overtimePayStatus == 1 ? '未支付': overtimePayStatus == 2 ? '已支付':''  }}</span>
    </div>
    <div class="orderInfo">
      <div class="subTitle">
        基本信息
      </div>
      <div class="info_left">
        <div class="info_item">
          <div class="item_subTitle">订单号</div> {{orderSn}}</div>
        <div class="info_item">
          <div class="item_subTitle">用户昵称</div> <a href="javascript:;" @click="jumpToUserDetail">{{username}}</a></div>
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
          <div class="item_subTitle">预约价格</div>{{(reservationPrice/100).toFixed(2)}}/分钟
        </div>
        <div class="info_item">
          <div class="item_subTitle">离店时间</div> {{endTime}}</div>
        <div class="info_item">
          <div class="item_subTitle">预约时长</div> {{orderTime}}分钟</div>
        <div class="info_item">
          <div class="item_subTitle">预约超时</div> {{overTime}}分钟</div>
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
        <div class="overtimeMoney" :style="overtimePayStatus == 1 && overTime > 15? 'border: 1px solid red' : 'border: 1px solid #e5e5e5'">
          <div class="overtimeMoneyTitle money_title">超时预约费用</div>
          <div class="info_item">
            <div class="item_subTitle">商品单价</div>{{(reservationPrice / 100).toFixed(2)}}/分钟</div>
          <div class="info_item">
            <div class="item_subTitle">超时时长</div>{{overTime}}分钟</div>
          <div class="info_item">
            <div class="item_subTitle">订单总价</div>{{(overMoney / 100).toFixed(2)}}</div>
          <div class="info_item">
            <div class="item_subTitle">订单优惠</div>-{{appealSign == 1 && appealResult == 1 ? (overMoney/100).toFixed(2) : '0.00'}}</div>
          <div class="info_item" style="color: red">
            <div class="item_subTitle">应付金额</div>{{appealSign == 1 && appealResult == 1 ? 0.00 : (overMoney/100).toFixed(2) }}</div>
          <div class="info_item">
            <div class="item_subTitle">支付方式</div>{{overtimePayStatus == 1 ? '-': '余额'}}</div>

          <div class="pay_status">
            <div :style="overtimePayStatus == 2 ? markStyle: imarkStyle"></div>
            <div>{{overtimePayStatus == 2 ? '已支付': '未支付'}}</div>
          </div>
        </div>
      </div>
      <div class="realPayMoney">订单实收:{{(realPayMoney / 100).toFixed(2)}}</div>
    </div>
    <!-- 已申诉 -->
    <div class="userReason" v-if="appealSign == 1">
      <div class="subTitle">用户申诉理由</div>
      <div class="createTime reasonItem">
        <div class="reasonSubTitle">申诉提交时间</div>
        <div>{{moment(appealInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
      </div>
      <div class="realTime reasonItem">
        <div class="reasonSubTitle">申诉实际离店时间</div>
        <div>{{moment(appealInfo.realLeaveTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
      </div>

      <div class="reasonDescribe reasonItem">
        <div class="reasonSubTitle">申诉原因描述</div>
        <div>{{appealInfo.appealState}}</div>
      </div>

      <div class="dealContent" v-if="appealCode == 0 ">
        <div style="height: 40px; line-height: 40px;">处理备注:</div>
        <el-input v-model="content" placeholder="输入处理备注"></el-input>
      </div>
      <div class="buttons" style="padding-top: 20px;" v-if="appealCode == 0 ">
        <el-button type="primary" @click="dealAppeal(1)">申诉通过</el-button>
        <el-button @click="dealAppeal(2)">申诉无效</el-button>
      </div>
    </div>
    <div class="userReason" v-if="appealSign == 2">
      <div class="reasonTitle">暂无用户申诉</div>
    </div>
    <!-- 已处理的申诉 -->
    <div class="dealResult" v-if="appealCode != 0 && appealCode" style="width: 100%;margin-top: 20px; margin-bottom: 30px; background-color: #ffffff; box-sizing: border-box; padding: 20px">
      <div style="font-size: 18px; font-weight: 600">{{appealCode == 1 ? '申诉通过' : appealCode == 2 ? '申诉未通过' : ''}}</div>
      <div>处理备注: &nbsp;{{appealInfo.dealOpinion}}</div>
      <div class="tips" :style="`color: #666666; backgroundColor: #ffffff; padding: 20px`" v-if="appealSign == 1">
        <div>*说明</div>
        <div>申诉通过，系统自动终止用户的超时订单，且超时费用为0元。</div>
        <div>申诉无效，超时订单需用户自主结束，且按额支付超时费用。</div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex';

// import moment from 'moment';

import { updateAppealStatus } from 'api/service/abnormalOrder';

import markIcon from 'assets/mark.svg';

import iMarkIcon from 'assets/imark.svg';

export default {
  data() {
    return {
      orderStatus: 0,
      overtimePayStatus: 1,
      appealSign: 2,
      content: '',
      orderId: null,
      createTime: '',
      payStatus: '',
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
      overTime: '',
      overMoney: 0,
      orderMoney: 0, // 订单总价
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
    realPayMoney() {
      if (this.appealSign == 1 && this.appealResult == 1) { // 申诉通过
        return this.payMoney;
      } else {
        if (this.overtimePayStatus == 2){ // 支付了超时金额
          return this.payMoney + this.overMoney
        }
        return this.payMoney + this.deductionMoney;
      }
    }
  },
  watch: {
    $route(val) {
      this.orderId = val.query.orderDetail;
    },
    orderId() {
      this.getAbnormalOrderDetail({
        orderId: this.orderId
      }).then(res => {
        // console.log(res);
        this.mapOrderInfo(res);
      });
    }
  },
  methods: {
    ...mapActions(['getAbnormalOrderDetail']),
    jumpToUserDetail() {
      this.$router.push({ path: `/user/userDetail?id=${this.userId}`})
    },
    dealAppeal(status) {
      if (!this.content) {
        return this.$notify.error('请输入处理备注');
      }
      updateAppealStatus({
        id: this.appealId,
        userId: this.userId,
        orderId: this.$route.query.orderDetail,
        appealState: this.content,
        dealCode: status
      }).then(res => {
          // console.log('申诉返回', res);
          if (res.data.code == 200) {
            this.getAbnormalOrderDetail({
              orderId: this.orderId
            }).then(res => {
              this.mapOrderInfo(res);
            });
            return this.$notify.success('更新申诉状态成功');
          }
          return this.$notify.error('更新申诉状态失败');
        })
        .catch(error => {
          return this.$notify.error('更新申诉状态失败');
        });
    },
    mapOrderInfo(apiData) {
      this.createTime = moment(apiData.createTime).format(
        'YYYY-MM-DD HH:mm:ss'
      ); // 下单时间
      this.overtimePayStatus = apiData.overtimePayStatus;
      this.payStatus =
        apiData.overtimePayStatus == 0
          ? '未支付'
          : apiData.overtimePayStatus == 1 ? '已完成' : ''; // 支付状态
      this.userId = apiData.userId;
      this.username = apiData.userInfo.nickname;
      this.storeName = apiData.storeName;
      this.orderSn = apiData.orderSn;
      this.intervalLabel =
        moment(apiData.startTime).format('YYYY-MM-DD HH:mm:ss') +
        '-' +
        moment(apiData.endTime).format('YYYY-MM-DD HH:mm:ss');
      this.startTime = apiData.intoStore
        ? moment(apiData.intoStore).format('YYYY-MM-DD HH:mm:ss')
        : '';
      this.endTime = apiData.leaveStore
        ? moment(apiData.leaveStore).format('YYYY-MM-DD HH:mm:ss')
        : '';
      this.orderMoney = apiData.orderMoney; // 订单金额(应付金额)
      this.orderTime = (apiData.endTime - apiData.startTime) / 1000 / 60; // 时长
      this.overTime = apiData.exceedMinute; // 超时时长
      this.overMoney = apiData.exceedMoney; // 超时金额
      this.payMoney = apiData.payMoney; // 实付金额
      this.orderStatus = apiData.orderStatus // 订单状态
      this.reservationPrice = apiData.reservationPrice; // 商品单价
      this.deductionMoney = apiData.deductionMoney;
      this.userPhone = apiData.userInfo.mobile;
      this.appealSign = apiData.appealSign; // 用户是否申诉 1 已申诉 2 未申诉
      this.appealResult = apiData.appealResult; // 申诉结果 1 通过 2 未通过
      this.appealInfo = apiData.appealInfo[0] ? apiData.appealInfo[0] : {}; // 申诉内容状态等
      this.appealCode = apiData.appealInfo[0]
        ? apiData.appealInfo[0].dealCode
        : 0; // 申诉结果 1 申诉通过 2 申诉不通过
      this.appealId = apiData.appealInfo[0].id; // 申诉接口传的id
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.orderId = this.$route.query.orderDetail;
      this.getAbnormalOrderDetail({
        orderId: this.orderId
      }).then(res => {
        this.mapOrderInfo(res);
      });
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.orderDetail {
  width: 100%;
  min-height: calc(100% - 60px);
  box-sizing: border-box;
}

.subTitle {
  font-size: 22px;
  height: 50px;
  line-height: 50px;
  border: {
    bottom: 1px solid #e5e5e5;
  }
}

.handleStatus {
  padding: 20px;
  font-weight: 600;
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

.moneyInfo {
  @include flexbox;
  @include justify-content(space-around);
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

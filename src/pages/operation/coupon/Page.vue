<template>
  <div class="protalPage">
    <div class="couponPage">
      <sub-title title="优惠券列表"></sub-title>
      <div class="selects">
        <!-- <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select> -->
        <el-input v-model="couponName" placeholder="搜索优惠券名称" style="width: 200px; margin-right: 20px"></el-input>
        <el-input v-model="couponId" placeholder="搜索优惠券ID" style="width: 200px; margin-right: 20px"></el-input>
        <el-button type="primary" @click="fetchData">搜索</el-button>
      </div>
      <div class="couponList" v-loading="isFetchingData" v-permission="'997fe68c-35b3-4478-96c1-8fb67c014174'">
        <el-table :data="[]" style="width: 100%">
          <el-table-column label="券ID" prop="id">
          </el-table-column>
          <el-table-column label="优惠券名称" prop="couponTag">
          </el-table-column>
          <el-table-column label="优惠券类型" prop="couponType">
            <template slot-scope="scope">
              {{scope.row.couponType == 1 ? '现金优惠券' : scope.row.couponType == 2 ? '折扣优惠券' : scope.row.couponType == 3 ? '次抵用优惠券' : scope.row.couponType == 4 ? '小时抵用优惠券' : ''}}
            </template>
          </el-table-column>
          <el-table-column label="消费类型">
            <template slot-scope="scope">
              预约消费
            </template>
          </el-table-column>
          <el-table-column label="使用门槛" prop="couponTag">
            <template slot-scope="scope">
              无门槛
            </template>
          </el-table-column>
          <el-table-column label="券有效期">
            <template slot-scope="scope">
              15天
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="checkoutDetail(scope.row)" v-permission="'f3ea508a-e002-486d-9b3c-f572901acca1'">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="paginationBox">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="0">
          </el-pagination>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { deepCopy } from 'common/utils';

import * as CouponApi from 'api/operation/coupon';

import SubTitle from 'components/SubTitle';

export default {
  components: {
    SubTitle
  },
  data() {
    return {
      couponName: '',
      couponId: '',
      currentPage4: 1,
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      curTotal: 0,
      time: '',
      deviceStatus: '已绑设备',
      input: '',
      totalCoupon: 0,
      options: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 2,
          label: '待使用'
        },
        {
          value: 3,
          label: '已使用'
        },
        {
          value: 6,
          label: '已过期'
        }
      ],
      value: 'all'
    };
  },
  watch: {
    value() {
      this.fetchData();
    }
  },
  computed: {
    ...mapState({
      couponList: state => state.coupon.couponList,
      isFetchingData: state => state.coupon.isFetchingData,
      pageSize: state => state.coupon.pageSize,
      pageNum: state => state.coupon.pageNum,
      total: state => state.coupon.total
    }),
    datas() {
      let list = deepCopy(this.couponList);
      // console.log(list);
      list.forEach((item, index) => {
        item.time =
          moment(item.useTimeStart).format('YYYY-MM-DD HH:mm:ss') +
          '至' +
          moment(item.useTimeEnd).format('YYYY-MM-DD HH:mm:ss');
        item.username = item.userInfo.nickname;
        item.couponStatus = this.mapCouponStatus(item.couponStatus);
        item.useTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
      });
      return list;
    }
  },
  methods: {
    ...mapActions(['getCouponList']),
    checkoutDetail(row) {
      this.$router.push({path: `/operation/couponDetail?id=${row.id}&couponName=${row.couponTag}&type=${row.couponType}&hour=${row.couponHour}`})
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.curPageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage4 = val;
      this.fetchData();
    },
    createParams() {
      let params = {};
      params.page = this.currentPage4;
      params.size = this.curPageSize;
      if (this.couponName) {
        params.couponTitle = this.couponName;
      }
      if (this.couponId) {
        params.id = this.couponId;
      }
      if (this.value !== 'all') {
        params.couponStatus = this.value;
      }
      return params;
    },
    mapPagination() {
      this.currentPage4 = this.pageNum;
      this.curTotal = this.total;
      this.curPageSize = this.pageSize;
    },
    mapCouponStatus(status) {
      if (status == 1) return '未领取';
      if (status == 2) return '待使用';
      if (status == 3) return '已使用';
      if (status == 4) return '已删除';
      if (status == 5) return '冻结';
      if (status == 6) return '已过期';
    },
    fetchData() {
      this.getCouponList(this.createParams()).then(() => {
        this.mapPagination();
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {
        // vm.fetchData();
      });
    });
  },
  mounted() {
    this.$nextTick(() => {
      // this.fetchData();
      // CouponApi.getCouponList({
      //   page: 1,
      //   size: 10000
      // }).then(res => {
      //   this.totalCoupon = res.data.data.list.length;
      // });
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.couponPage {
  background-color: #ffffff;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .title {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
    }
  }
  .couponName {
    width: 100%;
    font-size: 20px;
    box-sizing: border-box;
    padding: {
      top: 20px;
      bottom: 20px;
    }
  }
  .couponInfo {
    width: 100%;
    @include flexbox;
    border: {
      bottom: 1px solid #e5e5e5;
    }
    .info_left {
      margin: {
        right: 50px;
      }
    }
    .info_title {
      height: 50px;
      line-height: 50px;
    }
  }
  .selects {
    @include flexbox;
    box-sizing: border-box;
    padding: {
      top: 20px;
      bottom: 20px;
    }
  }
  // .selectTitle {
  //   // line-height: 40px;
  //   margin: {
  //     right: 10px;
  //   }
  // }
  // .statusSelect {
  //   margin: {
  //     right: 20px;
  //   }
  // }
  // .timeSelect {
  //   margin: {
  //     right: 100px;
  //   }
  // }
  // .messageTableBox {
  // }
}
</style>

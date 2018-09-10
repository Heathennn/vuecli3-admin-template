<template>
  <div class="shopsDetail">
    <div class="shopsDetailTitle">售货机商品详情</div>
    <div class="shoreDetail">
      <div class="storeName item">门店: {{storeInfo.storeName}}</div>
      <div class="storeAddress item">地址: {{storeInfo.detailedAddress}}</div>
      <div class="managerName item">店长: {{managerInfo.ownerName}}</div>
      <div class="managerPhone item">电话: {{managerInfo.ownerPhone}}</div>

      <div class="warningGoods">
        <div>预警商品: &nbsp;</div>
        <div class="goods" v-for="(item, index) in warningInfo" :key="index" style="padding-right: 10px; color: #666666; font-size: 14px">
          槽位[{{item.slotNo}}]-{{item.goodsName}}
        </div>
        <div>共{{warningInfo.length}}种商品</div>
      </div>
    </div>

    <div class="shopsTitle">售货机商品列表</div>

    <el-table :data="datas" style="width: 100%" v-loading="isFetchingShopsDetailData">
      <el-table-column label="位置" prop="slotNo">
      </el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <div :style="`width: 40px; height: 40px;background-image: url(${scope.row.minPicUrl}); background-size: 100% 100%`"></div>
        </template>
      </el-table-column>
      <el-table-column label="商品ID" prop="goodId">
      </el-table-column>
      <el-table-column label="商品" prop="goodName">
      </el-table-column>
      <el-table-column label="规格" prop="goodStandard">
      </el-table-column>
      <el-table-column label="价格" prop="priceSaler">
      </el-table-column>
      <el-table-column label="数量" prop="goodsSurplus">
      </el-table-column>
      <el-table-column label="预警值" prop="warnNum">
      </el-table-column>
    </el-table>
    <div class="paginationBox">
      <el-pagination @size-change="handleShopsSizeChange" @current-change="handleShopsCurrentChange" :current-page="shopsCurrentPage" :page-sizes="shopsPageSizes" :page-size="curShopsPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curShopsTotal">
      </el-pagination>
    </div>
    <div class="shopsTitle">操作记录</div>

    <div class="selects">
      <el-select v-model="actionType" placeholder="请选择" style="width: 100px">
        <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <div class="timeSelect" style="margin-left: 10px; margin-right: 20px">
        <el-date-picker v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </div>
      <el-input placeholder="输入商品名称,按回车搜索" suffix-icon="el-icon-search" v-model="goodsName" style="width: 250px" @keyup.enter.native="fetchHistory">
      </el-input>
    </div>
    <el-table :data="history" style="width: 100%">
      <el-table-column label="日期" prop="createTime">
      </el-table-column>
      <el-table-column label="位置" prop="slotNo">
      </el-table-column>
      <el-table-column label="商品ID" prop="goodsId">
      </el-table-column>
      <el-table-column label="商品" prop="goodsName">
      </el-table-column>
      <el-table-column label="规格" prop="goodsStandard">
      </el-table-column>
      <el-table-column label="售价" prop="priceSaler">
      </el-table-column>
      <el-table-column label="类型" prop="actionType">
      </el-table-column>
      <el-table-column label="补货数量" prop="actionNumber">
      </el-table-column>
      <el-table-column label="经手" prop="who">
      </el-table-column>
    </el-table>

    <div class="paginationBox">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { getShopOperationHistory } from 'api/operation/shops';

// import moment from 'moment';

export default {
  data() {
    return {
      datas: [],
      storeId: 1,
      managerInfo: {},
      storeInfo: {},
      warningInfo: [],
      goodsName: '',
      history: [],

      currentPage: 1,
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      curTotal: 0,

      shopsCurrentPage: 1,
      shopsPageSizes: [10, 20, 30, 40],
      curShopsPageSize: 10,
      curShopsTotal: 0,
      isFetchingShops: false,
      actionType: 'all', // 操作类型
      time: [],
      actionOptions: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 1,
          label: '补货'
        },
        {
          value: 2,
          label: '换货'
        }
      ]
    };
  },
  computed: {
    ...mapState({
      isFetchingShopsDetailData: state => state.shops.isFetchingShopsDetailData
    })
  },
  watch: {
    time() {
      this.fetchHistory();
    },
    actionType() {
      this.fetchHistory();
    }
  },
  methods: {
    ...mapActions(['getShopDetailList']),
    handleSizeChange(val) {
      this.curPageSize = val;
      this.fetchHistory();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchHistory();
    },
    handleShopsSizeChange(val){
      this.curShopsPageSize = val;
      if (this.isFetchingShopsDetailData) return;
      this.fetchShopsList();
    },
    handleShopsCurrentChange(val) {
      //  console.log(val, this.shopsCurrentPage)
      this.shopsCurrentPage = val;
      if (this.isFetchingShopsDetailData) return;
      this.fetchShopsList();
    },
    createParams() {
      let params = {};
      if (this.time.length > 0) {
        params.beginTime = this.time[0];
        params.endTime = this.time[1];
      }
      if (this.actionType !== 'all') {
        params.actionType = this.actionType;
      }
      if (this.goodsName) {
        params.goodsName = this.goodsName;
      }
      params.page = this.currentPage;
      params.size = this.curPageSize;
      return params;
    },
    fetchShopsList() {
      this.getShopDetailList({
        // 获取售货机列表
        storeId: this.storeId,
        page: this.shopsCurrentPage,
        size: this.curShopsPageSize
      }).then(res => {
        this.managerInfo = res.list[0].managerInfo;
        this.storeInfo = res.list[0].storeInfo;
        this.warningInfo = res.list[0].warningInfo;
        res.list.forEach((item, index) => {
          item.goodsType =
            item.goodsType == 1
              ? '饮料'
              : item.goodsType == 2 ? '减肥餐' : '其他';
          item.goodsStatus =
            item.goodsStatus == 1
              ? '待上架'
              : item.goodsStatus == 2 ? '已上架' : '其他';
          item.minPicUrl = item.goodsInfo.minPicUrl;
          item.goodId = item.goodsInfo.id;
          item.goodName = item.goodsInfo.goodsName;
          item.goodStandard = item.goodsInfo.goodsStandard;
          item.priceSaler = (item.goodsInfo.priceSaler / 100).toFixed(2);
        });
        this.shopsCurrentPage = res.pageNum < 1 ? 1 : res.pageNum;
        this.curShopsPageSize = res.pageSize;
        this.curShopsTotal = res.total;
        this.datas = res.list;
      }).catch( () => {
      })
    },
    fetchHistory() {
      getShopOperationHistory(this.createParams()).then(res => {
        let pagination = res.data.data;
        this.currentPage = pagination.pageNum < 1 ? 1 : pagination.pageNum;
        this.curPageSize = pagination.pageSize;
        this.curTotal = pagination.total;
        let history = res.data.data.list;
        history.forEach((item, index) => {
          item.createTime = moment(item.createTime).format(
            'YYYY-MM-DD HH:mm:ss'
          );
          item.actionType =
            item.actionType == 1 ? '补货' : item.actionType == 2 ? '换货' : '';
          item.priceSaler = (item.priceSaler / 100).toFixed(2);
          item.who = '店长';
        });
        this.history = history;
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(this.$route.query.shopsDetail)
      this.storeId = this.$route.query.shopsDetail;
      this.fetchShopsList();

      this.fetchHistory();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.warningGoods {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #e5e5e5;
  @include flexbox;
  @include flex-wrap(wrap);
  @include align-items(center);
}
.shopsDetail {
  background-color: #ffffff;
  width: 100%;
  min-height: calc(100% - 60px);
  box-sizing: border-box;
  padding: 20px;
  .subTitle {
    height: 40px;
    line-height: 40px;
  }
}

.shopsTitle {
  font-size: 26px;
  padding: {
    top: 20px;
  }
}
.shopsDetailTitle {
  font-size: 30px;
  height: 50px;
  line-height: 50px;
  border: {
    bottom: 1px solid #999999;
  }
}
.selects {
  @include flexbox;
  @include align-items(center);
}
.shoreDetail {
  width: 100%;
  box-sizing: border-box;
  padding: {
    top: 30px;
  }
  .item {
    height: 40px;
    line-height: 40px;
  }
}
</style>

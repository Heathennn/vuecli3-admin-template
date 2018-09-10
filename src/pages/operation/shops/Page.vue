<template>
  <div class="protalPage" v-if="isLoadSubPage">
    <div class="shopsPage">
      <div class="title">
        售货机商品管理
      </div>
      <div class="radioSelect">
        <el-radio-group v-model="status">
          <el-radio-button label="售货机" v-permission="'bedb7439-ba7e-42d8-926d-b754f089503d'"></el-radio-button>
          <el-radio-button label="商品库" v-permission="'e616c758-500c-42e1-88d5-5efd93b13932'"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="vending" v-if="status === '售货机'" >
        <div class="selects">
          <div class="selectTitle">状态 </div>
          <div class="statusSelect">
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in vendingOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="searchBar">
            <el-input placeholder="输入门店名称, 回车搜索 " v-model="storeName" @keyup.enter.native="fetchData1">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>

        </div>
        <div class="messageTableBox" v-loading="isFetchingData1">
          <shops-table :tableData="shopsList" v-permission="'3bda1e7d-47c0-41b6-afc8-36afb64036e5'"></shops-table>
        </div>
      </div>
      <div class="shops" v-if="status === '商品库'">
        <div class="selects">
          <div class="searchBar">
            <el-input placeholder="输入商品名称" v-model="input">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <el-button @click.native="createGood" v-permission="'76fa1cd0-30ca-4077-bf9d-b5f5c5597382'">新增商品</el-button>
        </div>
        <div class="goodsTableBox" v-loading="isFetchingData2">
          <goods-table :tableData="goodsList"
                       ref="goodsTable"
                      @fetchGoodsData="fetchData2"
                      v-permission="'eddb104f-b63b-41a7-88ad-43142415678a'"></goods-table>
          <div class="paginationBox">
            <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="currentPage2" :page-sizes="pageSizes2" :page-size="curPageSize2" layout="total, sizes, prev, pager, next, jumper" :total="curTotal2">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
  <shops-sub-page v-else :subPageType="routeQuery"></shops-sub-page>
</template>

<script>
import ShopsTable from './components/ShopsTable';

import GoodsTable from './components/GoodsTable';

import ShopsSubPage from './components/ShopsSubPage';

import { mapState, mapActions } from 'vuex';

export default {
  components: {
    ShopsTable,
    GoodsTable,
    ShopsSubPage
  },
  computed: {
    ...mapState({
      shopsList: state => state.shops.shopsList,
      goodsList: state => state.shops.goodsList,
      isFetchingData1: state => state.shops.isFetchingData1,
      pageSize1: state => state.shops.pageSize1,
      pageNum1: state => state.shops.pageNum1,
      total1: state => state.shops.total1,
      isFetchingData2: state => state.shops.isFetchingData2,
      pageSize2: state => state.shops.pageSize2,
      pageNum2: state => state.shops.pageNum2,
      total2: state => state.shops.total2,
    }),
    routeQuery() {
      return Object.keys(this.$route.query)[0];
    },
    isLoadSubPage() {
      if (Object.keys(this.$route.query)[0]) {
        return false;
      } else {
        return true;
      }
    }
  },
  data() {
    return {
      time: '',
      currentPage1: 1,
      currentPage2: 1,
      pageSizes2: [10, 20, 30, 40],
      curPageSize2: 10,
      curTotal2: 0,
      deviceStatus: '已绑设备',
      input: '', // 模糊搜索商品库
      storeName: '', // 模糊搜索 售货机
      // shopType: '全部类型',
      status: '售货机',
      vendingOptions: [
        {
          value: 'all',
          label: '全部类型'
        },
        {
          value: '1',
          label: '待补货'
        },
        {
          value: '2',
          label: '补货成功'
        }
      ],
      value: 'all',
      dialogVisible: false,
      dialogTitle: '添加',
       goodName: '',
      goodsStandard: '',
      priceBuyer: '',
      priceSaler: ''
    };
  },
  watch: {
    value(newValue) {
      this.fetchData1();
    },
    input(val) {
      this.fetchData2();
    },
    // storeName() {
    //   this.fetchData1();
    // }
  },
  methods: {
    ...mapActions(['getShopsList', 'getGoodsList']),
    confirm() {
      this.dialogVisible = false;
    },
    mapPagination1() {
      this.currentPage1 = this.pageNum1;
      this.curTotal1 = this.total1;
      this.curPageSize1 = this.pageSize1;
    },
    mapPagination2() {
      this.currentPage2 = this.pageNum2;
      this.curTotal2 = this.total2;
      this.curPageSize2 = this.pageSize2;
    },
    handleSizeChange1(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange1(val) {
      // console.log(`当前页: ${val}`);
    },
    handleSizeChange2(val) {
      // console.log(`每页 ${val} 条`);
      this.curPageSize2 = val;
      this.getGoodsList(this.creatGoodsParams()).then( () => {
        this.mapPagination2();
      })
    },
    handleCurrentChange2(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage2 = val;
      this.getGoodsList(this.creatGoodsParams()).then( () => {
        this.mapPagination2();
      })
    },
    createShopsParams() {
      let params = {};
      if (this.value !== 'all') {
        params.restockedStatus = this.value;
      }
      if (this.input1) {
        params.storeName = this.input1;
      }
      return params;
    },
    creatGoodsParams() {
      let params = {};
      params.page = this.currentPage2;
      params.size = this.curPageSize2;
      if (this.input) {
        params.goodsName = this.input;
      }
      return params;
    },
    fetchData1() {
      this.getShopsList(this.createShopsParams());
    },
    fetchData2() {
      this.getGoodsList(this.creatGoodsParams()).then( () => {
        this.mapPagination2();
      })
    },
    createGood() {
      // console.log(this.$refs.goodsTable);
      this.$refs.goodsTable.createGood();
    },
    handleClose(done) {
      done();
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchData1();
        vm.fetchData2();
      });
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData1();
      this.fetchData2();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.shopsPage {
  background-color: #ffffff;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .radioSelect {
    padding: {
      top: 30px;
    }
  }
  .title {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
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
  .selectTitle {
    line-height: 40px;
    margin: {
      right: 10px;
    }
  }
  .statusSelect {
    margin: {
      right: 20px;
    }
  }
  .timeSelect {
    margin: {
      right: 100px;
    }
  }
}
.goodsTableBox {
  width: 100%;
  box-sizing: border-box;
}
</style>

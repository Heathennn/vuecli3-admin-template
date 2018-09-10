<template>
  <div class="protalPage" v-if="isLoadSubPage">
    <div class="storePage">
      <div class="title">
        门店管理
      </div>
      <div class="selects">
        <!-- 选择器 -->
        <div class="adressSelect">地区</div>
        <!-- <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select> -->
        <el-cascader v-model="selectedIDs" :options="areaOptions" @change="areaChange" @active-item-change="handleItemChange" :props="areaProps" :change-on-select="false"></el-cascader>
        <div class="statusSelect">状态</div>
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>

        <div class="searchBar">
          <el-input placeholder="门店名称,回车搜索" v-model="storeName" @keyup.enter.native="areaChange">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>

        <div class="searchBar">
          <el-input placeholder="门店ID,回车搜索" v-model="storeId" @keyup.enter.native="areaChange">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>

        <div class="addStore">
          <el-button type="primary" @click.native="createStore" v-permission="'6da34d37-4960-41de-9807-ac320846316b'">新建门店</el-button>
        </div>
      </div>
      <div class="tableBox" v-loading="isFetchingData" v-permission="'a7ff4219-447a-4eac-bf30-595fc038f2b1'">
        <store-table :tableData="storeList"
                     :currentPage="currentPage4"
                     :currentSize="curPageSize"></store-table>
        <div class="paginationBox">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
  <store-sub-page v-else :subPageInfo="routeQuery" @refreshStoreList="areaChange"></store-sub-page>
</template>

<script>
import StoreTable from './components/StoreTable';

import StoreSubPage from './components/StoreSubPage';

import { mapState, mapActions, mapMutations } from 'vuex';

import { deepCopy } from 'common/utils';

export default {
  components: {
    StoreTable,
    StoreSubPage
  },
  data() {
    return {
      currentPage4: 1,
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      curTotal: 5,
      level0: 0,
      level1: 0,
      level2: 0,
      selectedIDs: ['all'],
      options: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: '1',
          label: '未营业'
        },
        {
          value: '2',
          label: '营业'
        }
      ],
      value: 'all',
      storeName: '',
      storeId: '',
      options2: [
        {
          province: '全部',
          id: 'all',
          cities: [
            {
              id: 2,
              province: '次级1',
              cities: [
                {
                  id: 3,
                  province: '次次级1'
                }
              ]
            }
          ]
        }
      ],
      areaOptions: [],
      areaProps: {
        value: 'id',
        children: 'cities',
        label: 'value'
      }
    };
  },
  computed: {
    ...mapState({
      storeList: state => state.store.storeList,
      total: state => state.store.total,
      pageSize: state => state.store.pageSize,
      pageNum: state => state.store.pageNum,
      areaList: state => state.store.areaList,
      isFetchingData: state => state.store.isFetchingData
    }),
    routeQuery() {
      return (
        Object.keys(this.$route.query)[0] +
        '=' +
        this.$route.query[Object.keys(this.$route.query)[0]]
      );
    },
    isLoadSubPage() {
      if (Object.keys(this.$route.query)[0]) {
        return false;
      } else {
        return true;
      }
    }
  },
  watch: {
    selectedIDs(val) {
      this.setAreaIds(val);
    },
    value() {
      this.getStoreList(this.createParams()).then(() => {
        this.mapPagination();
      });
    }
    // storeName() {
    //   this.getStoreList(this.createParams()).then(() => {
    //     this.mapPagination();
    //   });
    // }
  },
  methods: {
    ...mapMutations(['setAreaIds']),
    ...mapActions(['getStoreList', 'getAreaDropDown']),
    findIndexById(id, array) {
      for (let index in array) {
        if (array[index].id === id) {
          return index;
        }
      }
      return 'Nofound';
    },
    createAreaList(res, level) {
      let list = [];
      res.forEach((item, index) => {
        let obj = {};
        if (level === 0) {
          obj.value = item.province;
        }
        if (level === 1) {
          obj.value = item.city;
        }
        if (level === 2) {
          obj.value = item.district;
        }
        obj.id = item.id;
        list.push(obj);
      });
      return list;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.curPageSize = val;
      this.getStoreList({
        page: this.currentPage4,
        size: this.curPageSize
      }).then(() => {
        this.mapPagination();
      });
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage4 = val;
      this.getStoreList({
        page: this.currentPage4,
        size: this.curPageSize
      }).then(() => {
        this.mapPagination();
      });
    },
    areaChange(val) {
      this.getStoreList(this.createParams()).then(() => {
        this.mapPagination();
      });
    },
    handleItemChange(val) {
      let level = val.length;
      let id = val[level - 1];
      let result;
      if (level === 1) {
        this.level0 = this.findIndexById(id, this.areaOptions); // 第一级
        result = this.level0;
        if (this.areaOptions[result].cities.length > 0) {
          // 第二级cities已有 不再重复请求
          return;
        }
      }
      if (level === 2) {
        this.level1 = this.findIndexById(
          id,
          this.areaOptions[this.level0].cities
        ); // 第二级
        result = this.level1;
        if (this.areaOptions[this.level0].cities[result].cities.length > 0) {
          // 第三级cities已有 不再重复请求
          return;
        }
      }
      this.getAreaDropDown({
        id: id
      }).then(res => {
        let list = this.createAreaList(res, level); // 格式化下拉列表
        if (level === 1) {
          this.areaOptions[result].cities = list;
        }
        if (level === 2) {
          let newObj = Object.assign(
            {},
            this.areaOptions[this.level0].cities[result],
            { cities: list }
          );
          this.$set(this.areaOptions[this.level0].cities, result, newObj);
          // this.areaOptions[this.level0].cities[result].cities = list;
        }
        if (level < 2) {
          this.setEmptyCities(this.areaOptions[result].cities);
        }
      });
      // console.log(val)
    },
    setEmptyCities(array) {
      for (let item of array) {
        item.cities = [];
      }
    },
    mapPagination() {
      this.currentPage4 = this.pageNum;
      this.curTotal = this.total;
      this.curPageSize = this.pageSize;
    },
    createStore() {
      this.$router.push({ path: '/storePart/store?baseInfo' });
    },
    createParams() {
      let params = {};
      if (this.value !== 'all') {
        params.businessStatus = this.value;
      }
      if (this.selectedIDs.length > 1) {
        params.provinceId = this.selectedIDs[0];
        params.cityId = this.selectedIDs[1];
        params.districtId = this.selectedIDs[2];
      }
      if (this.storeName) {
        params.storeName = this.storeName;
      }
      if (this.storeId) {
        params.storeId = this.storeId;
      }
      params.page = this.currentPage4;
      params.size = this.curPageSize;
      return params;
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.getStoreList(vm.createParams()).then(() => {
        vm.mapPagination();
      });
      });
    })
  },
  mounted() {
    this.$nextTick(() => {
       this.getStoreList(this.createParams()).then(() => {
        this.mapPagination();
      });

      this.getAreaDropDown({
        id: 'all'
      }).then(res => {
        let list = this.createAreaList(res, 0);
        this.setEmptyCities(list);
        list.unshift({
          id: 'all',
          value: '全部'
        });
        this.areaOptions = list;
      });
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.storePage {
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
  .selects {
    @include flexbox;
    @include align-items(center);
    padding: {
      top: 20px;
    }
  }
  .adressSelect {
    line-height: 40px;
    padding: {
      right: 10px;
    }
  }
  .statusSelect {
    line-height: 40px;
    padding: {
      left: 10px;
      right: 10px;
    }
  }
  .searchBar {
    width: 200px;
    margin: {
      left: 20px;
      right: 10px;
    }
  }
  .tableBox {
    width: 100%;
  }
}
</style>

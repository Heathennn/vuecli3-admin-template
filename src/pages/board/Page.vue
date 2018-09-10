<template>
  <div class="boardPage protalPage">
    <div class="boardHeader shadow">
      <div class="select">
        <el-select v-model="store" placeholder="请选择" size="medium">
          <el-option v-for="(item, index) in dropdownStoreList" :key="index" :label="item.storeName" :value="item.id">
          </el-option>
        </el-select>
        <div class="status" v-if="defaultStore">
          <span>状态: </span>
          <span>{{defaultStore.businessStatus == 1 ? '未营业': defaultStore.businessStatus == 2 ? '营业' : '其他状态'}}</span>
        </div>
      </div>
      <div class="onlineNum">
        <div class="instoreNum numberBox" @click="checkoutOnline('当前在店人数')" v-permission="'b66e8462-6349-45ec-b57f-aa64a94ac40f'">
          <div class="number" :style="{border: '1px solid #0066FF',backgroundColor: 'rgba(0, 102, 255, 0.1)', color: 'RGBA(74, 74, 74, 1)'}">{{instoreNum}}</div>
          <div style="font-size: 12px; color: #666666">当前在店人数</div>
        </div>

        <div class="currentOvertimeNum numberBox" @click="checkoutOvertime('当前超时人数')" v-permission="'6a8d33b4-638a-4533-bfb8-63d3d473b8ed'">
          <div class="number" :style="{border: '1px solid RGBA(245, 166, 35, 1)',backgroundColor: 'RGBA(245, 166, 35, 0.1)', color: 'RGBA(74, 74, 74, 1)'}">{{overtimeNum}}</div>
          <div style="font-size: 12px; color: #666666">当前超时人数</div>
        </div>
      </div>

      <!-- 当时人数订单列表 -->
      <el-dialog :title="currentTitle" center :visible.sync="orderVisible" width="40%" :before-close="orderHandleClose" v-loading="isLoadingOrderList">
        <el-table :data="currentList" style="width: 100%" :border="false">
          <el-table-column prop="createTime" label="预约时间">
            <template slot-scope="scope">
              {{moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column prop="userInfo.nickname" label="用户">
          </el-table-column>
          <el-table-column prop="userInfo.mobile" label="手机">
          </el-table-column>
          <el-table-column prop="orderSn" label="订单号">
            <template slot-scope="scope">
              <a href="javascript:;" class="hyperlink" @click="jumpSportDetail(scope.row.orderSn)">{{scope.row.orderSn}}</a>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{scope.row.orderStatus == 1 ? '待使用' : scope.row.orderStatus == 2 ? '使用中' : scope.row.orderStatus == 3 ? '已完成' : scope.row.orderStatus == 4 ? '已取消' : '无'}}
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

    </div>
    <div class="tabsContent">
      <div class="elm-tabs shadow">
        <tabs></tabs>
      </div>
      <div class="errorContent">
        <div class="musicPlayer shadow" v-permission="'1c5f7114-78e3-44a0-8dee-61b1fe3f37d0'">
          <music-player></music-player>
        </div>
        <div class="untreatedError shadow" v-loading="isFetchingErrorList" v-permission="'838f086a-bb6c-4365-bbd0-2a5145ff4beb'">
          <div class="title">异常事件</div>
          <div class="untreatedList" v-if="currentErrorList && currentErrorList.length > 0">
            <div class="untreatedItem" v-for="(item, index) in errorDatas" :key="index" @click="jumpToDetail(item)">
              <div class="errorTitle" style="color: black">{{item.abnormalType == 1 ? '设备异常' : item.abnormalType == 2 ? '门店应急' : item.abnormalType == 3 ? '安防报警' : ''}}</div>
              <div class="item" style="color: black; font-size: 14px">{{item.facilityName}}({{item.abnormalCode}}):{{item.abnormalDesc}}</div>
              <div class="createTime" style="color: #999999; font-size: 14px">{{item.createTime}}</div>
              <div class="status" style="color: #999999; font-size: 14px">状态:{{item.dealStatus == 0 ? '未处理' : '已处理'}}</div>
            </div>
          </div>
          <!--  1，设备异常；2，门店应急；3，安防报警',-->
          <div class="empty" v-else>无</div>
        </div>
        <div class="downArrow" style="text-align: center" @click="fetchBoardErrorList" v-if="currentErrorList && currentErrorList.length > 0" v-permission="'838f086a-bb6c-4365-bbd0-2a5145ff4beb'">
          点击加载更多
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tabs from './components/Tabs';

import MusicPlayer from './components/MusicPlayer';

import { mapState, mapActions, mapMutations } from 'vuex';

import { deepCopy } from 'common/utils';

import { getOnlineOrderList, getOvertimeOrderList } from 'api/board';

// import moment from 'moment';

export default {
  data() {
    return {
      orderVisible: false,
      currentList: [],
      currentTitle: '',
      store: '',
      boardPage: 1,
      // currentTimeNumber: 0,
      currentErrorList: [],
      isFetchingErrorList: false,
      isLoadingOrderList: false
    };
  },
  computed: {
    ...mapState({
      dropdownStoreList: state => state.board.dropdownStoreList,
      defaultStore: state => state.board.defaultStore,
      borderError: state => state.board.borderError,
      timeDetail: state => state.board.timeDetail,
      instoreNum: state => state.board.instoreNum,
      overtimeNum: state => state.board.overtimeNum
    }),
    errorDatas() {
      this.currentErrorList.forEach((item, index) => {
        // console.log(item);
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
      });
      return this.currentErrorList;
    }
  },
  watch: {
    store(index) {
      if (typeof index !== 'number') {
        // 第一次设置默认值
        this.setDefaultStore(this.dropdownStoreList[0]);
      } else {
        this.setDefaultStore(this.dropdownStoreList[index]);
        this.getBoardError({
          storeId: this.defaultStore.id
        });
        this.getMusicPlayerList({
          page: 1,
          size: 10000,
          musicType: 1 // 普通
        });
        this.getMusicPlayerList({
          page: 1,
          size: 10000,
          musicType: 2 // 紧急
        });
      }
    }
  },
  components: {
    Tabs,
    MusicPlayer
  },
  methods: {
    ...mapMutations(['setDefaultStore']),
    ...mapActions([
      'getStores',
      'getBoardError',
      'getMusicPlayerList',
      'getToken',
      'getList',
      'getVideoList'
    ]),
    orderHandleClose(done) {
      done();
    }, 
    jumpSportDetail(orderSn) {
      this.orderVisible = false;
      this.$router.push({path: `/order/sportOrder?orderSn=${orderSn}`})
    },
    resetCurrentList() {
      this.currentList = [];
      this.currentTitle = '';
    },
    checkoutOvertime(title) {
      this.isLoadingOrderList = true;
      this.resetCurrentList();
      this.currentTitle = title;
      this.orderVisible = true;
      getOvertimeOrderList({
        storeId: this.defaultStore.id,
        payStatus: 2,
        overtimeStatus: 2,
        orderStatus: 2,
        page: 1,
        size: 100
      }).then( (res) => {
        res.data.data.list.forEach( (item, index) => {
          item.createTime = this.moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
        })
        this.currentList = res.data.data.list
        this.isLoadingOrderList = false;
      }).catch( () => {
        this.isLoadingOrderList = false;
      })
    },
    checkoutOnline(title) {
      this.resetCurrentList();
      this.orderVisible = true;
      this.currentTitle = title;
      getOnlineOrderList({
        storeId: this.defaultStore.id,
        payStatus: 2,
        inStore: 1,
        page: 1,
        size: 1000
      }).then( (res) => {
        // console.log(res);
         this.currentList = res.data.data.list
      })
    },
    getMinute(time) {
      let times = time.split(':');
      let minute = parseInt(times[0]) * 60 + parseInt(times[1]);
      return minute;
    },
    jumpToDetail(item) {
      if (item.abnormalType == 3) {
        this.$router.push({
          path: `/monitor/securezoom?ZoomDetail=${item.id}`
        });
      }
      if (item.abnormalType == 1) {
        this.$router.push({ path: `/operation/error?errorDetail=${item.id}` });
      }
    },
    fetchBoardErrorList() {
      this.isFetchingErrorList = true;
      this.getBoardError({
        page: this.boardPage,
        size: 10,
        storeId: this.defaultStore.id
      })
        .then(res => {
          this.boardPage += 1;
          res.forEach((item, index) => {
            this.currentErrorList.push(item);
          });
          this.isFetchingErrorList = false;
        })
        .catch(() => {
          this.isFetchingErrorList = false;
        });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {
        // vm.getVideoList();
      });
    });
  },
  mounted() {
    this.$nextTick(() => {
      // this.getVideoList();
      this.getStores({
        page: 1,
        size: 100
      }).then(() => {
        if (!this.store) {
          // 初始状态
          this.store = this.defaultStore.storeName;
          this.fetchBoardErrorList();
        }
      });
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.boardPage {
  box-sizing: border-box;
  padding: 20px;
}
.boardHeader {
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 10px;
  @include flexbox;
  @include justify-content(space-between);
  margin: {
    bottom: 20px;
  }
}
.select {
  .el-input--medium {
    .el-input__inner {
      height: 50px !important;
      font-size: 30px;
    }
  }
}
.el-select {
  .el-select--medium {
    border: none;
    outline: 0;
    font-size: 30px;
  }
}

.untreatedList {
  max-height: 1000px;
  background-color: #ffffff;
  // overflow: hidden;
}
.tabsContent {
  width: 100%;
  min-height: 500px;
  @include flexbox;
  .elm-tabs {
    width: 70%;
    background-color: #ffffff;
    margin: {
      right: 20px;
    }
  }
  .errorContent {
    flex: 1;
    // background-color: #ffffff;
    .musicPlayer {
      background-color: #ffffff;
      // min-height: 100px;
      box-sizing: border-box;
      padding: 10px;
      margin: {
        bottom: 15px;
      }
    }
    .untreatedError {
      background-color: #ffffff;
      box-sizing: border-box;
      overflow-y: scroll;
      padding: 15px;
      .title {
        font-size: 20px;
      }
      .untreatedItem {
        box-sizing: border-box;
        cursor: pointer;
        padding: {
          top: 5px;
          bottom: 5px;
        }
        border: {
          bottom: 1px solid #999999;
        }
      }
    }
  }
}

.downArrow {
  cursor: pointer;
  width: 100%;
  height: 20px;
  background-color: #ffffff;
  @include flexbox;
  @include align-items(center);
  @include justify-content(center);
}
.onlineNum {
  @include flexbox;
  @include justify-content(center);
  @include align-items(center);
}
.status {
  font-size: 13px;
  padding: {
    top: 10px;
  }
}

.numberBox {
  cursor: pointer;
  @include flexbox;
  @include flex-direction(column);
  @include justify-content(center);
  @include align-items(center);
  margin: {
    right: 10px;
  }
  .number {
    text-align: center;
    line-height: 50px;
    width: 50px;
    height: 50px;
    font-size: 25px;
    border-radius: 50%;
    border: 1px solid black;
  }
}
</style>

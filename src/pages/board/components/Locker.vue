<template>
  <div class="lockerPage">
    <div class="title">储物柜</div>
    <!-- 储物柜 -->
    <el-dialog :title=" checking.doorNo + '-使用记录'" :visible.sync="dialogVisible" width="60%" center>
      <el-table :data="orderInfo.table" style="width: 100%" v-loading="isFetchingHistory" height="300px">
        <el-table-column label="操作者" prop="operatSource">
        </el-table-column>
        <el-table-column label="时间" prop="createTime">
        </el-table-column>
        <el-table-column label="手机" prop="telphone">
        </el-table-column>
        <el-table-column label="用户" prop="userNickname">
        </el-table-column>
        <el-table-column label="订单号" prop="orderSn">
          <template slot-scope="scope">
            <a v-if="scope.row.orderSn !== 'N/A'" href="javascript:;" @click="jumpToOrderDetail(scope.row.orderId)">{{scope.row.orderSn}}</a>
            <span v-else>{{scope.row.orderSn}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="operatMemo">
        </el-table-column>
      </el-table>

      <div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
        </el-pagination>
      </div>

    </el-dialog>

    <div class="lockers" v-if="lockers && lockers.length > 0" v-permission="'97c56d06-1006-4d59-8385-ff527f4602c2'">
      <div class="item shadow" v-for="(item, index) in lockers" :style="lokerStyle(item)" :key="index">
        <el-tooltip placement="top" effect="light">
          <div slot="content">
            <el-button type="primary" @click="openDoor(item)" v-permission="'c8db84f1-ca55-48aa-bd39-0650d582b405'">开门</el-button>
          </div>
          <expand-item :item="item" @showUseHistory="showUseHistory"></expand-item>
        </el-tooltip>
      </div>
    </div>
    <div class="" v-else v-permission="'97c56d06-1006-4d59-8385-ff527f4602c2'">无储物柜列表</div>
    <div style="color: #666666; font-size: 14px;padding-left: 20px" v-permission="'97c56d06-1006-4d59-8385-ff527f4602c2'">
      全部储物柜:&nbsp;{{lockers ? lockers.length : 0}}台, 可用:&nbsp;{{lockers ? (lockers.length - useable) : 0}}台, 已用:&nbsp;{{useable}}台
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import ExpandItem from './ExpandItem';

import { deepCopy } from 'common/utils';

export default {
  data() {
    return {
      visible2: false,
      currentSlot: '1',
      currentPage: 1,
      curPageSize: 10,
      curTotal: 0,
      pageSizes: [10, 20, 30, 40],
      orderInfo: {
        table: []
      },
      dialogVisible: false,
      checking: {},
      isFetchingHistory: false
    };
  },
  computed: {
    ...mapState({
      userInformation: state => state.auth.userInformation,
      defaultStore: state => state.board.defaultStore,
      lockers: state => state.board.lockers
    }),
    useable() {
      let number = this.lockers.length;
      this.lockers.forEach((item, index) => {
        if (item.doorStatus == 2) {
          number--;
        }
      });
      return number;
    }
  },
  components: {
    ExpandItem
  },
  methods: {
    ...mapActions(['getLockerList', 'openLocker', 'getLockerHistory']),
    jumpToOrderDetail(id) {
      this.dialogVisible = false;
      this.$router.push({ path: `/order/sportOrder?orderDetail=${id}` });
    },
    handleSizeChange(val) {
      this.curPageSize = val;
      this.showUseHistory(this.checking, this.currentPage, val);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.showUseHistory(this.checking, val, this.curPageSize);
    },
    openDoor(item) {
      this.openLocker({
        num: item.doorNo,
        lockersId: item.lockersId,
        userId: this.userInformation.id,
        userName: this.userInformation.username,
        telPhone: this.userInformation.mobile,
        storeId: this.defaultStore.id,
        equipmentId: item.facilityId
      })
        .then(() => {
          this.$notify.success(`开启储物柜[${item.doorNo}]成功`);
        })
        .catch(res => {
          this.$notify.error(
            `开启储物柜[${item.doorNo}]失败, 错误码:${res.code},描述:${
              res.message
            }`
          );
        });
    },
    lokerStyle(locker) {
      if (locker.doorStatus == 1) {
        return 'backgroundColor: RGBA(0, 102, 255, 1);color: white';
      } else {
        return '';
      }
    },
    mapPagination(res) {
      this.curPageSize = res.pageSize;
      this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
      this.curTotal = res.total;
    },
    showUseHistory(item, currentPage, curPageSize) {
      this.dialogVisible = true;
      this.checking = item;
      this.isFetchingHistory = true;
      this.getLockerHistory({
        lockerId: item.lockersId,
        page: currentPage || this.currentPage,
        size: curPageSize || this.curPageSize
      })
        .then(res => {
          res.list.forEach((item, index) => {
            item.orderSn = item.orderSn ? item.orderSn : 'N/A';
            item.operatSource =
              item.operatSource == 1
                ? '用户'
                : item.operatSource == 2 ? '后台' : item.operatSource == 3 ? '店长' : '';
            item.createTime = this.moment(item.createTime).format(
              'YYYY-MM-DD HH:mm:ss'
            );
          });
          this.orderInfo.table = res.list;
          this.mapPagination(res);
          this.isFetchingHistory = false;
        })
        .catch(() => {
          this.isFetchingHistory = false;
        });
    },
    handleClose(done) {
      // this.checking = {};
      done();
    }
  },
  watch: {
    defaultStore(value) {
      // console.log(this.defaultStore);
      this.getLockerList({
        storeId: this.defaultStore.id
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      // console.log
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.lockerPage {
  box-sizing: border-box;
  padding: 10px;
  .title {
    font-size: 20px;
    height: 50px;
    line-height: 50px;
  }
}
.lockers {
  width: 100%;
  @include flexbox;
  @include flex-wrap(wrap);
  // @include justify-content(space-around);
  border: {
    top: 1px solid #999999;
  }
  box-sizing: border-box;
  padding: 10px;
  .item {
    width: 150px;
    height: 200px;
    box-sizing: border-box;
    transition: all 1s;
    padding: 10px;
    overflow: hidden;
    margin: {
      bottom: 10px;
      right: 10px;
    }
    .state {
      font-size: 14px;
      padding: {
        top: 5px;
        bottom: 5px;
      }
    }
    .lockerUser {
      font-size: 14px;
    }
    // border: 1px solid #999999;
  }
}
.dropDown {
  transition: all 0.5s;
  width: 100%;
  height: 40px;
  overflow: hidden;
}
</style>

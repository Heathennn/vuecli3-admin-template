<template>
  <div class="currentMessage">
    <div class="messageItem" v-for="(item, index) in currentMessage"
         :key="index">
       <div class="messageHead">
        <div :class="item.iconSign == 2 ? item.readStatus == 1 ? ['title', 'fire']: ['fire'] : item.readStatus == 1 ? ['title'] : ['']" :style="item.readStatus == 2 ? 'color: #999999' : ''">异常订单</div>  
        <div class="createTime" style="font-size: 14px;color: #999999">{{item.orderInfo ? moment(item.createTime).format('YYYY-MM-DD HH:mm:ss') : '无'}}</div>
       </div>  

       <div class="messageContent" @click="jumpToErrorDetail(item.id, item.orderInfo.id)" :style="item.readStatus == 2 ? 'color: #999999' : ''">
         单号:{{item.orderInfo ? item.orderInfo.orderSn : '无'}},超时:{{item.orderInfo ? item.orderInfo.exceedMinute : '0'}}分钟
       </div>
       <div class="storeName" style="color: #999999">
         {{item.orderInfo ? item.orderInfo.storeName : '无'}}
       </div>
    </div>

     <div class="paginationBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20,30,40]" :page-size="currentSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
        </el-pagination>
      </div>
  </div>
</template>

<script>

import { getHistoryMessage, readNotice } from 'api/auth';
export default {
  data() {
    return {
      currentPage: 1,
      currentSize: 10,
      curTotal: 10,
      currentMessage: []
    }
  },
  watch: {
    currentMessage: {
      handler: function(val, oldVal) {
        if (val.length == 0) {
          this.$emit('setRead', 0)
        } else {
          this.$emit('setRead', val[0].needReadNum)
        }
      }
    }
  },  
  methods: {
    handleSizeChange(val) {
      this.currentSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    mapPagination(res) {
      this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
      this.currentSize = res.pageSize;
      this.curTotal = res.total;
    },
    jumpToErrorDetail(id, detailId) {
      if (!id) return;
      readNotice({id:id}).then( () => {
        this.fetchData();
      })
      this.$router.push({path: `/service/abnormalOrder?orderDetail=${detailId}`});
    },
    fetchData() {
      getHistoryMessage({
        userId: this.$store.state.auth.userInformation.id,
        noticeType: 2,
        page: this.currentPage,
        size: this.currentSize,
      }).then( (res) => {
        this.currentMessage = res.data.data.list;
        this.mapPagination(res.data.data);
      })
    }
  },
  mounted() {
    this.$nextTick( () => {
      this.fetchData();
      // console.log(this.currentMessage);
    })
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.title {
  position: relative;
}
.title::before {
  content: '';
  display: block;
  position: absolute;
  left: -9px;
  top: 5px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: red;
}
.messageItem {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  border: {
    bottom: 1px solid #e5e5e5;
  }
}
.messageContent {
  cursor: pointer;
}
.messageHead {
  @include flexbox;
  @include justify-content(space-between);
  padding: {
    top: 5px;
    bottom: 5px;
  }
}
.storeName{
  padding: {
    top: 5px;
    bottom: 5px;
  }
}
</style>

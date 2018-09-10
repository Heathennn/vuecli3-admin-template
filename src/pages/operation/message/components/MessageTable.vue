<template>
  <div class="storeTable pageTable">
    <el-dialog title="消息详情" :visible.sync="showDialog" width="30%" :before-close="handleClose" center>
      <div class="content" style="width: 100%" v-loading="isFetchingDetail">
        <div class="detailTitle">标题: {{currentDetail.title}}</div>
        <div class="detailContent">内容: {{currentDetail.content}}</div>
        <div style="width: 100%; height: 1px; backgroundColor: #999999;"> </div>
        <div class="sendTime">发布时间: {{currentDetail.createTime}}</div>
        <div class="sendName">发布人: {{currentDetail.createName}}</div>
        <div class="sendType">消息类型: {{currentDetail.sendType}}</div>
        <div class="reciveType">接收群体: {{currentDetail.userType}}</div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
      </span> -->
    </el-dialog>

    <el-table :data="datas" style="width: 100%" :header-cell-style="headStyle">
      <el-table-column label="发布时间" prop="createTime">
      </el-table-column>
      <el-table-column label="消息类型" prop="sendType">
      </el-table-column>
      <el-table-column label="接收群体" prop="userType">
      </el-table-column>
       <el-table-column label="标题" prop="title">
      </el-table-column>
       <el-table-column label="发布人" prop="createName">
      </el-table-column>
       <el-table-column label="状态" prop="sendStatus">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click.native="checkMessageDetail(scope.row)" v-permission="'fb891617-ac7f-4aee-8680-211ac3477a64'">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { deepCopy } from 'common/utils';

// import moment from 'moment';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState({
      checkingMessageDetail: state => state.message.checkingMessageDetail
    }),
    currentDetail() {
      let detail = deepCopy(this.checkingMessageDetail);
      detail.createTime = moment(detail.createTime).format('YYYY-MM-DD HH:mm:ss');
      detail.sendType = detail.sendType == 1 ? '短信' : detail.sendType == 2 ? 'app推送' : detail.sendType == 3 ? '系统消息' : '未知的类型';
      detail.userType = detail.userType = detail.userType == 1 ? '店长' : detail.userType == 2 ? '用户' : '其他';
      return detail;
    },
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach( (item, index) => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        item.sendType = item.sendType == 1 ? '短信' : item.sendType == 2 ? 'app推送' : item.sendType == 3 ? '系统消息' : '未知的类型';
        item.userType = item.userType == 1 ? '店长' : item.userType == 2 ? '用户' : '其他';
        item.sendStatus = item.sendStatus == 0 ? '待发送' : item.sendStatus == 1 ? '已发送' : item.sendStatus == 2 ? '发送失败' : '未知的发送状态'
      })
      return list
    }
  },
  data() {
    return {
      headStyle: {
        // "text-align": 'center',
        // color: 'red'
      },
      showDialog: false,
      isFetchingDetail: false,
    };
  },
  methods: {
    ...mapActions(['getMessageDetail']),
    handleEdit1(index, row) {
      // console.log(index, row);
    },
    handleEdit2(index, row) {
      // console.log(index, row);
    },
    handleEdit3(index, row) {
      // console.log(index, row);
    },
    handleEdit4(index, row) {
      // console.log(index, row);
    },
    handleClose(done) {
      done();
      this.showDialog = false;
    },
    checkMessageDetail(row) {
      this.showDialog = true;
      this.isFetchingDetail = true;
      // console.log(row);
      let id = row.id;
      this.getMessageDetail({
        id: id
      }).then( () => {
        this.isFetchingDetail = false;
      }).catch( () => {
        this.isFetchingDetail = false;
      })
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.item {
  margin-top: 10px;
  margin-right: 40px;
}

</style>

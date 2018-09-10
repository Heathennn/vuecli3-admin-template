<template>
  <div class="depositConfigPage">
    <div class="depositDefault shadow" v-permission="'0bcf51d0-cf8a-4af6-b61f-76a8b803cd3a'">
      <div style="font-size: 24px">押金:&nbsp;&nbsp;{{defaultDeposit}}元</div>
      <el-button type="primary" plain @click="editDeposit" v-permission="'5a85c591-f4b9-4ce9-98a7-aa64e3cf65dc'">修改</el-button>
    </div>

    <el-dialog title="修改押金" :visible.sync="dialogVisible" width="50%" center :before-close="handleClose">
       <div>输入金额</div>
       <el-input v-model="deposit">
         <template slot="append">元</template>
       </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmUpdate">确 定</el-button>
        </span>
      </el-dialog>


    <div class="depositListBox" v-permission="'64c25fa9-ae0a-405b-9630-3db6100fef4b'">
      <sub-title title="修改记录"></sub-title>
      <el-table :data="datas" style="width: 100%">
        <el-table-column label="序号" prop="no">
        </el-table-column>
        <el-table-column label="修改时间" prop="createTime">
        </el-table-column>
        <el-table-column label="修改后金额" prop="depositAfter">
        </el-table-column>
        <el-table-column label="经手人" prop="adminName">
        </el-table-column>
      </el-table>
      <div class="paginationBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import { getDepositConfig, updateDeposit } from 'api/system/depositConfig';

export default {
  components: {
    SubTitle
  },
  data() {
    return {
      currentPage: 1,
      curPageSize: 10,
      pageSizes: [10, 20, 30, 40],
      curTotal: 0,
      deposit: '',
      depositList: [],
      dialogVisible: false, 
    };
  },
  computed: {
    defaultDeposit() {
      if (this.depositList[0]) {
        return this.depositList[0].depositAfter;
      } else {
        return ''; 
      }
    },
    datas() {
      let list = this.depositList.concat();
      list.forEach( (item, index) => {
        item.no = index + 1 + ((this.currentPage - 1) * this.curPageSize);
        item.createTime = this.moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        item.depositAfter = ( item.depositAfter / 100 ).toFixed(2)
      })
      return list
    }
  },
  methods: {
    editDeposit() {
      this.dialogVisible = true;
      this.deposit = this.defaultDeposit;
    },
    confirmUpdate() {
      if(!this.deposit && this.deposit <= 0) {
        return this.$notify.error('请输入大于0的押金(整数)');
      }
      updateDeposit({
        depositAfter: parseInt(this.deposit) * 100,
        adminId: this.$store.state.auth.userInformation.id,
        adminName: this.$store.state.auth.userInformation.username
      }).then( (res) => {
        if (res.data.code == 200) {
          this.$notify.success('修改成功(押金保留整数)');
          this.dialogVisible = false;
          this.fetchConfig();
          return;
        }
        this.$notify.error(res.data.message || '修改失败');
        this.dialogVisible = false;
      }).catch( () => {
        this.$notify.error('修改失败');
        this.dialogVisible = false;
      })
    },
    handleClose(done) {
      done();
    },
    handleSizeChange(size) {
      this.curPageSize = size;
      this.fetchConfig();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.fetchConfig();
    },
    mapPagination(res) {
      this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
      this.curPageSize = res.pageSize;
      this.curTotal = res.total;
    },
    fetchConfig() {
      getDepositConfig({
        page: this.currentPage,
        size: this.curPageSize
      }).then(res => {
        // console.log(res);
        this.depositList = res.data.data.list;
        this.mapPagination(res.data.data)
      });
    },
    
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchConfig();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.depositConfigPage {
  box-sizing: border-box;
  padding: 20px;
}

.depositDefault {
  @include flexbox;
  @include align-items;
  @include justify-content(space-between);
  box-sizing: border-box;
  padding: 20px;
}
.depositListBox {
  box-sizing: border-box;
  padding: 20px;
  margin-top: 20px;
  border: 1px solid #e5e5e5;
}
.paginationBox {
  padding: {
    top: 20px;
  }
}
</style>

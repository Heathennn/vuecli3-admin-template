<template>
  <el-table ref="multipleTable" :data="datas" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
    <!-- <el-table-column type="selection">
    </el-table-column> -->
    <el-table-column label="用户ID" prop="userId">
    </el-table-column>
    <el-table-column prop="nickname" label="用户昵称" >
    </el-table-column>
    <el-table-column prop="sex" label="性别">
    </el-table-column>
    <el-table-column prop="phone" label="手机">
    </el-table-column>
    <el-table-column prop="deposit" label="押金">
    </el-table-column>
    <el-table-column prop="record" label="身体报告">
    </el-table-column>
    <el-table-column prop="credit" label="信用分">
    </el-table-column>
    <el-table-column label="注册时间">
      <template slot-scope="scope">
        {{moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}
      </template>
    </el-table-column>
    <el-table-column label="操作" width="80">
      <template slot-scope="scope">
        <el-button @click.native="checkout(scope.row)" v-permission="'a6ddf41e-08e4-4e96-9663-c6bfb490e8b9'">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { deepCopy } from 'common/utils';

export default {
  props: {
    tableData: {
      type:  Array,
      default: () => []
    }
  },
  data() {
    return {
      multipleSelection: []
    };
  },
  watch: {
  },
  computed: {
    datas() {
      let list = deepCopy(this.tableData);
      let target = [];
      list.forEach( (item, index) => {
        let obj = {};
        obj.id = item.id;
        obj.nickname = item ? item.nickname : '';
        obj.sex = item ? item.sex == '1' ? '男' : '女' : '';
        obj.record = item.reportStatus == 0 ? '无' : '有';
        obj.credit = item.creditScore;
        obj.phone = item ? item.mobile : '';
        obj.userId = item.userId;
        obj.deposit = item.depositStatus == 0 ? '未交' : item.depositStatus == 1 ? '已交' : item.depositStatus == 2 ? '免交' : item.depositStatus == 3 ? '已冻结' : ''
        obj.createTime = item.createTime;
        target.push(obj);
      })
      return target;
    }
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    checkout(row) {
      this.$router.push({path: `/user/userDetail?id=${row.userId}`})
    }
  }
};
</script>

<style lang="scss" scoped>

</style>

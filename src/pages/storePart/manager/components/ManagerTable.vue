<template>
  <div class="storeTable">
    <el-table :data="datas" style="width: 100%" :header-cell-style="headStyle">
      <el-table-column label="ID" prop="id" >
      </el-table-column>
      <el-table-column label="创建日期" prop="createTime">
      </el-table-column>
      <el-table-column label="姓名" prop="ownerName">
      </el-table-column>
       <el-table-column label="账号" prop="ownerAccount">
      </el-table-column>
       <el-table-column label="手机" prop="ownerPhone">
      </el-table-column>
       <el-table-column label="所属门店" prop="storeListStr">
      </el-table-column>
      <!-- <el-table-column label="启用/禁用">
        <template slot-scope="scope">
          <admin-switch switchToggle="0"></admin-switch>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click.native="editManager(scope.row)" v-permission="'18316176-a0d7-46fe-a207-3b1311b9d382'">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { deepCopy } from 'common/utils';

// import moment from 'moment';

import AdminSwitch from 'components/AdminSwitch';

export default {
  components: {
    AdminSwitch
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach( (item) => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
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
    };
  },
  methods: {
    editManager(row) {
      this.$router.push({path: `/storePart/manager?editManager=${row.id}`})
    },
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
.storeTable {
  width: 100%;
  height: 100%;
}
</style>

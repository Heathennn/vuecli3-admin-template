<template>
  <div class="errorTable">
    <el-table :data="datas" style="width: 100%" :header-cell-style="headStyle">
      <el-table-column label="上报时间" prop="createTime">
      </el-table-column>
      <el-table-column label="设备ID" prop="facilityId">
      </el-table-column>
      <el-table-column label="设备名称" prop="facilityName">
      </el-table-column>
      <el-table-column label="所属门店" prop="storeName">
      </el-table-column>
       <el-table-column label="异常报备" prop="abnormalCode">
      </el-table-column>
       <el-table-column label="路径" prop="source" width="80">
      </el-table-column>
      <el-table-column label="状态" prop="handleStatus">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click.native="checkErrorDetail(scope.row)" v-permission="'5454e38b-8cab-4b3c-aa2b-975be4c82690'">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
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
    datas() {
      let list = deepCopy(this.tableData);
      // console.log('异常设备', list);
      list.forEach( (item, index) => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        item.source = item.source == 1 ? '系统' : item.source == 2 ? '店长' : item.source == 3 ? '用户' : '';
        item.handleStatus = item.handleStatus == 1 ? '待处理' : item.handleStatus == 2 ? '处理中' : item.handleStatus == 3 ? '已处理' : '';
      })
      return list;
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
    checkErrorDetail(row) {
      this.$router.push( {path: `/operation/error?errorDetail=${row.id}`});
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

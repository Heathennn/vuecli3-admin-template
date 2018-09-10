<template>
  <div class="errorTable">
    <el-table :data="datas" style="width: 100%" :header-cell-style="headStyle">
      <el-table-column label="时间" prop="createTime">
      </el-table-column>
      <el-table-column label="所属门店" prop="storeName">
      </el-table-column>
      <el-table-column label="用户" prop="userName">
      </el-table-column>
      <el-table-column label="设备类型" prop="facilityType">
      </el-table-column>
       <el-table-column label="设备名称" prop="facilityName">
      </el-table-column>
       <el-table-column label="异常类型" prop="abnormalType">
      </el-table-column>
      <el-table-column label="状态" prop="dealStatus">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="checkDetail(scope.row)" v-permission="'51bf3914-a8ea-4b11-ae7b-ef74031b7f23'">查看详情</el-button>
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
      list.forEach( (item, index) => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        item.userName = item.userInfo.nickname;
        item.facilityType = item.facilityType == 1 ? '运动设备' : item.facilityType == 2 ? '弱电设备' : item.facilityType == 0 ? '其他设备' : '其他设备';
        item.dealStatus = item.dealStatus == 1 ? '待处理' : item.dealStatus == 2 ? '已处理' : ''
      });
      return list;
    }
  },
  data() {
    return {
      headStyle: {
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
    checkDetail(row) {
      this.$router.push({path: `/service/feedback?uploadErrorDetail=${row.id}`});
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

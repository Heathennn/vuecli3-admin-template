<template>
  <div style="width: 100%">
    <el-table :data="datas" style="width: 100%">
      <el-table-column prop="createTime" label="上报时间" sortable>
      </el-table-column>
      <el-table-column prop="storeName" label="门店">
      </el-table-column>
      <el-table-column prop="alarmCode" label="异常代码">
      </el-table-column>
      <el-table-column prop="alarmType" label="类型">
      </el-table-column>
      <el-table-column prop="alarmDesc" label="描述">
      </el-table-column>
      <el-table-column prop="name" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="getZoom(scope.$index, scope.row)" v-permission="'f5f180a8-e4a0-4e6d-9eec-adf88e88eb06'">查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
// import moment from 'moment';

import { deepCopy } from 'common/utils';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getZoom(index, row) {
      this.$router.push({ path: `/monitor/securezoom?ZoomDetail=${row.id}` }); 
    }
  },
  data() {
    return {};
  },
  computed: {
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach((item, index) => {
        item.alarmType =
          item.alarmType == 1
            ? '陌生人闯入'
            : item.alarmType == 2 ? '安全画面' : '';
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
      });
      return list;
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

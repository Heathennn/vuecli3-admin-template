<template>
  <div style="width: 100%">
    <el-table :data="datas" style="width: 100%">
      <el-table-column prop="createTime" label="上报时间" sortable>
      </el-table-column>
      <el-table-column prop="storeName" label="门店">
      </el-table-column>
      <el-table-column prop="alarmCode" label="异常代码">
      </el-table-column>
      <el-table-column prop="alarmName" label="类型">
      </el-table-column>
      <el-table-column prop="alarmDesc" label="描述">
      </el-table-column>
      <el-table-column prop="dealStatus" label="状态">
      </el-table-column>
      <el-table-column prop="name" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="getStranger(scope.$index, scope.row)" v-permission="'a3d94429-0305-4318-8e52-5d10cda6b3fb'">查看详情</el-button>
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
  methods: {
    getStranger(index, row) {
      //console.log('11', row);
      this.$router.push({ path: `/monitor/stranger?strangerTotal=${row.id}` });
    },
  },
  computed: {
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach((item, index) => {
        item.dealStatus =
          item.dealStatus == 1
            ? '待处理'
            : item.dealStatus == 2 ? '已处理' : '';
              item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
      });
      return list;
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

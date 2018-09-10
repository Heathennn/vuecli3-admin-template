<template>
  <el-table :data="datas" style="width: 100%">
    <el-table-column prop="createTime" label="创建日期">
    </el-table-column>
    <el-table-column prop="exceptionType" label="代码类型">
    </el-table-column>
    <el-table-column prop="abnormalCode" label="异常代码">
    </el-table-column>
    <el-table-column prop="exceptionSource" label="异常来源">
    </el-table-column>
    <el-table-column prop="abnormalType" label="异常类型">
    </el-table-column>
    <el-table-column prop="eventType" label="事件定义">
    </el-table-column>
    <el-table-column prop="abnormalDescribe" label="描述">
    </el-table-column>
    <el-table-column prop="handlePlan" label="建议处理">
    </el-table-column>
    <el-table-column label="编辑" v-permission="'751176b2-d7f3-4ad8-800e-2544a92435e7'">
    </el-table-column>
  </el-table>
</template>

<script>

import { deepCopy } from 'common/utils';

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
      list.forEach((item, index) => {
        item.abnormalType =
          item.abnormalType == 1
            ? '设备异常'
            : item.abnormalType == 2 ? '门店应急' : '安防报警';
        item.exceptionSource =
          item.exceptionSource == 0
            ? '无异常'
            : item.exceptionSource == 1
              ? '触键异常'
              : item.exceptionSource == 2 ? '主板设备异常' : '接口异常';
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
      });
      return list;
    }
  },
  data() {
    return {};
  }
};
</script>
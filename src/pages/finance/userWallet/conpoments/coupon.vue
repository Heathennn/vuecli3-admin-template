<template>
  <div>
    <el-table :data="datas" style="width: 100%">
      <el-table-column prop="createTime" label="领取日期">
      </el-table-column>
      <el-table-column prop="couponCode" label="编码">
      </el-table-column>
      <el-table-column prop="couponTag" label="名称">
      </el-table-column>
      <el-table-column prop="useTimeStart" label="使用开始时间">
      </el-table-column>
      <el-table-column prop="useTimeEnd" label="使用结束时间">
      </el-table-column>
      <el-table-column prop="couponStatus" label="状态">
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
      list.forEach((item, index) => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        item.couponStatus =
          item.couponStatus == 1
            ? '未领取'
            : item.couponStatus == 2
              ? '待使用'
              : item.couponStatus == 3
                ? '已使用'
                : item.couponStatus == 4
                  ? '已删除'
                  : item.couponStatus == 5
                    ? '冻结'
                    : item.couponStatus == 6 ? '已过期' : '';
        item.useTimeStart = moment(item.useTimeStart).format('YYYY-MM-DD HH:mm:ss');
        item.useTimeEnd = moment(item.useTimeEnd).format('YYYY-MM-DD HH:mm:ss')
      });
      return list;
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>

</style>

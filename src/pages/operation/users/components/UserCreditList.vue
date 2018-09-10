<template>
<div>
  <el-dialog title="信用分记录" :visible.sync="dialogVisible" center width="60%">
    <el-table :data="datas" style="width: 100%;">
      <el-table-column label="时间" prop="createTime">
      </el-table-column>
      <el-table-column prop="event" label="事件">
      </el-table-column>
      <el-table-column prop="creditScore" label="信用分">
      </el-table-column>
    </el-table>
  </el-dialog>
</div>
</template>

<script>
import { deepCopy } from 'common/utils';

// import moment from 'moment';

export default {
  props: {
    // dialogVisible: {
    //   type: Boolean,
    //   default: false
    // },
    tableData: {
      type: [Array,Object],
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      // this._dialogVisible = this.dialogVisible;
    });
  },
  computed: {
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach((item, index) => {
        // console.log(item)
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        item.event = item.sceneDescribe + item.scoreChange;
        item.creditScore = item.scoreAfter;
      });
      return list;
    }
  },
  methods: {
    changeStatus(boolean) {
      this.dialogVisible = boolean;
    },
  }
};
</script>

<style lang="scss" scoped>

</style>

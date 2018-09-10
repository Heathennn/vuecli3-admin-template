<template>
  <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column type="selection">
    </el-table-column>
    <el-table-column label="用户ID" >
      <template slot-scope="scope">{{ scope.row.id }}</template>
    </el-table-column>
    <el-table-column prop="name" label="用户昵称" >
      <template slot-scope="scope">
        <div class="username">{{scope.row.name}}</div>
        <div>
          <el-tag type="info" :style="`color: red; font-size: 10px`">一级用户</el-tag>
          <el-tag type="info" :style="`color: red; font-size: 10px`">一级用户</el-tag>
          <el-tag type="info" :style="`color: red; font-size: 10px`">一级用户</el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别">
    </el-table-column>
    <el-table-column prop="record" label="健身档案">
    </el-table-column>
    <el-table-column prop="credit" label="信用分">
    </el-table-column>
    <el-table-column prop="status" label="状态">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <a href="###">查看</a>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      tableData3: [
        {
          id: '001',
          name: '王小虎',
          sex: '男',
          record: '有',
          credit: '90',
          status: '正常'
        }
      ],
      multipleSelection: []
    };
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
    }
  }
};
</script>

<style lang="scss" scoped>

</style>

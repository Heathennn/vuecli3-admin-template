<template>
  <div class="errorTable">
    <el-table :data="tableData" style="width: 100%" :header-cell-style="headStyle">
      <el-table-column label="ID" prop="id">
      </el-table-column>
      <el-table-column label="问题" prop="title">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="checkHelp(scope.row)" v-permission="'04eaa39a-4f72-495e-8753-6d6da633a7b9'">编辑</el-button>
          <el-button @click="remove(scope.row)" v-permission="'f9619899-4fab-4b4e-975f-527fc3e74d98'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
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
    ...mapActions(['removeHelp', 'getHelpList']),
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
    checkHelp(row) {
      let param = JSON.stringify(row);
      this.$router.push({path: `/service/helpCenter?helpDetail=${param}`})
    },
    remove(row) {
      this.removeHelp({
        id: row.id
      }).then( () => {
        this.$notify.success('删除帮助成功');
        this.getHelpList();
      }) 
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

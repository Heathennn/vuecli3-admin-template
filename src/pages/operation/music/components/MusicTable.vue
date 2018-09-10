<template>
  <el-table ref="multipleTable" :data="datas" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
    <!-- <el-table-column type="selection">
    </el-table-column> -->
    <el-table-column label="ID" prop="id">
    </el-table-column>
    <el-table-column prop="createTime" label="上传时间">
    </el-table-column>
    <el-table-column prop="musicName" label="名称">
    </el-table-column>
    <el-table-column prop="musicUrl" label="输出地址">
    </el-table-column>
    <el-table-column prop="musicLength" label="大小">
      <template slot-scope="scope">
        {{scope.row.musicLength}}MB
      </template>
    </el-table-column>
     <el-table-column label="操作">
       <template slot-scope="scope">
         <el-button type="danger" plain @click="remove(scope.row)" v-permission="'1c61cc40-de8e-4e0b-8541-3c237f9139f9'">删除</el-button>
       </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { deepCopy } from 'common/utils';

// import moment from 'moment';

import { removeMusic } from 'api/operation/music';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },  
  data() {
    return {
      multipleSelection: []
    };
  },
  computed: {
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach( (item, index) => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
      })
      return list;
    }
  },
  methods: {
    remove(row) {
      if (confirm('确定要删除吗?')) {
        removeMusic({
          id: row.id
        }).then( (res) => {
          if (res.data.code == 200) {
            this.$notify.success('删除成功')
            this.$emit('refresh')
          } else {
            this.$notify.error('删除失败')
          }
        }).catch( () => {
          this.$notify.error('删除失败')
        })
      }
    },
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

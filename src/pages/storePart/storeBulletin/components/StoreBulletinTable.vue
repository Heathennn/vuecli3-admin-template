<template>
  <el-table :data="datas" style="width: 100%">
      <el-table-column label="门店ID" prop="storeId">
      </el-table-column>
      <el-table-column label="门店名称" prop="storeName">
      </el-table-column>
      <el-table-column label="公告标题" prop="topic">
        <template slot-scope="scope">
          <div class="ellipsis">{{scope.row.topic}}</div>
        </template>
      </el-table-column>
      <el-table-column label="公告内容" prop="topicContent">
        <template slot-scope="scope">
          <div class="ellipsis">{{scope.row.topicContent}}</div>
        </template>
      </el-table-column>
      <el-table-column label="发布人" prop="adminName">
      </el-table-column>
      <el-table-column label="有效期" prop="time" width="300">
      </el-table-column>
      <el-table-column label="状态" prop="status">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="checkoutHistory(scope.row)" v-permission="'9e93064d-26f4-4038-97b1-f4312653f8d3'">历史公告</el-button>
        </template>
      </el-table-column>
    </el-table>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    datas() {
      let list  = this.tableData.concat();
      list.forEach( (item, index) => {
        item.time = this.moment(item.startTime).format('YYYY-MM-DD HH:mm:ss') + '至' + this.moment(item.endTime).format('YYYY-MM-DD HH:mm:ss');
        item.status = item.status == 1 ? '进行中' : item.status == 2 ? '未到期' : item.status == 3 ? '已过期' : item.status == 4 ? '已终止' : '';

      })
      return list;
    }
  },
  methods: {
    checkoutHistory(storeInfo) {
      this.$router.push({path: `/storePart/historyBulletin?storeId=${storeInfo.storeId}&storeName=${storeInfo.storeName}`})
    }
  }
}
</script>

<style lang="scss" scoped>

.ellipsis{//单行文本溢出
  overflow: hidden;
  text-overflow:ellipsis;//文本溢出显示省略号
  white-space:nowrap;//文本不会换行（单行文本溢出）
  // width:130px;
  // background-color: red;
}
</style>

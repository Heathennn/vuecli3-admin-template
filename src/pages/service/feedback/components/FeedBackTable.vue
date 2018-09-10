<template>
  <div class="errorTable">
    <el-table :data="datas" style="width: 100%" :header-cell-style="headStyle">
      <el-table-column label="时间" prop="createTime">
      </el-table-column>
      <el-table-column label="所属门店" prop="storeName">
      </el-table-column>
      <el-table-column label="用户" prop="username">
      </el-table-column>
      <el-table-column label="问题类型" prop="type">
      </el-table-column>
       <el-table-column label="描述" prop="content">
      </el-table-column>
      <el-table-column label="状态" prop="dealStatus">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="checkDetail(scope.row)" v-permission="'6fde119c-9866-4953-8048-ae2b37c3c122'">查看详情</el-button>
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
        item.dealStatus = item.dealStatus == 1 ? '待处理' : item.dealStatus == 2 ? '已处理' : '无';
        item.username = item.userInfo.nickname;
        // 1：建议；2：投诉；3：app问题；4：健身房问题；5：其他）
        item.type = item.type == 1 ? '建议' : item.type == 2 ? '投诉' : item.type == 3 ? 'app问题' : item.type == 4 ? '健身房问题' : item.type == 5 ? '其他' : ''
      })
      return list;
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
      this.$router.push( { path: `/service/feedback?feedbackDetail=${row.id}`})
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

<template>
  <div class="protalPage">
    <div class="activityPage">
      <div class="title">
        活动管理
      </div>
      <div class="selects">
        <div class="selectTitle">状态 </div>
        <div class="statusSelect">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="searchBar">
          <el-input placeholder="活动名称" v-model="activityName">
          </el-input>
        </div>
        <div class="searchBar">
          <el-input placeholder="活动ID" v-model="activityID">
          </el-input>
        </div>
        <div class="buttons">
          <el-button type="primary">搜索</el-button>
        </div>
      </div>
      <div class="messageTableBox" v-permission="'a21e24ba-5a63-470d-8c84-99a7553b736e'">
        <activity-table></activity-table>
        <div class="paginationBox">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="0">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActivityTable from './components/ActivityTable';

export default {
  components: {
    ActivityTable
  },
  data() {
    return {
      time: '',
      currentPage: 1,
      activityName: '',
      activityID:'',
      options: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: '1',
          label: '未开始'
        },
        {
          value: '2',
          label: '进行中'
        },
        {
          value: '3',
          label: '已暂停'
        },
        {
          value: '4',
          label: '已结束'
        },
      ],
      value: 'all'
    };
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.activityPage {
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .title {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
    }
  }
  .selects {
    @include flexbox;
    box-sizing: border-box;
    padding: {
      top: 20px;
      bottom: 20px;
    }
  }
  .selectTitle {
    line-height: 40px;
    margin: {
      right: 10px;
    }
  }
  .statusSelect {
    margin: {
      right: 20px;
    }
  }
  .timeSelect {
    margin: {
      right: 100px;
    }
  }
  .messageTableBox {
  }
}
</style>

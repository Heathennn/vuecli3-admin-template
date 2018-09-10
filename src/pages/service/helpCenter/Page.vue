<template>
  <div class="protalPage" v-if="isLoadSubPage">
    <div class="feedbackPage">
      <div class="title">
        帮助中心
      </div>
      <div class="selects">
        <el-button type="primary" @click="_addHelp" v-permission="'a51e358c-4732-42bd-9751-a7179b9b091b'">新建帮助</el-button>
      </div>
      <div class="messageTableBox" v-permission="'b0cf3185-c7e7-4c18-9b3a-6e5e64bb7820'">
        <help-center-table :tableData="helpList"></help-center-table>
      </div>
      <!-- <div class="paginationBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="0">
        </el-pagination>
      </div> -->
    </div>
  </div>
   <help-center-sub-page v-else :subPageInfo="routeQuery"
                         @refreshHelpCenterList="fetchData"></help-center-sub-page>
</template>

<script>
import HelpCenterTable from './components/HelpCenterTable';

import HelpCenterSubPage from './components/HelpCenterSubPage';

import { mapState, mapActions } from 'vuex';

export default {
  components: {
    HelpCenterTable,
    HelpCenterSubPage
  },
  computed: {
    ...mapState({
      helpList: state => state.helpCenter.helpList
    }),
    routeQuery() {
      return (
        Object.keys(this.$route.query)[0] +
        '=' +
        this.$route.query[Object.keys(this.$route.query)[0]]
      );
    },
    isLoadSubPage() {
      if (Object.keys(this.$route.query)[0]) {
        return false;
      } else {
        return true;
      }
    }
  },
  data() {
    return {
      time: '',
      currentPage4: 1,
      deviceStatus: '已绑设备',
      input: '',
    };
  },
  methods: {
    ...mapActions(['getHelpList', 'addHelp']),
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    },
    _addHelp() {
      this.$router.push({ path: '/service/helpCenter?helpDetail'})
    },
    fetchData() {
this.getHelpList();
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchData();
      });
    })
  },
  mounted() {
    this.$nextTick( () => {
      this.fetchData();
      // this.addHelp({
      //   title: '测试帮助',
      //   content: '内容内容内容内容内容内容内容'
      // })
    })
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.feedbackPage {
  background-color: #ffffff;
  width: 100%;
  min-height: 100%;
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
  .paginationBox {
    padding: {
      top: 20px;
    }
  }
}
</style>

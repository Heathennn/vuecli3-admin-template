<template>
  <div class="protalPage">
    <div class="usersPage">
      <div class="title">
        用户管理
      </div>
      <div class="filter_search">
        <el-input placeholder="输入手机号" v-model="userMobile" @keyup.enter.native="searchByMobile" style="width: 200px">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-input placeholder="输入用户昵称" v-model="nickname" @keyup.enter.native="searchByMobile" style="width: 200px">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-input placeholder="输入用户ID" v-model="userId" @keyup.enter.native="searchByMobile" style="width: 200px">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" @click="searchByMobile">搜索</el-button>
      </div>
      <div class="userSelectors">

        <div class="usersSubTitle">押金</div>
        <el-select v-model="depositvalue" placeholder="请选择" style="width: 100px; margin-right: 10px;">
          <el-option v-for="item in depositOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>

        <div class="usersSubTitle">身体报告</div>
        <el-select v-model="reportvalue" placeholder="请选择" style="width: 100px; margin-right: 10px;">
          <el-option v-for="item in reportOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>

        <div class="usersSubTitle">信用分</div>
        <div class="selector_item" style="margin-right: 20px">
        <el-dropdown split-button trigger="click" @command="handleClick" :hide-on-click="false">
          {{percentLabel}}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, index) in creditOptions" :command="item" :key="index">{{item.label}}</el-dropdown-item>
            <el-dropdown-item :command="false">
              <div>自定义</div>
              <el-input style="width: 110px" v-model="customPercent.min">
                <template slot="append">分</template>
              </el-input>
              至
              <el-input style="width: 110px" v-model="customPercent.max">
                <template slot="append">分</template>
              </el-input>
              <el-button type="primary" size="small" @click.native.stop="custom">确认</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      </div>

      <div class="deviceTableBox pageTable" v-loading="isFetchingData" v-permission="'2963b5cf-7c04-4820-88f9-1d00608c01fa'">
        <user-table :tableData="users"></user-table>
        <div class="paginationBox">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import UserTable from './components/UserTable';

import { mapState, mapActions } from 'vuex';

export default {
  components: {
    UserTable,
  },
  computed: {
    ...mapState({
      users: state => state.users.users,
      isFetchingData: state => state.users.isFetchingData,
      pageSize: state => state.users.pageSize,
      pageNum: state => state.users.pageNum,
      total: state => state.users.total
    }),
  },
  data() {
    return {
      userMobile:'',
      nickname: '',
      userId: '',
      currentPage4: 1,
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      curTotal: 0,
      userStatus: '全部',
      sexvalue: '', // 性别
      depositvalue: 'all', // 是否已交押金
      reportvalue: 'all', // 是否有身体报告
      creditvalue: 'all', // 信用分阈值
      input: '',
      // 选择男女
      sexOptions: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: '1',
          label: '男'
        },
        {
          value: '0',
          label: '女'
        }
      ],
      reportOptions: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 0,
          label: '无'
        },
        {
          value: 1,
          label: '有'
        }
      ],
      // 押金状态
      depositOptions: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 0,
          label: '未交'
        },
        {
          value: 1,
          label: '已交'
        }
      ],
      // 信用分
      percentMin: '',
      percentMax: '',
      percentLabel: '全部',
      customPercent: {
        isCustom: true,
        max: '',
        min: '',
      },
      creditOptions: [
        {
          command: {
            max: 1000,
            min: 0
          },
          label: '全部'
        },
        {
          command: {
            max: 100,
            min: 0
          },
          label: '100分以下'
        },
        {
          command: {
            max: 80,
            min: 0
          },
          label: '80分以下'
        },
        {
          command: {
            max: 60,
            min: 0
          },
          label: '60分以下'
        },
        {
           command: {
            max: 40,
            min: 0
          },
          label: '40分以下'
        },
        {
           command: {
            max: 20,
            min: 0
          },
          label: '20分以下'
        },
      ]
    };
  },
  watch: {
    percentMin() {
      this.fetchData();
    },
    percentMax() {
      this.fetchData();
    },
    depositvalue() {
      this.fetchData();
    },
    reportvalue() {
      this.fetchData();
    },
  },
  methods: {
    ...mapActions(['getUsers']),
    handleClick(item, vm) {
      if (item) {
        this.percentLabel = item.label;
        this.percentMin = item.command.min;
        this.percentMax = item.command.max;
        this.customPercent.min = '';
        this.customPercent.max = '';
      }
    },
    custom() {
      if (!this.customPercent.min || !this.customPercent.max || isNaN(Number(this.customPercent.min)) || isNaN(Number(this.customPercent.max))) {
        this.$notify.error('区间不能为空,且为整数');
        return;
      }
      if (this.customPercent.min >= this.customPercent.max) {
        this.$notify.error('起始百分比应小于结束百分比');
        this.customPercent.min = '';
        this.customPercent.max = '';
        return;
      }
      if (Number(this.customPercent.min) < 0 || Number(this.customPercent.max) > 999) {
         this.$notify.error('起始百分比不能小于0,结束百分比不能大于999');
         this.customPercent.min = '';
         this.customPercent.max = '';
         return;
      }
      this.percentLabel = `${parseInt(this.customPercent.min)}分-${parseInt(this.customPercent.max)}分`;
      this.percentMin = parseInt(this.customPercent.min);
      this.percentMax = parseInt(this.customPercent.max);
    },
    searchByMobile() {
      this.depositvalue=  'all'; // 是否已交押金
      this.reportvalue= 'all';// 是否有身体报告
      this.creditvalue= 'all';
      if (this.userMobile) {
        if (!this.isPhoneAvailable(this.userMobile)) return this.$notify.error('请输入有效的手机号');
      }
      this.getUsers({
        nickname: this.nickname,
        userId: this.userId,
        mobile: this.userMobile
      }).then( () => {
        // this.userMobile = '';
        this.mapPagination();
      })
    },
    isPhoneAvailable(pone) {
      var myreg = /^[1][3,4,5,7,8,6,9][0-9]{9}$/;
      if (!myreg.test(pone)) {
       return false;
      } else {
       return true;
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.curPageSize = val;
      this.fetchData()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage4 = val;
      this.fetchData();
    },
     mapPagination() {
      this.currentPage4 = this.pageNum;
      this.curTotal = this.total;
      this.curPageSize = this.pageSize;
    },
    // depositvalue: '', // 是否已交押金
    //   reportvalue: '', // 是否有身体报告
    //   creditvalue: ''
    fetchData() {
      this.userMobile = '';
      this.getUsers(this.computeParams()).then(() => {
        this.mapPagination();
      });
    },
    computeParams() {
      let params = {};
      if (this.depositvalue !== 'all') {
        params.depositStatus = this.depositvalue;
      }
      if (this.reportvalue !== 'all') {
        params.reportStatus = this.reportvalue;
      }
      params.startScore = this.percentMin;
      params.endScore = this.percentMax;
      params.page = this.currentPage4;
      params.size = this.curPageSize;
      return params;
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
    this.$nextTick(() => {
      this.fetchData();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.usersPage {
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
  }

  .radioSelect {
    padding: {
      top: 20px;
      bottom: 20px;
    }
  }
  .userPageContent {
    width: 100%;
    @include flexbox;
    .tablePart {
      flex: 1;
    }
    .statistics {
      width: 200px;
      // background-color: #999999;
      box-sizing: border-box;
      padding: {
        top: 30px;
      }
      .addLabel {
        margin: {
          bottom: 30px;
        }
      }
      .usersList {
        width: 100%;
        .allUsers {
          width: 100%;
          height: 50px;
          background-color: #e5e5e5;
          text-align: center;
          line-height: 50px;
        }
        .user {
          width: 100%;
          height: 30px;
          text-align: center;
          line-height: 30px;
          font-size: 15px;
          border: {
            bottom: 1px solid #e5e5e5;
          }
        }
      }
    }
  }
}

.userSelectors {
  width: 100%;
  @include flexbox;
  @include align-items(center);
  box-sizing: border-box;
  padding: {
    top: 20px;
    bottom: 20px;
  }
}

.usersSubTitle {
  box-sizing: border-box;
  padding: {
    right: 10px;
  }
}

.filter_search {
  padding: {
    top: 20px;
  }
}
</style>

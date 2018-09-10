<template>
  <div class="userPlanPage">
    <sub-title title="用户训练计划"></sub-title>
    <div class="selectors" style="margin-top: 20px">
      <el-input v-model="userName" placeholder="搜索用户昵称" style="width: 200px; margin-right: 10px;"></el-input>
      <el-input v-model="userPhone" placeholder="搜索用户手机号" style="width: 200px; margin-right: 10px;"></el-input>
      <el-input v-model="userId" placeholder="搜索用户ID" style="width: 200px; margin-right: 10px;"></el-input>
      <el-button type="primary" @click="fetchPlanList">搜索</el-button>
    </div>
    <div class="selectors" style="margin-top: 20px;">
      <div class="selector_item">
        <div class="selector_item_title">周数</div>
        <el-select v-model="cycleNum" placeholder="请选择">
          <el-option v-for="item in cycleOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="selector_item">
        <div class="selector_item_title">状态</div>
        <el-select v-model="tariningStatus" placeholder="请选择">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="selector_item">
        <div class="selector_item_title">完成</div>
        <el-dropdown split-button trigger="click" @command="handleClick" :hide-on-click="false">
          {{percentLabel}}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, index) in percentOptions" :command="item" :key="index">{{item.label}}</el-dropdown-item>
            <el-dropdown-item :command="false">
              <div>自定义</div>
              <el-input style="width: 110px" v-model="customPercent.min">
                <template slot="append">%</template>
              </el-input>
              至
              <el-input style="width: 110px" v-model="customPercent.max">
                <template slot="append">%</template>
              </el-input>
              <el-button type="primary" size="small" @click.native.stop="custom">确认</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="tableBox" v-loading="isLoadingData" v-permission="'94524f86-56a4-4575-9b54-66bb6b1e2e0c'">
      <el-table :data="userPlans" style="width: 100%">
          <el-table-column label="时间" prop="createTime">
            <template slot-scope="scope">
              {{moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column label="用户ID" prop="userId">     
          </el-table-column>
          <el-table-column label="用户昵称" prop="userInfo.nickname">
          </el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              {{scope.row.userInfo.sex == 1 ? '男' : '女'}}
            </template>
          </el-table-column>
          <el-table-column label="手机" prop="userInfo.mobile">
          </el-table-column>
          <el-table-column label="训练计划名称" prop="planName">
          </el-table-column>
          <el-table-column label="周数" prop="cityName">
          </el-table-column>
           <el-table-column label="状态" prop="trainStatus">
             <template slot-scope="scope">
               {{scope.row.trainStatus == 1 ? '进行中': scope.row.trainStatus == 2 ? '已过期':scope.row.trainStatus == 3 ? '已终止':'未开始'}}
             </template>
          </el-table-column>
           <el-table-column label="完成" prop="completePercent">
             <template slot-scope="scope">
               {{parseFloat(scope.row.completePercent) * 100 + '%'}}
             </template>
          </el-table-column>
          <el-table-column label="操作">
             <template slot-scope="scope">
               <el-button type="primary" plain @click="jumpTo(scope.row)" v-permission="'8d81f81c-e072-4708-9cc4-9be155448d46'">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
          </el-pagination>
    </div>
  </div>
</template>

<script>
import { getUserPlanList } from 'api/user/userPlan';

import SubTitle from 'components/SubTitle';

export default {
  data() {
    return {
      userId: '',
      userName: '',
      userPhone: '',
      currentPage: 1,
      currentSize: 10,
      curTotal: 0,
      userPlans: [],
      tariningStatus: 0,
      cycleNum: 'all',
      cycleOptions: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: '2',
          label: '2周'
        },
        {
          value: '3',
          label: '3周',
        },
        {
          value: '4',
          label: '4周'
        }
      ], 
      statusOptions: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '进行中',
          value: 1,
        },
        {
          label: '已过期',
          value: 2,
        },
        {
          label: '已终止',
          value: 3
        }
      ],
      percentMin: '',
      percentMax: '',
      percentLabel: '全部',
      customPercent: {
        isCustom: true,
        max: '',
        min: '',
      },
      percentOptions: [
        {
          command: {
            max: 1,
            min: 0
          },
          label: '全部'
        },
        {
          command: {
            max: 1,
            min: 0.8
          },
          label: '80%-100%'
        },
        {
          command: {
            max: 0.8,
            min: 0.6
          },
          label: '60%-80%'
        },
        {
           command: {
            max: 0.6,
            min: 0.4
          },
          label: '40%-60%'
        },
        {
           command: {
            max: 0.4,
            min: 0.2
          },
          label: '20%-40%'
        },
        {
           command: {
            max: 0.2,
            min: 0
          },
          label: '0%-20%'
        }
      ],
      isLoadingData: false
    };
  },
  components: {
    SubTitle
  },
  watch: {
    cycleNum() {
      this.fetchPlanList();
    },
    tariningStatus() {
      this.fetchPlanList();
    },
    percentMin() {
      this.fetchPlanList();
    }
  },
  methods: {
    handleSizeChange(val) {
      this.currentSize = val;
      this.fetchPlanList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchPlanList();
    },
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
      if (!this.customPercent.min || !this.customPercent.max) {
        this.$notify.error('输入不能为空');
        return;
      }
      if (isNaN(Number(this.customPercent.min)) || isNaN(Number(this.customPercent.max)) || !/^\d+$/.test(this.customPercent.max) ||  !/^\d+$/.test(this.customPercent.min)) {
        this.$notify.error('请输入整数');
        return;
      }
      if (this.customPercent.min >= this.customPercent.max) {
        this.$notify.error('起始百分比应小于结束百分比');
        this.customPercent.min = '';
        this.customPercent.max = '';
        return;
      }
      this.percentLabel = `${parseInt(this.customPercent.min)}%-${parseInt(this.customPercent.max)}%`;
      this.percentMin = parseInt(this.customPercent.min) / 100;
      this.percentMax = parseInt(this.customPercent.max) / 100;
    },
    jumpTo(row) {
      this.$router.push({path: `/user/userPlanDetail?userTrainId=${row.id}&userId=${row.userId}&nickname=${row.userInfo.nickname}&mobile=${row.userInfo.mobile}`})
    },
    createParams() {
      let params = {};
      if(this.userId || this.userName || this.userPhone) {
        params.page = 1;
      } else {
        params.page = this.currentPage;
      }
      params.size = this.currentSize;
      if (this.userId) {
        params.userId = this.userId;
      }
      if (this.userName) {
        params.nickName = this.userName;
      }
      if (this.userPhone) {
        params.phone = this.userPhone;
      }
      if (this.percentMin || this.percentMax) {
        params.percentMin = this.percentMin;
        params.percentMax = this.percentMax;
      }
      if (this.cycleNum != 'all') {
        params.cycleId = this.cycleNum;
      }
      params.trainStatus = this.tariningStatus;
      return params;
    },
    mapPagination(res) {
      if (!res) {
        this.currentPage = 1;
        this.currentSize = 10;
        this.curTotal = 0;
        return;
      }
      this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
      this.currentSize = res.pageSize;
      this.curTotal = res.total;
    },
    fetchPlanList() {
      this.isLoadingData = true;
      getUserPlanList(this.createParams()).then( (res) => {
        this.userPlans = res.data ? res.data.data.list : [];
        this.mapPagination(res.data.data);
        this.isLoadingData = false;
      }).catch( () => {
        this.isLoadingData = false;
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchPlanList();
      });
    })
  },
  mounted() {
    this.$nextTick( () => {
      this.fetchPlanList();
    })
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.userPlanPage {
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
}

.selectors {
  @include flexbox;
  .selector_item {
    @include flexbox;
    @include align-items(center);
    margin: {
      right: 20px;
    }
    .selector_item_title {
      width: 40px;
    }
  }
}
</style>

<template>
  <div class="userDetailPage">
    <sub-title title="用户详情"></sub-title>
    <div class="userInfoBox">

      <div class="userInfo">
        <div class="user_head">
          <div class="head_img" :style="`background-image: url(${userInfo.headImg}); background-size: 100% 100%`"></div>
          <div class="head_des">用户头像</div>
        </div>
        <div class="user_baseInfo">
          <div class="user_ID user_item" style="border-top: 1px solid #e5e5e5">
            <!-- <span class="item_title">用户ID</span>:&nbsp;{{userInfo.user_id}} -->
            <div class="user_subItem">用户ID</div>
            <div class="user_content">{{userInfo.userId}}</div>
          </div>
          <div class="user_nickname user_item" style="border-top: 1px solid #e5e5e5">
            <!-- <span class="item_title">用户昵称</span>:&nbsp;{{userInfo.nickname}} -->
            <div class="user_subItem">用户昵称</div>
            <div class="user_content">{{userInfo.nickname}}</div>
          </div>
          <div class="user_sex user_item">
            <!-- <span class="item_title">性别</span>:&nbsp;{{userInfo.sex == 1 ? '男': '女'}} -->
            <div class="user_subItem">性别</div>
            <div class="user_content">{{userInfo.sex == 1 ? '男': '女'}}</div>
          </div>
          <div class="user_birthday user_item">
            <!-- <span class="item_title">生日</span>:&nbsp;{{userInfo.birthday}} -->
            <div class="user_subItem">生日</div>
            <div class="user_content">{{userInfo.birthday}}</div>
          </div>
          <div class="user_age user_item">
            <!-- <span class="item_title">年龄</span>:&nbsp;{{userInfo.age}} -->
            <div class="user_subItem">年龄</div>
            <div class="user_content">{{userInfo.age}}</div>
          </div>
          <div class="user_phone user_item">
            <!-- <span class="item_title">手机</span>:&nbsp;{{userInfo.mobile}} -->
            <div class="user_subItem">手机</div>
            <div class="user_content">{{userInfo.mobile}}</div>
          </div>
          <div class="user_createTime user_item">
            <!-- <span class="item_title">注册时间</span>:&nbsp;{{userInfo.createTime}} -->
            <div class="user_subItem">注册时间</div>
            <div class="user_content">{{userInfo.createTime}}</div>
          </div>
        </div>
      </div>

    </div>

    <div class="credit_score">
      <div class="score">
        信用分: {{userInfo.creditScore ? userInfo.creditScore : 0}}
      </div>
      <user-credit-list ref="userCreditList" :dialogVisible="dialogVisible" :tableData="creditInfo.list"></user-credit-list>
      <div class="creditList" @click="showCreditList">
        {{totalCredit}}条信用分记录 >>
      </div>
    </div>
    <div class="user_chart">
      <el-tabs tab-position="top" type="card">
        <el-tab-pane label="身体报告">
          <!-- <div>暂无身体报告</div> -->
          <user-body-report :sex="userInfo.sex == 1 ? '男': '女'"></user-body-report>
        </el-tab-pane>
        <el-tab-pane label="运动记录">
          <!-- <div>暂无运动记录</div>             -->
          <user-sport :userId="id"></user-sport>
        </el-tab-pane>
        <el-tab-pane label="训练计划">
          <div class="userTrainingPlan">
            <el-table :data="userTrainingPlan" style="width: 100%">
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
              <el-table-column label="每周运动频率" prop="cityName">
                <template slot-scope="scope">
                  {{scope.row.countDay}}天/周
                </template>
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
                  <el-button type="primary" plain @click="jumpTo(scope.row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import UserCreditList from './UserCreditList';

import UserBodyReport from './UserBodyReport';

import UserSport from './UserSport';

import SubTitle from 'components/SubTitle';

import { getUserPlanList } from 'api/user/userPlan';

export default {
  name: 'userDetail',
  data() {
    return {
      id: '',
      head_img: '',
      userInfo: {},
      dialogVisible: false,
      creditScore: 0,
      creditInfo: [],
      totalCredit: 0,
      userTrainingPlan: []
    };
  },
  components: {
    UserCreditList,
    UserBodyReport,
    UserSport,
    SubTitle
  },
  created() {
    this.id = this.$route.query.id;
    // console.log(this.id);
  },
  watch: {
    $route() {
      this.id = this.$route.query.id;
    }
  },
  methods: {
    ...mapActions(['getUserDetail', 'getUserCreditList']),
    jumpTo(row) {
      this.$router.push({
        path: `/user/userPlanDetail?userTrainId=${row.id}&userId=${row.userId}&nickname=${row.userInfo.nickname}&mobile=${row.userInfo.mobile}`
      });
    },
    showCreditList() {
      this.$refs.userCreditList.changeStatus(true);
    },
    fetchUserPlan() {
      getUserPlanList({
        userId: this.id
      }).then(res => {
        this.userTrainingPlan = res.data.data.list;
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getUserDetail({
        // 用户基本信息
        userId: this.id
      }).then(res => {
        this.userInfo = res.userInfo;
        this.creditScore = res.creditScore ? res.creditScore : 0;
      });

      this.getUserCreditList({
        // 信用分列表
        userId: this.id
      }).then(res => {
        this.totalCredit = res.total;
        this.creditInfo = res;
        this.getUserCreditList({
          userId: this.id,
          page: 1,
          size: this.totalCredit + 10
        }).then(res => {
          this.totalCredit = res.total;
          this.creditInfo = res;
        });
        // console.log('信用分列表', res);
      });
      this.fetchUserPlan();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.userDetailPage {
  // background-color: #ffffff;
  width: 100%;
  // min-height: calc(100% - 60px);
  box-sizing: border-box;
  padding: 20px;
  overflow-y: scroll;
}

.userTrainingPlan {
  box-sizing: border-box;
  padding: 10px;
}
.userDetailTitle {
  background-color: #ffffff;
  width: 100%;
  font-size: 30px;
  height: 50px;
  line-height: 50px;
  padding: 20px;
  .title {
    border: {
      bottom: 1px solid black;
    }
  }
}

.userInfoBox {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  background-color: #ffffff;
  .userInfo {
    @include flexbox;
    width: 100%;
    height: 250px;
    // border: 1px solid #e5e5e5;
    box-sizing: border-box;

    margin: {
      bottom: 30px;
    }
    .user_head {
      @include flexbox;
      @include flex-direction(column);
      @include justify-content(center);
      @include align-items(center);
      width: 250px;
      height: 250px;
      border: 1px solid #e5e5e5;
    }
    .head_img {
      width: 150px;
      height: 150px;
      background: #e5e5e5;
    }
    .head_des {
      text-align: center;
      font-size: 14px;
      color: #666666;
    }
    .user_baseInfo {
      @include flexbox;
      @include flex-wrap(wrap);
      height: 250px;
      width: 100%;
      .user_item {
        @include flexbox;
        box-sizing: border-box;
        width: 50%;
        height: 25%;
        box-sizing: border-box;
        border: {
          right: 1px solid #e5e5e5;
          bottom: 1px solid #e5e5e5;
        }
        .user_subItem {
          @include flexbox;
          @include justify-content(center);
          @include align-items(center);
          background-color: #e5e5e3;
          width: 40%;
          border: {
            right: 1px solid #e5e5e5;
          }
        }
        .user_content {
          @include flexbox;
          @include justify-content(center);
          @include align-items(center);
          width: 60%;
        }
      }
    }
  }
}
.item_title {
  color: #999999;
}

.user_chart {
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
}
.credit_score {
  width: 100%;
  background-color: #ffffff;
  @include flexbox;
  @include justify-content(space-between);
  border: 1px solid #e5e5e5;
  box-sizing: border-box;
  padding: 30px;
  margin: {
    top: 30px;
    bottom: 30px;
  }
}
.creditList {
  cursor: pointer;
  // color;
  font-size: 14px;
}
</style>

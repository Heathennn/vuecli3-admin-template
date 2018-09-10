<template>
  <div class="userPlanDetailPage">
    <div class="userInfo">
      <sub-title title="用户信息"></sub-title>
      <div class="userInfo_item" style="margin-top: 10px">
        <span style="width: 80px; display: inline-block">昵称</span>{{nickname}}</div>
      <div class="userInfo_item">
        <span style="width: 80px; display: inline-block">ID</span>{{userId}}</div>
      <div class="userInfo_item">
        <span style="width: 80px; display: inline-block">手机</span>{{mobile}}</div>
    </div>
    <el-dialog title="定制过程" :visible.sync="dialogVisible" width="50%" center>
      <el-table :data="processList" style="width: 100%">
        <el-table-column label="序号" type="index" width="100">
        </el-table-column>
        <el-table-column label="问题" prop="q">
        </el-table-column>
        <el-table-column label="回答" prop="a">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" type="primary">我知道了</el-button>
      </span>
    </el-dialog>
    <div class="planDetail">
      <sub-title title="训练计划详情"></sub-title>

      <div class="planDetailInfo">
        <a href="javascript:;" class="hyperlink processButton" @click="checkoutProcess">定制过程记录</a>
        <div style="font-size: 20px; font-weight: 600; padding-bottom: 15px;">{{planName}}</div>
        <div style="color: #999999; font-size: 14px;padding-bottom: 10px;">
          <span style="display:inline-block;margin-right: 20px;"> 状态: {{trainStatus == 1 ? '进行中': trainStatus == 2 ? '已过期':trainStatus == 3 ? '已终止':'未开始'}} </span>
          <span>时间: {{cycle}}</span>
        </div>
        <div class="planDetail_rate" style="color: #999999; font-size: 14px;padding-bottom:10px;">
          <span style="display:inline-block;margin-right: 20px;"> 完成: {{isNaN(completePercent * 100) ? '0%' : completePercent * 100 + '%'}} </span>
          <span>星级:
            <el-rate v-model="planRate" disabled text-color="#ff9900">
            </el-rate>
          </span>
        </div>
        <div class="planDetail_progress">
          <el-progress :percentage="isNaN(completePercent * 100) ? 0 : completePercent * 100"></el-progress>
        </div>
      </div>
      <div>
        <el-table :data="trainList" style="width: 100%">
          <el-table-column label="序号" prop="num">
          </el-table-column>
          <el-table-column label="运动日期" prop="trainDate">
            <template slot-scope="scope">
              <div>
                {{scope.row.trainDate}}
              </div>
              <div>
                {{formatDay(new Date(scope.row.trainDate).getDay())}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="训练内容" prop="userFacilityInfoList">
            <template slot-scope="scope">
              <div v-for="(facItem, index) in scope.row.userFacilityInfoList" :key="index" style="padding-top: 20px;padding-bottom:20px;border-bottom: 1px solid #e5e5e5">
                {{facItem.facilityName}}{{facItem.trainContent}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单项完成">
            <template slot-scope="scope">
              <div v-for="(facItem, index) in scope.row.userFacilityInfoList" :key="index" style="padding-top: 20px;padding-bottom:20px;border-bottom: 1px solid #e5e5e5">
                <span v-if="facItem.sportType != 3">
                  完成:{{(facItem.completePercent * 100) + '%'}}
                  <div class="plan_rate" style="">星评
                    <el-rate v-model="facItem.completeLevel" disabled text-color="#ff9900">
                    </el-rate>
                  </div>
                </span>
                 <span v-else>N/A</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="疲劳反馈" prop="userFacilityInfoList">
            <template slot-scope="scope">
              <div v-for="(facItem, index) in scope.row.userFacilityInfoList" :key="index" style="padding-top: 26px;padding-bottom:26px;border-bottom: 1px solid #e5e5e5">
                <span v-if="facItem.sportType != 3 && facItem.tiredFeedback">{{facItem.tiredFeedback}}</span> <span v-else>N/A</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="每日完成" prop="planName">
            <template slot-scope="scope">
              完成{{(scope.row.courseCompletePercent * 100) + '%'}} 
              <div class="plan_rate">星评
                <el-rate v-model="scope.row.courseCompleteLevel" disabled text-color="#ff9900">
                </el-rate>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>

<script>
import { getUserPlanDetail, getCustomProcess } from 'api/user/userPlan';

import SubTitle from 'components/SubTitle';

export default {
  name: 'planDetail',
  data() {
    return {
      dialogVisible: false,
      userTrainId: '',
      cycle: '',
      trainStatus: '',
      planRate: 0, // 星级
      planName: '',
      completePercent: 0, // 百分比
      trainList: [],
      processList: []
    };
  },
  components: {
    SubTitle
  },
  computed: {
    nickname() {
      return this.$route.query.nickname;
    },
    userId() {
      return this.$route.query.userId;
    },
    mobile() {
      return this.$route.query.mobile;
    }
  },
  methods: {
    checkoutProcess() {
      this.dialogVisible = true;
      this.fetchProcess(this.$route.query.userTrainId);
    },
    fetchDetail() {
      getUserPlanDetail({
        userTrainId: this.$route.query.userTrainId
      }).then(res => {
        // console.log(res);
        res.data.data.trainList.list.forEach((item, index) => {
          item.num = index + 1;
        })
        this.trainStatus = res.data.data.trainStatus;
        this.planName = res.data.data.planName;
        this.cycle = res.data.data.cycle;
        this.completePercent = res.data.data.completePercent;
        this.planRate = res.data.data.completeLevel;
        this.trainList = res.data.data.trainList.list;
      });
    },
    formatDay(day) {
      switch (day) {
        case 0:
          return '周日';
        case 1:
          return '周一';
        case 2:
          return '周二';
        case 3:
          return '周三';
        case 4:
          return '周四';
        case 5:
          return '周五';
        case 6:
          return '周六';
        default:
          return '';
      }
    },
    fetchProcess(id) {
      getCustomProcess({
        userTrainId: id
      }).then(res => {
        let data = res.data.data;
        let list = [
          {
            q: '您的健身基础',
            a: data.planRankName
          },
          {
            q: '您希望通过健身达到什么效果',
            a: data.planTypesName
          },
          {
            q: '您希望着重训练哪个部位',
            a: data.planBodyTypesName
          },
          {
            q: '您身体哪个部位受过伤',
            a: data.medicalHisName ? data.medicalHisName : '无'
          },
          {
            q: '训练计划坚持周数',
            a: data.cityName
          },
          {
            q: '选择每周的训练日',
            a: data.weekDay
          },
          {
            q: '4M测试',
            a: data.fourMTotal ?  data.fourMTotal + '个' : 'N/A'
          },
        ];
        this.processList = list;
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchDetail();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.userPlanDetailPage {
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
}

.userInfo {
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
  border: 1px solid #e5e5e5;
  margin: {
    bottom: 20px;
  }
}

.planDetail {
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
  border: 1px solid #e5e5e5;
}

.userInfo_item {
  padding: {
    top: 5px;
    bottom: 5px;
  }
}
.processButton {
  position: absolute;
  top: 10px;
  right: 20px;
}
.planDetailInfo {
  width: 100%;
  background-color: #e5e5e5;
  position: relative;
  @include flexbox;
  @include flex-direction(column);
  @include align-items(center);
  box-sizing: border-box;
  padding: 10px;
  margin: {
    top: 20px;
  }
  .planDetail_progress {
    width: 80%;
    flex: 1;
  }
  .planDetail_rate {
    width: 100%;
    flex: 1;
    @include flexbox;
    @include justify-content(center);
  }
  .el-rate {
    display: inline-block;
  }
}
.plan_rate {
  height: 20px;
  line-height: 20px;
}
</style>

<template>
  <div class="courseConfigPage">
    <div class="trainingPlan">
      <sub-title title="训练计划"></sub-title>
      <div class="planDetail">
        <div style="padding-bottom: 10px">训练类型: {{trainingType}}</div>
        <div style="padding-bottom: 10px">训练名称: {{trainingName}}</div>
        <div>训练部位: {{trainingPart}}</div>
      </div>
    </div>

    <div class="courseContent">
      <sub-title title="课程内容"></sub-title>
      <div style="height: 30px;"></div>
      <el-tabs v-model="strengthId" type="card" @tab-click="handleClick" v-loading="isLoadingCourses">
        <el-tab-pane v-for="(item, index) in strengthList" :key="index" :label="item.strengthLv" :name="item.id + ''">
          <el-table :data="courseList" style="width: 100%">
            <el-table-column label="课程ID" prop="planCourseId" width="80">
            </el-table-column>
            <el-table-column label="课程名称" prop="name">
            </el-table-column>
            <el-table-column label="训练基础值" prop="typeDesc">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.courseDetailByRankVos[0].planCourseSportVos" :key="index">
                  {{index + 1}}.{{item.sportType == 3 ? '拉伸运动' : item.sportType == 1 ? '无氧运动' : item.sportType == 2 ? '有氧运动' : '' }}:
                  <span v-if="item.stretchExercise">{{item.stretchExercise.name}}</span>
                  <span v-if="item.facilityTypeUnitVoList">
                    <span v-for="(facilityItem, facilityIndex) in item.facilityTypeUnitVoList" :key="facilityIndex">
                      #{{facilityItem.facilityName}}#
                      <span style="color: blue">(
                        <span v-for="(unitItem, unitIndex) in facilityItem.unitInfoVoList" :key="unitIndex">
                          {{unitItem.unitValue}}{{unitItem.unitSymbol}};
                        </span> )</span>
                    </span>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="item.strengthLv" prop="typeDesc">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.courseDetailByRankVos[1].planCourseSportVos" :key="index">
                  {{index + 1}}.{{item.sportType == 3 ? '拉伸运动' : item.sportType == 1 ? '无氧运动' : item.sportType == 2 ? '有氧运动' : '' }}:
                  <span v-if="item.stretchExercise">{{item.stretchExercise.name}}</span>
                  <span v-if="item.facilityTypeUnitVoList">
                    <span v-for="(facilityItem, facilityIndex) in item.facilityTypeUnitVoList" :key="facilityIndex">
                      #{{facilityItem.facilityName}}#
                      <span style="color: blue">(
                        <span v-for="(unitItem, unitIndex) in facilityItem.unitInfoVoList" :key="unitIndex">
                          {{unitItem.unitValue}}{{unitItem.unitSymbol}};
                        </span> )</span>
                    </span>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="训练部位" prop="bodies">
              <template slot-scope="scope">
                <span v-for="(item, index) in scope.row.bodies" :key="index">
                  #{{item.planBodyName}}# &nbsp;&nbsp;
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="time" width="100">
              <template slot-scope="scope">
                <el-button type="primary" plain @click="editType(scope.row)">编辑</el-button>
                <el-button type="danger" plain @click="removeType(scope.row)" style="margin-left: 0">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="bottom_add">
      <div>已添加{{courseNum}}天课程</div>
      <el-button type="primary" @click="addCourse">+添加课程</el-button>
    </div>

    <el-dialog title="添加课程" :visible.sync="dialogVisible" width="70%" center :before-close="handleClose">
      <div class="dialog_trainingType">
        <el-input placeholder="搜索课程ID" v-model="courseId" style="width: 200px;margin-right: 10px"></el-input>
        <el-input placeholder="搜索课程名称" v-model="courseName" style="width: 200px;margin-right:10px"></el-input>
        <el-button @click="fetchAllCourses">搜索</el-button>
        <el-button type="primary" plain @click="jumpToCourse">去课程库</el-button>
      </div>

      <el-table :data="dialog_courses" style="width: 100%" v-loading="isLoadingAllCourses" @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column label="ID" prop="planCourseId">
        </el-table-column>
        <el-table-column label="课程名称" prop="name">
        </el-table-column>
        <el-table-column label="训练基础值" prop="displayStatus">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.courseSportVoList" :key="index">
              {{index + 1}}.{{item.sportType == 3 ? '拉伸运动' : item.sportType == 1 ? '有氧运动' : item.sportType == 2 ? '无氧运动' : '' }}:
              <span v-if="item.stretchExercise">{{item.stretchExercise.name}}</span>
              <span v-if="item.facilityTypeUnitVoList">
                <span v-for="(facilityItem, facilityIndex) in item.facilityTypeUnitVoList" :key="facilityIndex">
                  #{{facilityItem.facilityName}}#
                  <span style="color: blue">(
                    <span v-for="(unitItem, unitIndex) in facilityItem.unitInfoVoList" :key="unitIndex">
                      {{unitItem.unitValue}}{{unitItem.unitSymbol}};
                    </span> )</span>
                </span>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="训练部位" prop="bodyNames">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-radio v-model="currentSelectedCourse" :label="scope.row.
            planCourseId" border @change="getCurrentSelect">选择</el-radio>
            <div v-if="courseIdList.includes(scope.row.planCourseId)">已在课程中</div>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import { getTrainingCourseList, getCoursesAll, updatePlanCourseBind, removePlanCourse } from 'api/training/newPlan';

import { getPlanRank } from 'api/training/trainingLevel';

export default {
  data() {
    return {
      strengthId: '1',
      strengthList: [],
      courseList: [],
      dialogVisible: false,
      courseId: '',
      courseName: '',
      trainingType: '',
      trainingName: '',
      trainingPart: '',
      trainingPlanTypeId: '',
      bodyIds: '',
      planBodyTypeId: 0,
      isLoadingCourses: false,
      isLoadingAllCourses: false,
      dialog_courses: [],
      selectedCourses: [],
      currentSelectedCourse: ''
    };
  },
  components: {
    SubTitle
  },
  computed: {
    courseNum() {
      return this.courseList.length;
    },
    courseIdList() {
      return this.courseList.map(item => item.planCourseId)
    }
  },
  methods: {
    getCurrentSelect(val) {
      // console.log(val);
    },
    jumpToCourse() {
      this.dialogVisible = false;
      this.$router.push({ path: '/training/course' });
    },
    handleSelectionChange(val) {
      this.selectedCourses = val.map(item => item.planCourseId);
    },
    handleClose(done) {
      done();
    },
    handleClick(tab) {
      // console.log(tab)
      this.fetchCourses();
    },
    addCourse() {
      this.dialogVisible = true;
      this.fetchAllCourses();
    },
    editType() {
      this.addCourse();
    },
    removeType(row) {
      if (confirm('确认删除吗?')) {
        removePlanCourse({
          id: row.planBodyTypeCourseBindId
        }).then( (res) => {
          if (res.data.code == 200) {
            this.$notify.success('删除成功');
            this.fetchCourses();
            return;
          } else {
             this.$notify.error('删除失败');
          }
        }).catch( () => {
          this.$notify.error('删除失败');
        })
      }
    },
    confirmUpdate() {
      this.dialogVisible = false;
      updatePlanCourseBind({
        planTypeId: this.trainingPlanTypeId,
        planBodyTypeId: this.planBodyTypeId,
        planCourseId: this.currentSelectedCourse
      }).then( (res) => {
        if ( res.data.code == 200) {
          this.$notify.success('绑定课程成功');
          this.fetchCourses();
          return;
        } else {
          this.$notify.error('绑定课程失败');
        }
      }).catch( () => {
        this.$notify.error('绑定课程失败');
      })
    },
    initData() {
      this.planBodyTypeId = this.$route.query.id;
      this.trainingType = this.$route.query.type;
      this.trainingName = this.$route.query.planName;
      this.trainingPart = this.$route.query.planPart;
      this.trainingPlanTypeId = this.$route.query.planTypeId
      this.bodyIds = this.$route.query.bodyIds
        ? JSON.stringify(
            this.$route.query.bodyIds.split('-').map(item => parseInt(item))
          )
        : '';
      // console.log(this.bodyIds);
    },
    createParams() {
      let params = {};
      if (this.courseName) {
        params.courseName = this.courseName;
      }
      if (this.courseId) {
        params.courseId = this.courseId;
      }
      params.planBodyIds = this.bodyIds;
      return params;
    },
    fetchRank() {
      return new Promise((resolve, reject) => {
        getPlanRank({ page: 1, size: 100 })
          .then(res => {
            this.strengthId = res.data.data.list[0].id + '';
            this.strengthList = res.data.data.list;
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    fetchCourses() {
      this.isLoadingCourses = true;
      getTrainingCourseList({
        planBodyTypeId: this.planBodyTypeId,
        // courseId: 6,
        rankId: this.strengthId
      })
        .then(res => {
          this.courseList = res.data.data;
          this.isLoadingCourses = false;
        })
        .catch(() => {
          this.isLoadingCourses = false;
        });
    },
    fetchAllCourses() {
      this.isLoadingAllCourses = true;
      getCoursesAll(this.createParams())
        .then(res => {
          res.data.data.list.forEach((item, index) => {

            item.createTime = this.moment(item.createTime).format(
              'YYYY-MM-DD HH:mm:ss'
            );
            item.bodyNames = item.bodies
              .map(item => item.planBodyName)
              .join(';');
            item.isSelected = item.planBodyTypeId
          });
          this.dialog_courses = res.data.data.list;
          this.isLoadingAllCourses = false;
        })
        .catch(() => {
          this.isLoadingAllCourses = false;
        });
    }
  },
  watch: {
    $route() {
      this.initData();
      this.fetchRank().then(() => {
        this.fetchCourses();
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initData();
      this.fetchRank().then(() => {
        this.fetchCourses();
      });
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.courseConfigPage {
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
}

.trainingPlan {
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid #e5e5e5;
  margin: {
    bottom: 20px;
  }
  .planDetail {
    padding: 10px;
    background-color: #e5e5e5;
    margin: {
      top: 20px;
    }
  }
}

.courseContent {
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid #e5e5e5;
  min-height: 200px;
}

.bottom_add {
  background-color: #999999;
  height: 60px;
  @include flexbox;
  @include align-items(center);
  @include justify-content(space-between);
  box-sizing: border-box;
  padding: {
    left: 20px;
    right: 20px;
  }
}

.dialog_trainingType {
  @include flexbox;
  @include align-items(center);
}
</style>

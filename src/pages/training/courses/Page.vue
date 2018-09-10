<template>
  <div class="coursesPage">
    <div class="checkboxs">
      <div>训练部位:</div>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" border style="margin-right: 10px">全选</el-checkbox>
      <el-checkbox-group v-model="selectedBodies" @change="handleCheckedBodiesChange">
        <el-checkbox v-for="(body, index) in bodies" :label="body.id" :key="index" border>{{body.name}}</el-checkbox>
      </el-checkbox-group>
    </div>

    <div class="selectors">
      <el-input placeholder="课程名称" v-model="courseName" style="width: 200px"></el-input>
      <el-input placeholder="课程ID" v-model="courseId" style="width: 200px"></el-input>
      <el-button type="primary" @click="fetchCourses">搜索</el-button>
      <el-button type="primary" @click="createCourse" v-permission="'c663d037-6d16-4c2e-9fb1-d0357e08da58'">新增课程</el-button>
    </div>

    <el-table :data="courses" style="width: 100%" v-loading="isLoadingCourse">
      <el-table-column label="创建时间" prop="createTime">
      </el-table-column>
      <el-table-column label="ID" prop="planCourseId" width="60">
      </el-table-column>
      <el-table-column label="课程名称" prop="name">
      </el-table-column>
      <el-table-column label="训练基础值" prop="displayStatus" width="400px">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.courseSportVoList" :key="index">
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
      <el-table-column label="训练部位" prop="bodyNames">
      </el-table-column>
      <el-table-column label="操作" prop="time">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="editCourse(scope.row)" v-permission="'c4e24745-f68a-43fc-aae7-071ae4ddfd64'">编辑</el-button>
          <el-button type="danger" plain @click="removeCourse(scope.row)" v-permission="'9a113608-0ab3-4133-a24e-9393f445373f'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="paginationBox" style="margin-top: 20px;" v-permission="'dc9d5918-19ea-48ea-b594-fb700b9ab5dd'">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
        </el-pagination>
      </div>
  </div>
</template>

<script>
import { getTrainingParts } from 'api/training/trainingParts';

import { getCourseList, removePlanCourse } from 'api/training/courses';

export default {
  data() {
    return {
      currentPage: 1,
      curPageSize: 10,
      curTotal: 0,
      checkAll: true,
      bodies: [],
      selectedBodies: [],
      isIndeterminate: false,
      courseName: '',
      courseId: '',
      courses: [],
      isLoadingCourse: false,
      isCreate: 0,
      planCourseId: 0
    };
  },
  watch: {
    selectedBodies() {
      this.fetchCourses();
    }
  },
  computed: {},
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.fetchTrainingParts().then(() => {
          vm.fetchCourses();
        });
      });
    })
  },
  methods: {
    handleSizeChange(val) {
      this.curPageSize = val;
      this.fetchCourses();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchCourses();
    },
    mapPagination(res) {
      this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
      this.curPageSize = res.pageSize;
      this.curTotal = res.total;
    },
    removeCourse(row) {
      if (confirm('确定要删除吗?')) {
      removePlanCourse({
        id: row.planCourseId
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
    editCourse(row) {
      this.isCreate = 0;
      this.planCourseId = row.planCourseId;
      this.$router.push({
        path: `/training/courseBase?isCreate=${this.isCreate}&planCourseId=${this.planCourseId}`
      });
    },
    createCourse() {
      this.isCreate = 1;
      this.$router.push({
        path: `/training/courseBase?isCreate=${this.isCreate}`
      });
    },
    handleCheckAllChange(val) {
      this.selectedBodies = val ? this.bodies.map(item => item.id) : [];
      this.isIndeterminate = false;
    },
    handleCheckedBodiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.bodies.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.bodies.length;
    },
    createParams() {
      let params = {};
      params.page = this.currentPage;
      params.size = this.curPageSize;
      if (this.courseName) {
        params.courseName = this.courseName;
      }
      if (this.courseId) {
        params.courseId = this.courseId;
      }
      params.planBodyIds = JSON.stringify(this.selectedBodies);
      return params;
    },
    fetchTrainingParts() {
      return new Promise((resolve, reject) => {
        getTrainingParts({ page: 1, size: 100 })
          .then(res => {
            this.bodies = res.data.data.list;
            this.selectedBodies = this.bodies.map(item => item.id);
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    fetchCourses() {
      this.isLoadingCourse = true;
      getCourseList(this.createParams())
        .then(res => {
          res.data.data.list.forEach((item, index) => {
            item.createTime = this.moment(item.createTime).format(
              'YYYY-MM-DD HH:mm:ss'
            );
            item.bodyNames = item.bodies
              .map(item => item.planBodyName)
              .join(';');
          });
          this.courses = res.data.data.list;
          this.mapPagination(res.data.data);
          this.isLoadingCourse = false;
        })
        .catch(() => {
          this.isLoadingCourse = false;
        });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchTrainingParts().then(() => {
        this.fetchCourses();
      });
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.coursesPage {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}
.checkboxs {
  @include flexbox;
  @include align-items(center);
}
.selectors {
  padding: {
    top: 20px;
    bottom: 20px;
  }
}
</style>

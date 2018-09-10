<template>
  <div class="courseConfigPage">
    <sub-title title="课程内容设置"></sub-title>

    <div class="courseConfig_item">
      <div class="courseConfig_subTitle">课程名称</div>
      <el-input placeholder="输入课程名称(20字以内)" style="width: 300px" v-model="name" maxlength="20"></el-input>
    </div>
    <div class="courseConfig_item">
      <div class="courseConfig_subTitle">训练部位</div>
      <div class="selectedBodyName">{{selectedBodyName}}</div>
      <el-button type="primay" plain @click="open_bodies">设置</el-button>
    </div>

    <div class="sportTypes">
      <el-button @click="createStretch">+拉伸运动</el-button>
      <el-button @click="createAerobic">+有氧运动</el-button>
      <el-button @click="createAnaerobic">+无氧运动</el-button>
    </div>

    <div class="courseSportList">
      <draggable v-model="courseSportVoList">
        <div v-for="(item,index) in courseSportVoList" :key="item.id" class="item">
          <div class="list_number">
            <div class="list_number_box">{{index + 1}}</div>
          </div>
          <div class="list_item">
            <div class="list_header">{{item.sportType == 3 ? '拉伸运动' : item.sportType == 1 ? '无氧运动' : '有氧运动'}}</div>
            <div class="list_content">
              <span v-if="item.stretchExercise">{{item.stretchExercise.name}}</span>
              <span v-if="item.facilityTypeUnitVoList">
                <span v-for="(facilityItem, facilityIndex) in item.facilityTypeUnitVoList" :key="facilityIndex">
                  #{{facilityItem.facilityName}}#
                  <span style="color: #3A71A8">(
                    <span v-for="(unitItem, unitIndex) in facilityItem.unitInfoVoList" :key="unitIndex">
                      {{unitItem.unitValue}}{{unitItem.unitSymbol}};
                    </span> )</span>
                </span>
              </span>
            </div>
          </div>
          <div class="bottom_item">
            <el-button type="primary" size="small" @click="editSport(item, index)">编辑</el-button>
            <el-button type="danger" size="small" @click="removeSport(index)">删除</el-button>
          </div>
        </div>
      </draggable>
    </div>
    <!-- 训练部位 -->
    <el-dialog title="训练部位" :visible.sync="bodyDialog" width="50%" center >
      <div class="dialog_subtitle" style="margin-bottom: 20px">选择部位</div>
      <el-checkbox-group v-model="dialog_bodyIds">
        <el-checkbox v-for="(body, index) in trainingParts" :label="body.id" :key="index" border>{{body.name}}</el-checkbox>
      </el-checkbox-group>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelBodySelect">取 消</el-button>
        <el-button type="primary" @click="save_bodies">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 拉伸运动 -->
    <el-dialog :title="isCreateStretch ? '添加' : '编辑'" :visible.sync="stretchDialog" width="50%" center >
      <div class="dialog_subtitle" style="margin-bottom: 20px">拉伸运动(单选)</div>
      <div class="dialog_strechList" v-loading="isEditingStretch" element-loading-spinner="el-icon-loading">
        <el-radio-group v-model="dialog_stretchId" style="display: flex; flex-direction: column">
          <el-radio v-for="(item, index) in stretchList" :key="index" :label="item.id" style="margin-left: 0px;margin-bottom: 20px;">
            
            <div style="display: inline-block"> <el-input v-if="isEdit" v-model="item.name" style="width: 150px"></el-input><span v-else>{{item.name}}</span> <el-button type="primary" plain @click="editStretch" v-if="!isEdit">编辑</el-button><el-button type="primary" plain v-if="isEdit" @click="stretchConfirm(item.name, item.id)">确认</el-button><el-button type="danger" plain @click="removeStretch(item.id)">删除</el-button></div>
            </el-radio>
        </el-radio-group>
      </div>
      <div class="">
        <el-button type="primary" plain @click="isAdd = true">新增</el-button>
        <el-input v-model="add_stretch" v-if="isAdd" style="width: 150px;"></el-input>
        <el-button type="primary" plain v-if="isAdd" @click="stretchConfirm(add_stretch, null)">确认</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelStretchSelect">取 消</el-button>
        <el-button type="primary" @click="save_stretch">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 无氧运动 -->
    <el-dialog :title="isCreateAnaerobic ? '添加' : '编辑'" :visible.sync="anaerobicDialog" width="50%" center >
      <div class="dialog_subtitle" style="margin-bottom: 20px">设备类型:&nbsp;&nbsp;&nbsp;无氧运动</div>
      <el-select v-model="dialog_anaerobicType" placeholder="请选择" style="width: 100%">
        <el-option v-for="item in anaerobicOptions" :key="item.id" :label="item.name" :value="item.facilityType">
        </el-option>
      </el-select>
      <div class="dialog_item">
        <div class="dialog_subtitle" style="padding-top: 10px;padding-bottom:10px;">训练配置</div>
        <div class="dialog_unitConfig" v-for="(item, index) in dialog_anaerobicUnit" :key="index">
          <span style="display: inline-block;width:80px;">{{item.unitName}}:</span>
          <el-input v-model="item.unitValue" style="width: 150px">
            <span slot="append">{{item.unitSymbol}}</span>
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAnaerobicSelect">取 消</el-button>
        <el-button type="primary" @click="save_anaerobic">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 有氧运动 -->
    <el-dialog :title="isCreateAerobic ? '添加' : '编辑'" :visible.sync="aerobicDialog" width="50%" center>
      <div class="dialog_subtitle" style="margin-bottom: 20px">设备类型:&nbsp;&nbsp;&nbsp;有氧运动</div>
      <el-table ref="multipleTable" :data="aerobicFacility" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="设备" >
          <template slot-scope="scope">
            {{scope.row.facilityName}}<div>(主:{{scope.row.parts.mainParts}};辅:{{scope.row.parts.minorParts}})</div>
          </template>
        </el-table-column>
        <el-table-column label="基本配置">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.unitInfoVoList" :key="index" class="dialog_aerobic_unitConfig">
              <span>{{item.unitName}}:</span>
              <el-input v-model="item.unitValue" style="width: 150px">
                <span slot="append">{{item.unitSymbol}}</span>
              </el-input>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAerobicSelect">取 消</el-button>
        <el-button type="primary" @click="save_aerobic">确 定</el-button>
      </span>
    </el-dialog>

    <el-button type="primary" @click="submitCourse" style="margin-top: 30px;">提交</el-button>
  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import draggable from 'vuedraggable';

import { getCourseDetail, getStretchList, updatePlanCourse, updateStretchList, removeStretchList } from 'api/training/courses';

import { getTrainingParts } from 'api/training/trainingParts';

import { getSportFacility } from 'api/training/sportFacility'; // facilityKind 1 无氧  2 有氧

export default {
  name: 'courseBase',
  data() {
    return {
      courseSportVoList: [], // 已有的运动列表, 可拖拽, 监听
      bodies: [], // 已有的部位
      name: '', // 课程名称
      planCourseId: 0, // 课程ID
      editingIndex: null, // 正在编辑的index
      // 部位
      trainingParts: [], // 部位列表
      selectedBodyIds: [], // 选定的部位
      dialog_bodyIds: [], // 临时选择的部位
      bodyDialog: false,
      // 拉伸运动
      isEdit: false,
      isAdd: false,
      isEditingStretch: false,
      stretchDialog: false,
      isCreateStretch: false,
      add_stretch: '', // 添加拉伸
      stretchList: [], // 拉伸运动列表
      selectedStretchId: 0, // 选中并确认的id
      dialog_stretchId: 0, // 临时选择的id
      // 无氧运动
      anaerobicDialog: false,
      isCreateAnaerobic: false,
      anaerobicFacility: [], // 无氧设备
      selectedAnaerobicType: '', // 选中并确认的类型
      dialog_anaerobicType: '', // 临时选择的类型
      dialog_anaerobicUnit: [], // 临时选择的单位信息
      selectedAnaerobicUnit: [], // 确认的单位信息
      //有氧运动
      aerobicDialog: false,
      isCreateAerobic: false,
      aerobicFacility: [], // 有氧设备
      dialog_aerobicList: [], // 临时选择的设备
      selectedAerobicList: [], // 已选设备
    };
  },
  watch: {
    courseSportVoList(val) {
      this.courseSportVoList.forEach((item, index) => {
        if (item.sportRank == 0) {
          this.editingIndex = val.length - 1;
          // console.log(this.editingIndex);
        }
        item.sportRank = index + 1;
      });
    },
    selectedStretchId(val) {
      if (typeof this.editingIndex !== 'number') return;
      let selected = this.stretchList.filter(item => item.id == val)[0];
      this.courseSportVoList[this.editingIndex] = Object.assign(
        this.courseSportVoList[this.editingIndex],
        { stretchExercise: selected }
      );
    },
    selectedAnaerobicUnit(val) {
      // console.log
    },
    // 设备变化, 变单位信息
    dialog_anaerobicType(val) {
      if (val == this.selectedAnaerobicType) return;
      if (typeof this.editingIndex !== 'number') return;
      let selected = this.anaerobicFacility
        .filter(item => item.facilityType == val)
        .map(facItem => {
          return {
            facilityName: facItem.facilityName,
            facilityType: facItem.facilityType,
            sportType: facItem.sportType,
            unitInfoVoList: facItem.unitInfoVoList,
            stretchExercise: null
          };
        });
      this.dialog_anaerobicUnit = selected[0].unitInfoVoList;
    },
    // 确认
    selectedAnaerobicType(val, oldvalue) {
      if (typeof this.editingIndex !== 'number' || !oldvalue) return;
      let selected = this.anaerobicFacility
        .filter(item => item.facilityType == val)
        .map(facItem => {
          return {
            facilityName: facItem.facilityName,
            facilityType: facItem.facilityType,
            sportType: facItem.sportType,
            unitInfoVoList: facItem.unitInfoVoList,
            stretchExercise: null
          };
        });
      this.courseSportVoList[this.editingIndex] = Object.assign(
        this.courseSportVoList[this.editingIndex],
        selected[0]
      );
    }
  },
  components: {
    SubTitle,
    draggable
  },
  computed: {
    courseId() {
      return this.$route.query.planCourseId
        ? this.$route.query.planCourseId
        : '';
    },
    selectedBodyName() {
      // console.log(this.trainingParts);
      let list = this.trainingParts.filter(item => {
        // console.log(this.selectedBodyIds)
        return this.selectedBodyIds.includes(item.id);
      });
      let names = list.map(item => '#' + item.name + '#');
      // console.log(names);
      return names.join(' ');
    },
    anaerobicOptions() {
      if (!this.anaerobicFacility || this.anaerobicFacility.length == 0) {
        return []
      };
      return this.anaerobicFacility.map(item => {
        let mainPart = item.mainBodyList
          ? item.mainBodyList.map(mainItem => mainItem.name).join(',')
          : '无';
        let minorPart = item.minorBodyList
          ? item.minorBodyList.map(minorItem => minorItem.name).join(',')
          : '无';
        return {
          id: item.id,
          facilityType: item.facilityType,
          name: item.facilityName + `(主: ${mainPart};辅: ${minorPart})`
        };
      });
    }
  },
  methods: {
    handleCloseStretchSelector(done) {
      done();
    },
    handleCloseAnaerobicSelector(done) {
      done();
    },
    handleCloseBodySelector(done) {
      this.dialog_bodyIds = this.selectedBodyIds;
      done();
    },
    handleCloseAerobicSelector(done) {
      done();
    },
    // 选中
    handleSelectionChange(val) {
      if (this.selectedAerobicList.length != 0) {
        this.aerobicFacility.forEach( (item, index) => {
          if (this.selectedAerobicList.every( (_item) => _item.facilityType !== item.facilityType)) {
            item.unitInfoVoList.map( (unitItem) => unitItem.unitValue = '')
          }    
        })
      }
      this.dialog_aerobicList = val;
    },
    removeSport(index) {
      // 页面删除
      this.courseSportVoList.splice(index, 1);
    },
    // 部位操作
    open_bodies() {
      this.bodyDialog = true;
    },
    save_bodies() {
      this.bodyDialog = false;
      this.selectedBodyIds = this.dialog_bodyIds;
    },
    cancelBodySelect() {
      this.bodyDialog = false;
      this.dialog_bodyIds = this.selectedBodyIds;
    },
    // 编辑三种运动
    editSport(item, index) {
      this.editingIndex = index;
      if (item.sportType == 3) {
        this.fetchStretchList();
        // 拉伸
        this.isCreateStretch = false;
        this.stretchDialog = true;
        this.selectedStretchId = item.stretchExercise.id;
        this.dialog_stretchId = item.stretchExercise.id;
      }
      if (item.sportType == 1) {
        // 无氧
        this.anaerobicDialog = true;
        this.isCreateAnaerobic = false;
        // this.fetchAnaerobic(); // 获取无氧设备
        this.selectedAnaerobicType =
          item.facilityTypeUnitVoList[0].facilityType;
        this.dialog_anaerobicType = item.facilityTypeUnitVoList[0].facilityType;
        let unitList = item.facilityTypeUnitVoList[0].unitInfoVoList.slice(0);
        this.selectedAnaerobicUnit = JSON.parse(JSON.stringify(unitList));
        this.dialog_anaerobicUnit = JSON.parse(JSON.stringify(unitList));
      }
      if (item.sportType == 2) {
        // 有氧
        this.aerobicDialog = true;
        this.isCreateAerobic = false;
        this.selectedAerobicList = JSON.parse(JSON.stringify(item.facilityTypeUnitVoList));
        this.dialog_aerobicList = this.aerobicFacility.filter( (item) => {
          return this.selectedAerobicList.map( (facItem) => facItem.facilityType).includes(item.facilityType)
        })
        this.aerobicFacility.forEach( (item, index) => {
          this.selectedAerobicList.forEach( (selectItem, index) => {
            if (selectItem.facilityType == item.facilityType) {
              item.unitInfoVoList = selectItem.unitInfoVoList;
            } 
          })
          if (this.selectedAerobicList.every( (_item) => _item.facilityType !== item.facilityType)) {
            item.unitInfoVoList.map( (unitItem) => unitItem.unitValue = '')
          } 
        })
        this.$nextTick( () => { // 等待dom渲染
          this.toggleSelection(this.dialog_aerobicList, true)
        })
      }
    },
    // 拉伸运动
    createStretch() {
      // 创建
      this.isCreateStretch = true;
      this.dialog_stretchId = '';
      this.selectedStretchId = '';
      this.stretchDialog = true;
      this.courseSportVoList.push({
        facilityTypeUnitVoList: null,
        sportRank: 0,
        sportType: 3,
        stretchExercise: null
      });
    },
    cancelStretchSelect() {
      if ( this.isCreateStretch ) {
        this.courseSportVoList.pop();
      }
      this.stretchDialog = false;
      this.dialog_stretchId = this.selectedStretchId;
    },
    save_stretch() {
      this.stretchDialog = false;
      this.selectedStretchId = this.dialog_stretchId;
    },
    editStretch() {
      this.isEdit = true;
    },
    // 确认编辑拉伸
    stretchConfirm(name, id) {
      this.isEditingStretch = true;
      if (id) {
        this.isEdit = false;
        updateStretchList({
          name: name,
          id: id,
        }).then( (res) => {
          if (res.data.code == 200) {
            this.$notify.success('配置拉伸运动成功');
            this.fetchStretchList()
          } else {
            this.$notify.success('配置拉伸运动失败, 请重试');
          }
          this.isEditingStretch = false;
        }).catch( () => {
          this.isEditingStretch = false;
        })
      } else {
        this.isAdd = false;
        updateStretchList({
          name: name,
        }).then( (res) => {
          if (res.data.code == 200) {
            this.$notify.success('新增拉伸运动成功');
            this.fetchStretchList();
          } else {
            this.$notify.success('新增拉伸运动失败, 请重试');
          }
          this.add_stretch = '';
          this.isEditingStretch = false;
        }).catch( () => {
          this.isEditingStretch = false;
        })
      }
    },
    // 删除拉伸
    removeStretch(id) {
      this.isEditingStretch = true;
      removeStretchList({id: id}).then( (res) => {
        if (res.data.code == 200) {
          this.$notify.success('删除成功');
          this.fetchStretchList();
        } else {
          this.$notify.success('删除失败, 请重试');
        }
        this.isEditingStretch = false;
      }).catch( () => {
        this.isEditingStretch = false;
      })
    },
    // 无氧运动
    createAnaerobic() {
      this.isCreateAnaerobic = true;
      this.anaerobicDialog = true;
      this.dialog_anaerobicType = '';
      this.dialog_anaerobicUnit = [];
      this.selectedAnaerobicType = '';
      this.selectedAnaerobicUnit = [];
      // this.fetchAnaerobic(); // + 设置单位
      this.courseSportVoList.push({
        facilityTypeUnitVoList: [],
        sportRank: 0,
        sportType: 1,
        stretchExercise: null
      });
    },
    cancelAnaerobicSelect() {
      if ( this.isCreateAnaerobic ) {
        this.courseSportVoList.pop();
      }
      this.anaerobicDialog = false;
      this.dialog_anaerobicType = this.selectedAnaerobicType;
      this.dialog_anaerobicUnit = this.selectedAnaerobicUnit;
    },
    save_anaerobic() {
      let isVerify = false;
      if (!this.dialog_anaerobicType) {
        this.$notify.warning('请填写完整的配置信息');
        return;
      }
      for(let item of this.dialog_anaerobicUnit) {
        if (!item.unitValue) {
          this.$notify.warning('请填写完整的配置信息');
          return;
        }
      }
      
      this.selectedAnaerobicType = this.dialog_anaerobicType;
      this.selectedAnaerobicUnit = this.dialog_anaerobicUnit;
      isVerify = this.selectedAnaerobicUnit.every( (item) => {
       return /^\d+$/.test(item.unitValue)
      })
      if (!isVerify) {
        return this.$notify.warning('输入必须为数字');
      }; 
      this.anaerobicDialog = false;
      let selected = this.anaerobicFacility
        .filter(item => item.facilityType == this.selectedAnaerobicType)
        .map(facItem => {
          return {
            facilityName: facItem.facilityName,
            facilityType: facItem.facilityType,
            sportType: facItem.sportType,
            unitInfoVoList: this.dialog_anaerobicUnit,
            stretchExercise: null
          };
        });
      this.courseSportVoList[this.editingIndex].facilityTypeUnitVoList[0] =
        selected[0];
      // this.courseSportVoList[this.editingIndex] = Object.assign(this.courseSportVoList[this.editingIndex].facilityTypeUnitVoList[0], selected[0])
      // console.log(this.courseSportVoList)
    },

    // 有氧运动
    createAerobic() {
      this.isCreateAerobic = true;
      this.aerobicDialog = true;
       this.$nextTick( () => { // 等待dom渲染
          this.toggleSelection(this.dialog_aerobicList)
        })
      this.courseSportVoList.push({
        facilityTypeUnitVoList: [],
        sportRank: 0,
        sportType: 2,
        stretchExercise: null
      });
    },
    cancelAerobicSelect() {
      if ( this.isCreateAerobic ) {
        this.courseSportVoList.pop();
      }
      this.aerobicDialog = false;
    },
    save_aerobic() {
      for (let item of this.dialog_aerobicList) {
        if (!item.unitInfoVoList) {
          this.$notify.warning('请填写完整的配置信息');
          return;
        }
        for (let unitItem of item.unitInfoVoList) {
          if (!unitItem.unitValue) {
            this.$notify.warning('请填写完整的配置信息');
            return;
          }
          if (!/^\d+$/.test(unitItem.unitValue)) {
            this.$notify.warning('请输入整数');
            return;
          }
        }
      }
      this.aerobicDialog = false;
      this.selectedAerobicList = this.dialog_aerobicList.map((item) => {
        return {
          facilityName: item.facilityName,
          facilityType: item.facilityType,
          sportType: item.sportType,
          unitInfoVoList: item.unitInfoVoList
        }
      });
      this.courseSportVoList[this.editingIndex].facilityTypeUnitVoList = this.selectedAerobicList;
    },
    // 初始化时选中
    toggleSelection(rows, selected) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, selected);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    fetchCourseDetail() {
      getCourseDetail({
        id: this.courseId
      }).then(res => {
        let data = res.data.data;
        this.planCourseId = data.planCourseId;
        this.name = data.name;
        this.bodies = data.bodies;
        this.selectedBodyIds = data.bodies.map(item => item.planBodyId);
        // console.log(this.selectedBodyIds)
        this.dialog_bodyIds = this.selectedBodyIds;;
        this.courseSportVoList = data.courseSportVoList;
        // this.parseDetail(data.courseSportVoList);
      });
    },
    fetchTrainingParts() {
      getTrainingParts({ page: 1, size: 100 }).then(res => {
        this.trainingParts = res.data.data.list;
      });
    },
    fetchStretchList() {
      getStretchList({ page: 1, size: 100 }).then(res => {
        this.stretchList = res.data.data.list;
      });
    },
    fetchAnaerobic() { // 无氧
      getSportFacility({ facilityKind: 1 }).then(res => {
        this.anaerobicFacility = res.data.data;
      });
    },
    fetchAerobic() { // 有氧
      getSportFacility({ facilityKind: 2 }).then(res => {
        res.data.data.forEach( (item, index) => {
          let mainParts = item.mainBodyList ? item.mainBodyList.map( mainItem => mainItem.name).join('、') : '无';
          let minorParts = item.minorBodyList ? item.minorBodyList.map( minorItem => minorItem.name).join('、') : '无';
          item.parts = {
            mainParts: mainParts,
            minorParts: minorParts
          }
        })
        this.aerobicFacility = res.data.data;
      });
    },

    // 提交课程
    submitCourse() {
      let filterbodies = this.trainingParts.filter( (item) => {
        if (this.selectedBodyIds.find( (b) => b == item.id)){
          return true;
        } else {
          return false;
        }
      })
      let bodies = filterbodies.map( (item) => {
        return {
          id: item.id,
          name: item.name
        }
      })
      if (!bodies || bodies.length == 0) {
        this.$notify.warning('身体部分选择不能为空');
        return;
      }
      let courseSportBindlist;
      let courseSportDetailVoList = [];
      try {
        courseSportBindlist = this.courseSportVoList.map( (item) => {
          if (item.sportType == 3) {
            return {
              planStretchId: item.stretchExercise.id,
              sportRank: item.sportRank,
              sportType: item.sportType
            }
          } else {
            return {
              sportRank: item.sportRank,
              sportType: item.sportType
            }
          }
        })
        this.courseSportVoList.forEach( (courseItem) => {
          if (courseItem.sportType != 3) {
            for (var facItem of courseItem.facilityTypeUnitVoList) {
              
              for(var unitItem of facItem.unitInfoVoList) {
                // console.log('11')
                courseSportDetailVoList.push( {
                  facilityName: facItem.facilityName,
                  facilityType: facItem.facilityType,
                  rank: courseItem.sportRank,
                  unitId: unitItem.unitId,
                  unitValue: unitItem.unitValue
                })
              }
            }
          }
        })
      } catch(error) {
         this.$notify.warning('请填写完整训练基础值');
         return;
      }
      if (courseSportBindlist.length < 1 || courseSportDetailVoList < 1) {
        this.$notify.warning('请填写完整训练基础值');
        return;
      } 
      let params = {};
      params.bodies = bodies;
      params.courseSportBindlist = courseSportBindlist;
      params.courseSportDetailVoList = courseSportDetailVoList;
      if (!this.name) {
        this.$notify.warning('课程名称不能为空');
        return;
      }
      params.name = this.name;
      if (this.courseId) {
        params.planCourseId = this.courseId;
      }
      updatePlanCourse({
        param: JSON.stringify(params)
      }).then( (res) => {
        if (res.data.code == 200) {
          this.$notify.success('编辑课程成功');
          this.$router.push({path: '/training/course'})
          return;
        } else {
           this.$notify.error('编辑课程失败');
        }
      }).catch( () => {
        this.$notify.error('编辑课程失败');
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.courseId) {
        this.fetchCourseDetail();
      }
      this.fetchTrainingParts();
      this.fetchAnaerobic();
      this.fetchStretchList();
      this.fetchAerobic();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.courseConfigPage {
  box-sizing: border-box;
  padding: 20px;
}

.courseConfig_item {
  @include flexbox;
  @include align-items(center);
  margin: {
    top: 20px;
    bottom: 20px;
  }
}

.courseConfig_subTitle {
  width: 80px;
}

.courseSportList {
  border: 1px solid #e5e5e5;
  width: 100%;
  padding: 20px;
  .item {
    @include flexbox;
    background-color: #e5e5e5;
    margin: {
      bottom: 20px;
    }
    padding: 10px;
    .list_number {
      @include flexbox;
      @include align-items(center);
      @include justify-content(center);
      width: 50px;
      height: 100%;
      .list_number_box {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #999999;
        color: white;
        line-height: 30px;
        text-align: center;
      }
    }
    .list_item {
      flex: 1;
    }
  }
}
.dialog_aerobic_unitConfig {
  @include flexbox;
  @include align-items(center);

}

.dialog_unitConfig {
   @include flexbox;
  @include align-items(center);
  padding:  {
    top: 5px;
    bottom: 5px;
  }
}
.item.sortable-chosen {
  background: $blue;
}
</style>

<template>
  <div class="diseaseConfig">
    <div class="disease_to_level">
      病痛对应设备的训练难度:{{trainingLevel}}
      <a class="hyperlink" @click="level_setting" v-permission="'430d0bc4-3ee0-455c-9778-3492d3ac0a71'">设置</a>
    </div>

    <div class="diseaseList_header">
      <sub-title title="病痛列表"></sub-title>
      <el-button type="primary" @click="createDisease" v-permission="'b8fb5ecd-0c10-40d8-9e4e-23e71afd85a1'">新增</el-button>
    </div>
    
    <el-dialog title="设置" :visible.sync="levelVisible" width="50%" center>
      <div class="dialog_item">
        <div class="dialog_subtitle">病痛对应设备的训练难度(单选)</div>
        <el-radio-group v-model="dialog_level">
          <el-radio :label="item.id" v-for="(item, index) in levels" :key="index">{{item.strengthLv}}</el-radio>
        </el-radio-group>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="levelVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmConfig">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="isCreate ? '新增': '编辑'" :visible.sync="dialogVisible" width="50%" center :before-close="handleClose"> 
      <div class="dialog_item">
        <div class="dialog_subtitle">病痛名称</div>
        <el-input placeholder="病痛名称(6字以内)" v-model="diseaseName" style="width: 250px" maxlength="6"></el-input>
      </div>
      <div class="dialog_item">
        <div class="dialog_subtitle">对应设备</div>
        <div class="facilitiesBox">
          <div class="facility_a">无氧运动设备</div>
          <div class="facility_checkbox">
            <el-checkbox-group v-model="dialog_facility">
              <el-checkbox v-for="item in facilityes_a" :label="item.facilityType" :key="item.id" border>{{item.facilityName}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="facility_b">有氧运动设备</div>
          <div class="facility_checkbox">
            <el-checkbox-group v-model="dialog_facility">
              <el-checkbox v-for="item in facilityes_b" :label="item.facilityType" :key="item.id" border>{{item.facilityName}}
                <span>(主:{{item.parts.mainParts}};辅:{{item.parts.minorParts}})</span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdate">确 定</el-button>
      </span>
    </el-dialog>

    <div class="diseaseTable" v-permission="'53d8095a-2c8d-4b4f-8b2b-54ea3494f6f8'">
      <el-table :data="diseases" style="width: 100%">
        <el-table-column label="序号" prop="id">
        </el-table-column>
        <el-table-column label="疾病" prop="name">
        </el-table-column>
        <el-table-column label="对应器械" prop="facilities">
        </el-table-column>
        <el-table-column label="操作" prop="time" width="300">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="editDisease(scope.row)" v-permission="'9fb6e43c-3f57-4a72-89df-4553c1d6ac4a'">编辑</el-button>
            <el-button type="danger" plain @click="remove(scope.row)" v-permission="'9868dce1-8cff-4be0-b486-a6081cfba91d'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import {
  getDiseaseList,
  updateDisease,
  removeDisease
} from 'api/training/disease';

import { getSportFacility } from 'api/training/sportFacility';

import { getPlanRank } from 'api/training/trainingLevel';

import {
  getTrainingConfig,
  updateTrainingConfig
} from 'api/training/trainingConfig';

export default {
  data() {
    return {
      // configDialog: false,
      levelId: '',
      dialog_level: '',
      diseases: [],
      levels: [],
      id: '',
      isCreate: false,
      levelVisible: false,
      dialogVisible: false,
      diseaseName: '',
      checkedFacility: [], // 选定无氧
      facilityes_a: [],
      facilityes_b: [],
      dialog_facility: [] // 临时
    };
  },
  components: {
    SubTitle
  },
  computed: {
    trainingLevel() {
      if (!this.levelId || this.levels.length == 0) {
        this.configDialog = true;
        return '';
      } else {
        let item = this.levels.find(item => item.id == this.levelId);
        if (!item) {
          this.configDialog = true;
          return ''
        };
        this.configDialog = false;
        return item.strengthLv
      }
    }
  },
  watch: {
    dialog_facility_a(val) {
      // console.log(val);
    }
  },
  methods: {
    // goToConfig() {
    //   this.level_setting();
    // },
    editDisease(row) {
      this.dialog_facility = row.facilityTypeConfList.map(item => {
        return item.facilityType;
      });
      this.checkedFacility = row.facilityTypeConfList.map(item => {
        return item.facilityType;
      });
      this.diseaseName = row.name;
      this.id = row.id;
      this.isCreate = false;
      this.dialogVisible = true;
    },
    confirmUpdate() {
      if (!this.dialog_facility || this.dialog_facility.length < 1) {
        this.$notify.warning('请选择对应的器械');
        return;
      }
      this.dialogVisible = false;
      this.checkedFacility = this.dialog_facility;
      if (this.isCreate) {
        updateDisease({
          name: this.diseaseName,
          facilityTypeList: this.checkedFacility.join(',')
        })
          .then(res => {
            if (res.data.code == 200) {
              this.$notify.success('新建伤痛病史成功');
              this.fetchDisease();
              return;
            } else {
              this.$notify.error('新建伤痛病史失败');
            }
          })
          .catch(() => {
            this.$notify.error('新建伤痛病史失败');
          });
      } else {
        updateDisease({
          id: this.id,
          name: this.diseaseName,
          facilityTypeList: this.checkedFacility.join(',')
        })
          .then(res => {
            if (res.data.code == 200) {
              this.$notify.success('编辑伤痛病史成功');
              this.fetchDisease();
              return;
            } else {
              this.$notify.error('编辑伤痛病史失败');
            }
          })
          .catch(() => {
            this.$notify.error('编辑伤痛病史失败');
          });
      }
    },
    createDisease() {
      this.isCreate = true;
      this.diseaseName = '';
      this.dialog_facility = [];
      this.id = '';
      this.dialogVisible = true;
    },
    fetchDisease() {
      getDiseaseList({
        page: 1,
        size: 100
      }).then(res => {
        res.data.data.list.forEach((item, index) => {
          item.facilities = [];
          item.facilityTypeConfList.forEach((facilityItem, index) => {
            item.facilities.push(facilityItem.facilityName);
          });
          item.facilities = item.facilities.join(';');
        });
        this.diseases = res.data.data.list;
      });
    },
    remove(row) {
      if (confirm('确认删除吗?')) {
      removeDisease({
        id: row.id
      })
        .then(res => {
          if (res.data.code == 200) {
            this.$notify.success('删除伤痛病史成功');
            this.fetchDisease();
            return;
          } else {
            this.$notify.error('删除伤痛病史失败');
          }
        })
        .catch(() => {
          this.$notify.error('删除伤痛病史失败');
        });
      }
    },
    handleClose(done) {
      done();
    },
    level_setting() {
      this.levelVisible = true;
    },
    confirmConfig() {
      this.levelVisible = false;
      updateTrainingConfig({
        confType: 'medicalHis',
        confValue: this.dialog_level
      }).then( (res) => {
        if (res.data.code == 200) {
          this.$notify.success('修改配置成功');
          this.levelId = this.dialog_level;
          this.fetchConfig();
          return;
        } else {
           this.$notify.error('修改配置失败');
        }
      }).catch( () => {
        this.$notify.error('修改配置失败');
      })
    },
    fetchLevel() {
      getPlanRank().then(res => {
        this.levels = res.data.data.list;
      });
    },
    fetchConfig() {
      getTrainingConfig({
        confType: 'medicalHis'
      }).then(res => {
        this.levelId = res.data.data.confValue;
        this.dialog_level = parseInt(res.data.data.confValue)
      });
    },
    fetchSportFacility_a() {
      getSportFacility({
        facilityKind: 1
      }).then(res => {
        res.data.data.forEach((item, index) => {
          let mainParts;
          let minorParts;
          if (item.mainBodyList) {
            let main = [];
            item.mainBodyList.forEach((item, index) => {
              main.push(item.name);
            });
            mainParts = main.join('、');
          } else {
            mainParts = '';
          }
          if (item.minorBodyList) {
            let minor = [];
            item.minorBodyList.forEach((item, index) => {
              minor.push(item.name);
            });
            minorParts = minor.join('、');
          } else {
            minorParts = '';
          }

          item.parts = {
            mainParts: mainParts,
            minorParts: minorParts
          };
        });
        this.facilityes_a = res.data.data;
      });
    },
    fetchSportFacility_b() {
      getSportFacility({
        facilityKind: 2
      }).then(res => {
        res.data.data.forEach((item, index) => {
          let mainParts;
          let minorParts;
          if (item.mainBodyList) {
            let main = [];
            item.mainBodyList.forEach((item, index) => {
              main.push(item.name);
            });
            mainParts = main.join('、');
          } else {
            mainParts = '';
          }
          if (item.minorBodyList) {
            let minor = [];
            item.minorBodyList.forEach((item, index) => {
              minor.push(item.name);
            });
            minorParts = minor.join('、');
          } else {
            minorParts = '';
          }

          item.parts = {
            mainParts: mainParts,
            minorParts: minorParts
          };
        });
        this.facilityes_b = res.data.data;
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {
        vm.fetchDisease();
      });
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchLevel();
      this.fetchConfig();
      this.fetchSportFacility_a();
      this.fetchSportFacility_b();
      this.fetchDisease();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.disease_to_level {
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
  border: 1px solid #e5e5e5;
}

.diseaseList_header {
  @include flexbox;
  @include align-items(center);
  @include justify-content(space-between);
  margin: {
    top: 20px;
  }
}
.dialog_item {
  @include flexbox;
  margin: {
    top: 10px;
    bottom: 20px;
  }
  .dialog_subtitle {
    width: 100px;
  }
  .facilitiesBox {
    width: 80%;
    .facility_a,.facility_b {
      padding: {
        bottom: 10px;
        top: 10px;
      }
    }
  }
}
</style>

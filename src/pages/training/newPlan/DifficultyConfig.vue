<template>
  <div class="difficultyConfigPage">
    <sub-title title="训练难度设置"></sub-title>
    <div class="planType">训练类型: {{planType}}</div>
    <div class="configTip">注：此处的难度设置是浮动值</div>
    <!-- 修改强度 -->
    <el-dialog title="强度设置" :visible.sync="dialogVisible" width="50%" center :before-close="handleClose">
        <div class="dialog_item">
          <div class="dialog_subtitle">设备名称</div>
          <el-input v-model="dialog_facilityName" style="width: 250px" disabled></el-input>
        </div>

        <div class="dialog_item" 
             v-for="(value, key, index) in dialog_unitMap"
             :key="index"
             >
               <div class="dialog_subtitle">{{key}}</div>
               <div v-for="(item, index) in value.unitModifyDetailList"
                     :key="index"
                     class="dialog_subItem">
                  <span>{{item.unitName}}:</span>
                  <el-input style="width: 170px" v-model="item.changeData" placeholder="输入如:+10">
                    <template slot="append">{{item.unitSymbol}}</template>
                  </el-input>
               </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmUpdate">确 定</el-button>
        </span>
      </el-dialog>

    <el-table :data="difficultyConfigTable" style="width: 100%" v-loading="isLoadingConig">
      <el-table-column label="分类" prop="sportType">
        <template slot-scope="scope">
          {{scope.row.sportType == 1 ? '无氧设备' : '有氧设备'}}
        </template>
      </el-table-column>
      <el-table-column label="设备名称" prop="facilityName">
      </el-table-column>
      <el-table-column v-for="(item, index) in levels" :key="index" :label="item.strengthLv">
        <template slot-scope="scope">
          <div v-for="(unitItem, unitIndex) in scope.row.planRankUnitVoMap[item.strengthLv].unitModifyDetailList"
               :key="unitIndex">
            <span>{{unitItem.unitName}}:</span><span>{{unitItem.changeData ? unitItem.changeData :'0'}}</span><span>{{unitItem.unitSymbol}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="editConig(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import { getTrainingTypeDifficulty, updateTrainingTypeDifficulty } from 'api/training/newPlan';

import { getPlanRank } from 'api/training/trainingLevel';

export default {
  name: 'difficultyConfig',
  data() {
    return {
      dialog_facilityName: '',
      dialog_facilityType: '',
      dialog_sportType: '',
      dialog_unitMap: {},
      levels: [],
      difficultyConfigTable: [],
      dialogVisible: false,
      isLoadingConig: false,
    }
  },
  watch: {
    dialog_unitMap(value) {
      // console.log(value)
    }
  },
  components: {
    SubTitle
  },
  computed: {
    planTypeId() {
      return this.$route.query.planTypeId;
    },
    planType() {
      return this.$route.query.planType;
    }
  },
  methods: {
    verifyValue(value) {
      var re = /^(\+|\-)(\d)+$/
      if (!re.test(value)) {
        this.$notify.error('请以"+"或"-"开头拼接数字的格式输入,如:+10');
        return false;
      } else {
        return true;
      }
    },
    yieldParms(obj) {
      let keys = Object.keys(obj);
      let isUseable = true;
      let params = [];
      keys.forEach( (item, index) => {
        if (isUseable) {
          obj[item].unitModifyDetailList.forEach( (unitItem, unitIndex) => {
            if (isUseable) {
              let one_param = {};
              one_param.planTypeId = this.planTypeId;
              one_param.planRankId = obj[item].planRankId;
              one_param.facilityName = this.dialog_facilityName;
              one_param.facilityType = this.dialog_facilityType;
              one_param.sportType = this.dialog_sportType;
              one_param.unitId = unitItem.unitId;
              if (this.verifyValue(unitItem.changeData)) {
                one_param.unitValue = unitItem.changeData;
              } else {
                isUseable = false;
                return;
              }
              params.push(one_param)
            } else {
              return;
            }
          })
        } else {
          return;
        }
      })
      if (isUseable) {
        return JSON.stringify(params);
      } else {
        return false;
      }
  //  planTypeId: this.planTypeId,
  // `plan_rank_id` int(11) DEFAULT NULL COMMENT '难度等级id',
  // `facility_name` varchar(255) DEFAULT NULL COMMENT '设备名称',
  // `facility_type` varchar(255) DEFAULT NULL COMMENT '设备类型',
  // `sport_type` int(2) DEFAULT NULL COMMENT '设备运动类型(1:有氧; 2:无氧)',
  // `unit_id` int(11) DEFAULT NULL COMMENT '单位id',
  // `unit_value` varchar(255) DEFAULT NULL COMMENT '值',
    },
    editConig(row) {
      this.dialog_facilityName = row.facilityName;
      this.dialog_facilityType = row.facilityType;
      this.dialog_sportType = row.sportType;
      this.dialog_unitMap = JSON.parse(JSON.stringify(Object.assign({},row.planRankUnitVoMap)));
      this.dialogVisible = true;
    },
    confirmUpdate() {
      let params = this.yieldParms(this.dialog_unitMap);
      if (params) {
        this.dialogVisible = false;
        updateTrainingTypeDifficulty({
          param: params
        }).then( (res) => {
          if ( res.data.code == 200) {
            this.$notify.success('编辑强度配置成功')
            this.fetchConfig();
            return;
          } else {
            this.$notify.error('编辑强度配置失败')
          }
        }).catch( () => {
          this.$notify.success('编辑强度配置失败')
        })
      }
    },
    handleClose(done) {
      done();
    },
    fetchLevel() {
      return new Promise( (resolve, reject) => {
        getPlanRank()
          .then(res => {
            if (res.data.code == 200) {
              this.levels = res.data.data.list;
              resolve();
            } else {
              reject();
            }
          })
          .catch(() => {
            reject()
          });
      })
    },
    fetchConfig() {
      this.isLoadingConig = true;
      getTrainingTypeDifficulty({
        planTypeId: this.planTypeId
      }).then(res => {
        // console.log(res);
        this.difficultyConfigTable = res.data.data ? res.data.data : [];
        this.isLoadingConig = false;
      }).catch( () => {
        this.isLoadingConig = false;
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchLevel();
      this.fetchConfig();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.difficultyConfigPage {
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
}

.planType {
  box-sizing: border-box;
  padding: 20px;
  background-color: #e5e5e5;
  margin: {
    top: 20px;
    bottom: 20px;
  }
}
.configTip {
  width: 100%;
  font-size: 14px;
  padding: {
    top: 5px;
    bottom: 10px;
  }
}
.dialog_item {
  @include flexbox;
  @include align-items(center);
  padding: {
    top: 10px;
    bottom: 10px;
  }
}
.dialog_subItem {
  box-sizing: border-box;
  padding: {
    right: 10px;
  }
}
.dialog_subtitle {
  width: 100px;
}
</style>

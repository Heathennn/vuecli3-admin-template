<template>
  <div class="sportFacilityPage">
    <div class="facility_aerobic" v-permission="'8820871b-fa64-48e2-bb8f-1688c50a1579'">
      <sub-title title="有氧运动设备"></sub-title>
      <el-table :data="facility_aerobic" style="width: 100%" v-permission="'d90838a2-08fe-4570-9034-f4eaf1b22016'">
        <el-table-column label="设备ID" prop="id">
        </el-table-column>
        <el-table-column label="设备名称" prop="facilityName">
        </el-table-column>
        <el-table-column label="设备类型" prop="sportType">
          <template slot-scope="scope">
            {{ scope.row.sportType == 2 ? '有氧设备': '无氧设备'}}
          </template>
        </el-table-column>
        <el-table-column label="训练部位" prop="parts">
          <template slot-scope="scope" v-if="scope.row.parts">
            主:{{scope.row.parts.mainParts}} 副: {{scope.row.parts.minorParts}}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="time">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="edit(scope.row)" v-permission="'616b357d-302c-4724-899f-7baa3f1049f6'">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑 -->
     <el-dialog title="编辑" :visible.sync="dialogVisible" width="50%" center :before-close="handleClose">
      <div class="dialog_trainingType">
        <span>设备名称</span> <span>{{editingItem.facilityName}}</span>
      </div>
      <div class="dialog_trainingType">
        <span>设备类型</span> <span>{{editingItem.sportType == 1 ? '无氧设备' : '有氧设备'}}</span>
      </div>
      <div style="padding-top: 10px;padding-bottom: 10px">主要部位</div>
      <div style="width: 100%;">
        <el-checkbox-group v-model="selectedMainPart">
          <el-checkbox v-for="part in editingItem.mainPart" :label="part.id" :key="part.id" border>{{part.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div style="padding-top: 10px;padding-bottom: 10px">辅助部位</div>
      <div style="width: 100%;">
        <el-checkbox-group v-model="selectedMinorPart">
          <el-checkbox v-for="part in editingItem.minorPart" :label="part.id" :key="part.id" border>{{part.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdate">确 定</el-button>
      </span>
    </el-dialog>

    <div class="facility_anaerobic" v-permission="'39c54448-4cd6-49ed-be70-947b84077591'">
      <sub-title title="无氧运动设备"></sub-title>
      <el-table :data="facility_anaerobic" style="width: 100%" v-permission="'d599b5b0-8b9f-4dd5-824d-28c5b9194a7c'">
        <el-table-column label="设备ID" prop="id">
        </el-table-column>
        <el-table-column label="设备名称" prop="facilityName">
        </el-table-column>
        <el-table-column label="设备类型" prop="sportType">
          <template slot-scope="scope">
            {{ scope.row.sportType == 2 ? '有氧设备': '无氧设备'}}
          </template>
        </el-table-column>
        <el-table-column label="训练部位" prop="adminName">
          <template slot-scope="scope" v-if="scope.row.parts">
            主:{{scope.row.parts.mainParts}} 副: {{scope.row.parts.minorParts}}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="time">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="edit(scope.row)" v-permission="'86015a6a-4046-4185-9399-d1e20b603986'">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import { getSportFacility, facilityConnectBody } from 'api/training/sportFacility';

import { getTrainingParts } from 'api/training/trainingParts';

export default {
  data() {
    return {
      facility_aerobic: [],
      facility_anaerobic: [],
      dialogVisible: false,
      selectedMainPart: [],
      selectedMinorPart: [],
      editingItem: {},
    }
  },
  watch: {
    selectedMainPart(val) {
      // console.log(val)
    }
  },
  components: {
    SubTitle
  },
  methods: {
    handleClose(done) {
      this.selectedMainPart = [];
      this.selectedMinorPart = [];
      done();
    },
    edit(row) {
      this.editingItem = row;
      this.selectedMainPart = row.mainBodyList ? row.mainBodyList.map(item => item.id) : [];
      this.selectedMinorPart = row.minorBodyList ? row.minorBodyList.map(item => item.id) : []
      this.dialogVisible = true;
      getTrainingParts({ page: 1, size: 100}).then( (res) => {
        this.editingItem = Object.assign({}, this.editingItem, {
          mainPart: res.data.data.list.concat()
        })
        this.editingItem = Object.assign({}, this.editingItem, {
          minorPart: res.data.data.list.concat()
        })
      }) 
    },
    fetchFacility_anaerobic() {
      getSportFacility({
        facilityKind: 1 // 无氧
      }).then( (res) => {
        res.data.data.forEach( (item, index) => {
          let mainParts = item.mainBodyList ? item.mainBodyList.map( mainItem => mainItem.name).join('、') : '无';
          let minorParts = item.minorBodyList ? item.minorBodyList.map( minorItem => minorItem.name).join('、') : '无';
          item.parts = {
            mainParts: mainParts,
            minorParts: minorParts
          }
        })
        this.facility_anaerobic = res.data.data;

      })
    },
    fetchFacility_aerobic() {
      getSportFacility({
        facilityKind: 2 // 有氧
      }).then( (res) => {
        res.data.data.forEach( (item, index) => {
          let mainParts = item.mainBodyList ? item.mainBodyList.map( mainItem => mainItem.name).join('、') : '无';
          let minorParts = item.minorBodyList ? item.minorBodyList.map( minorItem => minorItem.name).join('、') : '无';
          item.parts = {
            mainParts: mainParts,
            minorParts: minorParts
          }
        })
        this.facility_aerobic = res.data.data
      })
    },
    confirmUpdate() {
      this.dialogVisible = false;
      facilityConnectBody({
        facilityType: this.editingItem.facilityType,
        mainIds: this.selectedMainPart.join(','),
        minorIds: this.selectedMinorPart.join(',')
      }).then( (res) => {
        if (res.data.code == 200) {
          this.$notify.success('关联部位成功');
          this.fetchFacility_anaerobic();
          this.fetchFacility_aerobic();
          return;
        }
        this.$notify.error('关联部位失败');
        return
      }).catch( () => {
        this.$notify.error('关联部位失败')
      })
    }
  },
  mounted() {
    this.$nextTick( () => {
      this.fetchFacility_anaerobic();
      this.fetchFacility_aerobic();
    })
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.sportFacilityPage {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}
.facility_aerobic {
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid #e5e5e5;
  margin: {
    bottom: 20px;
  }
}
.facility_anaerobic {
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid #e5e5e5;
}
.dialog_trainingType {
  padding: {
    top: 10px;
    bottom: 10px;
  }
}
</style>

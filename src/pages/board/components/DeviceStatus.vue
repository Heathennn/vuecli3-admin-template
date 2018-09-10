<template>
  <div class="deviceStatus">
    <div class="device1">
      <div class=""></div>
      <el-radio-group v-model="activeDevice">
        <el-radio-button :label="'运动设备'">运动设备({{sportData.length}})</el-radio-button>
        <el-radio-button :label="'弱电设备'">弱电设备({{weakData.length}})</el-radio-button>
      </el-radio-group>
      <el-button @click.native="refreshData" v-permission="'a028d0f1-eb3f-4deb-b7f1-1918d3a3d0b6'">刷新</el-button>
      <div class="device1Table" v-loading="isFetchingData" v-permission="'b8d05981-5192-4982-8b92-b008bc09c01f'">
        <el-table :data="active" style="width: 100%" border height="600">
          <el-table-column prop="facilityNo" label="设备ID" width="180">
          </el-table-column>
          <el-table-column prop="facilityName" label="设备名称" width="180">
          </el-table-column>
          <el-table-column prop="useStatus" label="状态">
          </el-table-column>
          <el-table-column label="通电开/关" width="120">
            <template slot-scope="scope">
              <admin-switch v-permission="'1fd9b2be-b3b4-4218-8ed4-2b36ecaba420'" v-if="scope.row.isBind == 0" :switchToggle="scope.row.electrifiedSwitch" @click.native="switchControl(scope.$index, scope.row)"></admin-switch>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="报备" width="180">
            <template slot-scope="scope">
              <div>{{scope.row.abnormalCode ? scope.row.abnormalCode : '正常' }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

import AdminSwitch from 'components/AdminSwitch';

import { deepCopy } from 'common/utils';

export default {
  data() {
    return {
      _switch: true,
      isFetchingData: false,
      activeDevice: '运动设备'
    };
  },
  components: {
    AdminSwitch
  },
  //    storeId 门店id  --> firmStoreId
  //  * equipmentId 设备id --> facilityNo
  //  * equipmentType 设备类型 --> facilityVsersion
  //  * status 1 开 0 关
  //  * fid 设备表ID --> id
  //  * level  1 设备开关 0 电源开关
  //  * sign 签名
  computed: {
    ...mapState({
      defaultStore: state => state.board.defaultStore,
      deviceList_sport: state => state.board.deviceList_sport,
      deviceList_weak: state => state.board.deviceList_weak
    }),
    sportData() {
      let list = deepCopy(this.deviceList_sport);
      list.forEach((item, index) => {
        item.useStatus =
          item.useStatus == '0' ? '设备空闲' : item.useStatus == '1' ? '设备使用中' : item.useStatus == '2' ? '设备断网中/设备断电中' : item.useStatus == '3' ? '设备异常' : item.useStatus == '4' ? '设备不存在' : ''
        item.abnormalCount = item.abnormalCount + '次';
      });
      return list;
    },
    weakData() {
      let list = deepCopy(this.deviceList_weak);
      list.forEach((item, index) => {
        item.useStatus =
          item.useStatus == '0' ? '设备空闲' : item.useStatus == '1'? '设备使用中' : item.useStatus == '2' ? '设备断网中/设备断电中' : item.useStatus == '3' ? '设备异常' : item.useStatus == '4' ? '设备不存在' : ''
        item.abnormalCount = item.abnormalCount + '次';
      });
      return list;
    },
    active() {
      if (this.activeDevice === '运动设备') {
        return this.sportData;
      } else {
        return this.weakData;
      }
    }
  },
  methods: {
    ...mapActions(['getDeviceList', 'setSportDeviceSwitch', 'updateFacilityStatus']),
    ...mapMutations(['setWeakDeviceSwitch']),
    fetchData(storeInfo, facilityKind) {
      return this.getDeviceList({
        facilityKind: facilityKind,
        storeId: storeInfo.id
      });
    },
    switchControl(index, row) {
      // console.log(index, row);
      let param = {
        storeId: row.firmStoreId,
        equipmentId: row.facilityNo,
        equipmentType: row.facilityVsersion,
        status: row.electrifiedSwitch == '1' ? '0' : '1',
        fid: row.id,
        level: 2
      };
      // console.log(param);
      this.setSportDeviceSwitch(param)
        .then(() => {
          this.$notify.success('操作成功');
          this.refreshData();
        })
        .catch(message => {
          this.$notify.error(message);
        });
    },
    weakSwitchControl(index, row) {
      // console.log(row);
      let param = {
        storeId: row.firmStoreId,
        equipmentId: row.facilityNo,
        equipmentType: row.facilityType,
        status: row.electrifiedSwitch == '1' ? '0' : '1',
        fid: row.id,
        level: 2
      };
      this.setSportDeviceSwitch(param)
        .then(() => {
          this.$notify.success('操作成功');
          this.refreshData();
        })
        .catch(message => {
          this.$notify.error(message);
        });
    },
    refreshData() {
      this.isFetchingData = true;
      this.updateFacilityStatus({
        storeId: this.defaultStore.id,
        facilityKind: 1
      }).then( () => {
        this.updateFacilityStatus({
          storeId: this.defaultStore.id,
          facilityKind: 2
        }).then( () => {
          this.fetchData(this.defaultStore, 1)
            .then(() => {
              this.fetchData(this.defaultStore, 2)
                .then(() => {
                  this.isFetchingData = false;
                })
                .catch(() => {
                  this.isFetchingData = false;
                });
            })
            .catch(() => {
              this.isFetchingData = false;
            });
        }).catch( () => {
          this.isFetchingData = false;
        })
      }).catch( () => {
        this.isFetchingData = false;
      })


    }
  },
  watch: {
    defaultStore(value) {
      this.refreshData();
    }
  },
  mounted() {
    this.$nextTick(() => {});
  }
};
</script>

<style lang="scss" scoped>
.deviceStatus {
  box-sizing: border-box;
  padding: 15px;
  .device1 {
    margin: {
      bottom: 20px;
    }
  }
}
</style>

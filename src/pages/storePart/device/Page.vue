<template>
  <div class="protalPage">
    <!-- <div class="devicePage"> -->
    <el-dialog title="添加未绑设备" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <!-- <div class="subTitle">设备ID</div>
        <el-input placeholder="输入设备ID" v-model="editingDevice.id" clearable>
        </el-input> -->
      <div class="popup_item">
        <div class="subTitle">设备类型</div>
        <el-select v-model="editingDevice.facilityKind" placeholder="请选择">
          <el-option v-for="item in editingTypes" :key="item.type" :label="item.name" :value="item.type">
          </el-option>
        </el-select>
      </div>

      <div class="popup_item">
        <div class="subTitle">设备名称</div>
        <el-input placeholder="设备名称" v-model="editingDevice.facilityName" clearable>
        </el-input>
      </div>

      <div class="popup_item">
        <div class="subTitle">设备位置</div>
        <el-input placeholder="设备位置" v-model="editingDevice.facilityPosition" clearable>
        </el-input>
      </div>

      <div class="popup_item">
        <div class="subTitle">设备厂商</div>
        <el-input placeholder="输入设备厂商" v-model="editingDevice.facilityFirm" clearable>
        </el-input>
      </div>

      <div class="popup_item">
        <div class="subTitle">备注</div>
        <el-input placeholder="编辑备注..." v-model="editingDevice.remarks" clearable type="textarea">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">提交</el-button>
      </span>
    </el-dialog>

    <div class="devicePage">
      <div class="title">
        设备绑定
      </div>
      <div class="radioSelect">
        <el-radio-group v-model="deviceStatus">
          <el-radio-button label="已绑设备" v-permission="'ae3d5a92-8e82-44f1-8043-b29870fe1bac'"></el-radio-button>
          <el-radio-button label="未绑设备" v-permission="'63583d5e-fe4e-4576-a6b0-bcbc427179ac'"></el-radio-button>
        </el-radio-group>
        <el-button @click.native="refresh" v-permission="'854f790e-9132-4039-b259-d2148fef47be'">刷新</el-button>
      </div>
      <div class="selects">
        <div class="storeSelect" v-if="deviceStatus == '已绑设备'"  v-permission="'05c0dbff-f94d-4e52-bff4-2ca87e09c55f'">
          <el-select v-model="store" placeholder="请选择">
            <el-option v-for="item in storeList" :key="item.id" :label="item.storeName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="statusSelect" v-if="deviceStatus == '已绑设备'"  v-permission="'05c0dbff-f94d-4e52-bff4-2ca87e09c55f'">
          <el-select v-model="type" placeholder="请选择">
            <el-option v-for="item in deviceTypes" :key="item.type" :label="item.name" :value="item.type">
            </el-option>
          </el-select>
        </div>
        <!-- <div class="searchBar"> -->
          <!-- <el-input placeholder="设备ID/名称/门店" v-model="input">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input> -->
        <!-- </div> -->

        <div class="buttons" v-if="deviceStatus == '未绑设备'">
          <el-button type="primary" @click.native="syncDevice" v-permission="'58f16c39-cafb-4b2b-aa4d-267c793cab3e'" v-if="$store.state.auth.userInformation.isAdmin == 1">一键同步</el-button>
          <!-- <el-button type="primary" @click.native="addDevice">添加未绑设备</el-button> -->
        </div>
      </div>
      <div class="deviceTableBox" v-loading="isLoadingData">
        <device-table v-if="deviceStatus == '已绑设备'" :tableData="boundDeviceList"
                      @refreshData="refresh"></device-table>
        <unbind-device-table v-else :tableData="unboundDeviceList" @refreshData="refresh"></unbind-device-table>
      </div>
      <div class="paginationBox" v-if="deviceStatus === '已绑设备'" v-permission="'05c0dbff-f94d-4e52-bff4-2ca87e09c55f'">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
        </el-pagination>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import DeviceTable from './components/DeviceTable';

import UnbindDeviceTable from './components/UnbindDeviceTable';

import { mapState, mapActions } from 'vuex';

import { deepCopy } from 'common/utils';

export default {
  components: {
    DeviceTable,
    UnbindDeviceTable
  },
  data() {
    return {
      deviceStatus: '已绑设备',
      dialogVisible: false,
      bind: 1,
      store: 'all',
      type: 'all',
      input: '',
      currentPage: 1,
      pageSizes: [10, 20, 30, 40],
      curPageSize: 10,
      curTotal: 0,
      deviceTypes: [
        {
          type: 'all',
          name: '全部类型'
        },
        {
          type: 1,
          name: '运动设备'
        },
        {
          type: 2,
          name: '弱电设备'
        },
        {
          type: 0,
          name: '其他设备'
        }
      ],
      editingTypes: [
        {
          type: 1,
          name: '运动设备'
        },
        {
          type: 2,
          name: '弱电设备'
        },
        {
          type: 0,
          name: '其他设备'
        }
      ],
      editingDevice: {
        facilityName: '',
        facilityPosition: '',
        facilityFirm: '',
        remarks: '',
        facilityKind: 1
      }
    };
  },
  watch: {
    store(value) {
      // console.log(value);
      this.filterBoundDevices();
    },
    type(value) {
      this.filterBoundDevices();
    }
  },
  computed: {
    ...mapState({
      boundDeviceList: state => state.device.boundDeviceList,
      unboundDeviceList: state => state.device.unboundDeviceList,
      dropdownStoreList: state => state.device.dropdownStoreList,
      isLoadingData: state => state.device.isLoadingData
    }),
    storeList() {
      // let list = [];
      let list = deepCopy(this.dropdownStoreList);
      list.unshift({
        storeName: '全部门店',
        id: 'all'
      });
      return list;
    },
    currentTableData() {
      if (this.deviceStatus == '已绑设备') {
        this.bind = 1;
        return this.boundDeviceList;
      }
      if (this.deviceStatus == '未绑设备') {
        this.bind = 2;
        return this.unboundDeviceList;
      }
    }
  },
  methods: {
    ...mapActions([
      'getDeviceListByIsBound',
      'getDropDownStoreList',
      'deviceSync',
      'editDeviceInfo'
    ]),
    handleSizeChange(val) {
      this.curPageSize = val;
      this.filterBoundDevices();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.filterBoundDevices();
    },
    createFilterParams() {
      let params = {};
      if (this.store !== 'all') {
        params.storeId = this.store;
      }
      if (this.type !== 'all') {
        params.facilityKind = this.type;
      }
      params.bundling = 1;
      params.page = this.currentPage;
      params.size = this.curPageSize;
      // console.log(params)
      return params;
    },
    filterBoundDevices() {
      this.getDeviceListByIsBound(this.createFilterParams()).then( (res) => {
        this.curTotal = res.total;
        this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
        this.curPageSize = res.pageSize;
      })
    },
    filterUnboundDevices() {
      this.getDeviceListByIsBound({
        page:1,
        size: 100,
        bundling: 2
      })
    },
    refresh() {
      this.filterBoundDevices();
      this.filterUnboundDevices();
    },
    syncDevice() { // 一键同步
      this.deviceSync({
        storeId: 123
      }).then(() => {
        this.refresh();
      });
    },
    addDevice() {
      this.dialogVisible = true;
      this.isEdit = false;
    },
    confirm() {
      // 添加未绑设备
      this.dialogVisible = false;
      let params = {
        facilityType: '',
        facilityKind: this.editingDevice.facilityKind,
        facilityPosition: this.editingDevice.facilityPosition,
        facilityFirm: this.editingDevice.facilityFirm,
        remarks: this.editingDevice.remarks
      };
      this.editDeviceInfo(params);
      // this.$notify.success('添加未绑设备成功');
    },
    handleClose(done) {
      done();
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.$nextTick( () => {
        vm.filterBoundDevices();
        vm.filterUnboundDevices();
        vm.getDropDownStoreList();
      });
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.filterBoundDevices();
      this.filterUnboundDevices();
      this.getDropDownStoreList();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.devicePage {
  background-color: #ffffff;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  // overflow-y: scroll;
  padding: 20px;
  .title {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
    }
  }
  .selects {
    @include flexbox;
  }
  .storeSelect {
    margin: {
      right: 20px;
    }
  }

  .statusSelect {
    margin: {
      right: 50px;
    }
  }
  .radioSelect {
    padding: {
      top: 20px;
      bottom: 20px;
    }
  }
  .searchBar {
    margin: {
      right: 20px;
    }
  }
}
</style>

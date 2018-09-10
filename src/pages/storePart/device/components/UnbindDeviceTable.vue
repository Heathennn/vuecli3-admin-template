<template>
  <div class="storeTable">
    <el-dialog title="编辑未绑设备" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="subTitle">设备ID</div>
      <el-input placeholder="输入设备ID" v-model="editingDevice.id" :disabled="true">
      </el-input>
      <div class="popup_item">
        <div class="subTitle">设备类型</div>
        <el-select v-model="editingDevice.facilityKind" placeholder="请选择">
          <el-option v-for="item in deviceTypes" :key="item.type" :label="item.name" :value="item.type">
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

    <el-dialog title="绑定设备" :visible.sync="dialogVisible2" width="30%" :before-close="handleClose" v-loading="isBinding">
      <el-select v-model="store" placeholder="请选择门店">
        <el-option v-for="item in dropdownStoreList" :key="item.id" :label="item.storeName" :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="confirm2(willUnbindDevice.id, store)">确认绑定</el-button>
      </span>
    </el-dialog>

    <el-table :data="datas" style="width: 100%" :header-cell-style="headStyle" height="550" v-permission="'ce0e4fba-6229-49d4-982d-3d6852821813'">
      <el-table-column label="设备ID" prop="facilityNo" width="100">
      </el-table-column>
      <el-table-column label="厂商" prop="facilityFirm" width="120">
      </el-table-column>
      <el-table-column label="入库时间" prop="createTime">
      </el-table-column>
      <el-table-column label="设备类型" prop="facilityType">
      </el-table-column>
      <el-table-column label="设备名称" prop="facilityName">
      </el-table-column>
      <el-table-column label="所属门店" prop="storeName">
      </el-table-column>
      <el-table-column label="位置" prop="facilityPosition">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a href="###" @click="showDialog(scope.row)" v-permission="'1bf41164-4c4f-47eb-88eb-e50f0fcceced'">编辑</a>
          <a href="###" @click="showDiglog2(scope.row)" v-permission="'37b471ae-f47b-407c-8639-9829be510865'">绑定</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import moment from 'moment';

import { mapState, mapActions } from 'vuex';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState({
      dropdownStoreList: state => state.device.dropdownStoreList
    }),
    datas() {
      let copy = JSON.parse(JSON.stringify(this.tableData));
      copy.forEach((item, index) => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
      });
      return copy;
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      editingDevice: {},
      willUnbindDevice: {},
      facilityPosition: '',
      selectedType: '',
      isEdit: true,
      isBinding: false,
      store: '',
      remarks: '',
      deviceTypes: [
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
      headStyle: {
        // 'text-align': 'center',
        // color: 'red'
      }
    };
  },
  methods: {
    ...mapActions(['editDeviceInfo', 'bindDevice']), // 编辑设备信息, 绑定设备
    showDialog(item) {
      // 编辑
      // console.log(item);
      this.editingDevice = item;
      this.facilityPosition = item.facilityPosition;
      this.remarks = item.remarks;
      this.dialogVisible = true;
    },
    showDiglog2(item) {
      // 解绑
      this.willUnbindDevice = item;
      // console.log(item);
      this.dialogVisible2 = true;
    },
    confirm() {
      // 编辑确认
      let params = {
        id: this.editingDevice.id,
        facilityType: '',
        facilityKind: this.editingDevice.facilityKind,
        facilityPosition: this.editingDevice.facilityPosition,
        facilityFirm: this.editingDevice.facilityFirm,
        remarks: this.editingDevice.remarks
      };
      // console.log(params);
      this.editDeviceInfo(params);
      this.dialogVisible = false;
    },
    confirm2(id, store) {
      // 绑定确认
      this.dialogVisible2 = false;
      this.$notify({
          title: '提示',
          message: `设备[${id}]正在绑定门店[${store}]...`,
          type: 'warning'
        })
      this.bindDevice({
        id: id,
        storeId: store,
        bindingTime: moment().format('YYYY-MM-DD HH:mm:ss')
      }).then(() => {
        this.$notify({
          title: '成功',
          message: `设备[${id}]绑定门店[${store}]成功`,
          type: 'success'
        })
        this.$emit('refreshData')
      }).catch( (error) => {
        // console.log(error);
        this.dialogVisible2 = false;
      })
    },
    handleClose(done) {
      done();
    },
    handleEdit1(index, row) {
      // console.log(index, row);
    },
    handleEdit2(index, row) {
      // console.log(index, row);
    },
    handleEdit3(index, row) {
      // console.log(index, row);
    },
    handleEdit4(index, row) {
      // console.log(index, row);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.item {
  margin-top: 10px;
  margin-right: 40px;
}

.popup_item {
  width: 100%;
  box-sizing: border-box;
  padding: {
    top: 10px;
    bottom: 10px;
  }
}
</style>

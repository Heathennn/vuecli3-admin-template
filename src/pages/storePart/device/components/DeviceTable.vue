<template>
  <div class="storeTable">
    <el-dialog title="编辑设备" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="subTitle">设备位置</div>
      <el-input placeholder="输入设备位置..." v-model="facilityPosition" clearable>
      </el-input>
      <div class="subTitle">备注</div>
      <el-input placeholder="编辑备注..." v-model="remarks" clearable type="textarea">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm(editingDevice)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="解绑设备" :visible.sync="dialogVisible2" width="30%" :before-close="handleClose">
      <div>设备ID: {{willUnbindDevice.id}}</div>
      <div>设备类型: {{willUnbindDevice.facilityType}}</div>
      <div>设备名称: {{willUnbindDevice.facilityName}}</div>
      <div>设备厂商: {{willUnbindDevice.facilityFirm}}</div>
      <div>入库时间: {{willUnbindDevice.id}} </div>
      <div>绑定时间: {{willUnbindDevice.id}}</div>
      <div>所属门店: {{willUnbindDevice.storeName}}</div>
      <div>备注: {{willUnbindDevice.remarks}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="confirm2(willUnbindDevice.id)">确认解绑</el-button>
      </span>
    </el-dialog>

    <el-table :data="datas" style="width: 100%" :header-cell-style="headStyle" v-permission="'05c0dbff-f94d-4e52-bff4-2ca87e09c55f'">
      <el-table-column label="设备ID" prop="id" width="100">
      </el-table-column>
      <el-table-column label="厂商" prop="facilityFirm" width="120">
      </el-table-column>
      <el-table-column label="绑定时间" prop="bindingTime">
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
          <a href="###" @click="showDialog(scope.row)" v-permission="'51c3af70-f600-4d4e-999f-f73665ff7ed5'">编辑</a>
          <a href="###" @click="showDiglog2(scope.row)" v-permission="'83184ec1-0ec2-488e-b41d-3e13e647aa9d'">解绑</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import moment from 'moment';

import { mapActions } from 'vuex';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    datas() {
      let copy = JSON.parse(JSON.stringify(this.tableData));
      copy.forEach((item, index) => {
        item.bindingTime = item.bindingTime ? moment(item.bindingTime).format('YYYY-MM-DD HH:mm:ss') : '无'; 
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
      remarks: '',
      headStyle: {
        // 'text-align': 'center',
        // color: 'red'
      }
    };
  },
  methods: {
    ...mapActions(['editDeviceInfo', 'unbindDevice']), // 编辑设备信息, 解绑设备
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
      this.dialogVisible2 = true;
    },
    confirm(item) {
      // 编辑确认
      let params = {
        id: item.id,
        facilityType: item.facilityType,
        facilityKind: item.facilityKind,
        facilityPosition: this.facilityPosition,
        facilityFirm: item.facilityFirm,
        remarks: this.remarks
      };
      // console.log(params);
      this.editDeviceInfo(params);
      this.dialogVisible = false;
    },
    confirm2(id) {
      // 解绑确认
      this.dialogVisible2 = false;
      this.$notify({
        title: '提示',
        message: `设备[${id}]正在解绑...`,
        type: 'warning'
      });
      this.unbindDevice({
        id: id
      })
        .then(() => {
          this.$notify({
            title: '成功',
            message: `设备[${id}]解绑成功`,
            type: 'success'
          });
          this.$emit('refreshData')
        })
        .catch(() => {
          this.$notify.error({
            title: '失败',
            message: `设备[${id}]解绑失败`
          });
        });
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
</style>

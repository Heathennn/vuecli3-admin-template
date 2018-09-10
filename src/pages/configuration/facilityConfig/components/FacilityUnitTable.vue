<template>
  <div>
    <el-dialog title="编辑" center :visible.sync="dialogVisible" width="70%">
      <div class="dialog_item">
        <div class="dialog_subtitle">设备类型</div>
        <div>{{dialog_sportType == 1 ? '无氧设备' : dialog_sportType == 2 ? '有氧设备' : ''}}</div>
      </div>
      <div class="dialog_item">
        <div class="dialog_subtitle">设备名称</div>
        <div>{{dialog_facilityName}}</div>
      </div>
      <div class="dialog_item">
        <div class="dialog_subtitle">单位</div>
        <el-checkbox-group v-model="dialog_units">
          <el-checkbox v-for="(item, index) in unitList" :label="item.id" :key="index">{{item.name}}:单位({{item.unitSymbol}})</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-table :data="datas" style="width: 100%">
      <el-table-column prop="sportType" label="设备类型">
        <template slot-scope="scope">
          {{scope.row.sportType == 1 ? '无氧运动' : scope.row.sportType == 2 ? '有氧运动' : ''}}
        </template>
      </el-table-column>
      <el-table-column prop="facilityName" label="设备名称"></el-table-column>
      <el-table-column prop="unitStr" label="单位"> 
        <template slot-scope="scope">
          <span v-if="scope.row.unitStr">{{scope.row.unitStr}}</span>
          <span v-else>空</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="score2" label="大小"></el-table-column> -->
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="editImage(scope.row)" v-permission="'95a347c2-672e-47ee-9ae6-677e512f55a8'">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
 <script>
import { uploadFileApi } from 'common/common';
import {
  updateFacilityConfig,
  getUnitList
} from 'api/configuration/facilityConfig';

export default {
  data() {
    return {
      id: '',
      dialog_facilityType: '',
      dialogVisible: false,
      dialog_units: [],
      dialog_sportType: '',
      dialog_facilityName: '',
      imageUrl: '',
      actionApi: uploadFileApi,
      unitLists: []
    };
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    dialog_units(val) {
      // console.log(val)
    }
  },
  computed: {
    unitList() {
      return this.unitLists.filter( (item, index) => {
        return item.unitType == this.dialog_sportType
      })
    },
    datas() {
     let list = this.tableData.concat()
     if (this.unitLists.length < 1 || this.tableData.length < 1) {
       return;
     }
     list.forEach( (item) => {
        let unit = item.typeUnit ? item.typeUnit.split(',') : []; // [1,2]
        let unitStr = '';
        unit.forEach( (unitItem) => {
          let _item = this.unitLists.find( (unit) => unit.id == unitItem);
          unitStr += `${_item.name}(${_item.unitSymbol});`;
        })
        item.unitStr = unitStr
      })
      return list;
    }
  },
  methods: {
    fetchUnit() {
      getUnitList({
        page: 1,
        size: 10
      }).then(res => {
        this.unitLists = res.data.data.list;
      });
    },
    editImage(row) {
      this.id = row.id;
      this.dialog_facilityType = row.facilityType;
      this.dialog_sportType = row.sportType;
      this.dialog_facilityName = row.facilityName;
      this.dialog_units = row.typeUnit.split(',').map((item) => parseInt(item));
      this.dialogVisible = true;
    },
    confirm() {
      this.dialogVisible = false;
      updateFacilityConfig({
        id: this.id,
        facilityName: this.dialog_facilityName,
        facilityType: this.dialog_facilityType,
        sportType: this.dialog_sportType,
        typeUnit: this.dialog_units.join(',')
      }).then( (res) => {
        if (res.data.code == 200) {
          this.$notify.success('编辑设备配置成功');
          this.$emit('refreshData')
          return;
        } else {
          this.$notify.error('编辑设备配置失败');
        }
      }).catch( () => {
        this.$notify.error('编辑设备配置失败');
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchUnit();
    });
  }
};
</script>
<style lang="scss" scoped>
@import '~assets/style/utils';
.dialog_item {
  @include flexbox;
  padding: {
    top: 10px;
    bottom: 10px;
  }
}
.dialog_subtitle {
  width: 120px;
}
</style>
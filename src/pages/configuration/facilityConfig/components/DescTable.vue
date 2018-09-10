<template>
<div>
  <el-dialog title="描述编辑" center :visible.sync="dialogVisible" width="70%">
      <div class="dialog_item">
        <div class="dialog_subtitle">设备类型</div>
        <div>{{dialog_sportType == 1 ? '无氧设备' : dialog_sportType == 2 ? '有氧设备' : ''}}</div>
      </div>
      <div class="dialog_item">
        <div class="dialog_subtitle">设备名称</div>
        <div>{{dialog_facilityName}}</div>
      </div>
      <div class="dialog_item">
        <div class="dialog_subtitle">设备简介({{dialog_desciption.length}}/50)</div>
        <el-input type="textarea" v-model="dialog_desciption" placeholder="限50汉字" maxlength="50" style="width: 400px"></el-input>
      </div>
      <div class="dialog_item">
        <div class="dialog_subtitle">训练部位说明({{dialog_bodyTip.length}}/100)</div>
        <el-input style="width: 500px" type="textarea" v-model="dialog_bodyTip" placeholder="限100汉字" maxlength="100"></el-input>
      </div>
      <div class="dialog_item">
        <div class="dialog_subtitle">使用要点({{dialog_keypoint.length}}/1000)</div>
        <el-input style="width: 500px" type="textarea" v-model="dialog_keypoint" placeholder="限1000汉字" maxlength="1000"></el-input>
      </div>
      <div class="dialog_item">
        <div class="dialog_subtitle">防护说明({{dialog_protect.length}}/1000)</div>
        <el-input style="width: 500px" type="textarea" v-model="dialog_protect" placeholder="限1000汉字" maxlength="1000"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="sportType" label="设备类型">
        <template slot-scope="scope">
          {{scope.row.sportType == 1 ? '无氧运动' : scope.row.sportType == 2 ? '有氧运动' : ''}}
        </template>
      </el-table-column>
      <el-table-column prop="facilityName" label="设备名称"></el-table-column>
      <el-table-column prop="typeSummary" label="简介"> </el-table-column>
      <el-table-column prop="typeMuscle" label="训练部位说明"></el-table-column>
      <el-table-column prop="typeKeypoint" label="使用要点"></el-table-column>
      <el-table-column prop="typeProtect" label="防护说明"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="editDesc(scope.row)" v-permission="'9e29efc0-0fb2-4112-ab42-6b756c4a8c9d'">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
</div>
</template>
<script>
import { updateFacilityConfig } from 'api/configuration/facilityConfig';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      id: '',
      dialogVisible: false,
      dialog_sportType: '',
      dialog_facilityName: '',
      dialog_facilityType: '',
      dialog_desciption: '',
      dialog_bodyTip: '',
      dialog_keypoint: '',
      dialog_protect: ''
    }
  },
  methods: {
    editDesc(row) {
      this.id = row.id;
      this.dialog_facilityName = row.facilityName;
      this.dialog_facilityType = row.facilityType;
      this.dialog_sportType = row.sportType;
      this.dialog_desciption = row.typeSummary;
      this.dialog_bodyTip = row.typeMuscle;
      this.dialog_keypoint = row.typeKeypoint;
      this.dialog_protect = row.typeProtect;
      this.dialogVisible = true;
    },
    confirm() {
      this.dialogVisible = false;
      updateFacilityConfig({
        id: this.id,
        facilityName: this.dialog_facilityName,
        facilityType: this.dialog_facilityType,
        sportType: this.dialog_sportType,
        typeSummary: this.dialog_desciption,
        typeMuscle: this.dialog_bodyTip,
        typeKeypoint: this.dialog_keypoint,
        typeProtect: this.dialog_protect
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
    this.$nextTick( () => {
      // console.log(this.tableData)
    })
  }
}
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
   width: 150px;
 }
 </style>
 
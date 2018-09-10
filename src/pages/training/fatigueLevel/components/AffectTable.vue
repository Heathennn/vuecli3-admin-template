<template>
<div> 
  <el-dialog title="编辑" :visible.sync="affectVisible" width="50%" center>
      <div class="dialog_item">
        <div class="dialog_subtitle">疲劳反馈</div>
        <div >{{dialog_tiredName}}</div>
      </div>
      <div class="dialog_item">
        <div class="dialog_subtitle">有氧设备</div>
        <div v-for="(item, index) in dialog_aerobicList" :key="index">
          <span>{{item.unitName}}</span>
          <el-input v-model="item.changeData" style="width: 130px">
            <span slot="append">{{item.unitSymbol}}</span>
          </el-input>
        </div>
      </div>
      <div class="dialog_item">
        <div class="dialog_subtitle">无氧设备</div>
        <div v-for="(item, index) in dialog_anaerobicList" :key="index">
          <span>{{item.unitName}}</span>
          <el-input v-model="item.changeData" style="width: 130px">
            <span slot="append">{{item.unitSymbol}}</span>
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="affectVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="疲劳反馈分类" prop="planTiredName">
    </el-table-column>
    <el-table-column label="有氧设备">
      <template slot-scope="scope" v-if="scope.row.aerobicList && scope.row.aerobicList.length > 0">
        <div v-for="(item,index) in scope.row.aerobicList" 
             :key="index"
             >
             {{item.unitName}}: <span>{{item.changeData}}{{item.unitSymbol}} </span> 
        </div>
      </template>
    </el-table-column>
    <el-table-column label="无氧设备" prop="topicContent">
      <template slot-scope="scope" v-if="scope.row.anaerobicList && scope.row.anaerobicList.length > 0">
        <div v-for="(item,index) in scope.row.anaerobicList" 
             :key="index">
              {{item.unitName}}: <span>{{item.changeData}}{{item.unitSymbol}} </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" prop="time">
      <template slot-scope="scope">
        <el-button type="primary" plain @click="editAffect(scope.row)" v-permission="'8d8d4feb-fe89-4d4f-8e55-f21e5dfddcc7'">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import { updateFatigueAffect } from 'api/training/fatigueLevel';
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      affectVisible: false,
      dialog_tiredName: '',
      dialog_aerobicList: [],
      dialog_anaerobicList: [],
      dialog_frequency: '',
      dialog_planTiredId: ''
    }
  },
  methods: {
    yieldParams() {
      let params1 = [];
      this.dialog_aerobicList.forEach( (item) => {
        params1.push({
          planTiredId: this.dialog_planTiredId,
          sportType: 2,
          unitId: item.unitId,
          frequency: this.dialog_frequency,
          changeData: item.changeData
        })
      })
      let params2 = [];
      this.dialog_anaerobicList.forEach( (item) => {
         params2.push({
          planTiredId: this.dialog_planTiredId,
          sportType: 1,
          unitId: item.unitId,
          frequency: this.dialog_frequency,
          changeData: item.changeData
        })
      })
      return JSON.stringify(params1.concat(params2))
    },
    editAffect(row) {
      this.dialog_tiredName = row.planTiredName;
      this.dialog_frequency = row.frequency;
      this.dialog_planTiredId = row.planTiredId;
      this.dialog_aerobicList = JSON.parse(JSON.stringify(row.aerobicList))
      this.dialog_anaerobicList = JSON.parse(JSON.stringify(row.anaerobicList))
      this.affectVisible = true;
    },
    confirm() {
      this.affectVisible = false;
      updateFatigueAffect({param:this.yieldParams()}).then( (res) => {
        if (res.data.code == 200) {
          this.$notify.success('编辑疲劳评价影响成功');
          this.$emit('refreshData')
          return;
        } else {
          this.$notify.error('编辑疲劳评价影响失败');
        }
      }).catch( () => {
        this.$notify.error('编辑疲劳评价影响失败');
      }) 
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.dialog_item {
  @include flexbox;
  margin: {
    top: 5px;
    bottom: 10px;
  }
}
.dialog_subtitle {
  width: 100px;
}
</style>


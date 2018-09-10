<template>
  <div class="trainingPartPage">
    <div class="trainingPart_header">
      <sub-title title="训练部位"></sub-title>
      <el-button type="primary" @click="createPart" v-permission="'521d8eab-fe6e-4e27-96e7-8ad08bc5d95d'">新增</el-button>
    </div>
    <el-table :data="trainingParts" style="width: 100%" v-permission="'7160b4ce-5f0f-4f71-8df1-01c67db25849'">
      <el-table-column label="ID" prop="id">
      </el-table-column>
      <el-table-column label="训练部位" prop="name">
      </el-table-column>
      <el-table-column label="操作" prop="time" width="300">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="editPart(scope.row)" v-permission="'184f36ae-f220-4ae3-bd89-6a264d79193d'">编辑</el-button>
          <el-button type="danger" plain @click="removePart(scope.row)" v-permission="'d933203a-2f41-4e29-afe1-70a8204711ec'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-dialog :title="isCreate ? '新建' : '编辑'" :visible.sync="dialogVisible" width="40%" center :before-close="handleClose">
        <div class="dialog_parts">
          <div class="dialog_subTitle">训练部位</div>
          <el-input v-model="currentPart" style="width: 250px" maxlength="6" placeholder="6字以内"></el-input>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmUpdate">确 定</el-button>
        </span>
      </el-dialog>

  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import { getTrainingParts, removeTrainingParts, updateTrainingParts } from 'api/training/trainingParts';

export default {
  data() {
    return {
      isCreate: false,
      trainingParts: [],
      dialogVisible: false,
      currentId: null,
      currentPart: '',
    }
  },
  components: {
    SubTitle
  },
  methods: {
    fetchTrainingParts() {
      getTrainingParts({
        page: 1,
        size: 100
      }).then((res) => { 
        this.trainingParts = res.data.data.list
      });
    },
    removePart(row) {
      if (confirm('确认要删除吗')) {
      removeTrainingParts({
        id: row.id
      }).then( (res) => {
        if ( res.data.code == 200) {
          this.$notify.success('删除成功');
          this.fetchTrainingParts();
          return;
        }
        this.$notify.error('删除失败')
      }).catch(() => {
        this.$notify.error('删除失败')
      })
      }
    },
    editPart(row) {
      this.isCreate = false;
      this.currentPart = row.name;
      this.currentId = row.id;
      this.dialogVisible = true;
    },
    createPart() {
      this.isCreate = true;
      this.dialogVisible = true;
    },
    handleClose(done) {
      this.currentPart = '';
      this.currentId = null;
      done();
    },
    confirmUpdate() {
      if (!this.currentPart) {
        return this.$notify.error('请输入部位名称');
      }
      if (this.isCreate) {
        updateTrainingParts({
          name: this.currentPart
        }).then( (res) => {
          if ( res.data.code == 200) {
            this.$notify.success('创建成功');
            this.dialogVisible = false;
            this.fetchTrainingParts();
            return;
          }
          this.$notify.error('创建失败');
          this.dialogVisible = false;
        }).catch( () => {
          this.$notify.error('创建失败');
          this.dialogVisible = false;
        })
      } else {
         updateTrainingParts({
           id: this.currentId,
           name: this.currentPart
        }).then( (res) => {
          if ( res.data.code == 200) {
            this.$notify.success('编辑成功');
            this.dialogVisible = false;
            this.fetchTrainingParts();
            return;
          }
          this.$notify.error('编辑失败');
          this.dialogVisible = false;
        }).catch( () => {
          this.$notify.error('编辑失败');
          this.dialogVisible = false;
        })
      }
    }
  },
  mounted() {
    this.$nextTick( () => {
      this.fetchTrainingParts();
    })
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.trainingPartPage {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}
.trainingPart_header {
  @include flexbox;
  @include align-items(center);
  @include justify-content(space-between);
  margin: {
    bottom: 20px;
  }
}
.dialog_parts {
  @include flexbox;
  @include align-items(center);
  .dialog_subTitle {
    width: 80px;
  }
}
</style>

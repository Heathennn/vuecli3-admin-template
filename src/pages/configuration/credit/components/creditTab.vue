  <template>
  <div>
    <el-table :data="datas" style="width: 100%">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="sceneDescribe" label="场景"></el-table-column>
      <el-table-column prop="score1" label="加分"> </el-table-column>
      <el-table-column prop="score2" label="减分"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)" v-permission="'874ca175-ec62-47b8-aaf2-dc6aa6291d3b'">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑" :visible.sync="centerDialogVisible" width="30%" center :before-close="handleClose">
      <template slot-scope="scope">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="场景">
            <span>{{currentEditingItem.sceneDescribe}}</span>
          </el-form-item>
          <el-form-item label="加减分">
            <el-input v-model="score" placeholder="如输入+50,-50"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="confirm(currentEditingItem)">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

  <script>
import { deepCopy } from 'common/utils';

import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions(['updateCreditConfig']),
    vertifyData() {
      let symbol = this.score[0];
      // console.log(symbol);
      let isSymbol = false;
      if (symbol === '+') { 
        this.plusOrMinus = 1; // 加分
        // console.log('加分')
        isSymbol = true;
      }
      if (symbol === '-' || symbol === '减') {
        this.plusOrMinus = 2; // 减分
        // console.log('减分');
        isSymbol = true;
      }

      // 处理空格
      let score = this.score.substr(1);
      // console.log(this.plusOrMinus);
      // console.log(score);
      this.parseScore = score;
      if ( isNaN(parseInt(score)) ) {
        this.$notify.error('请输入有效的分数(数字)');
        return false;
      } else {
        if (!isSymbol) {
          this.$notify.error('请输入正确的符号"+,-"');
          return false;
        } 
        else {
          return true;
        }
        // 增加输入汉字提示输入内容是否正确
      }

    },
    confirm(item) {
      this.centerDialogVisible = false;
      this.$notify.warning('正在修改信用分规则...');
      if (!this.vertifyData()) return; 
      this.updateCreditConfig({
        id: item.id,
        plusOrMinus: this.plusOrMinus, // 1加分 2减分
        score: this.parseScore, // 分数
      }).then( () => {
        // 修改成功
        this.$notify.success('信用分规则修改成功');
        this.$emit('refreshData')
      }).catch( () => {
        // 修改失败
        this.$notify.error('信用分规则修改失败');
        this.$emit('refreshData');
      })
    },
    cancel() {
      this.centerDialogVisible = false;
    },
    edit(row) {
      // console.log(row);
      this.currentEditingItem = row;
      this.centerDialogVisible = true;
    },
    handleClose(done) {
      done();
    }
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      centerDialogVisible: false,
      score: '',
      plusOrMinus: 1,
      sceneDescribe: '',
      parseScore: '',
      currentEditingItem: null
    };
  },
  computed: {
    datas() {
      var score2 = '';
      var score1 = '';
      let list = deepCopy(this.tableData);
      list.forEach((item, index) => {
        item.plusOrMinus = item.plusOrMinus === 1 ? '+' : '-'; //(判断加减)
        // item.score = parseInt(item.score);
        if (item.plusOrMinus == '+') {
          score1 = item.plusOrMinus + parseInt(item.score);
          item.score1 = score1;
        } else {
          score2 = item.plusOrMinus + item.score;
          item.score2 = score2;
        }
      });
      return list;
    },
  }
};
</script>
<style lang="scss" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.dialog-footer {
  margin-top: 20px;
}
</style>
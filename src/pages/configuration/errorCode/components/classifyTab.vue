  <template>
  <div>

    <el-table :data="datas" style="width: 100%">
      <el-table-column prop="createTime" label="创建日期">
      </el-table-column>
      <el-table-column prop="exceptionType" label="代码类型">
      </el-table-column>
      <el-table-column prop="abnormalCode" label="异常代码">
      </el-table-column>
      <el-table-column prop="exceptionSource" label="异常来源">
      </el-table-column>
      <el-table-column prop="abnormalType" label="异常类型">
      </el-table-column>
      <el-table-column prop="eventType" label="事件定义">
      </el-table-column>
      <el-table-column prop="abnormalDescribe" label="描述">
      </el-table-column>
      <el-table-column prop="handlePlan" label="建议处理">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="checkDetail(scope.row)" v-permission="'4d0c8657-7e67-4e90-aea9-06dc5d8300bd'">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="详情" :visible.sync="centerDialogVisible" width="50%" center>
      <template slot-scope="scope">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="添加日期">
            <span>{{currentDetail.createTime}}</span>
          </el-form-item>
          <el-form-item label="异常来源">
            <span>{{currentDetail.exceptionSource}}</span>
          </el-form-item>
          <el-form-item label="异常代码">
            <span>{{currentDetail.abnormalCode}}</span>
          </el-form-item>
          <el-form-item label="异常描述">
            <span>{{currentDetail.abnormalDescribe}}</span>
          </el-form-item>
          <el-form-item label="事件定义">
            <el-select v-model="eventType" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理建议">
            <el-input v-model="input" placeholder="请输入内容" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" plain @click="editErrorCode">确认</el-button>
          <el-button type="danger" plain @click="centerDialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { deepCopy } from 'common/utils';

// import moment from 'moment';

import { updateErrorCode } from 'api/configuration/errorCode';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      centerDialogVisible: false,
      currentDetail: {},
      // 1，设备异常；2，门店应急；3，安防报警
      options: [
        {
          value: 1,
          label: '设备异常'
        },
        {
          value: 2,
          label: '门店应急'
        },
        {
          value: 3,
          label: '安防报警'
        }
      ],
      eventType: 1,
      input: ''
    };
  },
  methods: {
    checkDetail(row) {
      // console.log(row);
      this.centerDialogVisible = true;
      this.currentDetail = row;
    },
    editErrorCode() {
      this.centerDialogVisible = false;
      updateErrorCode({
        id: this.currentDetail.id,
        abnormalType:
          this.currentDetail.abnormalType == '设备异常'
            ? 1
            : this.currentDetail.abnormalType == '门店应急'
              ? 2
              : this.currentDetail.abnormalType == '安防报警' ? 3 : '',
        handlePlan: this.input,
        eventType: this.eventType, //事件定义
        eventName: '设备异常'
      })
        .then(res => {
          if (res.data.code == 200) {
            this.$emit('refreshData');
            return this.$notify.success('编辑成功');
          }
          return this.$notify.error('编辑失败');
        })
        .catch(() => {
          return this.$notify.success('编辑失败');
        });
    }
  },
  mounted() {
    this.$nextTick(() => {});
  },
  computed: {
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach((item, index) => {
        item.abnormalType =
          item.abnormalType == 1
            ? '设备异常'
            : item.abnormalType == 2 ? '门店应急' : '安防报警';
        item.exceptionSource =
          item.exceptionSource == 0
            ? '无异常'
            : item.exceptionSource == 1
              ? '触键异常'
              : item.exceptionSource == 2 ? '主板设备异常' : '接口异常';
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
      });
      return list;
    }
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
  width: 50%;
}
.dialog-footer {
  margin: 20px;
}
</style>

<template>
  <div>
    <div class="searchBox">
      <el-input v-model="nickname" placeholder="搜索用户昵称" style="width: 180px; margin-right: 20px"></el-input>
      <el-input v-model="orderSn" placeholder="搜索订单号" style="width: 180px; margin-right: 20px;"></el-input>
      <el-button type="primary" @click="fetchData">搜索</el-button>
    </div>
    <div class="selectors">
      <el-date-picker v-model="time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" value-format="yyyy-MM-dd">
      </el-date-picker>
      <div style="margin-left: 20px; margin-right: 10px">审核状态</div>
      <el-select v-model="status" placeholder="请选择">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="申请时间" prop="createTime">
        <template slot-scope="scope">
          {{scope.row.createTime ? moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') : ''}}
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="orderSn">
      </el-table-column>
      <el-table-column label="申请用户" prop="userInfo.nickname">
      </el-table-column>
      <el-table-column label="已交押金" prop="refundMoney">
        <template slot-scope="scope">
          {{(scope.row.refundMoney/100).toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column label="原支付路径" prop="payPath">
        <template slot-scope="scope">
          {{scope.row.payPath == 1 ? '支付宝' : scope.row.payPath == 2 ? '微信' : ''}}
        </template>
      </el-table-column>
      <el-table-column label="退款时间" prop="refundTime">
        <template slot-scope="scope">
          {{scope.row.refundTime ? moment(scope.row.refundTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="退款金额">
        <template slot-scope="scope">
          {{(scope.row.refundMoney/100).toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column label="退款路径" prop="refundPath">
        <template slot-scope="scope">
          {{scope.row.refundPath == 1 ? '支付宝' : scope.row.refundPath == 2 ? '微信' : ''}}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="refundStatus">
        <template slot-scope="scope">
          {{scope.row.refundStatus == 1 ? '退款成功' : scope.row.refundStatus == 2 ? '退款失败' : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="refundStatus">
        <template slot-scope="scope">
          {{scope.row.auditStatus == 1 ? '待审核' : scope.row.auditStatus == 2 ? '已审核' : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="审核结果" prop="auditResult">
        <template slot-scope="scope">
          {{scope.row.auditResult == 1 ? '审核通过' : scope.row.auditResult == 2 ? '审核拒绝' : '-'}}
        </template>
      </el-table-column>
      <el-table-column label="摘要" prop="abstractContent">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primay" plain @click="jumpTo(scope.row)" v-permission="'5767db80-d5c9-4f74-9a38-81eeebfaa43d'">查看操作</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20,30,40]" :page-size="currentSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getAuditDeposit } from 'api/finance/auditDeposit';

export default {
  data() {
    return {
      currentPage: 1,
      currentSize: 10,
      curTotal: 0,
      dealStatus: 1,
      status: 0,
      nickname: '',
      orderSn: '',
      time: [],
      statusOptions: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '待审核',
          value: 1
        },
        {
          label: '已审核',
          value: 2
        }
      ],
      pickerOptions2: {
        shortcuts: [
          {
            text: '本周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '本月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '本年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      tableData: []
    };
  },
  watch: {
    time() {
      this.fetchData();
    },
    status() {
      this.fetchData();
    },
    tableData: {
      handler(curVal, oldVal) {
        if (curVal.length == 0) {
          this.$emit('changeStatus', false)
        } else {
          this.$emit('changeStatus', true)
        }
      },
      immediate: true
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick( () => {
        vm.fetchData();
      })
    })
  },
  methods: {
    handleSizeChange(val) {
      this.currentSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    mapPagination(res) {
      this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
      this.curTotal = res.total;
      this.currentSize = res.pageSize;
    },
    jumpTo(row) {
      this.$router.push({
        path: `/finance/auditDetail?id=${row.id}&dealStatus=${this.dealStatus}`
      });
    },
    setDefaultDate() {
      const end = this.moment().format('YYYY-MM-DD');
      const start = this.moment(end)
        .add(-30, 'days')
        .format('YYYY-MM-DD');
      this.time = [start, end];
    },
    yieldParams() {
      let params = {};
      params.auditStatus = this.status;
      params.beginTime = this.time[0];
      params.endTime = this.time[1];
      params.page = this.currentPage;
      params.size = this.currentSize;
      params.dealStatus = this.dealStatus;
      if (this.nickname) {
        params.userName = this.nickname;
      }
      if (this.orderSn) {
        params.orderSn = this.orderSn;
      }
      return params;
    },
    fetchData(params) {
      getAuditDeposit(this.yieldParams()).then(res => {
        this.tableData = res.data.data.list;
        this.mapPagination(res.data.data);
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setDefaultDate();
      this.fetchData(this.yieldParams());
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.searchBox {
  @include flexbox;
  @include align-items(center);
}

.selectors {
  padding: {
    top: 20px;
    bottom: 20px;
  }
  @include flexbox;
  @include align-items(center);
}
</style>


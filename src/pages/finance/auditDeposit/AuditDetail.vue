<template>
  <div class="auditDetailPage">
    <div class="detail_header">
      处理状态: {{dealStatus == 1 ? '待处理' : dealStatus == 2 ? '已处理' : ''}}
    </div>
    <div class="auditContent">
      <div class="auditInfo">
        <div class="info_item">
          <div class="info_item_subtitle">申请时间</div>
          <div class="info_item_content">{{moment(auditInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
        </div>
        <div class="info_item">
          <div class="info_item_subtitle">退款时间</div>
          <div class="info_item_content">{{auditInfo.refundTime ? moment(auditInfo.refundTime).format('YYYY-MM-DD HH:mm:ss') : '无'}}</div>
        </div>
        <div class="info_item">
          <div class="info_item_subtitle">订单号</div>
          <div class="info_item_content">{{auditInfo.orderSn}}</div>
        </div>
        <div class="info_item">
          <div class="info_item_subtitle">已交期限</div>
          <div class="info_item_content">三个月内</div>
        </div>
        <div class="info_item">
          <div class="info_item_subtitle" v-if="auditInfo.userInfo">申请用户</div>
          <div class="info_item_content">{{auditInfo.userInfo ? auditInfo.userInfo.nickname : ''}}</div>
        </div>
        <div class="info_item">
          <div class="info_item_subtitle">退款金额</div>
          <div class="info_item_content">{{(auditInfo.refundMoney / 100).toFixed(2) + '元'}}</div>
        </div>
        <div class="info_item">
          <div class="info_item_subtitle">申请用户ID</div>
          <div class="info_item_content">{{auditInfo.userId}}</div>
        </div>
        <div class="info_item">
          <div class="info_item_subtitle">退款路径</div>
          <div class="info_item_content">{{auditInfo.refundPath == 1 ? '支付宝' : auditInfo.refundPath == 2 ? '微信' : ''}}</div>
        </div>
        <div class="info_item">
          <div class="info_item_subtitle">已交押金</div>
          <div class="info_item_content">{{(auditInfo.depositMoney/100).toFixed(2) + '元'}}</div>
        </div>
        <div class="info_item">
          <div class="info_item_subtitle">退款账号</div>
          <div class="info_item_content">{{auditInfo.refundAccount ? auditInfo.refundAccount : '-'}}</div>
        </div>
        <div class="info_item">
          <div class="info_item_subtitle">交押金时间</div>
          <div class="info_item_content">{{moment(auditInfo.payTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
        </div>
        <div class="info_item">
          <div class="info_item_subtitle">退款账号实名</div>
          <div class="info_item_content">{{auditInfo.refundName ? auditInfo.refundName : '-'}}</div>
        </div>
        <div class="info_item">
          <div class="info_item_subtitle">原支付路径</div>
          <div class="info_item_content">{{auditInfo.payPath == 1 ? '支付宝' : auditInfo.payPath == 2 ? '微信' : ''}}</div>
        </div>
      </div>
      <div class="audit_order">
        <div class="audit_order_item">
          <div class="audit_order_subtitle">状态</div>
          <div class="audit_order_content">{{auditInfo.refundStatus == 1 ? '退款成功' : auditInfo.refundStatus == 2 ? '退款失败' : ''}}</div>
        </div>
        <div class="audit_order_item">
          <div class="audit_order_subtitle">摘要</div>
          <div class="audit_order_content">{{auditInfo.abstractContent}}</div>
        </div>
        <div style="height: 1px; width: 100%; border-top: 1px solid #999999"> </div>
        <div class="audit_order_item">
          <div class="audit_order_subtitle">审核</div>
          <div class="audit_order_content" v-if="dealStatus == 1">
            <el-radio-group v-model="auditResult">
              <el-radio :label="1">审核通过(退款)</el-radio>
              <el-radio :label="2">审核不通过(不退款)</el-radio>
            </el-radio-group>
          </div>
          <div class="audit_order_content" v-else>
            {{auditResult == 1 ? '审核通过(退款)' : auditResult == 2 ? '审核不通过(不退款)' : ''}}
          </div>
        </div>
        <div class="audit_order_item">
          <div class="audit_order_subtitle">备注</div>
          <div class="audit_order_content" v-if="dealStatus == 1">
            <el-input v-model="auditContent" placeholder="输入备注" style="width: 200px"></el-input>
          </div>
          <div class="audit_order_content" v-else>
            {{auditContent}}
          </div>
        </div>
        <div style="height: 1px; width: 100%; border-top: 1px solid #999999;margin-bottom: 30px"> </div>
        <el-button type="primary" v-if="dealStatus == 1" @click="submitAudit">确认提交</el-button>
        <div v-else style="color: #999999; font-size: 12px">操作人员: {{auditInfo.auditName}} 操作时间: {{moment(auditInfo.auditTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuditDetail, refundAudit } from 'api/finance/auditDeposit';

export default {
  name: 'auditDetail',
  data() {
    return {
      auditInfo: {},
      auditResult: '',
      auditContent: ''
    };
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    dealStatus() {
      return this.$route.query.dealStatus;
    }
  },
  methods: {
    submitAudit() {
      if(!this.auditContent) {
        return this.$notify.warning('请填写备注！')
      }
      refundAudit({
        id: this.id,
        auditResult: this.auditResult,
        auditReason: this.auditContent,
        auditAdminId: this.$store.state.auth.userInformation.id,
        auditName: this.$store.state.auth.userInformation.username
      }).then( (res) => {
        if (res.data.code == 200) {
          this.$notify.success('退款审核成功');
          this.$router.push({path: '/finance/auditDeposit'})
          return;
        } else {
          this.$notify.error('退款审核失败, 请重试');
        }
      }).catch( () => {
        this.$notify.error('退款审核失败, 请重试');
      })
    },
    fetchDetail() {
      getAuditDetail({
        id: this.id
      }).then(res => {
        this.auditInfo = res.data.data;
        this.auditResult = res.data.data.auditResult;
        this.auditContent = res.data.data.auditReason
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchDetail();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.auditDetailPage {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}
.detail_header {
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid #e5e5e5;
}
.auditContent {
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
  border: 1px solid #e5e5e5;
  margin: {
    top: 20px;
  }
}
.auditInfo {
  @include flexbox;
  @include flex-wrap(wrap);
  @include align-items(center);
  padding: 5px;
  border: 1px solid #e5e5e5;
  .info_item {
    padding: {
      top: 10px;
      bottom: 10px;
    }
    width: 50%;
    @include flexbox;
    @include align-items(center);
    .info_item_subtitle {
      width: 120px;
      color: #999999;
    }
  }
}

.audit_order {
  margin: {
    top: 20px;
  }
  background-color: #e5e5e5;
  box-sizing: border-box;
  padding: 20px;
}

.audit_order_item {
  @include flexbox;
  @include align-items(center);
  padding: {
    top: 5px;
    bottom: 10px;
  }
  .audit_order_subtitle {
    width: 60px;
  }
}
</style>

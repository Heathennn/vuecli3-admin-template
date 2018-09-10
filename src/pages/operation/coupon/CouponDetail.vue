<template>
  <div class="couponDetailPage">
    <div class="couponDetailHeader">
      <div>优惠券名称: {{name}}</div>
      <div>优惠券ID: {{id}}</div>
    </div>

    <div class="couponDetailContent">
      <div>
        <div>优惠券类型</div>
        <div>{{type == 1 ? '现金优惠券' : type == 2 ? '折扣优惠券' : type == 3 ? '次抵用优惠券' : type == 4 ? '小时抵用优惠券' : ''}}</div>
      </div>
      <div>
        <div>抵用时长</div>
        <div>{{hour}}</div>
      </div>
      <div>
        <div>消费类型</div>
        <div>预约消费</div>
      </div>
      <div>
        <div>使用门槛</div>
        <div>无门槛</div>
      </div>
      <div>
        <div>使用有效期</div>
        <div>15天</div>
      </div>
      <div>
        <div>关联门店</div>
        <div>不限</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    id() {
      return this.$route.query.id
    },
    name() {
      return this.$route.query.couponName
    },
    type() {
      return this.$route.query.type
    },
    hour() {
      return this.$route.query.hour
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.couponDetailPage {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}

.couponDetailHeader {
  padding: 20px;
  box-sizing: border-box;
  border: {
    bottom: 1px solid #e5e5e5;
  }
}

.couponDetailContent {
  padding: {
    top: 20px;
  }
  @include flexbox;
  @include justify-content(space-around);
  @include flex-wrap(wrap);
  @include align-items(center);
}
</style>


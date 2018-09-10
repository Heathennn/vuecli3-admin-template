<template>
  <div class="card shadow">
    <div class="cardTitle">
      {{ title }}
      <span style="color: #666666; font-size: 10px">{{unity}}</span>
    </div>
    <div class="cardValue">
      <countTo :startVal="0" :endVal="value" :duration="2000"></countTo> 
    </div>
  </div>
</template>

<script>
import countTo from 'vue-count-to';

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    unity: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: 0
    }
  },
  components: {
    countTo
  }
}
</script>

<style lang="scss" scoped>

.card {
  width: 23%;
  height: 150px;
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 10px;
  .cardValue {
    font-size: 30px;
    text-align: center;
    line-height: 100px;
  }
}
</style>

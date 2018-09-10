<template>
    <div class="admin-tips shadow">
        <span :style="iconStyle"></span>
        <slot></slot>
    </div>
</template>

<script>
  import tipIcon from 'assets/images/tip_icon.png';

  export default {
    name: "AdminTips",
    data() {
      return {
        iconStyle: {
          display: 'inline-block',
          width: '20px',
          height: '20px',
          backgroundImage: `url(${tipIcon})`,
          backgroundSize: '100% 100%'
        }
      }
    }

  }
</script>

<style lang="scss" scoped>
.admin-tips {
    width: 100%;
    overflow: auto;
    background: #616b76;
    font-size: 14px;
    color: white;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 10px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    margin: {
        top: 10px;
        bottom: 10px;
    }
}
</style>
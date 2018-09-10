<template>
  <div class="switchBox" :style="switchStyle">
    <div class="dot" ref="dot" :style="dotStyle"></div>
  </div>
</template>

<script>
export default {
  props: {
    switchToggle: {
      type: String,
      default: '1'
    }
  },
  watch: {
    switchToggle(value) {
      // console.log(value)
    }
  },
  computed: {
    switchStyle() {
      if (this.switchToggle == '1') {
        return {
          backgroundColor: 'blue',
        }
      } else {
        // this.$refs.dot.style.left = '21px';
        return {
          backgroundColor: 'gray'
        }
      }
    },
    dotStyle() {
      if (this.switchToggle == '1') {
        return {
          top: '1px',
          left: '1px'
        }
      } else {
        // this.$refs.dot.style.left = '21px';
        return {
          left: '21px'
        }
      }
    }
  },
  methods: {
    // switchControl() {
    //   this.$emit('switchControl', this.switchToggle);
    // },
    
  }
}
</script>

<style lang="scss" scoped>
.switchBox {
  width: 40px;
  height: 20px;
  border-radius: 10px;
  background-color: blue;
  position: relative;
  .dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #ffffff;
    position: absolute;
    left: 1px;
    top: 1px;
    transition: all .3s;
  }
}
</style>

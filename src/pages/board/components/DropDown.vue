<template>
  <div class="dropdown">
    <div class="icon" @click="dropdown">
      <i class="el-icon-arrow-down"></i>
    </div>
    <div class="opendoor" :style="isExpand ? 'width: 100px;height: 0' : 'width:100%;height: 70px'">
      开门
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isExpand: true
    };
  },
  methods: {
    dropdown() {
      this.isExpand = !this.isExpand;
    }
  }
};
</script>

<style lang="scss" scoped>
.opendoor {
  height: 0;
  width: 100%;
  transition: all .5s;
  overflow: hidden;
}
.dropdown {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>

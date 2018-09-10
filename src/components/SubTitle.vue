<template>
  <div class="_subTitle"><span class="titleIcon"></span><span class="titleContent">{{title}}</span></div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
._subTitle {
  height: 18px;
  display: flex;
  align-items: center;
}
.titleIcon {
  display: inline-block;
  width: 3px;
  height: 100%;
  background-color: #304156;
  margin: {
    right: 10px;
  }
}

.titleContent {
  color: #444444;
  font-size: 18px;
}
</style>

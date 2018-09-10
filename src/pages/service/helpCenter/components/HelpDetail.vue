<template>
  <div class="editHelpPage"> 
    <div class="editHelpTitle">编辑帮助</div>
    <div style="line-height: 50px">标题:</div>
    <el-input v-model="title"></el-input>
    <div style="line-height: 50px">内容:</div>
    <el-input v-model="content" type="textarea"></el-input>

    <el-button @click="updateHelp">保存</el-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      UEditor: null,
      detail: null,
      title: '',
      content: '',
    };
  },
  methods: {
    ...mapActions(['addHelp']),
    updateHelp() {
      if (!this.$route.query.helpDetail) { // 新增
        this.addHelp({
          title: this.title,
          content: this.content
        }).then( () => {
          this.$notify.success('新建帮助成功');
          this.$router.push({path: '/service/helpCenter'})
          this.$emit('refreshHelpCenter')
        }).catch( () => {
          this.$notify.error('新建帮助失败')
        }) 
      } else {
        this.addHelp({
          id: this.detail.id,
          title: this.title,
          content: this.content
        }).then( () => {
          this.$notify.success('编辑帮助成功');
          this.$router.push({path: '/service/helpCenter'});
         this.$emit('refreshHelpCenter')
        })
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(this.$route.query.helpDetail)
      if (this.$route.query.helpDetail) {
        this.detail = JSON.parse(this.$route.query.helpDetail);
        this.title = this.detail.title;
        this.content = this.detail.content;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.editHelpPage {
   background-color: #ffffff;
  width: 100%;
  height: calc(100% - 60px);
  box-sizing: border-box;
  padding: 20px;
  overflow-y: scroll;
  .editHelpTitle {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
    }
  }
}
</style>

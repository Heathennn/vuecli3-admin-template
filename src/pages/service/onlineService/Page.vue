<template>
  <div class="protalPage">
    <div class="feedbackPage">
      <div class="title">
        在线客服
      </div>
      <el-button type="primary" style="margin-top: 20px" @click.native="jump">点击跳转到好享瘦在线客服</el-button>
    </div>
  </div>
</template>

<script>
// import AbnormalOrderTable from './components/AbnormalOrderTable';
// http://act.hxsapp.cc/html/webim/imchat.html?uid=gym-0001&key=24628171
export default {
  components: {
    // AbnormalOrderTable
  },
  data() {
    return {
      time: '',
      currentPage4: 10,
      deviceStatus: '已绑设备',
      input: '',
      options: [
        {
          value: '选项1',
          label: '全部门店'
        },
        {
          value: '选项2',
          label: '双皮奶'
        }
      ],
      value: '选项1'
    };
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    },
    jump() {
      window.open('http://act.hxsapp.cc/html/webim/imchat.html?uid=gym-0001&key=24628171');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.feedbackPage {
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .title {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
    }
  }
  .selects {
    @include flexbox;
    box-sizing: border-box;
    padding: {
      top: 20px;
      bottom: 20px;
    }
  }
  .selectTitle {
    line-height: 40px;
    margin: {
      right: 10px;
    }
  }
  .statusSelect {
    margin: {
      right: 20px;
    }
  }
  .timeSelect {
    margin: {
      right: 100px;
    }
  }
  .paginationBox {
    padding: {
      top: 20px;
    }
  }
}
</style>

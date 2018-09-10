<template>
  <div class="createMessagePage">
    <el-dialog title="消息预览" :visible.sync="showDialog" width="30%" :before-close="handleClose" center>
      <div class="content" style="width: 100%">
        <div class="detailTitle">标题: {{messageTitle}}</div>
        <div class="detailContent">内容: {{messageContent}}</div>
        <div style="width: 100%; height: 1px; backgroundColor: #999999;"> </div>
        <div class="sendTime">发布时间: -</div>
        <div class="sendName">发布人: {{userInformation.username}}</div>
        <div class="sendType">消息类型: {{sendType == '3' ? '系统消息' : sendType == '2' ? 'APP推送' : ''}}</div>
        <div class="reciveType">接收群体: {{receiveType == 'all' ? '全部' : receiveType == 1 ? '店长端' : receiveType == 2 ? '用户端' : '-'}}</div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
      </span> -->
    </el-dialog>


    <div class="createMessageTitle">新建消息</div>
    <div class="selectTypes">
      <div class="selectMessageType">
        <div class="subTitle">消息类型</div>
        <el-select v-model="sendType" placeholder="请选择" style="width: 120px">
          <el-option v-for="item in messageTypeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="selectReceiveType">
        <div class="subTitle">接收群体</div>
        <el-select v-model="receiveType" placeholder="请选择" style="width: 100px">
          <el-option v-for="item in receiveTypeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="subTitle">标题({{currentTitleLength}}/50)</div>
    <el-input placeholder="输入标题(限50字符)" v-model="messageTitle" clearable :maxlength="maxlength">
    </el-input>

    <div class="subTitle">内容({{currentContentLength}}/500)</div>
    <el-input placeholder="输入内容(限500字符)" v-model="messageContent" clearable :maxlength="maxlength2" type="textarea" :rows="contentRow">
    </el-input>
    <div class="buttons">
      <el-button type="primary" @click.native="confirmSend">确认群发</el-button>
      <el-button @click.native="preview">预览</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      messageType: '系统消息',
      receiveType: 'all',
      showDialog: false,
      messageTitle: '',
      messageContent: '',
      contentRow: 5,
      maxlength: 50,
      maxlength2: 500,
      sendType: '3',
      messageTypeOptions: [
        {
          value: '3',
          label: '系统消息'
        },
        {
          value: '2',
          label: 'APP推送'
        }
      ],
      receiveTypeOptions: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 1,
          label: '店长端'
        },
        {
          value: 2,
          label: '用户端'
        }
      ]
    };
  },
  computed: {
    ...mapState({
      userInformation: state => state.auth.userInformation
    }),
    currentTitleLength() {
      return this.messageTitle.length;
    },
    currentContentLength() {
      return this.messageContent.length
    }
  },
  watch: {},
  methods: {
    ...mapActions(['sendMessages']),
    handleClose(done) {
      done();
    },
    confirmSend() {
      this.$router.push({path: '/operation/message'});
      // 确认群发
      if (this.receiveType === 'all') {
        this.sendMessages({
          userType: 1,
          pushType: 2, //批量推送
          sendType: this.sendType, //批量推送
          title: this.messageTitle,
          content: this.messageContent,
          createUid: this.userInformation.id,
          createName: this.userInformation.username
        }).then(() => {
          this.sendMessages({
            userType: 2,
            pushType: 2, //批量推送
            sendType: this.sendType, //批量推送
            title: this.messageTitle,
            content: this.messageContent,
            createUid: this.userInformation.id,
            createName: this.userInformation.username
          }).then(() => {
            this.$notify.success('消息群发成功');
            
            this.$emit('refreshMessageList')
          });
        });
        return;
      }
      this.sendMessages({
        userType: this.receiveType,
        pushType: 2, //批量推送
        sendType: this.sendType, //批量推送
        title: this.messageTitle,
        content: this.messageContent,
        createUid: this.userInformation.id,
        createName: this.userInformation.username
      }).then(() => {
        this.$notify.success('消息群发成功');
        this.$router.push({path: '/operation/message'});
        this.$emit('refreshMessageList')
      });
    },
    preview() {
      // 预览
      this.showDialog = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.createMessagePage {
  background-color: #ffffff;
  width: 100%;
  height: calc(100% - 60px);
  box-sizing: border-box;
  padding: 20px;
}

.createMessageTitle {
  font-size: 30px;
  height: 50px;
  line-height: 50px;
  border: {
    bottom: 1px solid #999999;
  }
}
.selectTypes {
  @include flexbox;
  box-sizing: border-box;
  padding: {
    top: 20px;
  }
}

.selectMessageType {
  margin: {
    right: 30px;
  }
}
.subTitle {
  font-size: 14px;
  box-sizing: border-box;
  padding: {
    top: 10px;
    bottom: 5px;
  }
}

.buttons {
  box-sizing: border-box;
  padding: {
    top: 40px;
  }
}
</style>

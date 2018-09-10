<template>
  <div class="editManagerPage">
    <div class="editManagerTitle">
      {{id === 'null' ? '新建-店长' : '编辑-店长'}}
    </div>
    <div class="EM_item EM_ManagerName" style="width: 200px">
      <div class="subTitle">姓名</div>
      <el-input placeholder="请输入姓名" v-model="managerName" clearable>
      </el-input>
    </div>

    <div class="EM_item" style="width: 200px">
      <div class="subTitle">手机</div>
      <el-input placeholder="请输入手机号" v-model="managerPhone" clearable>
      </el-input>
    </div>

    <div class="EM_item" style="width: 200px">
      <div class="subTitle">账号</div>
      <el-input placeholder="请输入账号" v-model="managerAccount" clearable>
      </el-input>
    </div>

    <div class="EM_item" style="width: 200px">
      <div class="subTitle">密码</div>
      <el-input placeholder="请输入密码" v-model="managerPassword" clearable type="password">
      </el-input>
    </div>
    <div class="EM_buttonBox">
      <el-button type="primary" @click.native="saveManagerInfo">保存</el-button>
    </div>
    <!-- <div class="EM_transfer">
      <el-transfer v-model="selectedStores" 
                   :data="datas"
                   :titles="['可选门店', '已选门店']"></el-transfer>
    </div> -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      currentManagerDetail: state => state.manager.currentManagerDetail
    })
  },
  methods: {
    ...mapActions(['updateManagerInfo', 'getManagerDetail']),
    mapManagerInfo() {
      this.managerName = this.currentManagerDetail.ownerName;
      this.managerPhone = this.currentManagerDetail.ownerPhone;
      this.managerAccount = this.currentManagerDetail.ownerAccount;
      this.managerPassword = this.currentManagerDetail.ownerPassword;
    },
    createParams() {
      let params = {};
      if (this.id !== 'null') {
        params.id = this.id
      }
      params.name = this.managerName,
      params.phone = this.managerPhone,
      params.account = this.managerAccount,
      // 密码
      params.password = this.managerPassword
      return params;
    },
    resetData() {
      this.managerName = '';
      this.managerAccount = '';
      this.managerPhone = '';
      this.managerPassword = '';
    },
    verityData() {
      if (!this.managerName && !this.managerAccount && !this.managerPhone && !this.managerPassword) {
        this.$notify.error('请补全信息');
        return false;
      }
      return true;
    },
    saveManagerInfo() {
      if (!this.verityData()) {
        return;
      }
      this.$notify({
        title: '提示',
        message: '正在保存店长信息...',
        type: 'warning'
      });
      this.updateManagerInfo(this.createParams())
        .then(() => {
          if (this.id === 'null') {
            this.$notify.success(`创建店长[${this.managerName}]成功`)
            this.$router.push({path: '/storePart/manager'});
            this.$emit('refreshData')
          } else {
            this.$notify({
              title: '成功',
              message: `店长[${this.id}] 保存成功`,
              type: 'success'
            });
            this.$router.push({path: '/storePart/manager'})
            this.$emit('refreshData')
          }
          this.resetData();
        })
        .catch(error => {
          this.$notify.error({
            title: '失败',
            message: error.message
          });
          this.$router.push({path: '/storePart/manager'});
          this.$emit('refreshData')
        });
    }
  },
  data() {
    return {
      managerName: '',
      managerAccount: '',
      managerPhone: '',
      managerPassword: ''
    };
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      if (this.id !== 'null') {
        this.getManagerDetail({
          id: this.id
        }).then(res => {
          // console.log('done');
          this.mapManagerInfo();
        });
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.editManagerPage {
  background-color: #ffffff;
  width: 100%;
  height: calc(100% - 60px);
  box-sizing: border-box;
  padding: 20px;
}

.editManagerTitle {
  font-size: 30px;
  height: 50px;
  line-height: 50px;
  border: {
    bottom: 1px solid #999999;
  }
}

.EM_ManagerName {
  margin: {
    top: 20px;
  }
}
.EM_item {
  box-sizing: border-box;
  padding: {
    top: 10px;
    bottom: 10px;
  }
}

.subTitle {
  padding: {
    bottom: 5px;
  }
}

.EM_buttonBox {
  box-sizing: border-box;
  padding: {
    top: 20px;
  }
}
</style>

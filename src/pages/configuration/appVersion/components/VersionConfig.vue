<template>
  <div class="versionConfig">
    <div class="appType">
      <div class="subTitle">客户端</div>
      <el-select v-model="appSide" placeholder="请选择">
        <el-option v-for="item in appSides" :key="item.type" :label="item.name" :value="item.type">
        </el-option>
      </el-select>
    </div>

    <div class="appType">
      <div class="subTitle">平台</div>
      <el-select v-model="appType" placeholder="请选择">
        <el-option v-for="item in appTypes" :key="item.type" :label="item.name" :value="item.type">
        </el-option>
      </el-select>
    </div>

    <div class="appType">
      <div class="subTitle">更新类型</div>
      <el-select v-model="updateType" placeholder="请选择">
        <el-option v-for="item in updateTypes" :key="item.type" :label="item.name" :value="item.type">
        </el-option>
      </el-select>
    </div>

    <div class="appType">
      <div class="subTitle">App版本号</div>
      <el-input v-model="version" style="width: 200px"></el-input>
    </div>

    <div class="appType">
      <div class="subTitle">外部版本号</div>
      <el-input v-model="versionCode" style="width: 200px"></el-input>
    </div>

    <div class="appType">
      <div class="subTitle">更新链接</div>
      <el-input v-model="apkUrl" style="width: 50%"></el-input>
    </div>

    <div class="appType">
      <div class="subTitle">更新说明</div>
      <el-input type="textarea" :autosize="{ minRows: 4}" v-model="upgradePoint" style="width: 50%"></el-input>
    </div>

    <el-button type="primary" @click="update">确认提交</el-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      id: '',
      apkUrl: '',
      upgradePoint: '',
      currentVersion: '',
      version: '',
      versionCode: '',
      appSide: 1,
      appSides: [
        {
          type: 1,
          name: '用户端'
        },
        {
          type: 2,
          name: '店长端'
        }
      ],
      appType: 1,
      appTypes: [
        {
          type: 1,
          name: 'ios'
        },
        {
          type: 2,
          name: 'android'
        }
      ],

      updateType: 1,
      updateTypes: [
        {
          type: 1,
          name: '强制更新'
        },
        {
          type: 2,
          name: '提示更新'
        }
      ]
    };
  },
  computed: {
    isCreate() {
      if (this.id) {
        return false;
      } else {
        return true;
      }
    }
  },
  watch: {
    $route(val) {
      if (this.isCreate) return;
      this.id = val.query.version;
      this.getAppVerisonDetail({
        id: this.id
      }).then(res => {
        this.upgradePoint = res.upgradePoint.replace(/\\n\\r/g, '\n\r');
        this.versionCode = res.versionCode;
        this.apkUrl = res.apkUrl;
        this.updateType = res.isForce;
        this.version = res.version;
        this.currentVersion = res.version;
        this.appType = res.appType == 1 || res.appType == 3 ? 1 : 2;
        this.appSide = res.appType == 1 || res.appType == 2 ? 1 : 2;
      });
    },
    appSide(val) {
      if (val == 2) {
        this.updateTypes = [
          {
            type: 1,
            name: '强制更新'
          }
        ];
        if (this.updateType == 2) {
          this.updateType = 1;
        }
      } else {
        this.updateTypes = [
          {
            type: 1,
            name: '强制更新'
          },
          {
            type: 2,
            name: '提示更新'
          }
        ];
      }
    }
  },
  methods: {
    ...mapActions([
      'getAppVerisonDetail',
      'updateAppVersion',
      'addVersionConfig'
    ]),
    parseParams(isCreate, type) {
      if (isCreate) {
        if (type == 1) { // ios
          return {
            appType: this.parseUserType(this.appSide, this.appType),
            versionCode: this.versionCode,
            iosVersion: this.version,
            version: this.version,
            isForce: this.updateType,
            apkUrl: this.apkUrl,
            upgradePoint: this.upgradePoint
          }
        } else { // Android
          return {
            appType: this.parseUserType(this.appSide, this.appType),
            versionCode: this.versionCode,
            androidVersion: this.version,
            version: this.version,
            isForce: this.updateType,
            apkUrl: this.apkUrl,
            upgradePoint: this.upgradePoint
          }
        }
      } else { // 编辑
        if ( type == 1) { // ios
          return {
            id: this.id,
            appType: this.parseUserType(this.appSide, this.appType),
            versionCode: this.versionCode,
            isForce: this.updateType,
            iosVersion: this.version,
            version: this.version,
            apkUrl: this.apkUrl,
            upgradePoint: this.upgradePoint
          }
        } else { // android
          return {
            id: this.id,
            appType: this.parseUserType(this.appSide, this.appType),
            versionCode: this.versionCode,
            isForce: this.updateType,
            androidVersion: this.version,
            version: this.version,
            apkUrl: this.apkUrl,
            upgradePoint: this.upgradePoint
          }
        }
      }
    },
    re_url(url) {
      let re = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/).*$/
      return re.test(url)
    },
    update() {
      if (this.version < this.currentVersion) {
        this.version = this.currentVersion;
        return this.$notify.error('内部版本号不能小于之前的版本号, 且为整数');
      }
      if (!this.re_url(this.apkUrl)) {
        return this.$notify.error('请输入有效的网址,如http://www.baidu.com');
      }
      this.$router.push({ path: '/system/appVersion' });
      if (this.isCreate) {
        this.addVersionConfig(this.parseParams(this.isCreate, this.appType))
        .then(() => {
          this.$notify.success('操作成功');
        })
        .catch(() => this.$notify.error('操作失败'));
      }else {
          this.updateAppVersion(this.parseParams(this.isCreate, this.appType))
          .then(() => {
            this.$notify.success('操作成功');
          })
          .catch(() => this.$notify.error('操作失败'));
      }
    },
    parseUserType(side, type) {
      if (side == 1) {
        if (type == 1) {
          return 1;
        } else {
          return 2;
        }
      }
      if (side == 2) {
        if (type == 1) {
          return 3;
        } else {
          return 4;
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.id = this.$route.query.version;
      if (!this.isCreate) {
        this.getAppVerisonDetail({
          id: this.id
        }).then(res => {
          this.upgradePoint = res.upgradePoint.replace(/\\n\\r/g, '\n\r');
          this.versionCode = res.versionCode;
          this.apkUrl = res.apkUrl;
          this.currentVersion = res.version;
          this.updateType = res.isForce;
          this.appType = res.appType == 1 || res.appType == 3 ? 1 : 2;
          this.appSide = res.appType == 1 || res.appType == 2 ? 1 : 2;
          this.version = this.appType == 1 ? res.iosVersion : res.androidVersion
        });
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.versionConfig {
  background-color: #ffffff;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .appType {
    padding: {
      top: 10px;
      bottom: 10px;
    }
  }
  .subTitle {
    display: inline-block;
    color: #666666;
    width: 150px;
    height: 40px;
    line-height: 40px;
  }
}
</style>

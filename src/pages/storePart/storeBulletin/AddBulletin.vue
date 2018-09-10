<template>
  <div class="protalPage">
    <div class="storeBulletinPage">
      <div class="title">
        发布公告
      </div>

      <div class="form_item">
        <div class="form_item_title">门店</div>
        <el-select v-model="storeId" placeholder="请选择">
          <el-option v-for="item in stores" :key="item.id" :label="item.storeName" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="form_item">
        <div class="form_item_title">有效期</div>
        <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </div>

      <div class="form_item">
        <div class="form_item_title">公告标题</div>
        <el-input placeholder="输入公告标题" v-model="bulletinTitle" maxlength="20"></el-input>
      </div>

      <div class="form_item">
        <div class="form_item_title">公告内容</div>
        <el-input placeholder="输入公告内容" type="textarea" v-model="bulletinContent" maxlength="1000"></el-input>
      </div>

      <el-button type="primary" @click="create">确认发布</el-button>

    </div>
  </div>
</template>

<script>
import { getDropDownStoreList } from 'common/common';

import { addStoreBulletin } from 'api/storePart/storeBulletin';

export default {
  name: 'addBulletin',
  data() {
    return {
      storeId: 0,
      stores: [],
      time: [],
      bulletinTitle: '',
      bulletinContent: ''
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.auth.userInformation
    },
    isNowDate() {
      let now = this.moment().format('YYYY-MM-DD');
      let selectedTime = this.time[0];
      if (!selectedTime) {
        return false;
      } else {
        let date = selectedTime.split(' ')[0];
        if (date === now) {
          return true;
        } else {
          return false;
        }
      }
    },
    selectedDate() {
      return this.time[0].split(' ')[0]
    },
    storeName() {
      if ( this.stores.length < 1 ) {
        return '';
      } else {
        let curItem = this.stores.find( (item) => {
          return item.id == this.storeId
        })
        return curItem.storeName
      }
    }
  },
  methods: {
    setDefaultDate() {
      const start = this.moment().format('YYYY-MM-DD HH:mm:ss')
      const end = this.moment(start).add(3, 'days').format('YYYY-MM-DD HH:mm:ss')
      this.time = [start, end];
    },
    fetchDropDownStores() {
      getDropDownStoreList().then(res => {
        res.unshift({
          id: 0,
          storeName: '全部门店'
        })
        this.stores = res;
      }).catch( () => {
        this.$notify.error('获取门店菜单失败')
      })
    },
    successUpload(response, file, filelist) {
      // console.log(response);
    },
    failedUpload(err, file, filelist) {
      // console.log(err);
    },
    verify() {
      if (this.time.length < 1 || new Date(this.selectedDate).getTime() < new Date(this.moment().format('YYYY-MM-DD')).getTime() ) {
        this.$notify.error('请选择当前日期(或以后)为起始的日期区间')
        return false;
      }
      if (!this.bulletinTitle.trim()) {
        this.$notify.error('请输入公告标题')
        return false;
      }
      if (!this.bulletinContent.trim()) {
        this.$notify.error('请输入公告内容')
        return false ;
      }
      return true;
    },
    createParams() {
      let params = {};
      if (this.storeId !== 'all') {
        params.storeId = this.storeId;
        params.storeName = this.storeName;
      }
      params.adminId = this.userInfo.id;
      params.isLatest = 0;
      params.startTime = this.time[0];
      params.endTime = this.time[1]
      params.topic = this.bulletinTitle;
      params.topicContent = this.bulletinContent;
      params.adminName = this.userInfo.username;
      params.status =  this.isNowDate ? 1 : 2; // 1.进行中  2.未到期
      return params;
    },
    create() {
      if (this.verify()) {
        addStoreBulletin(this.createParams()).then( (res) => {
          if (res.data.code === 200) {
            this.$notify.success('发布成功');
            this.$router.push({path: '/storePart/storeBulletin'})
          } else {
            this.$notify.error(res.data.message || '发布失败, 请尝试重新发布')
          } 
        }).catch( () => {
          this.$notify.error('发布失败, 请尝试重新发布')
        })
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setDefaultDate();
      this.fetchDropDownStores();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.storeBulletinPage {
  background-color: #ffffff;
  width: 100%;
  min-height: 100%;
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
}

.selecters {
  @include flexbox;
  box-sizing: border-box;
  padding: {
    top: 20px;
  }
  .searchBar {
    width: 200px;
    margin: {
      right: 10px;
    }
  }
}

.tableBox {
  width: 100%;
  box-sizing: border-box;
  padding: {
    top: 20px;
  }
}

.form_item {
  @include flexbox;
  @include align-items(center);
  width: 100%;
  height: 80px;
  .form_item_title {
    width: 80px;
    height: 100%;
    text-align: left;
    line-height: 80px;
    margin: {
      right: 10px;
    }
  }
}
</style>

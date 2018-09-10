<template>
  <div class="configInfo">
    <div class="configTitle">编辑-配置信息</div>
    <div class="CI_business CI_item">
      <div class="subTitle">营业时间</div>
      <div class="inputBox" style="width: 500px">
        <el-input placeholder="请输入内容" v-model="business" clearable>
        </el-input>
      </div>
    </div>
    <div class="CI_interval CI_item">
      <div class="subTitle">预约时长(已选3个时长)</div>
      <div class="inputBox">
        <el-radio v-model="interval" label="30">30分钟</el-radio>
        <el-radio v-model="interval" label="60">60分钟</el-radio>
        <el-radio v-model="interval" label="90">60分钟</el-radio>
      </div>
    </div>
    <div class="CI_price CI_item">
      <div class="subTitle">预约价格</div>
      <div class="inputBox" style="width: 200px">
        <el-input placeholder="请输入内容" v-model="price" clearable>
          <template slot="append">元/分钟</template>
        </el-input>
      </div>
    </div>

    <div class="CI_publicDevice CI_item" v-loading="isLoadingPublicDevice">
      <div class="subTitle">公共设施(已选{{selectedDevices.length}}个设施)</div>
      <div class="inputBox">
        <el-checkbox-group v-model="selectedDevices" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="item in publicDevice" :label="item.id" :key="item.id">{{item.facilityName}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    
    <div class="CI_limit CI_item">
      <div class="subTitle">人数限制</div>
      <div class="inputBox" style="width: 160px">
        <el-input placeholder="请输入内容" v-model="limit" clearable>
          <template slot="append">人</template>
        </el-input>
      </div>
    </div>

    <div class="saveButton">
      <el-button type="primary" @click.native="saveBaseInfo">保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  props: {
    storeId: {
      type: String
    }
  },  
  data() {
    return {
      business: '',
      interval: '30',
      price: '',
      // puliceDevices: ['停车场','免费WIFI','自动售货机','充电宝','储物柜','淋浴','饮水机','按摩椅','租借雨伞'],
      selectedDevices: [],
      limit: '',
      isLoadingPublicDevice: false,
    };
  },
  watch: {
    selectedDevices(val) {
      // console.log(val)
    }
  },
  computed: {
    ...mapState({
      currentStoreConfig: state => state.store.currentStoreConfig,
      publicDevice:  state => state.store.publicDevice
    }),
    formatFacilitiyIds() {
      let list = this.selectedDevices.join(',');
      // console.log('chucuo',list);
      return list;
    }
  },
  methods: {
    ...mapActions(['getStoreConfig', 'getPublicDevice', 'updateStoreConfig']),
    handleCheckedCitiesChange() {

    },
    mapData(apiData) {
      this.business = apiData.businessHours;
      this.interval = apiData.appointmentLength;
      this.limit = apiData.limitNumber;
      this.price = apiData.reservationPrice / 100;
    },
    getPublic() {
      this.isLoadingPublicDevice = true;
      this.getPublicDevice().then( () => {
        this.isLoadingPublicDevice = false;
        this.publicDevice.forEach( (item, index) => {
          this.selectedDevices.push(item.id);
        }) 
      }).catch( (error) => {
        // console.log(error);
        this.isLoadingPublicDevice = false;
      })
    },
    saveBaseInfo() {
      let price = parseFloat(this.price)
      if (isNaN(price)) {
        return this.$notify.error('请输入正确的价格');
      } 
      this.updateStoreConfig({
        id: this.currentStoreConfig.id,
        businessHours: this.business,
        appointmentLength: this.interval,
        reservationPrice: price * 100,
        limitNumber: this.limit,
        storeInfoId: this.storeId,
        facilitiesIds: this.formatFacilitiyIds
      }).then( () => {
        this.$notify({
          title: '成功',
          message: `保存门店[${this.storeId}]配置信息成功`,
          type: 'success'
        })
      }).catch( (message) => {
        this.$notify.error(message);
      })
    }
  },
  mounted() {
    this.$nextTick( () => {
      this.getPublic();
      this.getStoreConfig({
        storeId: this.storeId
      }).then( () => {
        this.mapData(this.currentStoreConfig)
      })
    })
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.configInfo {
  width: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 20px;
}
.configTitle {
  font-size: 30px;
  height: 50px;
  line-height: 50px;
  border: {
    bottom: 1px solid #999999;
  }
}

.subTitle {
  padding: {
    top: 10px;
    bottom: 10px;
  }
}
.CI_item {
   box-sizing: border-box;
   padding: {
     top: 20px;
     bottom: 20px;
   }
}
.CI_business {
  width: 100%;
}
</style>

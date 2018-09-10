<template>
  <div class="baseinfo">
    <div class="baseInfoTitle">编辑-基本信息</div>
    <div class="BI_storeName">
      <div class="subTitle">门店名称</div>
      <div class="inputBox">
        <el-input placeholder="请输入内容" v-model="storeName" clearable>
        </el-input>
      </div>
    </div>
    <div class="BI_item2 BI_item">
      <div class="BI_phone item_230">
        <div class="subTitle">联系电话</div>
        <div class="inputBox">
          <el-input placeholder="请输入内容" v-model="storePhone" clearable>
          </el-input>
        </div>
      </div>
      <div class="BI_area item_230">
        <div class="subTitle">面积(平方)</div>
        <div class="inputBox">
          <el-input placeholder="请输入内容" v-model="storeArea" clearable>
          </el-input>
        </div>
      </div>
    </div>
    <div class="BI_item3 BI_item">
      <div class="BI_address item_230">
        <div class="subTitle">所在地区</div>
        <div class="inputBox">
          <!-- <el-input placeholder="请输入内容" v-model="storeAddress" clearable>
          </el-input> -->
          <el-cascader v-model="selectedIDs" :options="areaOptions" @change="areaChange" @active-item-change="handleItemChange" :props="areaProps" :change-on-select="false"></el-cascader>
        </div>
      </div>
      <div class="BI_detail item_230">
        <div class="subTitle">详细地址</div>
        <div class="inputBox">
          <el-input placeholder="请输入内容" v-model="storeAddress" clearable>
          </el-input>
        </div>
      </div>
    </div>
    <div class="BI_item4 BI_item">
      <div class="BI_positionX item_230">
        <div class="subTitle">经度</div>
        <div class="inputBox">
          <el-input placeholder="请输入内容" v-model="storePositionX" clearable>
          </el-input>
        </div>
      </div>
      <div class="BI_positionY item_230">
        <div class="subTitle">维度</div>
        <div class="inputBox">
          <el-input placeholder="请输入内容" v-model="storePositionY" clearable>
          </el-input>
        </div>
      </div>
    </div>
    <div class="BI_des">
      <div class="subTitle">简介(限100字)</div>
      <div class="inputBox">
        <el-input placeholder="请输入内容" v-model="storeIntroduce" type="textarea" maxlength="100">
        </el-input>
      </div>
    </div>
    <div class="BI_des">
      <div class="subTitle">使用须知(限1000字)</div>
      <div class="inputBox">
        <el-input placeholder="请输入内容" v-model="storeUserNotice" type="textarea" maxlength="1000">
        </el-input>
      </div>
    </div>
    <div class="BI_upload">
      <div class="subTitle">上传封面&相册</div>
      <div class="choosePic">
        <el-upload class="upload-demo" :action="actionApi" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList2" list-type="picture" :before-upload="beforeAvatarUpload" :on-success="successUpload" :limit="10">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">默认第一张为封面, 最多上传10张图片, 尺寸建议800X600</div>
        </el-upload>
      </div>
    </div>
    <div class="saveButton">
      <el-button v-if="storeId !== 'null'" type="primary" @click.native="saveBaseInfo">保存</el-button>
      <el-button v-else type="primary" @click.native="createStore">创建</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { deepCopy } from 'common/utils';

import { getCurrentArea } from 'api/storePart/store';

import { uploadFileApi } from 'common/common';

export default {
  computed: {
    ...mapState({
      currentStoreDetail: state => state.store.currentStoreDetail,
      // areaIds: state => state.store.areaIds,
      storeList: state => state.store.storeList
    }),
    cover() {
      return this.fileList2[0] ? this.fileList2[0].url : '';
    },
    areaIds() {
      let arr = [];
      this.storeList.forEach((item, index) => {
        if (item.id == this.storeId) {
          arr.push(item.provinceId);
          arr.push(item.cityId);
          arr.push(item.districtId);
          this.provinceId = item.provinceId;
          this.cityId = item.cityId;
          this.districtId = item.districtId;
          return;
        }
      });
      return arr;
    },
    detailImgs() {
      let imgs = [];
      let list = deepCopy(this.picList);
      list.shift();
      list.forEach((item, index) => {
        imgs.push(item.url);
      });
      let str = imgs.join(',');
      return str;
    }
  },
  watch: {
    $route(val) {
      this.resetData();
      if (this.storeId !== 'null') {
        // 有id 则为修改
        this.getStoreDetail({
          storeId: this.storeId
        }).then(() => {
          this.mapDatas(this.currentStoreDetail);
          this._getArea();
          this.getAreaDropDown({
            id: 'all'
          }).then(res => {
            let list = this.createAreaList(res, 0);
            this.setEmptyCities(list);
            this.areaOptions = list;
          });
        });
      } else {
        this.getAreaDropDown({
          id: 'all'
        }).then(res => {
          let list = this.createAreaList(res, 0);
          this.setEmptyCities(list);
          this.areaOptions = list;
        });
      }
    },
    fileList2(val) {
      if (val.length > 10) {
        this.$notify.error('最多上传十张图片, 请自行删除');
      }
    },
    selectedIDs(val) {
      // console.log('选择的省市区', val);
      this.provinceId = val[0];
      this.cityId = val[1];
      this.districtId = val[2];
    },
    currentArea(val) {
      this.areaOptions.unshift({
        id: 'current',
        value: val
      });
    }
  },
  props: {
    storeId: {
      type: String
    }
  },
  data() {
    return {
      actionApi: uploadFileApi,
      storeName: '',
      storePhone: '',
      storeArea: '',
      storeAddress: '',
      addressDetail: '',
      storePositionX: '',
      storePositionY: '',
      storeIntroduce: '',
      storeUserNotice: '',
      areaOptions: [],
      fileList2: [],
      picList: [],
      provinceId: '',
      cityId: '',
      currentArea: '',
      districtId: '',
      isUploadImg: false,
      isOverUploading: true,
      selectedIDs: ['current'],
      areaProps: {
        value: 'id',
        children: 'cities',
        label: 'value'
      }
    };
  },
  methods: {
    ...mapActions([
      'getStoreDetail',
      'uploadImg',
      'updateStoreDetail',
      'getAreaDropDown'
    ]),
    _getArea() {
      let address = '';
      getCurrentArea({
        id: this.provinceId
      }).then(res => {
        // console.log('详情',res);
        address = res.data.data.province + '/';
        getCurrentArea({
          id: this.cityId
        }).then(res => {
          // console.log(res);
          address = address + res.data.data.city + '/';
          getCurrentArea({
            id: this.districtId
          }).then(res => {
            address = address + res.data.data.district;
            this.currentArea = address;
          });
        });
      });
    },
    handleRemove(file, fileList) {
      this.fileList2 = fileList;
      this.picList = this.fileList2;
    },
    areaChange(val) {
      // console.log(val);
      this.selectedIDs = val;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handlePreview(file) {
      // console.log(file);
    },
    beforeAvatarUpload(file) {
      this.isOverUploading = false;
      const isMP4 = file.type === 'image/png' || file.type === 'image/jpeg';
      const isLt20M = true

      if (!isMP4) {
        this.$notify.error('上传图片只能是 JPG/PNG 格式!');
      }
      if (!isLt20M) {
        this.$notify.error('上传图片大小不能超过 1MB!');
      }
      if (isMP4 && isLt20M) {
        this.isOverUploading = true;
      }
      return isMP4 && isLt20M;
    },
    successUpload(response, file, filelist) {
      this.picList.push({name: '', url: response.data['oss-request-url']})
      this.isOverUploading = true;
    },
    failedUpload(err, file, filelist) {
      this.$notify.error('文件上传失败, 请重新上传');
      this.isOverUploading = true;
    },
    resetData() {
      this.storeName = '';
      this.storePhone = '';
      this.storeArea = '';
      this.storeAddress = ''; // 接口缺少字段
      this.addressDetail = '';
      this.storePositionX = '';
      this.storePositionY = '';
      this.storeIntroduce = '';
      this.fileList2 = [];
      this.picList = [];
    },
    createAreaList(res, level) {
      let list = [];
      res.forEach((item, index) => {
        let obj = {};
        if (level === 0) {
          obj.value = item.province;
        }
        if (level === 1) {
          obj.value = item.city;
        }
        if (level === 2) {
          obj.value = item.district;
        }
        obj.id = item.id;
        list.push(obj);
      });
      return list;
    },
    mapDatas(apiData) {
      this.storeName = apiData.storeName;
      this.storePhone = apiData.contactPhone;
      this.storeArea = apiData.storeArea;
      this.provinceId = apiData.provinceId;
      this.cityId = apiData.cityId;
      this.districtId = apiData.districtId;
      // console.log('区ID',apiData.districtId);
      this.storeAddress = apiData.detailedAddress;
      this.storePositionX = apiData.longitude; // 经度
      this.storePositionY = apiData.latitude; // 维度
      this.storeIntroduce = apiData.introduction;
      this.storeUserNotice = apiData.useNotice;
      this.fileList2.push({
        name: '门店图片',
        url: apiData.storeImage
      });
      this.picList.push({
        name: '门店图片',
        url: apiData.storeImage
      })
      apiData.images.forEach((item, index) => {
        this.fileList2.push({
          name: '详情图片',
          url: item.imageListUrl
        });
        this.picList.push({
          name: '详情图片',
          url: item.imageListUrl
        });
      });
    },
    updateInfo() {
      if (!this.isOverUploading) {
        return this.$notify.success('请等待文件上传成功');
      }
      if (
        !this.provinceId ||
        !this.cityId ||
        !this.districtId ||
        this.provinceId == 0 ||
        this.cityId == 0 ||
        this.districtId == 0
      ) {
        this.$notify.error('请输入省市区');
        return;
      }
      if (this.storeId !== 'null') {
        return this.updateStoreDetail({
          id: this.storeId,
          name: this.storeName,
          mobile: this.storePhone,
          area: this.storeArea,
          province: this.provinceId,
          city: this.cityId,
          district: this.districtId,
          detailedAddress: this.storeAddress,
          storeImage: this.cover, // 门店图片
          img: this.detailImgs, // 详情图片
          longitude: this.storePositionX,
          latitude: this.storePositionY,
          introduction: this.storeIntroduce,
          useNotice: this.storeUserNotice
        });
      } else {
        return this.updateStoreDetail({
          name: this.storeName,
          mobile: this.storePhone,
          area: this.storeArea,
          province: this.selectedIDs[0],
          city: this.selectedIDs[1],
          district: this.selectedIDs[2],
          detailedAddress: this.storeAddress,
          storeImage: this.cover, // 门店图片
          img: this.detailImgs, // 详情图片
          longitude: this.storePositionX,
          latitude: this.storePositionY,
          introduction: this.storeIntroduce,
          useNotice: this.storeUserNotice
        });
      }
    },
    verityData() {
      //校验数据
      if (this.fileList2.length > 10) {
        // 检测图片数量
        this.$notify({
          title: '提示',
          message: '最多上传10张图片',
          type: 'warning'
        });
        return false;
      }
      return true;
    },
    createStore() {
      if (this.verityData()) {
        this.updateInfo()
          .then(() => {
            this.$notify.success('创建门店成功');
            this.resetData();
            this.$router.push({ path: '/storePart/store' });
            this.$emit('refreshData');
          })
          .catch(message => {
            this.$notify.error(message);
            this.resetData();
            this.$router.push({ path: '/storePart/store' });
            this.$emit('refreshData');
          });
      }
    },
    saveBaseInfo() {
      // 保存信息
      if (this.verityData()) {
        this.updateInfo()
          .then(() => {
            this.$notify({
              title: '',
              message: '保存门店基础信息成功',
              type: 'success'
            });
            this.$router.push({ path: '/storePart/store' });
            this.$emit('refreshData');
          })
          .catch(message => {
            this.$notify.error({
              title: '失败',
              message: message
            });
            this.$router.push({ path: '/storePart/store' });
            this.$emit('refreshData');
          });
      }
    },
    beforeUploadImg(file) {
      // 检测图片格式及大小
      // console.log(file);
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt1M = file.size / 1024 / 1024 < 3;
      if (!isJPG) {
        this.$notify.error('上传图片只能是 JPG或PNG 格式!');
      }
      if (!isLt1M) {
        this.$notify.error('上传图片大小不能超过 3MB!');
      }
      return isJPG && isLt1M;
      return true;
    },
    handleItemChange(val) {
      let level = val.length;
      let id = val[level - 1];
      let result;
      if (level === 1) {
        this.level0 = this.findIndexById(id, this.areaOptions); // 第一级
        result = this.level0;
        if (this.areaOptions[result].cities.length > 0) {
          // 第二级cities已有 不再重复请求
          return;
        }
      }
      if (level === 2) {
        this.level1 = this.findIndexById(
          id,
          this.areaOptions[this.level0].cities
        ); // 第二级
        result = this.level1;
        if (this.areaOptions[this.level0].cities[result].cities.length > 0) {
          // 第三级cities已有 不再重复请求
          return;
        }
      }
      this.getAreaDropDown({
        id: id
      }).then(res => {
        // console.log(res);
        let list = this.createAreaList(res, level); // 格式化下拉列表
        if (level === 1) {
          this.areaOptions[result].cities = list;
        }
        if (level === 2) {
          let newObj = Object.assign(
            {},
            this.areaOptions[this.level0].cities[result],
            { cities: list }
          );
          this.$set(this.areaOptions[this.level0].cities, result, newObj);
          // this.areaOptions[this.level0].cities[result].cities = list;
        }
        if (level < 2) {
          this.setEmptyCities(this.areaOptions[result].cities);
        }
      });
      // console.log(val)
    },
    setEmptyCities(array) {
      for (let item of array) {
        item.cities = [];
      }
    },
    findIndexById(id, array) {
      for (let index in array) {
        if (array[index].id === id) {
          return index;
        }
      }
      return 'Nofound';
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.resetData();
      if (this.storeId !== 'null') {
        // 有id 则为修改
        this.getStoreDetail({
          storeId: this.storeId
        }).then(() => {
          this.mapDatas(this.currentStoreDetail);
          this._getArea();
          this.getAreaDropDown({
            id: 'all'
          }).then(res => {
            let list = this.createAreaList(res, 0);
            this.setEmptyCities(list);
            this.areaOptions = list;
          });
        });
      } else {
        this.getAreaDropDown({
          id: 'all'
        }).then(res => {
          let list = this.createAreaList(res, 0);
          this.setEmptyCities(list);
          this.areaOptions = list;
        });
      }
      // else {
      // }
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.baseinfo {
  background-color: #ffffff;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  .subTitle {
    height: 40px;
    line-height: 40px;
  }
}
.baseInfoTitle {
  font-size: 30px;
  height: 50px;
  line-height: 50px;
  border: {
    bottom: 1px solid #999999;
  }
}
.BI_item2 {
  @include flexbox;
  // @include justify-content(space-between);
}
.BI_item {
  @include flexbox;
  // @include justify-content(space-between);
  width: 50%;
  box-sizing: border-box;
  padding: {
    top: 30px;
    bottom: 20px;
  }
}
.BI_phone,
.BI_address,
.BI_positionX {
  margin: {
    right: 30px;
  }
}
.BI_storeName {
  width: 500px;
  padding: {
    top: 30px;
    bottom: 20px;
  }
}
.item_230 {
  width: 230px;
}
.choosePic {
  width: 500px;
}
.BI_des {
  width: 500px;
}
.saveButton {
  box-sizing: border-box;
  padding: {
    top: 50px;
    bottom: 20px;
  }
}
</style>

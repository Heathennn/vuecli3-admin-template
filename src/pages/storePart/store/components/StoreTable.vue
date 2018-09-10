<template>
  <div class="storeTable">
    <el-table :data="tableData" style="width: 100%" :header-cell-style="headStyle">
      <el-table-column label="门店ID" prop="id" width="100">
      </el-table-column>
      <el-table-column label="门店名称" prop="storeName">
      </el-table-column>
      <el-table-column label="详细地址" prop="detailedAddress">
      </el-table-column>
      <el-table-column label="编辑" width="300">
        <template slot-scope="scope">
          <!-- <el-badge value="待完善" class="item"> -->
          <el-button size="mini" type="primary" plain @click="handleEdit1(scope.$index, scope.row)" v-permission="'241e7b07-a70e-442c-bd8b-5e42f05afeba'">基本信息</el-button>
          <!-- </el-badge> -->
          <el-button size="mini" type="primary" plain @click="handleEdit2(scope.$index, scope.row)" v-permission="'2e3ff189-f735-42ee-b53e-17334ab324e6'">配置信息</el-button>
          <el-button size="mini" type="primary" plain @click="handleEdit4(scope.$index, scope.row)" v-permission="'97d33228-fe77-4090-a269-f90d4f3266b5'">店长信息</el-button>
        </template>
      </el-table-column>
      <el-table-column label="设备信息" width="100">
        <template slot-scope="scope">
          <el-button size="small" @click.native="checkDevice(scope.$index, scope.row)" v-permission="'6713f2cd-8e50-4c63-9700-9000af6f3a8d'">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="门店看板" width="100">
        <template slot-scope="scope">
          <el-button size="small" @click.native="checkBoard(scope.$index, scope.row)" v-permission="'3572ea27-333a-4761-a1f3-9be80ac1a2c3'">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.businessStatus != 2 ? '未营业' : '营业'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="门店状态">
        <template slot-scope="scope">
          <el-select v-model="scope.row.businessStatus" placeholder="请选择" v-permission="'9310de22-cb7d-4f79-9ba2-a57060baa640'" @change="statusChange(scope.row.businessStatus,scope.row.id)">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <!-- <store-status :row="scope.row.businessStatus" v-permission="'9310de22-cb7d-4f79-9ba2-a57060baa640'"></store-status> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import StoreStatus from './StoreStatus';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    currentPage: {
      type: [Number, String]
    },
    currentSize: {
      type: [Number, String]
    }
  },
  components: {
    StoreStatus
  },
  data() {
    return {
      headStyle: {
        // "text-align": 'center',
        // color: 'red'
      },
      storeStatus: 1,
      options: [
        {
          value: 1,
          label: '闭店'
        },
        {
          value: 2,
          label: '开店'
        }
      ]
    };
  },
  methods: {
    ...mapActions(['updateStoreDetail', 'getStoreList']),
    handleEdit1(index, row) {
      this.$router.push({ path: `/storePart/store?baseInfo=${row.id}` });
    },
    handleEdit2(index, row) {
      // console.log(row);
      this.$router.push({ path: `/storePart/store?configInfo=${row.id}` });
    },
    // handleEdit3(index, row) {
    //   console.log(index, row);
    // },
    handleEdit4(index, row) {
      this.$router.push({ path: `/storePart/store?managerInfo=${row.id}` });
    },
    checkBoard(index, row) {
      this.$router.push({ path: '/board' });
    },
    checkDevice(index, row) {
      this.$router.push({ path: '/storePart/device' });
    },
    statusChange(value,id) {
      this.updateStoreDetail({
        id: id,
        businessStatus: value
      }).then(res => {
          // console.log(res);
          if (res.data.code == 200) {
            this.$notify.success('修改门店状态成功');
            this.getStoreList({ page: this.currentPage, size: this.currentSize });
          } else {
            this.$notify.error('修改门店状态失败');
          }
        }).catch(error => {
          this.$notify.error('修改门店状态失败');
        });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.item {
  margin-top: 10px;
  margin-right: 40px;
}

.storeTable {
  width: 100%;
}
</style>

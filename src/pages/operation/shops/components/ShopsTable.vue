<template>
  <div class="shopsTable">
    <el-table :data="datas" style="width: 100%" :header-cell-style="headStyle">
      <el-table-column label="设备ID" prop="facilityId">
      </el-table-column>
      <el-table-column label="所属门店" prop="storeName">
      </el-table-column>
      <el-table-column label="商品" prop="goodsNum">
      </el-table-column>
       <el-table-column label="预警商品" prop="warningNum">
      </el-table-column>
       <el-table-column label="状态" prop="restockedStatus">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span @click="checkDetail(scope.row)" v-permission="'ea3a71ae-70d2-401f-a0d2-52dc38d5ec1f'">查看详情</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { deepCopy } from 'common/utils';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    datas() {
      let list = deepCopy(this.tableData);
      list.forEach( (item, index) => { 
        item.goodsNum = item.goodsNum + '种';
        item.warningNum = item.warningNum + '种';
        item.restockedStatus = item.restockedStatus == 1 ? '待补货' : item.restockedStatus == 0 ? '补货成功': '';
      }) 
      return list;
    }
  },
  data() {
    return {
      headStyle: {
        // "text-align": 'center',
        // color: 'red'
      },
    };
  },
  methods: {
    handleEdit1(index, row) {
      // console.log(index, row);
    },
    handleEdit2(index, row) {
      // console.log(index, row);
    },
    handleEdit3(index, row) {
      // console.log(index, row);
    },
    handleEdit4(index, row) {
      // console.log(index, row);
    },
    checkDetail(row) {
      // console.log(row);
      this.$router.push({path: `/operation/shops?shopsDetail=${row.storeId}`})
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.item {
  margin-top: 10px;
  margin-right: 40px;
}

</style>

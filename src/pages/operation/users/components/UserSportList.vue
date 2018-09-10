<template>
  <div class="userSportListTable">
    <el-table :data="datas" style="width: 100%">
      <el-table-column prop="statisticDate" label="日期">
      </el-table-column>
      <el-table-column prop="storeName" label="门店">
      </el-table-column>
      <el-table-column prop="sportCalorie" label="消耗卡路里">
      </el-table-column>
      <el-table-column prop="sportLength" label="运动时间">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="checkCurrentSportList(scope.row)">查看</el-button>
        </template>
         <!-- <template slot-scope="scope">
          <div class="tablePic" :style="`background-image: url(${scope.row.facilityIconUrl}); background-size: 100% 100%`"></div>
        </template> -->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getUserSportDetailByDate } from 'api/operation/users';

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      currentDateSport: [],
      currentDate: '',
      currentStoreName: '',
      isFetchingData: false,
      totalData: {}
    }
  },
  computed: {
    datas() {
      this.tableData.forEach((item, index) => {
        item.sportCalorie = isNaN(item.sportCalorie / 1000) ? 0 + 'kcal' : (item.sportCalorie / 1000) + 'kcal';
        item.sportLength = (item.sportLength / 60).toFixed(2) + '分钟';
      });
      return this.tableData;
    }
  },
  methods: {
    checkCurrentSportList(row) {
      this.$router.push({path: `/user/userSportDetail?userId=${row.userId}&storeName=${row.storeName}&statisticDate=${row.statisticDate}&orderSn=${row.orderSn}`})
      // console.log(row);
      // console.log(this.tableData);
      // this.dialogVisible = true;
      // this.currentDate = row.statisticDate;
      // this.currentStoreName = row.storeName;
      // this.isFetchingData = true;
      // getUserSportDetailByDate({
      //   userId: row.userId,
      //   statisticsDate: this.currentDate
      // }).then( (res) => {
      //     // console.log(res);
      //     this.isFetchingData = false;
      //     if (res.data.code == 200) {
      //       let list = res.data.data.list;
      //       this.totalData = res.data.data.total;
      //       list.forEach( (item, index) => {
      //         item.sportUnity = item.sportTimes == 0 ? (item.sportDistance + '米') : (item.sportTimes + '次');
      //         item.sportCalorie = (item.sportCalorie / 1000) + 'kcal'
      //         item.sportLength = (item.sportLength / 60).toFixed(2) + '分钟'
      //       })
      //       this.currentDateSport = list;
      //     }
      // }).catch( () => {
      //   this.isFetchingData = false;
      // })
    },
    handleClose(done) {
      done();
    }
  }
};
</script>

<style lang="scss" scoped>
.userSportListTable {
  width: 100%;
}
</style>

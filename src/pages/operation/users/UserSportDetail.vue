<template>
  <div class="userSportDetailPage">
    <div style="font-size: 22px;font-weight: 600;margin-bottom: 10px;">门店: {{storeName}}</div>
    <div style="font-size: 10px;color: #999999">预约时间:{{orderInfo.startTime ? moment(orderInfo.startTime).format('YYYY-MM-DD HH:mm:ss') : '-'}}至{{orderInfo.endTime ? moment(orderInfo.endTime).format('YYYY-MM-DD HH:mm:ss') : '-'}} 订单号: {{orderSn}}</div>

    <el-dialog :title="dialog_facilityName" :visible.sync="dialogVisible" width="60%" center>
      <template slot-scope="scope">
        <div class="dialog_header">
          <span>器械:{{dialog_facilityName}}</span>
          <span>时长:{{dialog_sportLength}}</span>
          <span>消耗:{{dialog_sportCalorie}}</span>
        </div>
        <el-table :data="sportData" style="width: 100%" v-if="!isLoading">
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column v-for="(item, index) in unitKeys" :key="index"  :prop="item" :label="config.find(configitem => configitem.field == item).label">
            <template slot-scope="scope">
              {{scope.row[item] ? scope.row[item]+ config.find(configitem => configitem.field == item).unit : 'N/A'}}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
    <div class="tableBox">
      <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="facilityTypeName" label="项目">
          </el-table-column>
          <el-table-column prop="sportLength" label="时长">
          </el-table-column>
          <el-table-column prop="sportUnity" label="距离/次数">
          </el-table-column>
          <el-table-column prop="sportCalorie" label="消耗卡路里">
          </el-table-column>
           <el-table-column label="操作">
             <template slot-scope="scope">
               <el-button type="primary" plain @click="checkoutDetail(scope.row)">详细数据</el-button>
             </template>
          </el-table-column>
        </el-table>
    </div>
    <div style="font-size: 18px; font-weight: 600"> 
      <span>运动总时长: {{totalData.totalsportLength ? (totalData.totalsportLength/60).toFixed(2) : 0}}分钟</span>
      <span>消耗总卡路里: {{totalData.totalsportCalorie ? (totalData.totalsportCalorie/1000).toFixed(3) : 0}}kcal</span>
    </div>
  </div>
</template>

<script>
import { getUserSportDetailByDate, getSportFacilityDetail  } from 'api/operation/users';

export default {
  name: 'userSportDetail',
  data() {
    return {
      dialog_facilityName: '',
      dialog_sportLength: '',
      dialog_sportCalorie: '',
      dialog_sportDataVoList: [],
      sportData: [],
      dialogVisible: false,
      id: '',
      tableData: [],
      totalData: {},
      orderInfo: {},
      unitKeys: [],
      isLoading: false,
      config: [
        {
          label: '放松时间',
          field: 'cooldown',
          unit: '秒'
        },
        {
          label: '重量',
          field: 'heavy',
          unit: 'kg'
        },
        {
          label: '平局坡度',
          field: 'incline',
          unit: '%',
        },
        {
          label: '平均速度', 
          field: 'speed',
          unit: 'km/h',
        },
        {
          label: '耗时',
          field: 'time',
          unit: '秒'
        },
        {
          label: '瓦特',
          field: 'watt',
          unit: 'w'
        },
        {
          label: '次数',
          field: 'times',
          unit: '次'
        }
      ]
    }
  },
  computed: {
    userId() {
      return this.$route.query.userId;
    },
    storeName() {
      return this.$route.query.storeName;
    },
    statisticDate() {
      return this.$route.query.statisticDate
    },
    orderSn() {
      return this.$route.query.orderSn
    },
    // unitKeys() {
    //   if (this.sportData.length == 0) {
    //     return []
    //   } else {
    //     let obj = this.sportData[0];
    //     for (let unit of Object.keys(obj)) {
    //       if (!obj[unit]) {
    //         delete obj[unit]
    //       }
    //     }
    //     console.log(Object.keys(obj))
    //     return Object.keys(obj)
    //   }
    // },
    // totalsportLength() {
    //   let total = 0;
    //   this.tableData.forEach( (item, index) => {
    //     total += item.sportLength
    //   })
    //   total = (total/60).toFixed(2);
    //   return total;
    //  },
    // totalsportCalorie() {
    //   let total = 0;
    //   this.tableData.forEach( (item, index) => {
    //     total += item.sportCalorie;
    //   })
    //   total = (total/1000).toFixed(3);
    //   return total;
    // }
  },
  methods: {
    getUnitKeys() {
      if (this.sportData.length == 0) {
        this.unitKeys = []
      } else {
        let obj = this.sportData[0];
        for (let unit of Object.keys(obj)) {
          if (!obj[unit]) {
            delete obj[unit]
          }
        }
        this.unitKeys =  Object.keys(obj)
      }
    },
    checkoutDetail(row) {
      this.isLoading = true;
      this.dialogVisible = true;
      this.dialog_facilityName = row.facilityTypeName;
      this.dialog_sportLength = row.sportLength;
      this.dialog_sportCalorie = row.sportCalorie;
      getSportFacilityDetail({
        id: row.id
      }).then( (res) => {
          this.sportData = res.data.data.sportDataVoList;
          this.getUnitKeys();
          this.isLoading = false;
      }).catch( () => {
        this.isLoading = false;
      })
      // this.dialog_sportCalorie = row.sportCalorie ? (row.sportCalorie/1000).toFixed(3) : '';
      // this.dialog_sportLength = row.sportLength ? (row.sportLength / 60).toFixed(2) : '';
      // this.sportData = row.sportData ? JSON.parse(row.sportData) : [];
    },
    fetchData() {
       getUserSportDetailByDate({
        userId: this.userId,
        statisticDate: this.statisticDate,
        orderSn: this.orderSn
      }).then( (res) => {
          // this.tableData = res.data.data; 
          this.isFetchingData = false;
          if (res.data.code == 200) {
            let list = res.data.data.list.voList;
            this.orderInfo = res.data.data.list.orderInfo;
            this.totalData = res.data.data.total;
            list.forEach( (item, index) => {
              item.sportUnity = item.sportTimes == 0 ? (item.sportDistance + '米') : (item.sportTimes + '次');
              item.sportCalorie = (item.sportCalorie / 1000) + 'kcal'
              item.sportLength = (item.sportLength / 60).toFixed(2) + '分钟'
            })
            this.tableData = list;
          }
      }).catch( () => {
        // this.isFetchingData = false;
      })
    }
  },
  mounted() {
    this.$nextTick( () => {
      this.fetchData();
    })
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.userSportDetailPage {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}

.dialog_header {
  background-color: #e5e5e5;
  box-sizing: border-box;
  padding: 10px;
  @include flexbox;
  @include justify-content(space-around);
}
</style>

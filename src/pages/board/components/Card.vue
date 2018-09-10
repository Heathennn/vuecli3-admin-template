<template>
  <div class="appointmentCard shadow" :style="timeInfoStyle" @click="checkoutOrder">

    <div class="hasClosed" v-if="timeInfo.intervalStatus == 1">已关闭</div>
    <!-- <div v-if="timeInfo.intervalStatus == 0" :class="getClass(timeInfo)" @click="close(timeInfo)">关闭时段</div> -->
    <div class="time">
      {{timeInfo.intervalLable}}
    </div>
    <div class="number">
      {{timeInfo.orderNormal}}
    </div>
    <div class="timeover" v-if="timeInfo.orderOvertime">
      含{{timeInfo.orderOvertime}}人超时
    </div>
    <div class="bottom">
      还可接受约{{timeInfoStyle.backgroundColor === '#e5e5e5' ? 0 : timeInfo.intervalStock}}人
    </div>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

// import moment from 'moment';

const today = moment().format('YYYY-MM-DD');
export default {
  props: {
    timeInfo: {
      type: Object,
      default: () => {}
    },
    currentDate: {
      type: String
    }
  },
  computed: {
    ...mapState({
      defaultStore: state => state.board.defaultStore
    }),
    timeInfoStyle() {
      let now = this.getMinute(moment().format('HH:mm'));
      let bTime = this.timeInfo.intervalLable.split('-');
      let bLabelMinute = this.getMinute(bTime[0]);
      let eLabelMinute = this.getMinute(bTime[1]);
      if (
        bLabelMinute <= now &&
        eLabelMinute < now &&
        this.timeInfo.intervalStatus !== 1 &&
        this.currentDate == today
      ) {
        return {
          backgroundColor: '#e5e5e5'
        };
      } else if (
        bLabelMinute <= now &&
        eLabelMinute > now &&
        this.currentDate == today
      ) {
        return {
          backgroundColor: 'blue',
          color: '#ffffff'
        };
      } else {
        return {};
      }
    }
  },
  methods: {
    ...mapActions(['closeTime']),
    getMinute(time) {
      let times = time.split(':');
      let minute = parseInt(times[0]) * 60 + parseInt(times[1]);
      return minute;
    },
    getClass(item) {
      if (item.intervalStatus == 0) {
        return ['closeTime'];
      } else {
        return [''];
      }
    },
    openTime(item) {
      if (
        !window.confirm(
          `确认开启时段[${item.intervalDay}:${item.intervalLable}]?`
        )
      ) {
        return;
      }
      this.$notify.warning(
        `正在开启时段${item.intervalDay}:${item.intervalLable}`
      );
      this.closeTime({
        storeId: this.defaultStore.id,
        startTime: item.start,
        endTime: item.end,
        intervalDay: item.intervalDay,
        intervalStatus: 0
      })
        .then(() => {
          this.$notify.success(
            `开启时段${item.intervalDay}:${item.intervalLable}成功`
          );
        })
        .catch(() => {
          this.$notify.error(
            `开启时段${item.intervalDay}:${item.intervalLable}失败`
          );
        });
    },
    close(item) {
      // console.log(item)
      this.$notify.warning(
        `正在关闭时段${item.intervalDay}:${item.intervalLable}`
      );
      this.closeTime({
        storeId: this.defaultStore.id,
        startTime: item.start,
        endTime: item.end,
        intervalDay: item.intervalDay,
        intervalStatus: 1
      })
        .then(() => {
          this.$notify.success(
            `关闭时段${item.intervalDay}:${item.intervalLable}成功`
          );
        })
        .catch(() => {
          this.$notify.error(
            `关闭时段${item.intervalDay}:${item.intervalLable}失败`
          );
        });
    },
    handleClose(done) {
      done();
    },
    checkoutOrder() {
      this.activeInterval = this.timeInfo.intervalLable;
      this.dialogVisible = true;
    },
    demo() {
      // console.log('demo')
      this.dialogVisible = false;
      // console.log(this.dialogVisible)
    }
  },
  data() {
    return {
      dialogVisible: false,
      activeInterval: '09:00-10:00',
      tableData: []
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.appointmentCard {
  border: 1px solid #999999;
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  @include flexbox;
  @include flex-direction(column);
  @include justify-content(space-between);
  @include align-items(center);
  &:hover {
    .closeTime {
      display: block;
    }
  }
  .hasClosed {
    text-align: center;
    line-height: 100px;
    position: absolute;
    cursor: pointer;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: black;
    opacity: 0.7;
    color: white;
  }
  .closeTime {
    display: none;
    text-align: center;
    line-height: 100px;
    position: absolute;
    cursor: pointer;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: black;
    opacity: 0.3;
    color: white;
  }
  .number {
    font-size: 40px;
    font-weight: 600;
    height: 50px;
    line-height: 50px;
  }
  .time {
    box-sizing: border-box;
    padding: {
      top: 10px;
    }
    font-size: 16px;
    height: 20px;
    line-height: 20px;
  }
  .bottom {
    text-align: center;
    background-color: black;
    width: 100%;
    height: 35px;
    line-height: 35px;
    color: #ffffff;
  }
}
.time,
.number,
.timeover,
.bottom {
  font-size: 12px;
}
</style>

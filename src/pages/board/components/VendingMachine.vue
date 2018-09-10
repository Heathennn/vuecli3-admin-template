<template>
  <div class="machinePage">
    <!-- <div class="machineID">
      预警商品: A1可乐; A2可口; A3可可; 共三种商品
    </div> -->
    <div class="title">售货机</div>
    <div class="lockers" ref="lockers">
      <div class="item shadow" v-for="(item, index) in sortedVendingList" :key="index">
        <div class="id">{{item.slotNo}}</div>
        <div class="itemImg" :style="`background-image: url(${item.goodsInfo.minPicUrl}); background-size: 100% 100%`" v-if="item.goodsInfo">
        </div>
        <div class="state" v-if="item.goodsInfo">
          {{ item.goodsInfo.goodsName }}
        </div>
        <div v-if="item.goodsInfo">
          ¥{{item.goodsInfo.priceSaler / 100}}
        </div>
        <div>
          <el-tag color="#ffffff"
                  :style="`color: #999999; border: 1px solid #999999`">库存: {{item.goodsSurplus}}</el-tag>
        </div>
      </div>
    </div>
    <!-- <div v-else>暂无售货机商品</div> -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import {
  deepCopy,
  compare
} from 'common/utils';

export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      defaultStore: state => state.board.defaultStore,
      vendingList: state => state.board.vendingList,
    }),
    sortedVendingList() {
      let list = deepCopy(this.vendingList);
      list = list.sort(compare('slotNo'));
      return list;
    },
  },
  methods: {
    ...mapActions(['getVendingList'])
  },
  watch: {
    defaultStore() {
       this.getVendingList({
          storeId: this.defaultStore.id,
      })
    }
  },
  mounted() {
    this.$nextTick( () => {
    })
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.machinePage {
  box-sizing: border-box;
  padding: 10px;
  .title {
    font-size: 20px;
    height: 50px;
    line-height: 50px;
  }
}
.machineID {
  width: 60%;
  min-height: 50px;
  border: 1px solid #999999;
  line-height: 50px;
}
.lockers {
  width: 100%;
  @include flexbox;
  @include flex-wrap(wrap);
  // @include justify-content(space-around);
  // border: 1px solid #999999;
  box-sizing: border-box;
  padding: {
    left: 10px;
    right: 10px;
  }
  .item {
    @include flexbox;
    @include flex-direction(column);
    @include justify-content(center);
    @include align-items(center);
    // border: 1px solid black;
    width: 150px;
    height: 200px;
    box-sizing: border-box;
    transition: all 1s;
    padding: 10px;
    margin: {
      bottom: 10px;
      right: 10px;
    }
    // border: 1px solid #999999;
    .id {
      width: 100%
    }
    .itemImg {
      width: 80%;
      height: 100px;
    }
  }
}
</style>

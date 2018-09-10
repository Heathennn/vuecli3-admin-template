<template>
  <el-select v-model="storeStatus" placeholder="请选择">
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import { setStoreStatus } from 'api/storePart/store';

import {
  mapActions
} from 'vuex';

export default {
  name:'storeStatus',
  props: {
    row: {
      type: [Number]
    }
  },
  methods: {
    ...mapActions(['updateStoreDetail', 'getStoreList']),
  },
  mounted() {
    this.$nextTick( () => {
      console.log(this.row)
      this.storeStatus = this.row;
    })
  },
  watch: {
    storeStatus(value, oldvalue) {
      if (!oldvalue) return;
      this.updateStoreDetail({
        id: this.row.id,
        businessStatus: this.storeStatus
      })
        .then(res => {
          // console.log(res);
          if (res.data.code == 200) {
            this.$notify.success('修改门店状态成功');
            this.getStoreList({page: 1, size: 100});
          } else {
            this.$notify.error('修改门店状态失败');
          }
        })
        .catch(error => {
          this.$notify.error('修改门店状态失败');
        });
    }
  },
  data() {
    return {
      storeStatus: '',
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
  }
};
</script>

<style lang="scss" scoped>

</style>

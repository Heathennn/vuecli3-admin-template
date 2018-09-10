<template>
  <div class="managerInfo">
    <div class="managerInfoTitle">编辑-店长信息</div>
    <div class="selectManager">
      <div class="subTitle">选择店长: </div>
      <el-select v-model="selectedManager" placeholder="请选择">
        <el-option v-for="item in managerList" :key="item.id" :label="item.ownerName" :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="buttonBox">
      <el-button type="primary" @click.native="binManager">保存</el-button>
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
      selectedManager: ''
    };
  },
  computed: {
    ...mapState({
      managerList: state => state.store.managerList
    })
  },
  watch: {
    selectedManager(val) {
      // console.log(val);
    }
  },
  methods: {
    ...mapActions(['getManagerList', 'bindManagerForStore']),
    findManagerById(id) {
      let arr = this.managerList.filter( (item) => {
        return item.id === id
      });
      return arr[0].ownerName;
    },
    binManager() {
      this.bindManagerForStore({ 
        storeId: this.storeId,
        managerId: this.selectedManager
      }).then( () => {
        this.$notify({
          title: '成功',
          message: `门店[${this.storeId}] 绑定店长[${this.findManagerById(this.selectedManager)}]成功`,
          type: 'success'
        })
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(this.storeId)
      this.getManagerList();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.managerInfo {
  width: 100%;
  height: calc(100% - 60px);
  box-sizing: border-box;
  padding: 20px;
  background-color: #ffffff;
}

.managerInfoTitle {
  font-size: 30px;
  height: 50px;
  line-height: 50px;
  border: {
    bottom: 1px solid #999999;
  }
}

.selectManager {
  @include flexbox;
  @include align-items(center);
  box-sizing: border-box;
  width: 100%;
  padding: {
    top: 30px;
  }
}
.buttonBox {
  box-sizing: border-box;

  padding: {
    top: 40px;
  }
}
.subTitle {
  height: 40px;
  line-height: 40px;
  margin: {
    right: 20px;
  }
}
</style>

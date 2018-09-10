<template>
  <div class="box protalPage">
    <div class="wraper">
      <div class="title">
        角色管理
      </div>
      <div class="sportOrderTop">
        <el-button type="primary" v-permission="'6f3438b4-96ec-4794-abac-dabc78ef4843'" @click="addRole">添加角色</el-button>
      </div>
      <!-- 表格部分 -->
      <div class="sportOrderBotom" v-permission="'f3ea16e1-e31a-46e4-9a8f-1e153f4fbad9'"> 
        <div style="width: 100%">
          <el-table :data="roleList" style="width: 100%">
            <el-table-column prop="id" label="ID">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称">
            </el-table-column>
            <el-table-column prop="isValid" label="状态">
              <template slot-scope="scope">
                {{scope.row.isValid == 1 ? '启用' : scope.row.isValid == 2 ? '禁用' : ''}}
              </template>
            </el-table-column>
            <el-table-column prop="userNum" label="成员">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" plain v-permission="'e821486a-dfa2-4b49-8e52-558f6347cc1f'" @click="edit(scope.row)" v-if="scope.row.isAdmin != 1 && $store.state.auth.userInformation.isAdmin == 1">编辑</el-button>
                <el-button type="danger" plain v-permission="'7e729643-bdbd-4d57-9d3e-584e77da02c8'"  v-if="scope.row.isAdmin != 1 && $store.state.auth.userInformation.isAdmin == 1" @click="remove(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="paging">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
              </el-pagination>
          </div>
        </div>
        <!-- 分页 -->
      </div>
    </div>
  </div>
</template>

<script>
import { getRoles, removeRole } from './role';

export default {
  name: 'role',
  data() {
    return {
      currentPage: 1,
      currentSize: 10,
      curTotal: 0,
      roleList: []
    };
  },
  methods: {
    remove(row) {
      if (confirm('确认要删除吗?')) {
        removeRole({
          id: row.id,
          adminId: this.$store.state.auth.userInformation.id,
        }).then( (res) => {
          if (res.data.code == 200) {
            this.$notify.success('删除成功');
            this.fetchRole();
          } else {
            this.$notify.error(res.data.message || '删除失败, 请重试');
          }
        }).catch( () => {
            this.$notify.error('删除失败, 请重试');
        })
      }
    },
    addRole() {
      this.$router.push({path: `/system/roleConfig`})
    },
    edit(row) {
      this.$router.push({path: `/system/roleConfig?id=${row.id}&roleName=${row.roleName}`})
    },
    handleSizeChange(val) {
      this.currentSize = val;
      this.fetchRole();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchRole();
    },
    mapPagination(res) {
      this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
      this.currentSize = res.pageSize;
      this.curTotal = res.total;
    },
    fetchRole() {
      getRoles({
        page: this.currentPage,
        size: this.currentSize
      }).then( (res) => {
        this.roleList = res.data.data.list;
        this.mapPagination(res.data.data);
      })
    }
  },
  mounted() {
    this.$nextTick( () => {
      this.fetchRole();
    })
  }
};
</script>

<style lang="scss" scoped>
.wraper {
  background: white;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .sportOrderTop {
    margin: 20px 0;   
  }
  .title {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
    }
  }
  .sportOrderBotom {
    .paging {
      margin-top: 30px;
    }
  }
}
</style>


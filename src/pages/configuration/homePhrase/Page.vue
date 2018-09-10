<template>
  <div class="homePhrasePage">
    <div class="title">首页激励语</div>

    <div class="defaultPhrase" v-permission="'349efd60-f240-4b6e-8677-a440e34a1304'">
      <sub-title title="默认显示"></sub-title>
      <div class="tableBox">
        <el-table :data="defaultPhrase" style="width: 100%" :border="true" v-permission="'86555937-2552-424b-a483-a67c96bd9860'">
          <el-table-column prop="encourageContent" label="激励语">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="editDefaultPhraseContent(scope.row)" v-permission="'46b843dc-e785-4935-8992-8d372a5ae5c9'">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 默认弹框 -->
    <el-dialog title="编辑" center :visible.sync="defaultVisible" width="50%" :before-close="defaultHandleClose">
      <el-input type="textarea" placeholder="输入激励语(30字以内)" v-model="editingDefaultPhraseContent" maxlength="30"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="defaultVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDefault">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 指定弹框 -->
    <el-dialog :title="isCreate ? '新建' : '编辑'" center :visible.sync="otherVisible" width="40%" :before-close="otherHandleClose">
      <div class="dateTimePicker">
        <div class="subTitle">显示时间</div>
        <el-date-picker v-model="showtime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </div>
      <div class="phraseInput">
        <div class="subTitle">激励语</div>
        <el-input type="textarea" placeholder="输入激励语(30字以内)" v-model="newPhrase" style="width: 400px" maxlength="30"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="otherVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCreate">确 定</el-button>
      </span>
    </el-dialog>

    <div class="otherPhrases" v-permission="'80f77b44-9dc4-47a5-a6da-542878f91ad2'">
      <div class="other_header">
        <sub-title title="指定显示"></sub-title>
        <el-button type="primary" @click="createPhrase" v-permission="'f9d1e4a0-2804-4ef2-82bf-93f26de06a5d'">新建</el-button>
      </div>

      <div class="tableBox" v-loading="isLoading" v-permission="'722d8ac5-4d61-4a4c-b29b-dc0da9179cc8'">
        <el-table :data="phrases" style="width: 100%" :border="true">
          <el-table-column prop="createTime" label="创建日期">
          </el-table-column>
          <el-table-column prop="time" label="显示有效期">
            <template slot-scope="scope">
              {{moment(scope.row.startTime).format('YYYY-MM-DD HH:mm:ss') + '至' + moment(scope.row.endTime).format('YYYY-MM-DD HH:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column prop="encourageContent" label="激励语">
          </el-table-column>
          <el-table-column prop="status" label="状态">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" plain v-if="scope.row.status === '未到期' || scope.row.status === '进行中'" @click="editOther(scope.row)" v-permission="'1c02794f-28b3-4d64-bb87-cecf1013ed95'">编辑</el-button>
              <el-button type="danger" plain v-if="scope.row.status === '未到期'" @click="remove(scope.row)" v-permission="'80226a04-6d74-4cd5-ba5d-8f927afc72cf'">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="paginationBox" v-permission="'722d8ac5-4d61-4a4c-b29b-dc0da9179cc8'">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="curPageSize" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
        </el-pagination>
      </div>

    </div>
  </div>
</template>

<script>
import SubTitle from 'components/SubTitle';

import {
  getHomePhraseList,
  addHomePhrase,
  updateHomePhrase,
  removePhrase
} from 'api/configuration/homePhrase';

export default {
  data() {
    return {
      currentPage: 1,
      curPageSize: 10,
      curTotal: 0,
      otherId: '',
      pageSizes: [10, 20, 30, 40],
      defaultPhrase: [],
      showtime: [],
      newPhrase: '',
      defaultVisible: false,
      otherVisible: false,
      phrases: [],
      isCreate: false,
      isLoading: false,
      editingDefaultPhraseContent: ''
    };
  },
  computed: {
    defaultId() {
      return this.defaultPhrase[0].id ? this.defaultPhrase[0].id : null;
    },
    selectedDate() {
      return this.showtime[0].split(' ')[0];
    }
  },
  components: {
    SubTitle
  },
  methods: {
    remove(row) {
      if (confirm('确定要删除吗?')) {
        removePhrase({ id: row.id })
          .then(res => {
            if (res.data.code == 200) {
              this.$notify.success('删除成功');
              this.fetchData();
            } else {
              this.$notify.error('删除失败, 请重试');
            }
          })
          .catch(() => {
            this.$notify.error('删除失败, 请重试');
          });
      }
    },
    editDefaultPhraseContent(row) {
      this.editingDefaultPhraseContent = row.encourageContent
        ? row.encourageContent
        : '';
      this.defaultVisible = true;
    },
    editDefault() {
      if (this.defaultId) {
        updateHomePhrase({
          id: this.defaultId,
          encourageContent: this.editingDefaultPhraseContent,
          isDefault: 1,
          adminId: this.$store.state.auth.userInformation.id
        })
          .then(res => {
            if (res.data.code == 200) {
              this.$notify.success('编辑激励语成功');
              this.fetchDefaultData();
              this.defaultVisible = false;
              return;
            }
            this.$notify.error('编辑激励语失败');
            this.defaultVisible = false;
            return;
          })
          .catch(() => {
            this.$notify.error('编辑激励语失败');
            this.defaultVisible = false;
            return;
          });
      } else {
        addHomePhrase({
          encourageContent: this.editingDefaultPhraseContent,
          isDefault: 1,
          adminId: this.$store.state.auth.userInformation.id
        })
          .then(res => {
            if (res.data.code == 200) {
              this.$notify.success('编辑激励语成功');
              this.fetchDefaultData();
              this.defaultVisible = false;
              return;
            }
            this.$notify.error('编辑激励语失败');
            this.defaultVisible = false;
            return;
          })
          .catch(() => {
            this.$notify.error('编辑激励语失败');
            this.defaultVisible = false;
            return;
          });
      }
    },
    confirmCreate() {
      if (this.verify()) {
        if (this.isCreate) {
          addHomePhrase({
            startTime: this.showtime[0],
            endTime: this.showtime[1],
            encourageContent: this.newPhrase,
            isDefault: 0,
            adminId: this.$store.state.auth.userInformation.id
          })
            .then(res => {
              if (res.data.code == 200) {
                this.$notify.success('新建激励语成功');
                this.fetchData();
                this.otherVisible = false;
                return;
              }
              this.$notify.error('新建激励语失败');
              this.otherVisible = false;
              return;
            })
            .catch(() => {
              this.$notify.error('新建激励语失败');
              this.otherVisible = false;
              return;
            });
        } else {
          updateHomePhrase({
            id: this.otherId,
            startTime: this.showtime[0],
            endTime: this.showtime[1],
            encourageContent: this.newPhrase,
            isDefault: 0,
            adminId: this.$store.state.auth.userInformation.id
          })
            .then(res => {
              if (res.data.code == 200) {
                this.$notify.success('编辑激励语成功');
                this.fetchData();
                this.otherVisible = false;
                return;
              }
              this.$notify.error('编辑激励语失败');
              this.otherVisible = false;
              return;
            })
            .catch(() => {
              this.$notify.error('编辑激励语失败');
              this.otherVisible = false;
              return;
            });
        }
      }
    },
    createPhrase() {
      this.otherVisible = true;
      this.showtime = [];
      this.newPhrase = '';
      this.isCreate = true;
    },
    editOther(row) {
      this.otherId = row.id;
      this.newPhrase = row.encourageContent;
      this.showtime = [
        moment(row.startTime).format('YYYY-MM-DD HH:mm:ss'),
        moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
      ];

      // console.log(this.showtime);
      this.isCreate = false;
      this.otherVisible = true;
    },
    handleSizeChange(size) {
      this.curPageSize = size;
      this.fetchData();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.fetchData();
    },
    defaultHandleClose(done) {
      done();
    },
    otherHandleClose(done) {
      done();
    },
    mapPagination(res) {
      this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
      this.curPageSize = res.pageSize;
      this.curTotal = res.total;
    },
    verify() {
      if (
        this.showtime.length < 1 ||
        new Date(this.selectedDate).getTime() <
          new Date(this.moment().format('YYYY-MM-DD')).getTime()
      ) {
        this.$notify.error('请选择当前日期(或以后)为起始的日期区间');
        return false;
      }
      if (!this.newPhrase.trim()) {
        this.$notify.error('请输入激励语');
        return false;
      }
      return true;
    },
    // 获取默认
    fetchDefaultData() {
      getHomePhraseList({
        isDefault: 1
      }).then(res => {
        this.defaultPhrase =
          res.data.data.list.length > 0 ? res.data.data.list : [{}];
      });
    },
    // 获取全部
    fetchData() {
      this.isLoading = true;
      getHomePhraseList({
        page: this.currentPage,
        size: this.curPageSize,
        isDefault: 0
      })
        .then(res => {
          res.data.data.list.forEach((item, index) => {
            item.createTime = this.moment(item.createTime).format(
              'YYYY-MM-DD HH:mm:ss'
            );
            // item.time =
            //   this.moment(item.startTime).format('YYYY-MM-DD HH:mm:ss') +
            //   '至' +
            //   this.moment(item.endTime).format('YYYY-MM-DD HH:mm:ss');
            item.status =
              item.status == 1
                ? '进行中'
                : item.status == 2
                  ? '未到期'
                  : item.status == 3
                    ? '已过期'
                    : item.status == 4 ? '已暂停' : '';
          });
          this.phrases = res.data.data.list;
          this.mapPagination(res.data.data);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData();
      this.fetchDefaultData();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.homePhrasePage {
  background: white;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .title {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #999999;
    }
  }
}

.defaultPhrase {
  box-sizing: border-box;
  padding: 20px;
}

.otherPhrases {
  box-sizing: border-box;
  padding: 20px;
  .other_header {
    @include flexbox;
    @include justify-content(space-between);
  }
}

.dateTimePicker {
  @include flexbox;
  @include align-items(center);
  margin: {
    bottom: 20px;
  }
  .subTitle {
    width: 100px;
  }
}
.phraseInput {
  @include flexbox;
  @include align-items(center);
  .subTitle {
    width: 100px;
  }
}
</style>

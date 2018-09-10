<template>
  <div class="protalPage">
    <div class="usersPage">
      <div class="title">
        音乐管理
      </div>
      <el-dialog title="上传音频" :visible.sync="dialogVisible" width="40%">
        <div style="font-size:10px;color:red">(出现<span style="color:green">绿色对号<i class="el-icon-circle-check"></i></span>标识时为上传成功!)</div>
        <div class="dialog_item">
          <div style="width: 80px;">选择门店</div>
          <el-select v-model="store" placeholder="请选择" size="medium" style="margin-bottom: 10px">
            <el-option v-for="(item, index) in dropdownStoreList" :key="index" :label="item.storeName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <el-upload class="upload-demo" :action="actionApi" :on-success="successUpload" :on-error="failedUpload" :before-upload="beforeAvatarUpload" :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button> 
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </el-dialog>
      <div class="music" v-permission="'fb727079-cd44-48a1-a861-6b246b6a8a88'">
        <div class="header">
          <div class="subtitle">普通音频</div>
          <el-button type="primary" @click="_uploadMusic(1)" v-permission="'4d4e6ced-3d23-4a20-b8db-1cd1fe0f4ade'">上传</el-button>
        </div>
        <div class="musicTable" v-permission="'47f086fa-3673-472a-84c3-ac8da8988653'">
          <music-table :tableData="normalMusic" @refresh="fetchMusic"></music-table>
          <div class="paginationBox">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentNormalPage" :page-sizes="[10, 20, 30, 40]" :page-size="currentNormalSize" layout="total, sizes, prev, pager, next, jumper" :total="curNormalTotal">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="specialMusic" v-permission="'0e5c45e1-72be-4203-83cf-1be188cf5906'">
        <div class="header">
          <div class="subtitle">紧急音频</div>
          <el-button type="primary" @click="_uploadMusic(2)" v-permission="'6bd38c83-6ea9-4683-8404-af26f0f3cddc'">上传</el-button>
        </div>
        <div class="speMusicTable">
          <music-table :tableData="crazyMusic" v-permission="'98a4d706-711d-412d-955a-041bca167f80'" @refresh="fetchMusic"></music-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MusicTable from './components/MusicTable';

import * as MusicApi from 'api/operation/music';

import { uploadFileApi } from 'common/common';

export default {
  components: {
    MusicTable
  },
  data() {
    return {
      store: 1,
      currentNormalPage: 1,
      currentNormalSize: 10,
      curNormalTotal: 0,
      actionApi: uploadFileApi,
      fileList: [],
      musicList: [],
      musicUrl: '',
      musicName: '',
      normalMusic: [],
      crazyMusic: [],
      curMusicType: 1,
      dialogVisible: false,
      isOverUploading: false,
      useableMusicSuffix: [
        'mp3',
        'wma',
        'mod',
        'wmv',
        'ra',
        'cd',
        'md',
        'asf',
        'mp3pro'
      ] // 音乐格式
    };
  },
  computed: {
    dropdownStoreList() {
      return this.$store.state.board.dropdownStoreList
    },
  },
  methods: {
    handleSizeChange(val) {
      this.currentNormalSize = val;
      this.fetchNormal();
    },
    handleCurrentChange(val) {
      this.currentNormalPage = val;
      this.fetchNormal();
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    },
    handleExceed(files, fileList) {},
    beforeRemove(file, fileList) {},
    beforeAvatarUpload(file) {
      const isMP4 = file.type === 'audio/mp3' || file.type === 'audio/mpeg';
      // const isMP4 = true;
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isMP4) {
        this.$notify.error('上传音频只能是 MP3 格式!');
      }
      if (!isLt20M) {
        this.$notify.error('上传视音频大小不能超过 20MB!');
      }
      return isMP4 && isLt20M;
    },
    successUpload(response, file, filelist) {
      let ossmusicUrl = response.data['oss-request-url'];
      let size = (response.data.info.size_upload / 1024 / 1024).toFixed(1);
      this.musicList.push({ name: file.name, url: ossmusicUrl, size: size });
      this.isOverUploading = true;
    },
    failedUpload(err, file, filelist) {
      this.$notify.error('文件上传失败, 请重新上传');
      this.isOverUploading = false;
    },
    getSuffix(musicName) {
      if (!musicName || typeof musicName !== 'string') return '';
      let arr = musicName.split('.');
      let suffix  = arr.pop();
      let name = arr.join('');
      return {
        name: name,
        suffix: suffix
      }
    },
    confirm() {
      if (!this.isOverUploading) {
        return this.$notify.warning('请等待文件上传成功');
      }
      let list = JSON.parse(JSON.stringify(this.musicList));
      let params = [];

      list.forEach( (item) => {
        let param = {};
        param.storeId = this.store;
        param.musicName =this.getSuffix(item.name).name;
        param.musicSuffix = this.getSuffix(item.name).suffix;
        param.musicUrl = item.url;
        param.musicLength = item.size;
        param.musicType = this.curMusicType
        params.push(param);
      })
      this.dialogVisible = false;
      MusicApi.uploadMusic({
        param: JSON.stringify(params)
      })
        .then(res => {
          // console.log(res);
          if (res.data.code == 200) {
            this.$notify.success(`音频上传成功`);
            this.fetchMusic();
          } else {
            this.$notify.error(
              `音频上传失败, 错误描述: ${res.data.message}`
            );
          }
        })
        .catch(error => {
          this.$notify.error(
            `音频上传失败, 错误描述: 网络异常`
          );
        });
    },
    mapNormalPagination(res) {
      this.currentNormalPage = res.pageNum < 1 ? 1 : res.pageNum;
      this.currentNormalSize = res.pageSize;
      this.curNormalTotal = res.total;
    },
    cancel() {
      this.dialogVisible = false;
    },
    _uploadMusic(musicType) {
      this.curMusicType = musicType;
      this.fileList = [];
      this.musicList = [];
      this.dialogVisible = true;
    },
    fetchNormal() {
      MusicApi.getMusicList({
        // 获取普通音频
        page: this.currentNormalPage,
        size: this.currentNormalSize,
        musicType: 1
      }).then(res => {
        // console.log('普通音频', res);
        this.normalMusic = res.data.data.list;
        this.mapNormalPagination(res.data.data);
      });
    },
    fetchCrazy() {
      MusicApi.getMusicList({
        // 获取紧急音频
        page: 1,
        size: 100,
        musicType: 2
      }).then(res => {
        // console.log('紧急音频', res);
        this.crazyMusic = res.data.data.list;
      });
    },
    fetchMusic() {
      this.fetchNormal();
      this.fetchCrazy();
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {
        vm.fetchMusic();
      });
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.musicList = [];
      this.fetchMusic();
      if (this.dropdownStoreList.length==0) {
        this.$store.dispatch('getStores');
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.usersPage {
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .title {
    font-size: 30px;
    height: 50px;
    line-height: 50px;
    border: {
      bottom: 1px solid #0e0808;
    }

  }
  .header {
    @include flexbox;
    @include justify-content(space-between);
  }
  .subtitle {
    font-size: 20px;
    font-weight: 600;
  }
  .header {
    box-sizing: border-box;
    padding: {
      top: 30px;
      bottom: 30px;
    }
  }
  .paginationBox {
    padding: {
      top: 20px;
    }
  }
  .specialMusic {
    width: 100%;
    height: 400px;
  }

  .dialog_item {
    @include flexbox;
    @include align-items(center);
  }
}
</style>

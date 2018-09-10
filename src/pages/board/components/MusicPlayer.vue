<template>
  <div class="music-player">
    <div class="currentMusic" v-if="normalMusic[0]">
      <div class="currentMusicName">
        {{curPalyMusic ? curPalyMusic.musicName : ''}}
      </div>
      <div class="musicPlayerButtons">
        <div :style="musicStyle" class="musicControler" @click="changeType"></div>
        <div class="playButton" :style="isPlaying ? pauseStyle : playStyle" @click="palyControl"></div>
        <div></div>
      </div>
    </div>
    <div class="currentMusic" v-else>暂无</div>
    <el-popover ref="popover4" placement="bottom" width="300" trigger="click">
      <div class="popoverContent">
        <el-tabs tab-position="left" style="height: 300px;">
          <el-tab-pane label="普通音频文件">
            <div class="normalMusics">
              <div class="musicItem" v-for="(item, index) in normalMusic" :key="index" @click="_playMusic(item, 1, index)">
                {{index + 1}}: &nbsp;(ID-{{item.id}}){{item.musicName}}
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="紧急音频">
            <div class="crazyMusics">
              <div class="musicItem" v-for="(item, index) in crazyMusic" :key="index" @click="_playMusic(item, 2, index)">
                {{index + 1}}: &nbsp;(ID-{{item.id}}){{item.musicName}}
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-popover>
    <div class="list" v-popover:popover4>播放列表</div>
  </div>
</template>

<script>
import PlayButton from 'assets/play.png';

import PauseButton from 'assets/pause.png';

import Danqu from 'assets/单曲循环@3x.png';

import Shuxu from 'assets/循环@3x.png';

import Suiji from 'assets/随机@3x.png';

import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  data() {
    return {
      curPalyMusic: null,
      isPlaying: false,
      curIndex: 0,
      playMode: 0,
      musicType: 1,
      isChangingType: false,
      playStyle: {
        backgroundImage: `url(${PlayButton})`,
        backgroundSize: '100% 100%'
      },
      pauseStyle: {
        backgroundImage: `url(${PauseButton})`,
        backgroundSize: '100% 100%'
      }
    };
  },
  computed: {
    ...mapState({
      normalMusic: state => state.board.normalMusic,
      crazyMusic: state => state.board.crazyMusic
    }),
    musicStyle() {
      if (this.playMode == 0) {
        return {
          backgroundImage: `url(${Shuxu})`,
          backgroundSize: '100% 100%'
        }
      }
      if (this.playMode == 1) {
        return {
          backgroundImage: `url(${Danqu})`,
          backgroundSize: '100% 100%'
        }
      }
      if (this.playMode == 2) {
        return {
          backgroundImage: `url(${Suiji})`,
          backgroundSize: '100% 100%'
        }
      }
    }
  },
  methods: {
    ...mapMutations(['setNormalMusic']),
    ...mapActions(['getMusicPlayerList', 'playMusic']),
    changeType() {
      if (this.isChangingType) return this.$notify.warning('正在切换模式, 请稍后') 
      this.isChangingType = true;
      if (this.playMode == 2) {
        this.playMode = 0;
      } else {
        this.playMode = this.playMode + 1;
      }
      this.playMusic({
        equipmentId: 4,
        equipmentType: 'acoustics',
        status: this.isPlaying ? 1 : 0,
        musicId: this.curPalyMusic.id,
        musicType: this.musicType,
        playMode: this.playMode
      })
        .then(res => {
            this.$notify.success('切换模式成功');
            this.isChangingType = false;
        })
        .catch(error => {
          this.$notify.error('切换模式失败');
          this.isChangingType = false;
        });
    },
    
    palyControl(type) {
      if (!this.isPlaying) {
        this.$notify.warning(
          `准备播放音频[${this.curPalyMusic.id}-${this.curPalyMusic.musicName}]`
        );
      } else {
        this.$notify.warning(
          `准备关闭音频[${this.curPalyMusic.id}-${this.curPalyMusic.musicName}]`
        );
      }
      this.playMusic({
        equipmentId: 4,
        equipmentType: 'acoustics',
        status: this.isPlaying ? 0 : 1,
        musicId: this.curPalyMusic.id,
        musicType: type,
        playMode: this.playMode
      })
        .then(res => {
          if (!this.isPlaying) {
            this.$notify.success(
              `音频文件[${this.curPalyMusic.id}-${
                this.curPalyMusic.musicName
              }]正在播放`
            );
            this.isPlaying = true;
          } else {
            this.$notify.success(
              `音频文件[${this.curPalyMusic.id}-${
                this.curPalyMusic.musicName
              }]已关闭`
            );
            this.isPlaying = false;
          }
        })
        .catch(error => {
          if (!this.isPlaying) {
            this.$notify.error(
              `音频文件[${this.curPalyMusic.id}-${
                this.curPalyMusic.musicName
              }]播放失败, 错误码:${error.code}, 错误描述: ${error.message}`
            );
            this.isPlaying = false;
          } else {
            this.$notify.error(
              `音频文件[${this.curPalyMusic.id}-${
                this.curPalyMusic.musicName
              }]关闭失败, 错误码:${error.code}, 错误描述: ${error.message}`
            );
            this.isPlaying = true;
          }
        });
    },
    _playMusic(item, type, index) {
      if (type != this.musicType || index != this.curIndex) {
        // 切歌
        this.isPlaying = false;
      }
      this.curPalyMusic = item;
      this.curIndex = index;
      this.musicType = type;
      if (!this.isPlaying) {
        this.$notify.warning(`准备播放音频[${item.id}-${item.musicName}]`);
      } else {
        this.$notify.warning(`准备关闭音频[${item.id}-${item.musicName}]`);
      }
      this.playMusic({
        equipmentId: 4,
        equipmentType: 'acoustics',
        status: this.isPlaying ? 0 : 1,
        musicId: item.id,
        musicType: type,
        playMode: this.playMode
      })
        .then(res => {
          if (!this.isPlaying) {
            this.$notify.success(
              `音频文件[${item.id}-${item.musicName}]正在播放`
            );
            this.isPlaying = true;
          } else {
            this.$notify.success(
              `音频文件[${item.id}-${item.musicName}]已关闭`
            );
            this.isPlaying = false;
          }
        })
        .catch(error => {
          if (!this.isPlaying) {
            this.$notify.error(
              `音频文件[${item.id}-${item.musicName}]播放失败, 错误码:${
                error.code
              }, 错误描述: ${error.message}`
            );
          } else {
            this.$notify.error(
              `音频文件[${item.id}-${item.musicName}]关闭失败, 错误码:${
                error.code
              }, 错误描述: ${error.message}`
            );
            this.isPlaying = true;
          }
        });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getMusicPlayerList({
        page: 1,
        size: 10000,
        musicType: 1 // 普通
      }).then(() => {
        this.curPalyMusic = this.normalMusic[0];
      });
      this.getMusicPlayerList({
        page: 1,
        size: 10000,
        musicType: 2 // 紧急
      });
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';
.currentMusic {
  .currentMusicName {
    text-align: center;
    font-size: 20px;
  }
  .musicPlayerButtons {
    @include flexbox;
    @include justify-content(space-between);
    @include align-items(center);
    box-sizing: border-box;
    padding: {
      left: 20px;
      right: 20px;
    }
  }
  .playButton {
    width: 30px;
    height: 30px;
  }
}
.musicControler {
  width: 30px;
  height: 30px;
}
.list {
  text-align: end;
  font-size: 14px;
  color: #666666;
  cursor: pointer;
}
.normalMusics {
  height: 300px;
  overflow-y: scroll;
}
.popoverContent {
  @include flexbox;
  .musicType {
    box-sizing: border-box;
    border: {
      // right: 1px solid #
    }
  }
  .typeBox {
    padding: {
      right: 10px;
    }
    border: {
      right: 1px solid #e5e5e5;
    }
  }
  .title {
    color: black;
    font-size: 16px;
    height: 24px;
    line-height: 24px;
  }
  .item {
    cursor: pointer;
  }
  .musicItem {
    box-sizing: border-box;
    cursor: pointer;
    padding: {
      top: 5px;
      bottom: 5px;
    }
    &:hover {
      background-color: #e5e5e5;
    }
  }
  .musicList {
    box-sizing: border-box;
    padding: {
      left: 10px;
    }
    .listBox {
      font-size: 12px;
      .item {
        line-height: 20px;
        &:hover {
          color: white;
          background-color: blue;
        }
      }
    }
  }
}
</style>

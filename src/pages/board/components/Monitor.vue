<template>
  <div class="monitor" v-if="videoList && videoList.length > 0">
    <div class="playerBox" v-for="(item, index) in videoList" :key="index">
      <player :liveAddress="item.remarksAry.liveAddress"
              :rtmp="item.remarksAry.rtmp"
              :position="item.facilityPosition"
              :playerId="'player' + index"></player>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import Player from './Player';

export default {
  components: {
    Player
  },
  data() {
    return {
      videoList: [],
      playList: [
        {
          liveAddress: "http://hls.open.ys7.com/openlive/c441ad6dc6104fb5be7b8192cd92f0f4.m3u8",
          rtmp: "rtmp://rtmp.open.ys7.com/openlive/c441ad6dc6104fb5be7b8192cd92f0f4"
        },
        {
          liveAddress:"http://hls.open.ys7.com/openlive/a912e8b8c25244aa9d2bf8eb07130208.m3u8",
          rtmp:"rtmp://rtmp.open.ys7.com/openlive/a912e8b8c25244aa9d2bf8eb07130208"
        },
        {
          liveAddress: "http://hls.open.ys7.com/openlive/541825f3d9eb49b6ab5b26af8bbc0872.m3u8",
          rtmp: "rtmp://rtmp.open.ys7.com/openlive/541825f3d9eb49b6ab5b26af8bbc0872"
        },
        {
          liveAddress: "http://hls.open.ys7.com/openlive/f1244c6944eb4b15872863ec9ae336bd.m3u8",
          rtmp: "rtmp://rtmp.open.ys7.com/openlive/f1244c6944eb4b15872863ec9ae336bd"
        },
        {
          liveAddress: "http://hls.open.ys7.com/openlive/bd59cf6f20164f5392fe75c61d2b7248.m3u8",
          rtmp: "rtmp://rtmp.open.ys7.com/openlive/bd59cf6f20164f5392fe75c61d2b7248"
        },
        {
          liveAddress: "http://hls.open.ys7.com/openlive/8ca824b12fd24de6b3d080f6384738c3.m3u8",
          rtmp: "rtmp://rtmp.open.ys7.com/openlive/8ca824b12fd24de6b3d080f6384738c3"
        }
      ]
    }
  },
  methods: {
    ...mapActions(['getVideoList'])
  },
  mounted() {
    this.$nextTick( () => {
      // console.log(this.$store.state.board)
      this.getVideoList({
        storeId: this.$store.state.board.defaultStore.id
      }).then( (res) => {
        this.videoList = res;
        // this.videoList = res;
      }).catch( () => {
        this.videoList = []
      })
        // this.player1 = new EZUIPlayer('myPlayer1');
        // this.player2 = new EZUIPlayer('myPlayer2');
        // this.player3 = new EZUIPlayer('myPlayer3');
        // this.player4 = new EZUIPlayer('myPlayer4');
        // this.player5 = new EZUIPlayer('myPlayer5');
        // this.player6 = new EZUIPlayer('myPlayer6');
    })
  }
} 
</script>

<style lang="scss" scoped>
@import "~assets/style/utils";
.monitor {
  width: 100%;
  min-height: 100px;
  @include flexbox;
  @include flex-wrap(wrap);
  @include align-items(center);
  @include justify-content(space-around);
}

.playerBox {
  width: 400px;
  height: 450px;
  margin: {
    bottom: 10px;
  }
}


</style>

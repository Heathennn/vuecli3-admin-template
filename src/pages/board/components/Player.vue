<template>
  <div class="monitorDemo">
    <sub-title :title="position"></sub-title>
    <video class="player" :id="playerId" poster="" controls playsInline webkit-playsinline autoplay>
      <source :src="rtmp" type="" />
      <source :src="liveAddress" type="application/x-mpegURL" />
    </video>
  </div>
</template>

<script>
import SubTitle from 'components/SubTitle'
export default {
  props: {
    liveAddress: {
      type: String,
      default: ''
    },
    rtmp: {
      type: String,
      default: ''
    },
    playerId: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      player: null
    };
  },
  watch: {
  },
  components: {
    SubTitle
  },
  methods: {
  },
  mounted() {
    this.$nextTick(() => {
        this.player = new EZUIPlayer(`${this.playerId}`);
    });
  }
};
</script>

<style lang="scss" scoped>
.player {
 width: 100%;
 height: 400px;
 display: block;
 
  // border: 1px solid black;
}
</style>

<template>
  <div class="dropDownImageContainer"
       ref="container"
       @mouseover="onMouseOver"
       @mouseout="onMouseOut">
    <img :src="source"
         :style="imageStyle"
       class="link"/>
    <transition name="fadeDropDown">
      <div v-show="showDropDown"
           :style="dropdownStyle"
           class="dropdown">
        <img @load="onImageLoad"
             ref="image"
             class="image"
             id="dropDownImage"
             :src="source"
             :alt="source">
      </div>
    </transition>
  </div>
</template>
<style lang='scss' scoped>
@import '~assets/style/vendorPrefix';

.dropDownImageContainer {
  @include inline-flex;
  @include flex-wrap(wrap);
  text-align: center;
  width: 100%;
  position: relative;
}

.link {
  display: inline-block;
  text-align: left;
  width: 30px;
  height: 30px;
  word-wrap: break-word;
  color: #767676;
  font-size: 13px;
}

.fadeDropDown-enter-active,
.fadeDropDown-leave-active {
    transition: opacity .1s ease-in-out;
}

.fadeDropDown-enter,
.fadeDropDown-leave-to {
    opacity: 0;
    z-index: -1;
}

.dropdown {
  z-index: 1000;
  @include flexbox;
  @include flex-direction(column);
  @include vendor-prefix('user-select', none);
  overflow: hidden;
  position: absolute;
  left: 0;
  max-width: 100%;
  height: auto;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  @include vendor-prefix('transition', all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1));
  cursor: pointer;
  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
  .image {
    max-width: 100%;
    height: auto;
  }
}
</style>
<script>
'use strict'

const margin = 4;

// header height
const topOffset = 55;

export default {
  props: {
    source: String,
    imageStyle: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      imageWidth: 0,
      imageHeight: 0,
      isHovered: false,
      showDropDown: false,
      dropdownStyle: null
    }
  },
  watch: {
    isHovered(value) {
      if (!value) {
        this.showDropDown = false;
        return;
      }
      if (!this.imageHeight || !this.imageWidth) {
        return;
      }
      const { top, bottom, width } = this.$refs.container.getBoundingClientRect();
      const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      const displayHeight = (this.imageWidth > width*2 ? width / this.imageWidth * this.imageHeight : this.imageHeight) + margin;
      // console.log(document.getElementsByClassName('dropDownImageContainer')[0].style)
      
      if (screenHeight < bottom + displayHeight && displayHeight < top - topOffset) {
        this.dropdownStyle = {
          top: `${-displayHeight}px`
        }
      }
      else {
        this.dropdownStyle = {
          top: `calc(100% + ${margin}px)`
        }
      }
      this.showDropDown = true;
    }
  },
  methods: {
    onMouseOver() {
      this.isHovered = true;
    },
    onMouseOut() {
      this.isHovered = false;
    },
    onImageLoad() {
      this.imageWidth = this.$refs.image.width * 2;
      this.imageHeight = this.$refs.image.height * 2;
    }
  }
}
</script>
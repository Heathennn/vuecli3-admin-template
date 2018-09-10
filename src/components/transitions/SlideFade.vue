<template>
    <transition name="slide-fade"
                :mode="mode"
                @before-leave="handleBeforeTransition"
                @after-leave="handleAfterTransition">
        <slot></slot>
    </transition>
</template>
<style lang='scss' scoped>
@import '~assets/style/vendorPrefix';

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  @include vendor-prefix('transition', all 0.3s cubic-bezier(1, 0.5, 0.5, 1));
}

.slide-fade-enter,
.slide-fade-leave-to {
  @include vendor-prefix('transform', translateX(25px));
  opacity: 0;
}
</style>
<script>
export default {
    props: {
        mode: {
            type: String,
            validator: value => {
                return ['out-in', 'in-out'].includes(value);
            }
        }
    },
    data() {
        return {
            overflowX: null
        }
    },
    methods: {
        handleBeforeTransition() {
            this.overflowX = document.body.style.overflowX;
            Object.assign(document.body.style, { overflowX: 'hidden' });
            Object.assign(document.documentElement.style, { overflowX: 'hidden' });
        },
        handleAfterTransition() {
            Object.assign(document.body.style, { overflowX: this.overflowX });
            Object.assign(document.documentElement.style, { overflowX: this.overflowX });
        }
    }
}
</script>

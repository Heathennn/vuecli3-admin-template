<template>
  <sub-page v-if="subPageInfo"
            mainTitle="用户反馈"
            subTitle="用户反馈详情"
            :routeCallback="routeCallback">
    <feedback-detail v-if="subPageType === 'feedbackDetail'"
                  :id="ID"
                  @refreshFeedbackList="refreshFeedback"></feedback-detail>
    <upload-error-detail v-if="subPageType === 'uploadErrorDetail'"
                  :id="ID"
                  @refreshUploadErrorList="refreshUploadError"></upload-error-detail>
  </sub-page>   
</template>

<script>
import SubPage from 'components/SubPage';

import FeedbackDetail from './FeedbackDetail';

import UploadErrorDetail from './UploadErrorDetail';

export default {
  components: {
    SubPage,
    FeedbackDetail,
    UploadErrorDetail
  },
  props: {
    subPageInfo: {
      type: String
    }
  },
  computed: {
    subPageType() {
      let arr = this.subPageInfo.split('=');
      let type = arr[0];
      return type;
    },
    ID() {
      let arr = this.subPageInfo.split('=');
      let id = arr[1];
      return id;
    }
  },
  methods: {
    routeCallback() {
      this.$router.push( { path: '/service/feedback' });
    },
    refreshUploadError() {
      this.$emit('refreshUploadError');
    },
    refreshFeedback() {
      this.$emit('refreshFeedback');
    }
  },  
  data() {
    return {
      mapSubPage: {
        editManager: {
          mainTitle: '店长管理',
          subTitle: '编辑店长'
        },
        modifiyManager: {
          mainTitle: '店长管理',
          subTitle: '编辑店长'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

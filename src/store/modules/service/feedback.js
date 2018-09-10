import * as FeedbackApi from 'api/service/feedback';

const feedback = {
  state: {
    feedbackList: [],
    uploadErrorList: [],
    isFetchingFeedbackDatas: false,
    isFetchingUploadErrorDatas: false,
    pageSize1: 0, // 每页条数(传入) size(实际每页条数)
    pageNum1: 1, // 当前页数
    pages1: 0, // 总页数
    total1: 0, // 总条数
    pageSize2: 0, // 每页条数(传入) size(实际每页条数)
    pageNum2: 1, // 当前页数
    pages2: 0, // 总页数
    total2: 0 // 总条数
  },
  actions: {
    getFeedbackList({ commit }, payload) {
      commit('setIsFetchingFeedbackDatas', true);
      return new Promise((resolve, reject) => {
        FeedbackApi.getFeedbackList(payload)
          .then(res => {
            commit('setFeedbackList', res.data.data.list);
            commit('setFeedbackPagination', res.data.data);
            commit('setIsFetchingFeedbackDatas', false);
            resolve();
          })
          .catch(error => {
            commit('setIsFetchingFeedbackDatas', false);
            reject();
          });
      });
    },
    getUploadErrorList({ commit }, payload) {
      commit('setisFetchingUploadErrorDatas', true);
      return new Promise((resolve, reject) => {
        FeedbackApi.getUploadErrorList(payload)
          .then(res => {
            // console.log('故障上报', res);
            // console.log('参数', payload);
            commit('setUploadErrorList', res.data.data.list);
            commit('setisFetchingUploadErrorDatas', false);
            commit('setUploadErrorPagination', res.data.data);
            resolve();
          })
          .catch(error => {
            commit('setisFetchingUploadErrorDatas', false);
            reject();
          });
      });
    },
    getFeedbackDetail( { commit }, payload) {
      return new Promise( (resolve, reject) => {
        FeedbackApi.getFeedbackDetail(payload).then( (res) => {
          // console.log(res);
          if (res.data.code == 200) {
            resolve(res.data.data);
            return;
          }
          reject();
        }).catch( (error) => {
          reject();
        })
      })  
    },
    getUploadErrorDetail( { commit }, payload) {
      return new Promise( (resolve, reject) => {
        FeedbackApi.getUploadErrorDetail(payload).then( (res) => {
          // console.log(res);
          if (res.data.code == 200) {
            resolve(res.data.data);
            return;
          }
          reject();
        }).catch( (error) => {
          reject();
        })
      })  
    }
  },
  mutations: {
    setFeedbackList(state, payload) {
      state.feedbackList = payload;
    },
    setUploadErrorList(state, payload) {
      state.uploadErrorList = payload;
    },
    setIsFetchingFeedbackDatas(state, payload) {
      state.isFetchingFeedbackDatas = payload;
    },
    setisFetchingUploadErrorDatas(state, payload) {
      state.isFetchingUploadErrorDatas = payload;
    },
    setFeedbackPagination(state, payload) {
      state.pageSize1 = payload.pageSize;
      state.pageNum1 = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total1 = payload.total;
      state.pages1 = payload.pages;
    },
    setUploadErrorPagination(state, payload) {
      state.pageSize2 = payload.pageSize;
      state.pageNum2 = payload.pageNum < 1 ? 1 : payload.pageNum;
      state.total2 = payload.total;
      state.pages2 = payload.pages;
    }
  }
};

export { feedback };

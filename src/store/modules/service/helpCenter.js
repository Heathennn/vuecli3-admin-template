import * as HelpCenterApi from 'api/service/helpCenter';

const helpCenter = {
  state: {
    helpList: []
  },
  actions: {
    getHelpList({
      commit
    }, payload) {
      HelpCenterApi.getHelpList(payload).then( (res) => {
        commit('getHelpList', res.data.data.list);

      }).catch( (error) => {
        // console.log(error);
      })
    },
    addHelp({
      commit
    }, payload) {
      return new Promise( (resolve, reject) => {
        HelpCenterApi.addHelp(payload).then( (res) => {
          // console.log(res);
          if (res.data.code == 200) {
            resolve();
            return;
          }
          reject();
        }).catch( () => {
          reject();
        })
      })
    },
    removeHelp({
      commit
    }, payload) {
      return new Promise( (resolve, reject) => {
        HelpCenterApi.removeHelp(payload).then( (res) => {
          if (res.data.code == 200) {
            resolve();
            return;
          }
          reject();
        }).catch( () => {
          reject();
        })
      })
    }
  },
  mutations: {
    getHelpList(state, payload) {
      state.helpList = payload;
    }
  }
}

export {
  helpCenter
}
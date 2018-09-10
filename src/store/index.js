import Vue from 'vue';

import Vuex from 'vuex';

import { auth } from './modules/auth';

import { board } from './modules/board/board';

import { home } from './modules/home';

import { store } from './modules/storePart/store';

import { device } from './modules/storePart/device';

import { manager } from './modules/storePart/manager';

import { storeConfig } from './modules/storePart/storeConfig';

import { message } from './modules/operation/message';

import {income} from './modules/finance/income';

import {refund} from './modules/finance/refund';

import {recharge} from './modules/finance/recharge';

import { error } from './modules/operation/error';

import { shops } from './modules/operation/shops';

import { securezoom } from './modules/monitor/securezoom';

import { abnormalOrder } from './modules/service/abnormalOrder';

import { helpCenter } from './modules/service/helpCenter';

import { userDeposit } from './modules/finance/userDeposit';

import { sportOrder } from './modules/order/sportOrder';

import { channels } from './modules/finance/channels';

import { journal } from './modules/finance/journal';

import { stranger } from './modules/monitor/stranger';

import { credit } from './modules/configuration/credit';

import { userWallet } from './modules/finance/userWallet';

import { users } from './modules/operation/users';

import { shopsOrder } from './modules/order/shopsOrder';

import { errorCode } from './modules/configuration/errorCode';

import { coupon } from './modules/operation/coupon';

import { feedback } from './modules/service/feedback';

import { appVersion } from './modules/system/appVersion';

import { userTop } from './modules/user/userTop';

import permission from './modules/permission';

import getters from './getters'

Vue.use(Vuex);

const debug = process.env.NODE_ENV != 'production';

// 开启严格模式debug. 不在mutations里改变state会报错
export default new Vuex.Store({
  modules: {
    auth,
    board,
    home,
    store,
    device,
    manager,
    storeConfig,
    message,
    error,
    income,
    refund,
    recharge,
    shops,
    abnormalOrder,
    helpCenter,
    sportOrder,
    userDeposit,
    channels,
    journal,
    securezoom,
    stranger,
    credit,
    userWallet,
    users,
    shopsOrder,
    errorCode,
    coupon,
    feedback,
    appVersion,
    userTop,
    permission
  },
  getters,
  // strict: debug
});

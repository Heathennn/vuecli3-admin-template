import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Layout from 'pages/layout/Page'

export const constantRouterMap = [{
    path: '/login',
    component: () =>
      import ('pages/login/Page'),
    hidden: true
  },
  // {
  //   path: '/404',
  //   component: () =>
  //     import ('pages/errorPage/404'),
  //   hidden: true
  // },
]

export default new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})


export const asyncRouterMap = [
  {
    path: '',
    redirect: 'home',
    component: Layout,
    meta: {
      title: '首页',
      resource: "1d405aa0-5a67-4d0f-8d96-8c8f4a3fb680",
      noChild: true
    },
    children: [{
      path: 'home',
      component: () =>
        import ('pages/home/Page'),
      name: 'home',
      meta: {
        alwaysShow: true,
        resource: "1d405aa0-5a67-4d0f-8d96-8c8f4a3fb680",
        title: '首页',
      }
    }]
  },
  {
    path: '/historyMessage',
    component: Layout,
    hidden: true,
    meta: {
      title: '历史信息',
      noChild: true,
      alwaysShow: true,
    },
    children: [{
      path: 'index',
      name: 'historyMessage',
      component: () =>
        import ('pages/historyMessage/Page'),
      meta: {
        title: '历史消息',
        alwaysShow: true,
      }
    }]
  },

  // {
  //   path: '/board',
  //   component: Layout,
  //   meta: {
  //     title: '看板',
  //     noChild: true,
  //     resource: "d6c40046-1887-4a63-8733-441f95cfde68"
  //   },
  //   children: [{
  //     path: 'index',
  //     name: 'board',
  //     component: () =>
  //       import ('pages/board/Page'),
  //     meta: {
  //       title: '看板',
  //       alwaysShow: true,
  //     }
  //   }]
  // },
  // 门店管理
  {
    path: '/storePart',
    component: Layout,
    redirect: '/storePart/store',
    name: 'storePart',
    alwaysShow: true,
    // redirect: '/permission/index',
    // alwaysShow: true, // will always show the root menu
    meta: {
      title: '表格',
      resource: "317111fa-174d-4bc0-90d4-8636bfc4997e",
      // icon: 'lock',
    },
    children: [{
      path: 'store',
      component: () =>
        import ('pages/storePart/store/Page'),
      name: 'store',
      
      meta: {
        title: '门店管理',
        resource: "6b5c9ee9-6b28-47be-b505-d92d49d1547d",
      }
    }, {
      path: 'device',
      component: () =>
        import ('pages/storePart/device/Page'),
      name: 'device',
      meta: {
        title: '设备绑定',
        resource: "f00c3c18-ba22-46ee-ba37-97527325d264",
      }
    }, {
      path: 'manager',
      name: 'manager',
      component: () =>
        import ('pages/storePart/manager/Page'),
      meta: {
        title: '店长管理',
        resource: "c5673930-5b4f-46c6-83bb-1dbbfa63ad4e",
      }
    }, {
      path: 'storeConfig',
      name: 'storeConfig',
      component: () =>
        import ('pages/storePart/storeConfig/Page'),
      meta: {
        title: '门店配置',
        resource: "feec0f7e-2110-40cc-bb8f-9710fcf99027",
      }
    }, {
      path: 'storeBulletin',
      name: 'storeBulletin',
      component: () =>
        import ('pages/storePart/storeBulletin/Page'),
      meta: {
        title: '门店公告',
        resource: "f81d62ce-70d0-462f-a8db-6fcd8fad4449",
      }
    }, {
      path: 'addBulletin',
      name: 'addBulletin',
      component: () =>
        import ('pages/storePart/storeBulletin/AddBulletin'),
      hidden: true,
      meta: {
        title: '发布公告',
        alwaysShow: true,
      }
    }, {
      path: 'historyBulletin',
      name: 'historyBulletin',
      component: () =>
        import ('pages/storePart/storeBulletin/HistoryBulletin'),
      hidden: true,
      meta: {
        title: '历史公告',
        alwaysShow: true,
      }
    }]
  },
  // 用户管理
  {
    path: '/user',
    redirect: '/user/userList',
    component: Layout,
    name: 'user',
    alwaysShow: true,
    meta: {
      title: '用户管理',
      resource: "b69fd11f-9610-49b3-bec8-ab94395a3180"
    },
    children: [{
        path: 'userList',
        name: 'userList',
        component: () =>
          import ('pages/operation/users/Page'),
        meta: {
          title: '用户列表',
          resource: "a5efc9db-4c9f-4004-b303-faddbbd225aa",
        }
      },
      {
        path: 'userDetail',
        name: 'userDetail',
        hidden: true,
        component: () => import('pages/operation/users/components/UserDetail'),
        meta: {
          title: '用户详情',
          alwaysShow: true
        }
      },
      {
        path: 'userSportDetail',
        name: 'userSportDetail',
        hidden: true,
        component: () => import('pages/operation/users/UserSportDetail'),
        meta: {
          title: '运动详细数据',
          alwaysShow: true,
        }
      },
      {
        path: 'userTop',
        name: 'userTop',
        component: () =>
          import ('pages/user/userTop/Page'),
        meta: {
          title: '运动排行榜',
          resource: "1fa04bd2-4699-4f8a-a021-1038e7025864",
        }
      },
      {
        path: 'userFace',
        name: 'userFace',
        component: () =>
          import ('pages/user/userFace/Page'),
        meta: {
          title: '用户人脸采集',
          resource: "abc7343c-8a6f-4dd1-892e-eb17f969ceac",
        }
      },
      {
        path: 'userWall',
        name: 'userWall',
        component: () =>
          import ('pages/user/userWall/Page'),
        meta: {
          title: '用户上墙',
          resource: "f7b44277-e39d-40aa-aadb-0eaf186c0484",
        }
      },
      {
        path: 'userPlan',
        name: 'userPlan',
        component: () => import('pages/user/userPlan/Page'),
        meta: {
          title: '用户训练计划',
          resource: "3195efa6-b8d9-42e0-96b0-f192bc60db81",
        }
      },
      {
        path: 'userPlanDetail',
        name: 'userPlanDetail',
        component: () => import('pages/user/userPlan/UserPlanDetail'),
        hidden: true,
        meta: {
          title: '训练计划详情',
          alwaysShow: true,
        }
      }
    ]
  },
  // 运营管理
  {
    path: '/operation',
    redirect: '/operation/message',
    name: 'operation',
    component: Layout,
    meta: {
      title: '运营管理',
      resource: "d6006476-fa4e-4db6-8168-ae329d6733c2"
    },
    children: [{
        path: 'message',
        name: 'message',
        component: () =>
          import ('pages/operation/message/Page'),
        meta: {
          title: '消息管理',
          resource: "a35f917e-c48a-4f3b-a92a-9e2bc3f33420"
        }
      },
      {
        path: 'coupon',
        name: 'coupon',
        component: () =>
          import ('pages/operation/coupon/Page'),
        meta: {
          title: '优惠券管理',
          resource: "6347b70e-dd35-41aa-a7a1-202312b46e9f",
        }
      },
      {
        path: 'couponDetail',
        name: 'couponDetail',
        hidden: true,
        component: () => import('pages/operation/coupon/CouponDetail'),
        meta: {
          title: '优惠券详情'
        }
      },
      {
        path: 'error',
        name: 'error',
        component: () =>
          import ('pages/operation/error/Page'),
        meta: {
          title: '异常管理',
          resource: "1d860397-4686-49cc-9e19-7a63e4b34b4e",
        }
      },
      {
        path: 'shops',
        name: 'shops',
        component: () =>
          import ('pages/operation/shops/Page'),
        meta: {
          title: '售货机商品管理',
          resource: "7645411e-02f6-447d-bbf2-ec7793efa649",
        }
      },
      {
        path: 'activity',
        name: 'activity',
        component: () => import('pages/operation/activity/Page'),
        meta: {
          title: '活动列表',
          resource: "38a03bfe-4f09-4239-89e6-3efbc2165112"
        }
      }
    ]
  },

  // 客服管理
  {
    path: '/service',
    redirect: '/service/abnormalOrder',
    name: 'service',
    component: Layout,
    meta: {
      title: '客服管理',
      resource: "ca99ccf1-1cef-4a1e-8a1c-278b06421c21"
    },
    children: [{
        path: 'abnormalOrder',
        name: 'abnormalOrder',
        component: () =>
          import ('pages/service/abnormalOrder/Page'),
        meta: {
          title: '异常订单',
          resource: "c47ffcba-d16e-4b9d-b8ef-1f323cb17d39",
        }
      },
      {
        path: 'feedback',
        name: 'feedback',
        component: () =>
          import ('pages/service/feedback/Page'),
        meta: {
          title: '用户反馈',
          resource: "d6f21d5f-f2fe-444c-9d7a-18be7e0c3a5e"
        }
      },
      {
        path: 'onlineService',
        name: 'onlineService',
        component: () =>
          import ('pages/service/onlineService/Page'),
        meta: {
          title: '在线客服',
          resource: "99739114-ab09-416d-be21-0bec50ddc009",
        }
      },
      {
        path: 'helpCenter',
        name: 'helpCenter',
        component: () =>
          import ('pages/service/helpCenter/Page'),
        meta: {
          title: '帮助中心',
          resource: "a5b4ef68-dbac-4aca-b349-e92060870fef",
        }
      },
    ]
  },

  // 训练管理 
  {
    path: '/training',
    name: 'training',
    redirect: '/training/newPlan',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '训练管理',
      resource: "c1a7798b-53e8-4157-afe0-5a7cfe957812"
    },
    children: [{
        path: 'newPlan',
        name: 'newPlan',
        component: () =>
          import ('pages/training/newPlan/Page'),
        meta: {
          title: '定制计划生成',
          resource: "e86debcb-d951-4881-a226-fc319d95b54d"
        }
      },
      {
        path: 'difficultyConfig',
        name: 'difficultyConfig',
        component: () =>
          import ('pages/training/newPlan/DifficultyConfig'),
        hidden: true,
        meta: {
          title: '训练难度设置',
          alwaysShow: true,
        }
      },
      {
        path: 'courseConfig',
        name: 'courseConfig',
        hidden: true,
        component: () =>
          import ('pages/training/newPlan/CourseConfig'),
        meta: {
          title: '课程内容设置',
          alwaysShow: true,
        }
      },
      {
        path: '/training/planConfig',
        name: 'planConfig',
        redirect: '/training/planConfig/trainingLevel',
        component: () =>
          import ('pages/training/planConfig/index'),
        meta: {
          title: '定制计划影响',
          resource: "54da415c-c595-4218-b218-08a378c9dcb2",
        },
        children: [{
            path: 'trainingLevel',
            name: 'trainingLevel',
            component: () =>
              import ('pages/training/planConfig/trainingLevel/Page'),
            meta: {
              title: '训练难度设置',
              resource: "eb45d9f0-e11f-4622-8733-8a263d8a7199"
            }
          },
          {
            path: 'disease',
            name: 'disease',
            component: () =>
              import ('pages/training/planConfig/disease/Page'),
            meta: {
              title: '病痛设置',
              resource: "9b2cdcd3-1609-478a-84e6-8191c97b6b9d",
            }
          },
          {
            path: 'preference',
            name: 'preference',
            component: () =>
              import ('pages/training/planConfig/preference/Page'),
            meta: {
              title: '运动偏好设置',
              resource: "c3d65cd8-951e-430c-908c-0bf0496cde66"
            }
          },
          {
            path: '4Mtest',
            name: '4Mtest',
            component: () =>
              import ('pages/training/planConfig/4Mtest/Page'),
            meta: {
              title: '4M测试设置',
              resource: "f6414dd4-a650-4164-9c6a-93d3caa5f01b"
            }
          },
          {
            path: 'trainingCycle',
            name: 'trainingCycle',
            component: () =>
              import ('pages/training/planConfig/trainingCycle/Page'),
            meta: {
              title: '训练周期设置',
              resource: "fac590e3-471d-4fad-bd60-caaa46bc100a"
            }
          },
        ]
      },
      {
        path: 'course',
        name: 'courses',
        component: () =>
          import ('pages/training/courses/Page'),
        meta: {
          title: '训练课程库',
          resource: "ef8e191e-1c32-4ab4-9ac0-9652e86cc9d1"
        }
      },
      {
        path: 'courseBase',
        name: 'courseBase',
        hidden: true,
        component: () =>
          import ('pages/training/courses/CourseBase'),
        meta: {
          title: '配置课程',
          alwaysShow: true,
        }
      },
      {
        path: 'fatigueLevel',
        name: 'fatigueLevel',
        component: () =>
          import ('pages/training/fatigueLevel/Page'),
        meta: {
          title: '疲劳评价管理',
          resource: "ac46f463-7200-4ed6-ae4e-488ee8fc77b7"
        }
      },
      {
        path: 'trainingParts',
        name: 'trainingParts',
        component: () =>
          import ('pages/training/trainingParts/Page'),
        meta: {
          title: '训练部位管理',
          resource: "5c05f08d-dceb-4379-b316-3df2d7d49cfb"
        }
      },
      {
        path: 'sportFacility',
        name: 'sportFacility',
        component: () =>
        import ('pages/training/sportFacility/Page'),
        meta: {
          resource: "19eb0898-eb6a-46c3-9ace-59e0aff11657",
          title: '运动设备管理'
        }
      },
    ]
  },

  // 订单管理
  {
    path: '/order',
    name: 'order',
    redirect: '/order/sportOrder',
    component: Layout,
    meta: {
      title: '订单管理',
      resource: "fcea68d1-5f3b-4de1-84b9-1ab5e060b09c",
    },
    children: [
      {
        path: 'sportOrder',
        name: 'sportOrder',
        component: () =>
          import ('pages/order/sportOrder/Page'),
        meta: {
          title: '运动订单',
          resource: "0328cafd-0a11-43ea-abb4-512fa447a631"
        }
      },
      {
        path: 'sportOrderDetail',
        name: 'sportOrderDetail',
        component: () => import('pages/order/sportOrder/components/OrderDetail'),
        hidden: true,
        meta: {
          title: '运动订单详情',
          alwaysShow: true,
        }
      },
      {
        path: 'shopsOrder',
        name: 'shopsOrder',
        component: () =>
          import ('pages/order/shopsOrder/Page'),
        meta: {
          title: '售货机商品订单',
          resource: "c36975de-8900-4798-9744-701b01c07250"
        }
      },
    ]
  },

  // 财务管理
  {
    path: '/finance',
    name: 'finance',
    redirect: '/finance/income',
    component: Layout,
    meta: {
      title: '财务管理',
      resource: "a64b8485-4037-41b4-85ba-9d32225fabfd",
    },
    children: [{
        path: 'income',
        name: 'income',
        component: () =>
          import ('pages/finance/income/Page'),
        meta: {
          title: '收入',
          resource: "2ec6b1e8-836c-413d-8ab5-d2bc695f3f6b"
        }
      },
      {
        path: 'recharge',
        name: 'recharge',
        component: () =>
          import ('pages/finance/recharge/Page'),
        meta: {
          title: '充值',
          resource: "f37b3a51-2c90-4aab-b814-72f68666c59d"
        }
      },
      {
        path: 'userDeposit',
        name: 'userDeposit',
        component: () =>
          import ('pages/finance/userDeposit/Page'),
        meta: {
          title: '用户押金',
          resource: "bae3cfe0-f983-478b-9a40-8b6668879757"
        }
      },
      {
        path: 'channels',
        name: 'channels',
        component: () =>
          import ('pages/finance/channels/Page'),
        meta: {
          title: '渠道汇总',
          resource: "a8ea7bc7-5460-47ea-8f23-10318885c9b2"
        }
      },
      {
        path: 'userWallet',
        name: 'userWallet',
        component: () =>
          import ('pages/finance/userWallet/Page'),
        meta: {
          title: '用户钱包',
          resource: "9981f142-42f8-49f2-b34f-097f4b729df9"
        }
      },
      {
        path: 'journal',
        name: 'journal',
        component: () =>
          import ('pages/finance/journal/Page'),
        meta: {
          title: '平台流水',
          resource: "557a8620-20f1-46cf-bf9b-696b4bae0af6"
        }
      },
      {
        path: 'couponPresent',
        name: 'couponPresent',
        component: () => import('pages/finance/couponPresent/Page'),
        meta: {
          title: '赠送消耗',
          resource: "8fba9bab-5344-4ac6-979f-644b5a8e3b9e"
        }
      },
      {
        path: 'presentDetail',
        name: 'presentDetail',
        hidden: true,
        component: () => import('pages/finance/couponPresent/PresentDetail'),
        meta: {
          title: '赠送明细',
          alwaysShow: true,
        }
      },
      {
        path: 'auditDeposit',
        name: 'auditDeposit',
        component: () => import('pages/finance/auditDeposit/Page'),
        meta: {
          title: '押金审核',
          resource: "39f4a697-28d8-41a3-afee-fa9bd172419c"
        }
      },
      {
        path: 'auditDetail',
        name: 'auditDetail',
        hidden: true,
        component: () => import('pages/finance/auditDeposit/AuditDetail'),
        meta: {
          title: '押金审核详情',
          alwaysShow: true,
        }
      }
    ]
  },

  // 安防监控
  {
    path: '/monitor',
    name: 'monitor',
    redirect: '/monitor/stranger',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '安防监控',
      resource: "0323969c-667e-458c-b12d-f8edbc981f6f"
    },
    children: [{
        path: 'stranger',
        name: 'stranger',
        component: () =>
          import ('pages/monitor/stranger/Page'),
        meta: {
          title: '陌生人入场',
          resource: "484e32a3-2458-4e01-a728-df6b2914b884"
        }
      },
      {
        path: 'securezoom',
        name: 'securezoom',
        component: () =>
          import ('pages/monitor/securezoom/Page'),
        meta: {
          title: '安全画面',
          resource: "cd9f8599-1934-49d8-a368-574ebffc8219"
        }
      },
    ]
  },

  // 配置管理
  {
    path: '/configuration',
    name: 'configuration',
    redirect: '/configuration/music',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: '配置管理',
      resource: "a9687910-63d2-4960-8ceb-4d6df26e448c"
    },
    children: [{
        path: 'music',
        name: 'music',
        component: () =>
          import ('pages/operation/music/Page'),
        meta: {
          title: '音乐管理',
          resource: "380f7830-1d28-4063-a20c-d391d9bd2d01"
        }
      },
      {
        path: 'credit',
        name: 'credit',
        component: () =>
          import ('pages/configuration/credit/Page'),
        meta: {
          title: '信用分体系',
          resource: "98fc9f4c-389d-4f65-b574-a306e865f1d4"
        }
      },
      {
        path: 'errorCode',
        name: 'errorCode',
        component: () =>
          import ('pages/configuration/errorCode/Page'),
        meta: {
          title: '异常代码管理',
          resource: "f874e2e9-f909-486c-a24b-ec102bf3a1fc"
        }
      },
      {
        path: 'homePhrase',
        name: 'homePhrase',
        component: () =>
          import ('pages/configuration/homePhrase/Page'),
        meta: {
          title: '首页激励语',
          resource: "921c9a9e-2ee0-4b78-a992-c8f4123e24d4"
        }
      },
      {
        path: 'facilityConfig',
        name: 'facilityConfig',
        component: () =>
          import ('pages/configuration/facilityConfig/Page'),
        meta: {
          title: '设备类型扩展配置',
          resource: "f6740df7-74d9-4309-8dc7-f06281bc85e9"
        }
      }
    ]
  },

  // 系统管理
  {
    path: '/system',
    name: 'system',
    redirect: '/system/appVersion',
    component: Layout,
    meta: {
      title: '系统管理',
      resource: "fa50e106-2ba8-4bbe-953d-3f26c1252418"
    },
    children: [{
        path: 'appVersion',
        name: 'appVersion',
        component: () =>
          import ('pages/configuration/appVersion/Page'),
        meta: {
          title: 'APP版本配置',
          resource: "579b98a1-ea01-4527-a5db-a9ae4bfbe000"
        }
      },
      {
        path: 'depositConfig',
        name: 'depositConfig',
        component: () =>
          import ('pages/system/depositConfig/Page'),
        meta: {
          title: '押金配置',
          resource: "a305073e-db69-4e6e-ae02-d30b350af04a"
        }
      },
      {
        path: 'personnel',
        name: 'personnel',
        component: () =>
          import ('pages/system/personnel/Page'),
        meta: {
          title: '人员管理',
          resource: "4e5b396d-9df8-4a7b-8a31-8ccf920f1c34"
        }
      },
      {
        path: 'personnelConfig',
        name: 'personnelConfig',
        hidden: true,
        component: () => import('pages/system/personnel/PersonnelConfig'),
        meta: {
          title: '人员管理配置',
          alwaysShow: true,
        }
      },
      {
        path: 'role',
        name: 'role',
        component: () =>
          import ('pages/system/role/Page'),
        meta: {
          title: '角色管理',
          resource: "9bcfbe4d-098f-4110-a7f1-4a745f11adab"
        }
      },
      {
        path: 'roleConfig',
        name: 'roleConfig',
        component: () => import('pages/system/role/RoleConfig'),
        hidden: true,
        meta: {
          title: '权限配置',
          alwaysShow: true,
        }
      }
    ]
  },

  // {
  //   path: '*',
  //   redirect: '/404',
  //   hidden: true,
  //   meta: {
  //     title: '404',
  //   }
  // }
]


import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // 在线预约
    {
      path: '/',
      meta: {
        title: '在线预约',
        footer: 0
      },
      component: function (resolve) {
        require(['./../pages/reserve/reserve.vue'], resolve)
      },
      children: [
        {
          path: '/',
          meta: {
            title: '在线预约',
            footer: 0
          },
          component: function (resolve) {
            require(['./../pages/reserve/reserve-online.vue'], resolve)
          }
        },
        {
          path: '/record',
          meta: {
            title: '预约记录',
            footer: 0
          },
          component: function (resolve) {
            require(['./../pages/reserve/reserve-record.vue'], resolve)
          }
        }
      ]
    },
    {
      path: '/message',
      meta: {
        title: '预约信息',
        footer: 0
      },
      component: function (resolve) {
        require(['./../pages/reserve/reserve-message.vue'], resolve)
      }
    },
    {
      path: '/newclient',
      meta: {
        title: '新建就诊人',
        footer: 3
      },
      component: function (resolve) {
        require(['./../pages/client/client-new.vue'], resolve)
      }
    },
    {
      path: '/clientmanage',
      meta: {
        title: '就诊人管理',
        footer: 3
      },
      component: function (resolve) {
        require(['./../pages/client/client-manage.vue'], resolve)
      }
    },
    {
      path: '/doctorlist',
      meta: {
        title: '专家团队',
        footer: 1
      },
      component: function (resolve) {
        require(['./../pages/doctor/doctorlist.vue'], resolve)
      }
    },
    {
      path: '/doctor',
      meta: {
        title: '专家详情',
        footer: 1
      },
      component: function (resolve) {
        require(['./../pages/doctor/doctor.vue'], resolve)
      }
    },
    {
      path: '/user',
      meta: {
        title: '个人中心',
        footer: 3
      },
      component: function (resolve) {
        require(['./../pages/user/user.vue'], resolve)
      }
    },
    {
      path: '/edit',
      meta: {
        title: '修改资料',
        footer: 3
      },
      component: function (resolve) {
        require(['./../pages/user/user-edit.vue'], resolve)
      }
    },
    {
      path: '/userbind',
      meta: {
        title: '绑定手机号',
        footer: 3
      },
      component: function (resolve) {
        require(['./../pages/user/user-bind.vue'], resolve)
      }
    },
    {
      path: '/success',
      meta: {
        title: '预约成功',
        footer: 0
      },
      component: function (resolve) {
        require(['./../pages/reserve/reserve-success.vue'], resolve)
      }
    },
    {
      path: '/fail',
      meta: {
        title: '预约失败',
        footer: 0
      },
      component: function (resolve) {
        require(['./../pages/reserve/reserve-fail.vue'], resolve)
      }
    },
    {
      path: '/find',
      meta: {
        title: '发现',
        footer: 2
      },
      component: function (resolve) {
        require(['./../pages/find/find-index.vue'], resolve)
      }
    },
    {
      path: '/find/list',
      meta: {
        title: '发现',
        footer: 2
      },
      component: function (resolve) {
        require(['./../pages/find/find-list.vue'], resolve)
      }
    },
    {
      path: '/find/list/article',
      meta: {
        title: '文章详情',
        footer: 2
      },
      component: function (resolve) {
        require(['./../pages/find/find-article.vue'], resolve)
      }
    },
    {
      path: '/find/subject',
      meta: {
        title: '专题',
        footer: 2
      },
      component: function (resolve) {
        require(['./../pages/find/find-subject.vue'], resolve)
      }
    },
    {
      path: '/find/topic',
      meta: {
        title: '专题详情',
        footer: 2
      },
      component: function (resolve) {
        require(['./../pages/find/find-subjectDetail.vue'], resolve)
      }
    }
  ]
})

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  footerSelect: 0,
  footerShow: true,
  newClientId: '',
  editUser: {},
  reserveInfo: null,
  userDefault: {
    count: 1,
    truename: '',
    agentId: '' // 分享ID
  }
}

const mutations = {
  // 页脚高亮选择
  footerSelect (state, select) {
    state.footerSelect = select
  },

  // 某些页面需要隐藏页脚
  footerShow (state, flag) {
    state.footerShow = flag
  },

  // 编辑用户
  editUser (state, data) {
    state.editUser = data
  },

  // 新的就诊人，返回预约默认选中新建就诊人
  newUserId (state, id) {
    state.newClientId = id
  },

  // 预约信息，选择医生和时间后跳转
  reserveInfo (state, data) {
    state.reserveInfo = data
  },

  // 保存默认用户信息
  userDefault (state, data) {
    state.userDefault = data
  },

  // 添加就诊人后更新仓库，放置再次提示添加就诊人
  updateDefault (state) {
    state.userDefault.count = 1
  },

  // 解绑所有就诊人并且没有默认就诊人的时候继续提示添加就诊人
  deleteDefault (state) {
    state.userDefault.count = 0
  }
}

export default new Vuex.Store({
  state,
  mutations
})

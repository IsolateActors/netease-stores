import Vue from 'vue'
import Vuex from 'vuex'
import Axios from "axios";
import api from '../assets/config/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cartTotal: {
      checkedGoodsAmount: 0,
      checkedGoodsCount: 0,
      goodsAmount: 0,
      goodsCount: 0
    },
    cartList: []

  },
  mutations: {
    setCarList: function (state, cartList) {
      state.cartList = cartList
    },
    setCartTotal: function (state, cartTotal) {
      state.cartTotal = cartTotal
    }
  },
  actions: {
    async ajaxCartlist(content) {
      let cartRes = await Axios.get(api.CartList);
      content.commit("setCarList", cartRes.data.data.cartList)
      content.commit("setCartTotal", cartRes.data.data.cartTotal)
    }
  },
  modules: {}
})
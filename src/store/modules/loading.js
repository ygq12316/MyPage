const state = {
  isLoading: false,
  loadingMessage: '加载中，请稍候...'
};

const mutations = {
  SET_LOADING(state, { status, message = '加载中，请稍候...' }) {
    state.isLoading = status;
    state.loadingMessage = message;
  }
};

const actions = {
  showLoading({ commit }, message) {
    commit('SET_LOADING', { status: true, message });
  },
  hideLoading({ commit }) {
    commit('SET_LOADING', { status: false });
  }
};

export default {
  state,
  mutations,
  actions
};

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import md5 from 'md5'
import config from './../assets/config'

Vue.use(Vuex)

const state = {
  user : {},
  userArr : [],
  userdata : {},
  boxes : [],
  params : {
    data : '',
    key : ''
  },
  language : 'th',
};

const getters = {
  userdata : (state) => state.user,
  userdataArr : (state) => state.userArr,
  getBoxes : (state) => state.boxes,
  getParams : (state) => state.params,
  getLanguage : (state) => state.language,
};

const actions = {
  async fetchBoxes({ commit }) {
    const tm = new Date().getTime().toString().substr(0,10);
    const chksum = md5(`${tm}aofkitapigamemysterbox2020`);
    const param = `timestamp=${tm}&ckSum=${chksum}`;
    const response = await axios.get(`https://back.luckygame.in.th/apiaction/get_listboxrandom?${param}`);
    commit('setBoxes',response.data.data.data)
  },
  async fetchUser({ commit }) {
    const user  = await axios.get(``);
  },
  async setUserData({ commit },key,userdata) {
    const ipAddress = window.ipAddress;
    const ckSum = md5(`${ipAddress}${config.addorsubChksumKey}`);
    const url = `https://back.luckygame.in.th/apiaction/genkey_gamesterbox?key=${key}&ip=${ipAddress}&ckSum=${ckSum}`;
    const response = await axios.get(url);
    const data = response.data.data;

    if(data.code != 200) {
      const user = {};
      const userdata = {};
      // await commit('setUserData',user);
      // window.history.go('/')
      let errorMsg = 'Invalid Key';
      let buff = new Buffer(errorMsg);
      let base64data = buff.toString('base64');

      // this.$router.go(`/error?text=${base64data}`)

      // window.history.go(`/error?text=${base64data}`);
      window.location.href=`/#/error?text=${base64data}`
    } else {

      const mliveData = data.data.Result;
      const language = typeof mliveData.language != 'undefined' ? mliveData.language : 'th';

      const user = {
        useridx: mliveData.Useridx,
        img_url : mliveData.Headimg,
        key : key,
        username : mliveData.Nickname,
        coupon : mliveData.Crystal,
        language : language
      };

      const userdata = userdata;

      await commit('setUserData',user)
      commit('setLanguage',language)
    }
  },
  setParams({ commit },data) {
    commit('setKeyAndData',data);
  },
  updatePoint({ commit },point) {
    commit('updatePoint',point);
  },
  setLanguage({ commit },language) {
    commit('setLanguage',language);
  }
};

const mutations = {
  setBoxes : (state,boxes) => (state.boxes = boxes),
  setUserData : (state,user) => {
    state.user = user;
    state.userArr = [user];
  },
  setKeyAndData : (state,data) => {
    state.params.key = data.key;
    state.params.data = data.data;
  },
  updatePoint : (state,point) => (state.user.coupon = point),
  setLanguage : (state,language) => (state.language = language),
};


export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
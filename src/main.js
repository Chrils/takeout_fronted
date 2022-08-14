Vue.config.productionTip = false
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './plugins/element.js'

import 'assets/css/base.css'
import axios from "axios";
import TreeTable from 'vue-table-with-tree-grid';
import moment from "moment";
import VueQuillEditor from "vue-quill-editor";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//导入nprogress插件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//引入高德地图
import VueAMap from 'vue-amap'
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '25903c4d3e8965d1d7b177b9c27e3c8e',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PlaceSearch', 'AMap.Geolocation', 'AMap.Geocoder'],
  v: '1.4.4',
  uiVersion: '1.0'
})

window._AMapSecurityConfig = {
  securityJsCode:'9b822432a512d45540c1d0a14db78295',
}


axios.defaults.baseURL = 'http://localhost:9999/';
// 为每次请求添加请求头，防止跨域问题
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});

axios.interceptors.response.use(config => {
  NProgress.done()
  return config;
});

Vue.use(VueQuillEditor)
Vue.component('tree-table',TreeTable)
Vue.prototype.$http = axios;
Vue.prototype.$moment = moment;
Vue.$refresh = () => {
  window.location.reload()
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


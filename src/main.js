Vue.config.productionTip = false
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from "moment";
import './plugins/element.js'

import 'assets/css/base.css'
import axios from "axios";
import TreeTable from 'vue-table-with-tree-grid';
import VueQuillEditor from "vue-quill-editor";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//导入nprogress插件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//引入excel导出组件
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

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


axios.defaults.baseURL = 'http://localhost:9527/';
// 为每次请求添加请求头，防止跨域问题
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('Authorization');
  return config;
});

axios.interceptors.response.use(config => {
  NProgress.done()
  return config;
});
//定义一个全局过滤器实现日期格式化
Vue.filter('datefmt',function (input,fmtstring) {//当input为时间戳时，需转为Number类型
  // 使用momentjs这个日期格式化类库实现日期的格式化功能
  return moment(input).format(fmtstring);
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


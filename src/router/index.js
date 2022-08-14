import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {path: '/',redirect:'/welcome'},
  {path: '/login',component:()=>import('../views/admin/login.vue')},
  {
    path: '/home',
    component:()=>import('../views/admin/home.vue'),
    redirect: '/data/stat',
    children:[
      {path: '/welcome',component:()=>import('../views/admin/welcome.vue')},
      {path: '/user/list',component:()=>import('../views/admin/user/userList.vue')},
      {path: '/rights/list',component:()=>import('../views/admin/power/rights.vue')},
      {path: '/roles/list',component:()=>import('../views/admin/power/roles.vue')},
      {path: '/order/list',component:()=>import('../views/admin/order/order.vue')},
      {path: '/order/detail/:order_no',component:()=>import('../views/admin/order/detail.vue')},
      {path: '/data/stat',component:()=>import('../views/admin/data/stat.vue')},
      {path: '/client/index',component:()=>import('../views/user/index.vue')},
      {path: '/client/apply',component:()=>import('../views/user/apply.vue')},
      {path: '/shop/list',component:()=>import('../views/admin/shop/shopList.vue')},
      {path: '/shop/detail',component:()=>import('../views/admin/shop/shopDetail.vue')},
      {path: '/shop/shopType',component:()=>import('../views/admin/shop/shopTypeList.vue')},
      {path: '/shop/shopReview',component:()=>import('../views/admin/shop/shopReview.vue')},
      {path: '/complaint/list',component:()=>import('../views/admin/complaint/complaintList.vue')},
      {path: '/voucher/list',component:()=>import('../views/admin/voucher/list.vue')},
      {path: '/merchant/order/list',component:()=>import('../views/merchant/order/order')},
      {path: '/merchant/order/detail/:order_no',component:()=>import('../views/merchant/order/detail')},
      {path: '/merchant/goods/list',component:()=>import('../views/merchant/goods/list')},
      {path: '/merchant/goods/add',component:()=>import('../views/merchant/goods/addGoods')},
      {path: '/merchant/profile',component:()=>import('../views/merchant/profile/profile')},
      {path: '/merchant/profile/edit',component:()=>import('../views/merchant/profile/editProfile')},
      {path: '/merchant/discount',component:()=>import('../views/merchant/discount/discount')},
      {path: '/merchant/customers/follow',component:()=>import('../views/merchant/customers/follows')},
      {path: '/merchant/customers/chat',component:()=>import('../views/merchant/customers/chat')},
      {path: '/merchant/goods/detail',component:()=>import('../views/merchant/goods/goodsDetail')},
      {path: '/merchant/fund',component:()=>import('../views/merchant/fund/fund')},
      {path: '/merchant/fund/data',component:()=>import('../views/merchant/fund/data')},
    ]
  }
]

const router = new Router({
  routes: routes,
  mode: 'history'
})

/**
 * 挂载路由守卫
 * @param to 跳转路由
 * @param from 上一个路由
 * @param next 执行跳转
 *          next() 不做任何操作
 *          next('/login') 强制跳转到登录页面
 */
// router.beforeEach(((to, from, next) => {
//   if (to.path === '/login') {
//     return next()
//   }
//   if (sessionStorage.getItem('token')) {
//     return next()
//   }
//   next('/login')
// }))

export default router
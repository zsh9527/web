import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/**
 * name       侧边菜单显示名字
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const routerMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  // 定义首页 路径为空 重定向到/dashboard
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard', //重定向
    name: "主页",
    meta: { title: '主页' },
    hidden: true,
    children: [{
      path: 'dashboard',
      meta:{ title: '主页' },
      component: () => import('@/views/dashboard/index')
    }]
  },
  /**
   * path 路径
   * redirect 重定向
   * name 路由的key  不可重复
   * meta 左边菜单栏 循环遍历判断的 显示 name名字 icon图标
   * children 是子菜单  如果只有1个子菜单 那就是显示单个
   * component 是组件路径
   */
  {
    path: '/spider-manage',
    name:'爬虫',
    meta: { title: '爬虫', icon: 'el-icon-tickets' },
    component: Layout,
    redirect: '/spider-manage/task/index',
    children: [
      {
        path: '/spider-manage/task/index',
        name: '搜索任务',
        component: () => import('@/views/modules/spider-manage/task'),
        meta: { title: '搜索任务', icon: 'el-icon-tickets' },
        children: [
          {
            path: '/spider-manage/result/engine',
            name: '搜索引擎结果',
            component: () => import('@/views/modules/spider-manage/result/engine'),
            meta: { title: '搜索引擎结果' },
            hidden: true
          },
          {
            path: '/spider-manage/result/spider',
            name: '爬虫结果',
            component: () => import('@/views/modules/spider-manage/result/spider'),
            meta: { title: '爬虫结果' },
            hidden: true
          },
        ]
      }
    ]
  },
  {
    path: '/imt-manage',
    name:'i茅台',
    meta: { title: 'i茅台', icon: 'el-icon-tickets' },
    component: Layout,
    redirect: '/imt-manage/user/index',
    children: [
      {
        path: '/imt-manage/user/index',
        name: '用户管理',
        component: () => import('@/views/modules/imt-manage/user'),
        meta: { title: '用户管理', icon: 'el-icon-tickets' },
        children: [
          {
            path: '/imt-manage/user/item_shops',
            name: '产品可预约门店列表',
            component: () => import('@/views/modules/imt-manage/user/item_shops'),
            meta: { title: '产品可预约门店列表' },
            hidden: true
          },
        ]
      },
      {
        path: '/imt-manage/item/index',
        name: '商品管理',
        component: () => import('@/views/modules/imt-manage/item'),
        meta: { title: '商品管理', icon: 'el-icon-tickets' },
      },
      {
        path: '/imt-manage/shop/index',
        name: '门店管理',
        component: () => import('@/views/modules/imt-manage/shop'),
        meta: { title: '门店管理', icon: 'el-icon-tickets' },
      },
      {
        path: '/imt-manage/order/index',
        name: '申购管理',
        component: () => import('@/views/modules/imt-manage/order'),
        meta: { title: '申购管理', icon: 'el-icon-tickets' },
      },
      {
        path: '/imt-manage/log/index',
        name: '操作日志管理',
        component: () => import('@/views/modules/imt-manage/log'),
        meta: { title: '操作日志管理', icon: 'el-icon-tickets' },
      }
    ]
  },
  // 未匹配到路由 进404
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: routerMap
})

/**
 * 基础路由
 * @type { *[] }
 */

const constantRouterMap = [
  {
    path: '/',
    name: 'Login',
    redirect: { name: 'login' },
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/im/login.vue')
      },
    ]
  },
  {
    path: '/home',
    name: 'Home',
    redirect: { name: 'home' },
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/im/home.vue')
      },
    ]
  },
  {
    path: '/example',
    name: 'Example',
    redirect: { name: 'ExampleHelloIndex' },
    children: [
      {
        path: '/example',
        name: 'ExampleHelloIndex',
        component: () => import('@/views/example/hello/Index.vue')
      },
    ]
  },
]

export default constantRouterMap
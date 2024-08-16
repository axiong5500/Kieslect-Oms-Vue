export const basicRoutes = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录页',
      layout: 'empty',
    },
  },

  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
    },
  },

  {
    name: '404',
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      title: '页面飞走了',
      layout: 'empty',
    },
  },

  {
    name: '403',
    path: '/403',
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      title: '没有权限',
      layout: 'empty',
    },
  },

  {
    name: 'qrcode',
    path: '/public/produce/app/qrcode/:appMark?',
    component: () => import('@/views/produce/app/qrcode.vue'),
    meta: {
      title: ' ',
      layout: 'empty',
    },
  },

  {
    name: 'privacy',
    path: '/public/privacy/:articleId?/:languageType?',
    component: () => import('@/views/content/privacy/index.vue'),
    meta: {
      title: ' ',
      layout: 'empty',
    },
  },

  {
    name: 'helper',
    path: '/public/produce/app/helper/:langId?',
    component: () => import('@/views/produce/app/helper.vue'),
    meta: {
      title: ' ',
      layout: 'empty',
    },
  },

  {
    name: 'videoGuide',
    path: '/public/video/guide',
    component: () => import('@/views/content/video/guide.vue'),
    meta: {
      title: ' ',
      layout: 'empty',
    },
  },

]

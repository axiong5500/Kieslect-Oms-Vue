

export const defaultLayout = 'normal'

export const naiveThemeOverrides = {
  common: {
    // primaryColor: '#18a058',
    // primaryColorHover: '#67c23a',
    // primaryColorPressed: '#2B4C59FF',
    // primaryColorSuppl: '#316C72E3',
    //
    // infoColor: '#2080F0FF',
    // infoColorHover: '#4098FCFF',
    // infoColorPressed: '#1060C9FF',
    // infoColorSuppl: '#4098FCFF',
    //
    // successColor: '#18A058FF',
    // successColorHover: '#36AD6AFF',
    // successColorPressed: '#0C7A43FF',
    // successColorSuppl: '#36AD6AFF',
    //
    // warningColor: '#F0A020FF',
    // warningColorHover: '#FCB040FF',
    // warningColorPressed: '#C97C10FF',
    // warningColorSuppl: '#FCB040FF',
    //
    // errorColor: '#D03050FF',
    // errorColorHover: '#DE576DFF',
    // errorColorPressed: '#AB1F3FFF',
    // errorColorSuppl: '#DE576DFF',
  },
}

export const basePermissions = [
  {
    code: 'ExternalLink',
    name: '外链管理',
    type: 'MENU',
    icon: 'i-fe:external-link',
    order: 98,
    enable: true,
    show: true,
    children: [
      {
        code: 'ShowDocs',
        name: '项目文档',
        type: 'MENU',
        path: 'https://docs.isme.top/web/#/624306705/188522224',
        icon: 'i-me:docs',
        order: 1,
        enable: true,
        show: false,
      },
      {
        code: 'ApiFoxDocs',
        name: '接口文档',
        type: 'MENU',
        path: 'https://apifox.com/apidoc/shared-419c28ef-16ab-4d45-9619-62642b2c107e',
        icon: 'i-me:apifox',
        iconMode: 'bg',
        order: 2,
        enable: true,
        show: true,
      },
      {
        code: 'NaiveUI',
        name: 'Naive UI',
        type: 'MENU',
        path: 'https://www.naiveui.com/zh-CN/os-theme',
        icon: 'i-me:naiveui',
        iconMode: 'bg',
        order: 3,
        enable: true,
        show: false,
      },
      {
        code: 'MyBlog',
        name: '博客-掘金',
        type: 'MENU',
        path: 'https://juejin.cn/user/1961184475483255/posts',
        icon: 'i-simple-icons:juejin',
        order: 4,
        enable: true,
        show: false,
      },
      {
        code: 'LangHu',
        name: '蓝湖UI',
        type: 'MENU',
        path: 'https://lanhuapp.com/dashboard/#/item?tid=a03b4e9b-1e19-479d-8dd3-7a8879cf371d',
        icon: 'i-simple-icons:juejin',
        order: 5,
        enable: true,
        show: true,
      },
      {
        code: 'IDO',
        name: '爱都Gitee',
        type: 'MENU',
        path: 'https://gitee.com/idoosmart',
        icon: 'i-me:gitee',
        order: 6,
        enable: true,
        show: true,
      },
      {
        code: 'YCYIOS',
        name: '优创亿IOS文档',
        type: 'MENU',
        path: 'https://showdoc.ute-tech.com.cn:48303/web/#/user/login',
        icon: 'i-simple-icons:juejin',
        order: 6,
        enable: true,
        show: true,
      }
    ],
  },
]

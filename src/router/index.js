import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'
import GINFO from '@/components/goodsinfo.vue'
import GTYPE from '@/components/goodstype.vue'
import STORE from '@/components/store.vue'
import PRO from '@/components/provider.vue'
import SINFO from '@/components/sellinfo.vue'
import SSTAT from '@/components/sellstat.vue'
import EINFO from '@/components/empinfo.vue'
import EAUTH from '@/components/empauthorize.vue'
import DISC from '@/components/discount.vue'
import BILLS from '@/components/bills.vue'
import SOUT from '@/components/sellout.vue'


Vue.use(Router)

export default new Router({
  routes: [{
      name: 'login',
      path: '/',
      component: Login
    },
    // {
    //   path: '/login',
    //   component: Login
    // },
    {
      name: 'home',
      path: '/home',
      redirect: '/ginfo',
      component: Home,
      children: [{
          name: 'ginfo',
          path: '/ginfo',
          component: GINFO
        }, {
          name: 'gtype',
          path: '/gtype',
          component: GTYPE
        }, {
          name: 'store',
          path: '/store',
          component: STORE
        }, {
          name: 'provide',
          path: '/provide',
          component: PRO
        }, {
          name: 'sinfo',
          path: '/sinfo',
          component: SINFO
        }, {
          name: 'sout',
          path: '/sout',
          component: SOUT
        },
        {
          name: 'sstat',
          path: '/sstat',
          component: SSTAT
        }, {
          name: 'einfo',
          path: '/einfo',
          component: EINFO
        }, {
          name: 'eauth',
          path: '/eauth',
          component: EAUTH
        }, {
          name: 'disc',
          path: '/disc',
          component: DISC
        }, {
          name: 'bills',
          path: '/bills',
          component: BILLS
        }
      ]
    }
  ]
})

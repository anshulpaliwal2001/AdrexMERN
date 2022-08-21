import { lazy } from 'react'

// ** Document title
const TemplateTitle = '%s - Adrex'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/Home'))

  },
  {
    path: '/client',
    component: lazy(() => import('../../views/tools/client/list'))

  },
  {
    path: '/login',
    component: lazy(() => import('../../views/auth/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/register',
    component: lazy(() => import('../../views/auth/Register')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/faq',
    component: lazy(() => import('../../views/misc/faq'))

  },
  {
    path: '/second-page',
    component: lazy(() => import('../../views/SecondPage'))
  },

  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
]

export { DefaultRoute, TemplateTitle, Routes }

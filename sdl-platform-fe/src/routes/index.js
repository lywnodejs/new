import routes from './routes'
import notFound from '@/errors/404'
import notAuth from '@/errors/403'
import whitepaper from '@/errors/whitepaper'

export default [

  {
    path: '/sdl/dolphin',
    redirect: '/sdl/dolphin/vulnerability'
  },
  {
    path: '/sdl/otter',
    redirect: '/sdl/otter/project'
  },
  {
    path: '/sdl/octopus',
    redirect: '/sdl/octopus/statistic'
  },
  {
    path: '/sdl/cachalot',
    redirect: '/sdl/cachalot/vulnerability'
  },
  {
    path: '/sdl/admin',
    redirect: '/sdl/admin/securityBp'
  },
  {
    path: '/sdl/ocean',
    redirect: '/sdl/ocean/global'
  },
  {
    path: '/sdl/ratel',
    redirect: '/sdl/ratel/selfService'
  },
  ...routes,
  {
    name: 'whitepaper',
    path: '/sdl/doc/whitepaper',
    component: whitepaper
  },
  {
    name: 'page-404',
    path: '*',
    component: notFound
  },
  {
    name: 'page-403',
    path: '*',
    component: notAuth
  }
]

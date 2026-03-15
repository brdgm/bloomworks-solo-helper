import { RouteRecordRaw } from 'vue-router'
import createRouterMatomoTracking from '@brdgm/brdgm-commons/src/util/router/createRouterMatomoTracking'
import { name, version, appDeployName } from '@/../package.json'
import AppHome from '@/views/AppHome.vue'
import NotFound from '@/views/NotFound.vue'
import SetupGame from '@/views/SetupGame.vue'
import SetupBot from '@/views/SetupBot.vue'
import RoundTurnPlayer from '@/views/RoundTurnPlayer.vue'
import RoundTurnBot from '@/views/RoundTurnBot.vue'
import RoundStart from '@/views/RoundStart.vue'
import EndOfGameAmounts from '@/views/EndOfGameAmounts.vue'
import EndOfGame from '@/views/EndOfGame.vue'

const LOCALSTORAGE_KEY = `${name}.route`

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'AppHome',
    component: AppHome
  },
  {
    path: '/setupGame',
    name: 'SetupGame',
    component: SetupGame
  },
  {
    path: '/setupBot',
    name: 'SetupBot',
    component: SetupBot
  },
  {
    path: '/round/:round/start',
    name: 'RoundStart',
    component: RoundStart
  },
  {
    path: '/round/:round/turn/:turn/player',
    name: 'RoundTurnPlayer',
    component: RoundTurnPlayer
  },
  {
    path: '/round/:round/turn/:turn/bot',
    name: 'RoundTurnBot',
    component: RoundTurnBot
  },
  {
    path: '/round/:round/gameEnd/amounts',
    name: 'EndOfGameAmounts',
    component: EndOfGameAmounts
  },
  {
    path: '/round/:round/gameEnd',
    name: 'EndOfGame',
    component: EndOfGame
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

export default createRouterMatomoTracking(routes, LOCALSTORAGE_KEY, appDeployName, version, 'AppHome')
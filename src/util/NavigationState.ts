import { State } from '@/store/state'
import { RouteLocation } from 'vue-router'
import getIntRouteParam from '@brdgm/brdgm-commons/src/util/router/getIntRouteParam'
import BotMode from '@/services/enum/BotMode'

export default class NavigationState {

  readonly round : number
  readonly turn : number
  readonly botMode : BotMode

  constructor(route: RouteLocation, state: State) {    
    this.round = getIntRouteParam(route, 'round')
    this.turn = getIntRouteParam(route, 'turn')
    this.botMode = state.setup.botMode
  }

}

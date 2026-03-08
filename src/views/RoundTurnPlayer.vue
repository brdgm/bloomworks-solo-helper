<template>
  <SideBar :navigationState="navigationState"/>
  <h1>{{t('player.player')}}</h1>

  <p class="mt-4">Select your action:</p>

  <div class="actions">
    <button class="btn btn-primary btn-lg" v-if="!showDeliveryActions" @click="showDeliveryActions = true">
      Make Delivery
    </button>
    <div class="deliveryActions" v-if="showDeliveryActions">
      <button class="btn btn-primary btn-lg" v-for="floor of floors" :key="floor" @click="deliverToFloor(floor)">
        Delivered to Floor {{floor}}
      </button>
    </div>
    <button class="btn btn-primary btn-lg" @click="next">
      Buy Flower
    </button>
    <button class="btn btn-primary btn-lg" @click="next">
      Other Action
    </button>
    <div>
      <button class="btn btn-outline-danger btn-lg passButton" data-bs-toggle="modal" data-bs-target="#passModal">
        {{t('action.pass')}}<SoloBoardPassActionInfo :soloBoardPassAction="soloBoardPassAction"/>
      </button>
      <div class="small mt-1 fst-italic passNextTurnInfo">
        <span>{{t('roundTurnPlayer.passInfo.nextTurn')}}</span><SoloBoardPassActionInfo :soloBoardPassAction="soloBoardPassActionNextTurn" :small="true"/>
      </div>
    </div>
  </div>

  <ModalDialog id="passModal" :title="t('action.pass')">
    <template #body>
      <p v-html="t('roundTurnPlayer.passConfirm')"></p>
    </template>
    <template #footer>
      <button class="btn btn-danger" @click="pass" data-bs-dismiss="modal">{{t('action.pass')}}</button>
      <button class="btn btn-secondary" data-bs-dismiss="modal">{{t('action.cancel')}}</button>
    </template>
  </ModalDialog>

  <DebugInfo :navigationState="navigationState"/>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import NavigationState from '@/util/NavigationState'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { useStateStore } from '@/store/state'
import ModalDialog from '@brdgm/brdgm-commons/src/components/structure/ModalDialog.vue'
import SideBar from '@/components/round/SideBar.vue'
import DebugInfo from '@/components/round/DebugInfo.vue'
import getSoloBoardPassAction, { SoloBoardPassAction } from '@/util/getSoloBoardPassAction'
import SoloBoardPassActionInfo from '@/components/round/SoloBoardPassActionInfo.vue'
import Player from '@/services/enum/Player'

export default defineComponent({
  name: 'RoundTurnPlayer',
  components: {
    FooterButtons,
    ModalDialog,
    SideBar,
    SoloBoardPassActionInfo,
    DebugInfo
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const state = useStateStore()

    const navigationState = new NavigationState(route, state)
    const { round, turn } = navigationState
    
    const playerDeliveryFloor = ref(navigationState.playerDeliveryFloor)
    const showDeliveryActions = ref(false)

    return { t, router, navigationState, state, round, turn, playerDeliveryFloor, showDeliveryActions }
  },
  computed: {
    backButtonRouteTo() : string {
      if (this.turn > 1) {
        return `/round/${this.round}/turn/${this.turn - 1}/player`
      }
      return ''
    },
    floors() : number[] {
      return [5,4,3,2,1]
    },
    soloBoardPassAction() : SoloBoardPassAction {
      const { soloBoard, playerTurns, playerDeliveryFloor } = this.navigationState
      return getSoloBoardPassAction(soloBoard, playerTurns, playerDeliveryFloor)
    },
    soloBoardPassActionNextTurn() : SoloBoardPassAction {
      const { soloBoard, playerTurns, playerDeliveryFloor } = this.navigationState
      return getSoloBoardPassAction(soloBoard, playerTurns + 1, playerDeliveryFloor)
    }
  },
  methods: {
    deliverToFloor(floor: number) : void {
      this.playerDeliveryFloor = floor
      this.next()
    },
    next() : void {
      this.nextWithPassed(false)
    },
    pass() : void {
      this.nextWithPassed(true)
    },
    nextWithPassed(passed : boolean) {
      this.state.storeRoundTurn({
        round: this.round,
        turn: this.turn,
        player: Player.PLAYER,
        marketPrices: this.navigationState.marketPrices.toPersistence(),
        playerDeliveryFloor: this.playerDeliveryFloor
      })
      if (passed) {
        this.router.push(`/round/${this.round}/turn/${this.turn + 1}/bot`)
      }
      else {
        this.router.push(`/round/${this.round}/turn/${this.turn + 1}/player`)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 18rem;
}
.deliveryActions {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.passButton {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.passNextTurnInfo {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
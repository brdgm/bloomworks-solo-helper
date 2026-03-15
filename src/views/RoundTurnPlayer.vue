<template>
  <SideBar :navigationState="navigationState"/>
  <h1>{{t('player.player')}}: {{navigationState.playerTurn}}</h1>

  <BotClaimMilestones :milestones="navigationState.botClaimMilestones" v-if="navigationState.botClaimMilestones.length"/>

  <template v-if="!showDeliveryActions">
    <p class="mt-4" v-html="t('roundTurnPlayer.selectAction')"/>

    <div class="actions">
      <button class="btn btn-primary btn-lg" @click="showDeliveryActions = true">
        {{t('roundTurnPlayer.makeDelivery')}}
      </button>
      <button class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#buyFlowerModal">
        {{t('roundTurnPlayer.buyFlower.title')}}
      </button>
      <button class="btn btn-primary btn-lg" @click="next">
        {{t('roundTurnPlayer.otherAction')}}
      </button>
      <div>
        <button class="btn btn-outline-danger btn-lg passButton" data-bs-toggle="modal" data-bs-target="#passModal">
          {{t('action.pass')}}<SoloBoardPassActionInfo :soloBoardPassAction="soloBoardPassAction"/>
        </button>
        <div class="small mt-1 fst-italic passNextTurnInfo">
          <a href="#" data-bs-toggle="modal" data-bs-target="#soloBoardOverviewModal">{{t('roundTurnPlayer.passInfo.nextTurn')}}</a><SoloBoardPassActionInfo :soloBoardPassAction="soloBoardPassActionNextTurn" :small="true"/>
        </div>
      </div>
    </div>
  </template>

  <PlayerMakeDelivery v-if="showDeliveryActions"
      :windowStates="navigationState.botPersistence.windowStates"
      :marketPrices="navigationState.marketPrices"
      @deliver="deliverToFloor"
      @cancel="showDeliveryActions = false"/>

  <PlayerBuyFlowerModal :marketPrices="navigationState.marketPrices" @next="next"/>
  <PlayerPassSellFlowerModal :marketPrices="navigationState.marketPrices" :soloBoardPassAction="soloBoardPassAction" @pass="pass"/>

  <SoloBoardOverviewModal :soloBoard="navigationState.soloBoard" :playerTurns="navigationState.playerTurns" :playerDeliveryFloor="navigationState.playerDeliveryFloor"/>

  <DebugInfo :navigationState="navigationState"/>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import NavigationState from '@/util/NavigationState'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { RoundTurn, useStateStore } from '@/store/state'
import SideBar from '@/components/round/SideBar.vue'
import DebugInfo from '@/components/round/DebugInfo.vue'
import PlayerPassSellFlowerModal from '@/components/round/PlayerPassSellFlowerModal.vue'
import PlayerBuyFlowerModal from '@/components/round/PlayerBuyFlowerModal.vue'
import getSoloBoardPassAction, { SoloBoardPassAction } from '@/util/getSoloBoardPassAction'
import SoloBoardPassActionInfo from '@/components/round/SoloBoardPassActionInfo.vue'
import Player from '@/services/enum/Player'
import BotClaimMilestones from '@/components/round/BotClaimMilestones.vue'
import PlayerMakeDelivery from '@/components/round/PlayerMakeDelivery.vue'
import SoloBoardOverviewModal from '@/components/round/SoloBoardOverviewModal.vue'

export default defineComponent({
  name: 'RoundTurnPlayer',
  components: {
    FooterButtons,
    SideBar,
    SoloBoardPassActionInfo,
    PlayerBuyFlowerModal,
    PlayerPassSellFlowerModal,
    BotClaimMilestones,
    PlayerMakeDelivery,
    SoloBoardOverviewModal,
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
      return `/round/${this.round}/start`
    },
    soloBoardPassAction() : SoloBoardPassAction {
      return this.navigationState.soloBoardPassAction
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
      const turnData : RoundTurn = {
        round: this.round,
        turn: this.turn,
        player: Player.PLAYER,
        marketPrices: this.navigationState.marketPrices.toPersistence(),
        playerDeliveryFloor: this.playerDeliveryFloor,
        botPersistence: this.navigationState.botPersistence.toPersistence()
      }
      if (passed) {
        turnData.playerPass = true
      }
      this.state.storeRoundTurn(turnData)
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
  a {
    text-decoration: underline dotted;
    color: #000;
  }
}
</style>
<template>
  <SideBar :navigationState="navigationState"/>
  <h1>
    {{t('player.bot')}}: 
    <template v-if="navigationState.botTurn==0">{{t('roundTurnBot.bonusActions')}}</template>
    <template v-else>{{navigationState.botTurn}} / {{navigationState.botTurns}}</template>
  </h1>

  <BotClaimMilestones :milestones="navigationState.botClaimMilestones" v-if="navigationState.botClaimMilestones.length"/>

  <div class="actions">
    <BotAction v-for="(action, index) in botActions.actions" :key="index" :action="action"
        :navigationState="navigationState" :currentCard="currentCard"/>
  </div>

  <button class="btn btn-primary btn-lg mt-4" @click="next">
    {{t('action.next')}}
  </button>

  <DebugInfo :navigationState="navigationState"/>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import NavigationState from '@/util/NavigationState'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { RoundTurn, useStateStore } from '@/store/state'
import SideBar from '@/components/round/SideBar.vue'
import DebugInfo from '@/components/round/DebugInfo.vue'
import Card from '@/services/Card'
import Player from '@/services/enum/Player'
import BotClaimMilestones from '@/components/round/BotClaimMilestones.vue'
import BotAction from '@/components/round/BotAction.vue'
import BotActions from '@/services/BotActions'
import recordBotRoundTurnStats from '@/util/recordBotRoundTurnStats'

export default defineComponent({
  name: 'RoundTurnBot',
  components: {
    FooterButtons,
    SideBar,
    BotClaimMilestones,
    BotAction,
    DebugInfo
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const state = useStateStore()

    const navigationState = new NavigationState(route, state)
    const { round, turn } = navigationState
    const botActions = new BotActions(navigationState)

    return { t, router, navigationState, state, round, turn, botActions }
  },
  computed: {
    backButtonRouteTo() : string {
      if (this.navigationState.botTurn == 0 
          || (this.navigationState.botTurn == 1 && this.navigationState.soloBoardPassAction.action.length == 0)) {
        return `/round/${this.round}/turn/${this.turn - 1}/player`
      }
      return `/round/${this.round}/turn/${this.turn - 1}/bot`
    },
    currentCard() : Card|undefined {
      if (this.navigationState.botTurn == 0) {
        return undefined
      }
      return this.navigationState.botPersistence.cardDeck.currentCard
    }
  },
  methods: {
    next() : void {
      if (this.navigationState.botTurn > 0) {
        this.navigationState.botPersistence.cardDeck.checkCurrentCardRemove()
      }
      const turn : RoundTurn = {
        round: this.round,
        turn: this.turn,
        player: Player.BOT,
        marketPrices: this.navigationState.marketPrices.toPersistence(),
        botPersistence: this.navigationState.botPersistence.toPersistence()
      }
      recordBotRoundTurnStats(turn, this.navigationState.botTurn, this.botActions.actions)
      this.state.storeRoundTurn(turn)
      if (this.navigationState.botTurn == this.navigationState.botTurns) {
        if (this.round == 12) {
          this.router.push(`/round/${this.round}/gameEnd/amounts`)
        }
        else {
          this.router.push(`/round/${this.round}/end`)
        }
      }
      else {
        this.router.push(`/round/${this.round}/turn/${this.turn + 1}/bot`)
      }
    }
  }
})
</script>

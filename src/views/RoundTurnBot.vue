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
        :navigationState="navigationState" :currentCard="currentCard"
        @ready="actionReady(index)"/>
  </div>

  <div class="row mt-3" v-if="!allActionsReady">
    <div class="col alert alert-warning" v-html="t('roundTurnBot.actionsNotReady')"/>
  </div>

  <button class="btn btn-primary btn-lg mt-4" @click="next" :disabled="!allActionsReady">
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
import { useStateStore } from '@/store/state'
import SideBar from '@/components/round/SideBar.vue'
import DebugInfo from '@/components/round/DebugInfo.vue'
import Card from '@/services/Card'
import Player from '@/services/enum/Player'
import BotClaimMilestones from '@/components/round/BotClaimMilestones.vue'
import BotAction from '@/components/round/BotAction.vue'
import BotActions from '@/services/BotActions'

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
  data() {
    return {
      actionsReadyState: [] as boolean[]
    }
  },
  computed: {
    allActionsReady() : boolean {
      return this.botActions.actions.length > 0
          && this.actionsReadyState.filter(r => r).length >= this.botActions.actions.length
    },
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
    actionReady(index: number) : void {
      this.actionsReadyState[index] = true
    },
    next() : void {
      if (this.navigationState.botTurn > 0) {
        this.navigationState.botPersistence.cardDeck.checkCurrentCardRemove()
      }
      this.state.storeRoundTurn({
        round: this.round,
        turn: this.turn,
        player: Player.BOT,
        marketPrices: this.navigationState.marketPrices.toPersistence(),
        botPersistence: this.navigationState.botPersistence.toPersistence()
      })
      this.router.push(`/round/${this.round}/turn/${this.turn + 1}/bot`)
    }
  }
})
</script>

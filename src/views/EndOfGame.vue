<template>
  <SideBar :navigationState="navigationState" :readOnly="true"/>
  <h1 class="mb-3">{{t('endOfGame.title')}}</h1>

  <FinalScoring :amount="amount"/>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="endGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { FinalScoringAmount, useStateStore } from '@/store/state'
import FinalScoring from '@/components/scoring/FinalScoring.vue'
import SideBar from '@/components/round/SideBar.vue'
import { useRoute } from 'vue-router'
import NavigationState from '@/util/NavigationState'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import Flower from '@/services/enum/Flower'

export default defineComponent({
  name: 'EndOfGame',
  components: {
    FooterButtons,
    FinalScoring,
    SideBar
  },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const state = useStateStore()
    
    const navigationState = new NavigationState(route, state)
    const { round } = navigationState

    const amount = state.finalScoringAmount ?? 
      {
        scoreTrackVP: [],
        milestonesVP: [],
        floricultureSteps: Object.fromEntries(
          getAllEnumValues(Flower).map(f => [f, [] as number[]])
        ) as Record<Flower, number[]>,
        playerGardenExtensionsSmall: undefined,
        playerGardenExtensionsLarge: undefined,
        playerBillboardVP: [],
        billboardsWon: [],
        playerSprays: undefined,
        playerLeftoverMoney: undefined
      } as FinalScoringAmount

    return { t, state, navigationState, round, amount }
  },
  computed: {
    backButtonRouteTo() : string {
      return `/round/${this.round}/gameEnd/amounts`
    }
  }
})
</script>

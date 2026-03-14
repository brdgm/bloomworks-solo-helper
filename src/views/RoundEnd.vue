<template>
  <SideBar :navigationState="navigationState" :readOnly="true"/>
  <h1>{{t('roundEnd.title')}}</h1>

  <p class="mt-4 mb-5" v-html="t('roundEnd.nextSeason', {season:t(`season.${nextSeason}`)})"></p>

  <button class="btn btn-primary btn-lg" @click="next()">
    {{t('action.next')}}
  </button>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { useStateStore } from '@/store/state'
import Season from '@/services/enum/Season'
import NavigationState from '@/util/NavigationState'
import { useRoute } from 'vue-router'
import getNextSeason from '@/util/getNextSeason'
import SideBar from '@/components/round/SideBar.vue'

export default defineComponent({
  name: 'RoundEnd',
  components: {
    FooterButtons,
    SideBar
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    const route = useRoute()

    const navigationState = new NavigationState(route, state)
    const { round, year, season } = navigationState

    const nextSeason = getNextSeason(season)
    const nextRound = round + 1
    const nextYear = nextSeason == Season.AUTUMN ? year + 1 : year

    return { t, state, navigationState, round, year, nextSeason, nextRound, nextYear }
  },
  computed: {
    backButtonRouteTo() : string {
      return `/round/${this.round}/turn/${this.navigationState.totalTurns}/bot`
    }
  },
  methods: {
    next() : void {
      this.state.storeRound({round:this.nextRound, year:this.nextYear, season:this.nextSeason, turns:[]})
      this.$router.push(`/round/${this.nextRound}/turn/1/player`)
    }
  }
})
</script>

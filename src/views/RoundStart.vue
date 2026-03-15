<template>
  <SideBar :navigationState="navigationState" :readOnly="true"/>
  <h1>{{t(`season.${season}`)}} {{t('sideBar.year', {year})}}</h1>

  <p class="mt-4 mb-5" v-html="t('roundStart.harvest')"></p>

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
import NavigationState from '@/util/NavigationState'
import { RouteLocation, useRoute } from 'vue-router'
import SideBar from '@/components/round/SideBar.vue'

export default defineComponent({
  name: 'RoundStart',
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

    return { t, state, navigationState, round, year, season }
  },
  computed: {
    backButtonRouteTo() : string {
      if (this.round > 1) {
        const navigationStateLastRound = new NavigationState({params: { round: `${this.round - 1}`, turn: '0' },
          query: {}, matched: [], meta: {}, fullPath: '', hash: '', path: '', redirectedFrom: undefined, name: undefined}, this.state)
        return `/round/${this.round - 1}/turn/${navigationStateLastRound.totalTurns}/bot`
      }
      return ''
    }
  },
  methods: {
    next() : void {
      this.$router.push(`/round/${this.round}/turn/1/player`)
    }
  }
})
</script>

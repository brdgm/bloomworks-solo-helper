<template>
  <h1>{{t('endOfGameAmounts.title')}}</h1>

  <FinalAmounts @next="next"/>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import FinalAmounts from '@/components/scoring/FinalAmounts.vue'
import { useStateStore } from '@/store/state'
import { useRoute } from 'vue-router'
import NavigationState from '@/util/NavigationState'

export default defineComponent({
  name: 'EndOfGameAmounts',
  components: {
    FooterButtons,
    FinalAmounts
  },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const state = useStateStore()
    
    const navigationState = new NavigationState(route, state)
    const { round } = navigationState
    
    return { t, state, navigationState, round }
  },
  computed: {
    backButtonRouteTo() : string {
      return `/round/${this.round}/turn/${this.navigationState.totalTurns}/bot`
    }
  },
  methods: {
    next() : void {
      this.$router.push(`/round/${this.round}/gameEnd`)
    }
  }
})
</script>

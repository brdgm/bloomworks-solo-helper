<template>
  <h1>{{t('setup.title')}}</h1>

  <PlayerColorSetup/>
  <MilestoneSeasonOrder/>
  <BotModeSelection/>

  <button class="btn btn-primary btn-lg mt-4" @click="setupBot()">
    {{t('setupBot.title')}}
  </button>

  <FooterButtons endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import BotModeSelection from '@/components/setup/BotModeSelection.vue'
import MilestoneSeasonOrder from '@/components/setup/MilestoneSeasonOrder.vue'
import PlayerColorSetup from '@/components/setup/PlayerColorSetup.vue'
import { useStateStore } from '@/store/state'
import MarketPrices from '@/services/MarketPrices'

export default defineComponent({
  name: 'SetupGame',
  components: {
    BotModeSelection,
    MilestoneSeasonOrder,
    PlayerColorSetup,
    FooterButtons
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    return { t, state }
  },
  methods: {
    setupBot() : void {
      this.state.setup.initialMarketPrices = MarketPrices.new().toPersistence()
      this.$router.push('/setupBot')
    }
  }
})
</script>

<template>
  <h1>{{t('setupBot.title')}}</h1>

  <div class="mt-3 instructions">
    <p v-html="t('setupBot.instructions.intro')"></p>
    <ol>
      <li v-html="t('setupBot.instructions.youAreFirstPlayer', {startingMoney})"></li>
      <li v-html="t('setupBot.instructions.chooseSetupCard')"></li>
      <li v-html="t('setupBot.instructions.ladyPeiNoStartingResources')"></li>
      <li v-html="t('setupBot.instructions.ladyPeiStartingGarden')"></li>
    </ol>
    <p v-html="t('setupBot.instructions.automaComponentsNotRequired')"/>
    <p>
      {{t('setupBot.instructions.flowerPriority')}}
      <FlowerIcon v-for="flower in flowerOrder" :key="flower" :flower="flower" class="flowerIcon"/>
    </p>  
  </div>

  <button class="btn btn-primary btn-lg mt-4" @click="startGame()">
    {{t('action.startGame')}}
  </button>

  <FooterButtons backButtonRouteTo="/setupGame" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { useStateStore } from '@/store/state'
import BotMode from '@/services/enum/BotMode'
import MarketPrices from '@/services/MarketPrices'
import Flower from '@/services/enum/Flower'
import FlowerIcon from '@/components/structure/FlowerIcon.vue'
import Season from '@/services/enum/Season'

export default defineComponent({
  name: 'SetupBot',
  components: {
    FooterButtons,
    FlowerIcon
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    return { t, state }
  },
  computed: {
    startingMoney() : number {
      if (this.state.setup.botMode == BotMode.ADVANCED) {
        return 6
      }
      return 8
    },
    flowerOrder() : Flower[] {
      const marketPrices = this.state.setup.initialMarketPrices ? MarketPrices.fromPersistence(this.state.setup.initialMarketPrices) : MarketPrices.new()
      return marketPrices.flowerOrder
    }
  },
  methods: {
    startGame() : void {
      this.state.storeRound({round:1, year:1, season:Season.AUTUMN, turns:[]})
      this.$router.push('/round/1/turn/1/player')
    }
  }
})
</script>

<style lang="scss" scoped>
.instructions {
  max-width: 1000px;
  ol > li {
    margin-top: 0.5rem;
  }
}
.flowerIcon {
  margin-left: 0.25rem;
}
</style>

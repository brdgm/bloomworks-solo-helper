<template>
  <h1>{{t('setupBot.title')}}</h1>

  <div class="mt-3 instructions">
    <p v-html="t('setupBot.instructions.intro')"></p>
    <ol>
      <li v-html="t('setupBot.instructions.botUnusedComponents')"></li>
      <li v-html="t('setupBot.instructions.firstPlayer')"></li>
      <li v-html="t('setupBot.instructions.startingMoney', {startingMoney})"></li>
      <li>
        <span v-html="t('setupBot.instructions.chooseSetupCard')"></span>
        <PlayerFlowerSelection v-model="playerFlowers"/>
      </li>
      <li v-html="t('setupBot.instructions.marketPricesManaged')"></li>
    </ol>
    <p v-html="t('setupBot.instructions.botComponentsNotRequired')"/>
  </div>

  <div class="row" v-if="!isPlayerFlowerSelectionValid">
    <div class="col">
       <p v-if="!isPlayerFlowerSelectionValid" class="alert alert-warning" v-html="t('setupBot.playerFlowerSelection.validationHint')"></p>
    </div>
  </div>

  <button class="btn btn-primary btn-lg" @click="startGame()" :disabled="!isPlayerFlowerSelectionValid">
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
import Season from '@/services/enum/Season'
import PlayerFlowerSelection from '@/components/setup/PlayerFlowerSelection.vue'
import BotGarden from '@/services/BotGarden'

export default defineComponent({
  name: 'SetupBot',
  components: {
    FooterButtons,
    PlayerFlowerSelection
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    return { t, state }
  },
  data() {
    return {
      playerFlowers: [] as Flower[]
    }
  },
  computed: {
    isPlayerFlowerSelectionValid() : boolean {
      return this.playerFlowers.length >= 3 && this.playerFlowers.length <= 4
    },
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
      const botGarden = BotGarden.new(this.playerFlowers, this.flowerOrder)
      this.state.setup.initialBotGarden = botGarden.toPersistence()
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

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
        <DistinctFlowerSelection v-model="playerFlowers"/>
      </li>
      <li v-html="t('setupBot.instructions.marketPricesManaged')"></li>
    </ol>
    <p v-html="t('setupBot.instructions.botComponentsNotRequired')"/>
  </div>

  <div class="row">
    
  </div>

  <div class="row">
    <div class="col">
       <div class="alert alert-info">
          <h5>{{t('setupBot.soloModeRules.title')}}</h5>
          <ul>
            <li v-html="t('setupBot.soloModeRules.turnStructure')"/>
            <li v-html="t('setupBot.soloModeRules.excessActions')"/>
            <li v-html="t('setupBot.soloModeRules.milestones')"/>
            <li v-html="t('setupBot.soloModeRules.noBonuses')"/>
            <li v-html="t('setupBot.soloModeRules.actionBoxTypes')"/>
            <li v-html="t('setupBot.soloModeRules.clickForDetails')"/>
          </ul>
       </div>
    </div>
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
import DistinctFlowerSelection from '@/components/setup/DistinctFlowerSelection.vue'
import BotGarden from '@/services/BotGarden'
import CardDeck from '@/services/CardDeck'
import BotPersistenceWrapper from '@/services/BotPersistenceWrapper'
import WindowStates from '@/services/WindowStates'
import BillboardMarkers from '@/services/BillboardMarkers'

export default defineComponent({
  name: 'SetupBot',
  components: {
    FooterButtons,
    DistinctFlowerSelection
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
      this.state.setup.initialBotPersistence = new BotPersistenceWrapper(
        CardDeck.new(),
        BotGarden.new(this.playerFlowers, this.flowerOrder),
        [],
        WindowStates.new(),
        BillboardMarkers.new()
      ).toPersistence()
      this.state.storeRound({round:1, year:1, season:Season.AUTUMN, turns:[]})
      this.$router.push('/round/1/start')
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

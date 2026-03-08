<template>
  <SideBar :navigationState="navigationState"/>
  <h1>{{t('player.player')}}: {{t('sideBar.turn', {turn})}}</h1>

  <p class="mt-4" v-html="t('roundTurnPlayer.selectAction')"/>

  <div class="actions">
    <button class="btn btn-primary btn-lg" v-if="!showDeliveryActions" @click="showDeliveryActions = true">
      {{t('roundTurnPlayer.makeDelivery')}}
    </button>
    <div class="deliveryActions" v-if="showDeliveryActions">
      <button class="btn btn-primary btn-lg" v-for="floor of floors" :key="floor" @click="deliverToFloor(floor)">
        {{t('roundTurnPlayer.deliveredToFloor', {floor})}}
      </button>
    </div>
    <button class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#buyFlowerModal">
      {{t('roundTurnPlayer.buyFlower.title')}}
    </button>
    <button class="btn btn-primary btn-lg" @click="next">
      {{t('roundTurnPlayer.otherAction')}}
    </button>
    <div>
      <button class="btn btn-outline-danger btn-lg passButton" data-bs-toggle="modal" data-bs-target="#passModal">
        {{t('action.pass')}}<SoloBoardPassActionInfo :soloBoardPassAction="soloBoardPassAction"/>
      </button>
      <div class="small mt-1 fst-italic passNextTurnInfo">
        <span>{{t('roundTurnPlayer.passInfo.nextTurn')}}</span><SoloBoardPassActionInfo :soloBoardPassAction="soloBoardPassActionNextTurn" :small="true"/>
      </div>
    </div>
  </div>

  <ModalDialog id="buyFlowerModal" :title="t('roundTurnPlayer.buyFlower.title')">
    <template #body>
      <div>{{t('roundTurnPlayer.buyFlower.selectFlower')}}</div>
      <div class="d-flex flex-wrap gap-2 mb-3">
        <button v-for="flower in allFlowers" :key="flower" type="button"
            class="btn flower-btn" :class="buyFlowerType === flower ? 'btn-dark' : 'btn-outline-secondary'"
            @click="buyFlowerType = flower">
          <FlowerIcon :flower="flower"/>
        </button>
      </div>
      <div>
        {{t('roundTurnPlayer.buyFlower.numberOfFlowers')}}<br/>
        <NumberInput v-model="buyFlowerCount" :min="1" :max="20" class="numberInput"/>
      </div>
      <div class="mt-3">
        <span>{{t('roundTurnPlayer.buyFlower.totalCost')}}</span>
        <span class="cost">$<span class="value">{{buyFlowerTotalCost}}</span></span>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-primary" :disabled="!buyFlowerType || !buyFlowerCount" @click="buyFlower()" data-bs-dismiss="modal">{{t('action.ok')}}</button>
      <button class="btn btn-secondary" data-bs-dismiss="modal">{{t('action.cancel')}}</button>
    </template>
  </ModalDialog>

  <ModalDialog id="passModal" :title="t('action.pass')">
    <template #body>
      <p v-html="t('roundTurnPlayer.passConfirm')"></p>
      <div class="mt-3">
        <div class="fw-bold">{{t('roundTurnPlayer.sellFlower.title')}}</div>
        <div class="d-flex flex-wrap gap-2 mt-2">
          <button v-for="flower in allFlowers" :key="flower" type="button"
              class="btn flower-btn btn-outline-secondary"
              @click="addSellFlower(flower)">
            <FlowerIcon :flower="flower"/>
          </button>
        </div>
        <div v-if="sellFlowers.length > 0" class="mt-2">
          <div>{{t('roundTurnPlayer.sellFlower.selectedFlowers')}}</div>
          <div class="d-flex flex-wrap gap-1 align-items-center">
            <span v-for="(flower, index) in sellFlowers" :key="index" class="sell-flower-item">
              <FlowerIcon :flower="flower"/>
            </span>
            <button class="btn btn-sm btn-outline-secondary ms-2" @click="resetSellFlowers">
              {{t('action.reset')}}
            </button>
          </div>
        </div>
      </div>
      <div class="mt-3">
        <div v-if="sellFlowers.length > 0">
          <span>{{t('roundTurnPlayer.sellFlower.sellRevenue')}}</span>
          <span class="revenue">$<span class="value">{{sellFlowerTotalRevenue}}</span></span>
        </div>
        <div v-if="soloBoardPassAction.income > 0">
          <span>{{t('roundTurnPlayer.sellFlower.passingBonus')}}</span>
          <span class="revenue">$<span class="value">{{soloBoardPassAction.income}}</span></span>
        </div>
        <div v-if="sellFlowers.length > 0 || soloBoardPassAction.income > 0" class="mt-1 fw-bold">
          <span>{{t('roundTurnPlayer.sellFlower.totalRevenue')}}</span>
          <span class="revenue">$<span class="value">{{passTotalRevenue}}</span></span>
        </div>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-danger" @click="pass" data-bs-dismiss="modal">{{t('action.pass')}}</button>
      <button class="btn btn-secondary" data-bs-dismiss="modal">{{t('action.cancel')}}</button>
    </template>
  </ModalDialog>

  <DebugInfo :navigationState="navigationState"/>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import NavigationState from '@/util/NavigationState'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { useStateStore } from '@/store/state'
import ModalDialog from '@brdgm/brdgm-commons/src/components/structure/ModalDialog.vue'
import NumberInput from '@brdgm/brdgm-commons/src/components/form/NumberInput.vue'
import SideBar from '@/components/round/SideBar.vue'
import DebugInfo from '@/components/round/DebugInfo.vue'
import getSoloBoardPassAction, { SoloBoardPassAction } from '@/util/getSoloBoardPassAction'
import SoloBoardPassActionInfo from '@/components/round/SoloBoardPassActionInfo.vue'
import FlowerIcon from '@/components/structure/FlowerIcon.vue'
import Player from '@/services/enum/Player'
import Flower from '@/services/enum/Flower'
import getBuyFlowerCost from '@/util/getBuyFlowerCost'
import getSellFlowerRevenue from '@/util/getSellFlowerRevenue'

export default defineComponent({
  name: 'RoundTurnPlayer',
  components: {
    FooterButtons,
    ModalDialog,
    NumberInput,
    SideBar,
    SoloBoardPassActionInfo,
    FlowerIcon,
    DebugInfo
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const state = useStateStore()

    const navigationState = new NavigationState(route, state)
    const { round, turn } = navigationState
    
    const playerDeliveryFloor = ref(navigationState.playerDeliveryFloor)
    const showDeliveryActions = ref(false)
    const buyFlowerType = ref(undefined as Flower|undefined)
    const buyFlowerCount = ref(1)
    const sellFlowers = ref([] as Flower[])

    return { t, router, navigationState, state, round, turn, playerDeliveryFloor, showDeliveryActions, buyFlowerType, buyFlowerCount, sellFlowers }
  },
  computed: {
    backButtonRouteTo() : string {
      if (this.turn > 1) {
        return `/round/${this.round}/turn/${this.turn - 1}/player`
      }
      return ''
    },
    floors() : number[] {
      return [5,4,3,2,1]
    },
    allFlowers() : Flower[] {
      return this.navigationState.marketPrices.flowerOrder
    },
    buyFlowerTotalCost() : number {
      const price = this.navigationState.marketPrices.getPrice(this.buyFlowerType!)
      return getBuyFlowerCost(price, this.buyFlowerCount)
    },
    sellFlowerTotalRevenue() : number {
      const countByFlower = new Map<Flower, number>()
      for (const flower of this.sellFlowers) {
        countByFlower.set(flower, (countByFlower.get(flower) ?? 0) + 1)
      }
      let total = 0
      for (const [flower, count] of countByFlower) {
        const price = this.navigationState.marketPrices.getPrice(flower)
        total += getSellFlowerRevenue(price, count)
      }
      return total
    },
    passTotalRevenue() : number {
      return this.sellFlowerTotalRevenue + this.soloBoardPassAction.income
    },
    soloBoardPassAction() : SoloBoardPassAction {
      const { soloBoard, playerTurns, playerDeliveryFloor } = this.navigationState
      return getSoloBoardPassAction(soloBoard, playerTurns, playerDeliveryFloor)
    },
    soloBoardPassActionNextTurn() : SoloBoardPassAction {
      const { soloBoard, playerTurns, playerDeliveryFloor } = this.navigationState
      return getSoloBoardPassAction(soloBoard, playerTurns + 1, playerDeliveryFloor)
    }
  },
  methods: {
    deliverToFloor(floor: number) : void {
      this.playerDeliveryFloor = floor
      this.next()
    },
    buyFlower() : void {
      if (this.buyFlowerType && this.buyFlowerCount) {
        const newPrice = this.navigationState.marketPrices.getPrice(this.buyFlowerType) + this.buyFlowerCount
        this.navigationState.marketPrices.setPrice(this.buyFlowerType, newPrice)
        this.next()
      }
    },
    next() : void {
      this.nextWithPassed(false)
    },
    addSellFlower(flower: Flower) : void {
      this.sellFlowers.push(flower)
    },
    resetSellFlowers() : void {
      this.sellFlowers = []
    },
    pass() : void {
      // Adjust market prices for sold flowers
      const countByFlower = new Map<Flower, number>()
      for (const flower of this.sellFlowers) {
        countByFlower.set(flower, (countByFlower.get(flower) ?? 0) + 1)
      }
      for (const [flower, count] of countByFlower) {
        const currentPrice = this.navigationState.marketPrices.getPrice(flower)
        this.navigationState.marketPrices.setPrice(flower, currentPrice - count)
      }
      this.nextWithPassed(true)
    },
    nextWithPassed(passed : boolean) {
      this.state.storeRoundTurn({
        round: this.round,
        turn: this.turn,
        player: Player.PLAYER,
        marketPrices: this.navigationState.marketPrices.toPersistence(),
        playerDeliveryFloor: this.playerDeliveryFloor
      })
      if (passed) {
        this.router.push(`/round/${this.round}/turn/${this.turn + 1}/bot`)
      }
      else {
        this.router.push(`/round/${this.round}/turn/${this.turn + 1}/player`)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 18rem;
}
.deliveryActions {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.passButton {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.passNextTurnInfo {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flower-btn {
  padding: 0.4rem 0.6rem;
}
.cost {
  color: darkred;
  margin-left: 0.25rem;
  .value {
    font-weight: bold;
  }
}
.numberInput {
  width: 4rem;
}
.sell-flower-item {
  display: inline-flex;
}
.revenue {
  color: darkgreen;
  margin-left: 0.25rem;
  .value {
    font-weight: bold;
  }
}
</style>
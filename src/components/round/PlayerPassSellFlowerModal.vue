<template>
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
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ModalDialog from '@brdgm/brdgm-commons/src/components/structure/ModalDialog.vue'
import FlowerIcon from '@/components/structure/FlowerIcon.vue'
import Flower from '@/services/enum/Flower'
import MarketPrices from '@/services/MarketPrices'
import getSellFlowerRevenue from '@/util/getSellFlowerRevenue'
import { SoloBoardPassAction } from '@/util/getSoloBoardPassAction'

export default defineComponent({
  name: 'PlayerPassSellFlowerModal',
  components: {
    ModalDialog,
    FlowerIcon
  },
  props: {
    marketPrices: {
      type: Object as PropType<MarketPrices>,
      required: true
    },
    soloBoardPassAction: {
      type: Object as PropType<SoloBoardPassAction>,
      required: true
    }
  },
  emits: ['pass'],
  setup() {
    const { t } = useI18n()
    const sellFlowers = ref([] as Flower[])
    return { t, sellFlowers }
  },
  computed: {
    allFlowers() : Flower[] {
      return this.marketPrices.flowerOrder
    },
    sellFlowerTotalRevenue() : number {
      const countByFlower = this.countByFlower
      let total = 0
      for (const [flower, count] of countByFlower) {
        const price = this.marketPrices.getPrice(flower)
        total += getSellFlowerRevenue(price, count)
      }
      return total
    },
    passTotalRevenue() : number {
      return this.sellFlowerTotalRevenue + this.soloBoardPassAction.income
    },
    countByFlower() : Map<Flower, number> {
      const map = new Map<Flower, number>()
      for (const flower of this.sellFlowers) {
        map.set(flower, (map.get(flower) ?? 0) + 1)
      }
      return map
    }
  },
  methods: {
    addSellFlower(flower: Flower) : void {
      this.sellFlowers.push(flower)
    },
    resetSellFlowers() : void {
      this.sellFlowers = []
    },
    pass() : void {
      for (const [flower, count] of this.countByFlower) {
        const currentPrice = this.marketPrices.getPrice(flower)
        this.marketPrices.setPrice(flower, currentPrice - count)
      }
      this.$emit('pass')
    }
  }
})
</script>

<style lang="scss" scoped>
.flower-btn {
  padding: 0.4rem 0.6rem;
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

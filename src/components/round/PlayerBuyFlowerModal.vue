<template>
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
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ModalDialog from '@brdgm/brdgm-commons/src/components/structure/ModalDialog.vue'
import NumberInput from '@brdgm/brdgm-commons/src/components/form/NumberInput.vue'
import FlowerIcon from '@/components/structure/FlowerIcon.vue'
import Flower from '@/services/enum/Flower'
import MarketPrices from '@/services/MarketPrices'
import getBuyFlowerCost from '@/util/getBuyFlowerCost'

export default defineComponent({
  name: 'PlayerBuyFlowerModal',
  components: {
    ModalDialog,
    NumberInput,
    FlowerIcon
  },
  props: {
    marketPrices: {
      type: Object as PropType<MarketPrices>,
      required: true
    }
  },
  emits: ['next'],
  setup() {
    const { t } = useI18n()
    const buyFlowerType = ref(undefined as Flower|undefined)
    const buyFlowerCount = ref(1)
    return { t, buyFlowerType, buyFlowerCount }
  },
  computed: {
    allFlowers() : Flower[] {
      return this.marketPrices.flowerOrder
    },
    buyFlowerTotalCost() : number {
      if (!this.buyFlowerType) {
        return 0
      }
      const price = this.marketPrices.getPrice(this.buyFlowerType)
      return getBuyFlowerCost(price, this.buyFlowerCount)
    }
  },
  methods: {
    buyFlower() : void {
      if (this.buyFlowerType && this.buyFlowerCount) {
        const newPrice = this.marketPrices.getPrice(this.buyFlowerType) + this.buyFlowerCount
        this.marketPrices.setPrice(this.buyFlowerType, newPrice)
        this.$emit('next')
      }
    }
  }
})
</script>

<style lang="scss" scoped>
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
</style>

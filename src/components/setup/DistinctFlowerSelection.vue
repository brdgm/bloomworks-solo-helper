<template>
  <div class="card mt-2 me-3">
    <div class="card-header" v-html="t('setupBot.playerFlowerSelection.description')"></div>
    <div class="card-body">
      <div class="d-flex flex-wrap gap-2">
        <button v-for="flower in allFlowers" :key="flower" type="button"
            class="btn flower-btn" :class="isSelected(flower) ? 'btn-dark' : 'btn-outline-secondary'"
            @click="toggle(flower)">
          <FlowerIcon :flower="flower"/>
        </button>
      </div>
      <div class="mt-3" v-html="t('setupBot.playerFlowerSelection.flowerPriorityNote')"></div>
    </div>    
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import Flower from '@/services/enum/Flower'
import FlowerIcon from '@/components/structure/FlowerIcon.vue'
import { useStateStore } from '@/store/state'
import MarketPrices from '@/services/MarketPrices'

export default defineComponent({
  name: 'DistinctFlowerSelection',
  components: {
    FlowerIcon
  },
  props: {
    modelValue: {
      type: Array as PropType<Flower[]>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    return { t, state }
  },
  computed: {
    allFlowers() : Flower[] {
      const marketPrices = this.state.setup.initialMarketPrices
        ? MarketPrices.fromPersistence(this.state.setup.initialMarketPrices)
        : MarketPrices.new()
      return marketPrices.flowerOrder
    }
  },
  methods: {
    isSelected(flower: Flower) : boolean {
      return this.modelValue.includes(flower)
    },
    toggle(flower: Flower) : void {
      const updated = this.isSelected(flower)
        ? this.modelValue.filter(f => f !== flower)
        : [...this.modelValue, flower]
      this.$emit('update:modelValue', updated)
    }
  }
})
</script>

<style lang="scss" scoped>
.flower-btn {
  padding: 0.4rem 0.6rem;
}
</style>

<template>
  <div>
    <div class="d-flex flex-wrap gap-2">
      <button v-for="flower in allFlowers" :key="flower" type="button"
          class="btn flower-btn btn-outline-secondary"
          :disabled="maxReached"
          @click="addFlower(flower)">
        <FlowerIcon :flower="flower"/>
      </button>
    </div>
    <div v-if="modelValue.length > 0" class="mt-2">
      <div class="d-flex flex-wrap gap-1 align-items-center">
        <span v-for="(flower, index) in modelValue" :key="index" class="selected-flower-item">
          <FlowerIcon :flower="flower"/>
        </span>
        <button class="btn btn-sm btn-outline-secondary ms-2" @click="reset">
          {{t('action.reset')}}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import FlowerIcon from '@/components/structure/FlowerIcon.vue'
import Flower from '@/services/enum/Flower'
import MarketPrices from '@/services/MarketPrices'

export default defineComponent({
  name: 'FlowerSelection',
  components: {
    FlowerIcon
  },
  props: {
    modelValue: {
      type: Array as PropType<Flower[]>,
      required: true
    },
    marketPrices: {
      type: Object as PropType<MarketPrices>,
      required: true
    },
    max: {
      type: Number,
      required: false
    }
  },
  emits: ['update:modelValue'],
  setup() {
    const { t } = useI18n()
    return { t }
  },
  computed: {
    allFlowers() : Flower[] {
      return this.marketPrices.flowerOrder
    },
    maxReached() : boolean {
      return this.max !== undefined && this.modelValue.length >= this.max
    }
  },
  methods: {
    addFlower(flower: Flower) : void {
      if (!this.maxReached) {
        this.$emit('update:modelValue', [...this.modelValue, flower])
      }
    },
    reset() : void {
      this.$emit('update:modelValue', [])
    }
  }
})
</script>

<style lang="scss" scoped>
.flower-btn {
  padding: 0.4rem 0.6rem;
}
.selected-flower-item {
  display: inline-flex;
}
</style>

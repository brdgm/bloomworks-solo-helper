<template>
  <div class="sidebar">
    <div>
      {{t('sideBar.round', {round})}}: <span class="fw-bold">{{t(`season.${season}`)}}</span><br/>
      {{t('sideBar.turn', {turn})}}

      <hr/>

      <div v-for="price in marketPrices.prices" :key="price.flower" class="flowerPrice">
        <FlowerIcon :flower="price.flower"/>
        <div class="price buy">$<span class="value">{{price.price}}</span></div>
        <div class="price sell">$<span class="value">{{price.priceSell}}</span></div>
      </div>


    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStateStore } from '@/store/state'
import NavigationState from '@/util/NavigationState'
import Season from '@/services/enum/Season'
import MarketPrices from '@/services/MarketPrices'
import FlowerIcon from '../structure/FlowerIcon.vue'

export default defineComponent({
  name: 'SideBar',
  components: {
    FlowerIcon
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    return { t, state }
  },
  props: {
    navigationState: {
      type: NavigationState,
      required: true
    }
  },
  computed: {
    round() : number {
      return this.navigationState.round
    },
    season() : Season {
      return this.navigationState.season
    },
    turn() : number {
      return this.navigationState.turn
    },
    marketPrices() : MarketPrices {
      return this.navigationState.marketPrices
    }
  }
})
</script>

<style lang="scss" scoped>
.sidebar {
  float: right;
  width: 145px;
  margin-left: 15px;
  margin-bottom: 10px;
  margin-right: -12px;
  padding: 15px 10px 15px 15px;
  background-color: #ddd;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}
.flowerPrice {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  .price {
    &.buy {
      color: darkgreen;
    }
    &.sell {
      color: red;
    }
    .value {
      font-weight: bold;
    }
  }
}
</style>

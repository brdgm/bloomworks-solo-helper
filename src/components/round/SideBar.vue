<template>
  <div class="sidebar">
    <div>
      <span class="fw-bold">{{t(`season.${season}`)}}</span> {{t('sideBar.round', {round})}}

      <hr/>

      <div v-for="price in marketPrices.prices" :key="price.flower" class="flowerPrice"
          data-bs-toggle="modal" data-bs-target="#marketPriceModal" role="button"
          @click="openPriceEdit(price.flower, price.price)">
        <FlowerIcon :flower="price.flower"/>
        <div class="price buy">$<span class="value">{{price.price}}</span></div>
        <div class="price sell">$<span class="value">{{price.priceSell}}</span></div>
      </div>

      <hr/>

      <div class="small fw-bold">Lady Pei</div>
      <div v-for="season in gardenSeasons" :key="season.season" class="gardenSeason" :class="{active:isActiveSeason(season.season)}">
        <div class="title small">{{t(`season.${season.season}`)}}</div>
        <div class="flowers">
          <FlowerIcon v-for="flower in season.flowers" :key="flower" :flower="flower" class="flowerIcon"/>
        </div>
      </div>

    </div>
  </div>

  <ModalDialog id="marketPriceModal" :title="t('sideBar.marketPrice.title')">
    <template #body>
      <div v-if="selectedFlower" class="d-flex align-items-center gap-3">
        <FlowerIcon :flower="selectedFlower"/>
        <div>
        $&nbsp;<NumberInput v-model="editPrice" :min="1" :max="12" class="numberInput"/>
        </div>
        <button class="btn btn-sm btn-outline-success" @click="increasePrice">{{t('sideBar.marketPrice.increase')}}</button>
        <button class="btn btn-sm btn-outline-danger" @click="decreasePrice">{{t('sideBar.marketPrice.decrease')}}</button>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-primary" data-bs-dismiss="modal" @click="applyPrice">{{t('action.ok')}}</button>
      <button class="btn btn-secondary" data-bs-dismiss="modal">{{t('action.cancel')}}</button>
    </template>
  </ModalDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { GardenSeason, useStateStore } from '@/store/state'
import NavigationState from '@/util/NavigationState'
import Season from '@/services/enum/Season'
import MarketPrices from '@/services/MarketPrices'
import Flower from '@/services/enum/Flower'
import FlowerIcon from '../structure/FlowerIcon.vue'
import ModalDialog from '@brdgm/brdgm-commons/src/components/structure/ModalDialog.vue'
import NumberInput from '@brdgm/brdgm-commons/src/components/form/NumberInput.vue'

export default defineComponent({
  name: 'SideBar',
  components: {
    FlowerIcon,
    ModalDialog,
    NumberInput
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    return { t, state }
  },
  data() {
    return {
      selectedFlower: undefined as Flower|undefined,
      editPrice: 0
    }
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
    },
    gardenSeasons() : readonly GardenSeason[] {
      return this.navigationState.botGarden.seasons
    }
  },
  methods: {
    isActiveSeason(season: Season) : boolean {
      return season === this.season
    },
    openPriceEdit(flower: Flower, price: number) {
      this.selectedFlower = flower
      this.editPrice = price
    },
    increasePrice() {
      if (this.editPrice < 12) {
        this.editPrice++
      }
    },
    decreasePrice() {
      if (this.editPrice > 1) {
        this.editPrice--
      }
    },
    applyPrice() {
      if (this.selectedFlower) {
        this.marketPrices.setPrice(this.selectedFlower, this.editPrice)
      }
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
  hr {
    margin: 0.6rem 0;
  }
}
.flowerPrice {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  .price {
    &.buy {
      color: darkred;
    }
    &.sell {
      color: darkgreen;
    }
    .value {
      font-weight: bold;
    }
  }
}
.numberInput {
  width: 4rem;
}
.gardenSeason {
  padding: 0.25rem;
  margin-top: 0.1rem;
  &.active {
    background-color: #bbb;
    border-radius: 4px;
  }
  .flowers {
    display: flex;
    flex-wrap: wrap;
  }
  .flowerIcon {
    width: 1.5rem;
  }
}
</style>

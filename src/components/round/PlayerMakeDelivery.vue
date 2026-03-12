<template>
  <div class="mt-4">
    <div v-for="floor in floors" :key="floor.number" class="floor mb-3">
      <h5>{{t('playerMakeDelivery.floor', {floor: floor.number})}}</h5>
      <div class="d-flex flex-wrap gap-3">
        <div v-for="window in floor.windows" :key="window.selection" class="window-box border rounded p-2">
          <div v-if="floor.windows.length > 1" class="fw-bold small mb-1">{{window.label}}</div>
          <div v-if="getDisplayFlowers(window.selection, floor.number).length > 0"
              class="d-flex flex-wrap gap-1 align-items-center">
            <FlowerIcon v-for="(flower, i) in getDisplayFlowers(window.selection, floor.number)"
                :key="'f'+i" :flower="flower"/>
          </div>
          <div v-if="getDisplayDeliveries(window.selection).length > 0"
              class="d-flex flex-wrap gap-1 align-items-center mt-1">
            <PlayerColorIcon v-for="(player, i) in getDisplayDeliveries(window.selection)"
                :key="'d'+i" :player="player"/>
          </div>
          <div v-if="canDeliver(window.selection)" class="mt-2">
            <template v-if="selectingWindow === window.selection">
              <p class="small mb-1" v-html="t('playerMakeDelivery.selectFlowers', {count: floor.number})"/>
              <FlowerSelection v-model="selectedFlowers" :marketPrices="marketPrices" :max="floor.number"/>
              <button v-if="selectedFlowers.length === floor.number"
                  class="btn btn-success btn-sm mt-2" @click="confirmDelivery(window.selection, floor.number)">
                {{t('playerMakeDelivery.confirm')}}
              </button>
            </template>
            <button v-else class="btn btn-outline-primary btn-sm" @click="deliverHere(window.selection, floor.number)">
              {{t('playerMakeDelivery.deliverHere')}}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import WindowStates from '@/services/WindowStates'
import WindowSelection from '@/services/enum/WindowSelection'
import Flower from '@/services/enum/Flower'
import Player from '@/services/enum/Player'
import MarketPrices from '@/services/MarketPrices'
import FlowerIcon from '@/components/structure/FlowerIcon.vue'
import PlayerColorIcon from '@/components/structure/PlayerColorIcon.vue'
import FlowerSelection from '@/components/structure/FlowerSelection.vue'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'

interface FloorInfo {
  number: number
  windows: { selection: WindowSelection, label: string }[]
}

export default defineComponent({
  name: 'PlayerMakeDelivery',
  components: {
    FlowerIcon,
    PlayerColorIcon,
    FlowerSelection
  },
  emits: ['deliver'],
  props: {
    windowStates: {
      type: Object as PropType<WindowStates>,
      required: true
    },
    marketPrices: {
      type: Object as PropType<MarketPrices>,
      required: true
    }
  },
  setup() {
    const { t } = useI18n()
    const selectingWindow = ref<WindowSelection|null>(null)
    const selectedFlowers = ref<Flower[]>([])
    return { t, selectingWindow, selectedFlowers }
  },
  computed: {
    floors() : FloorInfo[] {
      return [
        { number: 5, windows: [
          { selection: WindowSelection.WINDOW_5, label: '' }
        ]},
        { number: 4, windows: [
          { selection: WindowSelection.WINDOW_4L, label: this.t('playerMakeDelivery.windowLeft') },
          { selection: WindowSelection.WINDOW_4R, label: this.t('playerMakeDelivery.windowRight') }
        ]},
        { number: 3, windows: [
          { selection: WindowSelection.WINDOW_3L, label: this.t('playerMakeDelivery.windowLeft') },
          { selection: WindowSelection.WINDOW_3R, label: this.t('playerMakeDelivery.windowRight') }
        ]},
        { number: 2, windows: [
          { selection: WindowSelection.WINDOW_2L, label: this.t('playerMakeDelivery.windowLeft') },
          { selection: WindowSelection.WINDOW_2R, label: this.t('playerMakeDelivery.windowRight') }
        ]},
        { number: 1, windows: [
          { selection: WindowSelection.WINDOW_1L, label: this.t('playerMakeDelivery.windowLeft') },
          { selection: WindowSelection.WINDOW_1R, label: this.t('playerMakeDelivery.windowRight') }
        ]}
      ]
    }
  },
  methods: {
    getDisplayFlowers(windowSelection: WindowSelection, floorNumber: number) : Flower[] {
      const state = this.windowStates.getWindowState(windowSelection)
      if (state) return state.flowers
      if (floorNumber === 5) return getAllEnumValues(Flower)
      return []
    },
    getDisplayDeliveries(windowSelection: WindowSelection) : Player[] {
      const state = this.windowStates.getWindowState(windowSelection)
      return state?.deliveries ?? []
    },
    canDeliver(windowSelection: WindowSelection) : boolean {
      const state = this.windowStates.getWindowState(windowSelection)
      if (!state) return true
      return state.deliveries.length < 4
    },
    deliverHere(windowSelection: WindowSelection, floorNumber: number) : void {
      const state = this.windowStates.getWindowState(windowSelection)
      if (state) {
        this.windowStates.addDelivery(windowSelection, Player.PLAYER)
        this.$emit('deliver', floorNumber)
      }
      else if (floorNumber === 5) {
        this.windowStates.setWindowState(windowSelection, getAllEnumValues(Flower), [Player.PLAYER])
        this.$emit('deliver', floorNumber)
      }
      else {
        this.selectingWindow = windowSelection
        this.selectedFlowers = []
      }
    },
    confirmDelivery(windowSelection: WindowSelection, floorNumber: number) : void {
      this.windowStates.setWindowState(windowSelection, [...this.selectedFlowers], [Player.PLAYER])
      this.selectingWindow = null
      this.$emit('deliver', floorNumber)
    }
  }
})
</script>

<style lang="scss" scoped>
.window-box {
  min-width: 8rem;
}
</style>

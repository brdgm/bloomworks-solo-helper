<template>
  <div class="mt-4">
    <div v-for="floor in floors" :key="floor.number" class="floor mb-3">
      <h5>{{t('roundTurnPlayer.playerMakeDelivery.floor', {floor: floor.number})}}</h5>
      <div class="d-flex flex-wrap gap-3">
        <div v-for="window in floor.windows" :key="window.selection" class="window-box border rounded p-2">
          <div v-if="floor.windows.length > 1" class="fw-bold small mb-1">{{window.label}}</div>
          <div v-if="getDisplayFlowers(floor.number, window.selection).length > 0"
              class="d-flex flex-wrap gap-1 align-items-center">
            <FlowerIcon v-for="(flower, i) in getDisplayFlowers(floor.number, window.selection)"
                :key="'f'+i" :flower="flower"/>
          </div>
          <div v-if="getDisplayDeliveries(floor.number, window.selection).length > 0"
              class="d-flex flex-wrap gap-1 align-items-center mt-1">
            <PlayerColorIcon v-for="(player, i) in getDisplayDeliveries(floor.number, window.selection)"
                :key="'d'+i" :player="player"/>
          </div>
          <div v-if="canDeliver(floor.number, window.selection)" class="mt-2">
            <template v-if="selectingFloor === floor.number && selectingWindow === window.selection">
              <p class="small mb-1" v-html="t('roundTurnPlayer.playerMakeDelivery.selectFlowers', {count: floor.number})"/>
              <FlowerSelection v-model="selectedFlowers" :marketPrices="marketPrices" :max="floor.number"/>
              <button v-if="selectedFlowers.length === floor.number"
                  class="btn btn-success btn-sm mt-2" @click="confirmDelivery(floor.number, window.selection)">
                {{t('roundTurnPlayer.playerMakeDelivery.confirm')}}
              </button>
            </template>
            <button v-else class="btn btn-outline-primary btn-sm" @click="deliverHere(floor.number, window.selection)">
              {{t('roundTurnPlayer.playerMakeDelivery.deliverHere')}}
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
    const selectingFloor = ref<number|null>(null)
    const selectingWindow = ref<WindowSelection|null>(null)
    const selectedFlowers = ref<Flower[]>([])
    return { t, selectingFloor, selectingWindow, selectedFlowers }
  },
  computed: {
    floors() : FloorInfo[] {
      return [
        { number: 5, windows: [
          { selection: WindowSelection.LEFT, label: '' }
        ]},
        { number: 4, windows: [
          { selection: WindowSelection.LEFT, label: this.t('roundTurnPlayer.playerMakeDelivery.windowLeft') },
          { selection: WindowSelection.RIGHT, label: this.t('roundTurnPlayer.playerMakeDelivery.windowRight') }
        ]},
        { number: 3, windows: [
          { selection: WindowSelection.LEFT, label: this.t('roundTurnPlayer.playerMakeDelivery.windowLeft') },
          { selection: WindowSelection.RIGHT, label: this.t('roundTurnPlayer.playerMakeDelivery.windowRight') }
        ]},
        { number: 2, windows: [
          { selection: WindowSelection.LEFT, label: this.t('roundTurnPlayer.playerMakeDelivery.windowLeft') },
          { selection: WindowSelection.RIGHT, label: this.t('roundTurnPlayer.playerMakeDelivery.windowRight') }
        ]},
        { number: 1, windows: [
          { selection: WindowSelection.LEFT, label: this.t('roundTurnPlayer.playerMakeDelivery.windowLeft') },
          { selection: WindowSelection.RIGHT, label: this.t('roundTurnPlayer.playerMakeDelivery.windowRight') }
        ]}
      ]
    }
  },
  methods: {
    getDisplayFlowers(floor: number, windowSelection: WindowSelection) : Flower[] {
      const state = this.windowStates.getWindowState(floor, windowSelection)
      return state?.flowers ?? []
    },
    getDisplayDeliveries(floor: number, windowSelection: WindowSelection) : Player[] {
      const state = this.windowStates.getWindowState(floor, windowSelection)
      return state?.deliveries ?? []
    },
    canDeliver(floor: number, windowSelection: WindowSelection) : boolean {
      const state = this.windowStates.getWindowState(floor, windowSelection)
      if (!state) return true
      return state.deliveries.length < 4
    },
    deliverHere(floor: number, windowSelection: WindowSelection) : void {
      const state = this.windowStates.getWindowState(floor, windowSelection)
      if (state) {
        this.windowStates.addDelivery(floor, windowSelection, Player.PLAYER)
        this.$emit('deliver', floor)
      }
      else {
        this.selectingFloor = floor
        this.selectingWindow = windowSelection
        this.selectedFlowers = []
      }
    },
    confirmDelivery(floor: number, windowSelection: WindowSelection) : void {
      this.windowStates.setWindowState(floor, windowSelection, [...this.selectedFlowers], [Player.PLAYER])
      this.selectingFloor = null
      this.selectingWindow = null
      this.$emit('deliver', floor)
    }
  }
})
</script>

<style lang="scss" scoped>
.window-box {
  min-width: 8rem;
}
</style>

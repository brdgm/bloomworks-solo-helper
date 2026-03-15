<template>
  <div class="mt-4">
    <div v-for="floor in floorNumbers" :key="floor" class="floor mb-3">
      <h5>{{t('roundTurnPlayer.playerMakeDelivery.floor', {floor})}}</h5>
      <div class="floor-windows">
        <div v-for="window in getWindowSelections(floor)" :key="window" class="window-box border rounded p-2">
          <div class="flex-grow-1">
            <div v-if="getDisplayFlowers(floor, window).length > 0" class="icon-row flowers">
              <FlowerIcon v-for="(flower, i) in getDisplayFlowers(floor, window)" :key="'f'+i" :flower="flower" class="flower-icon"/>
            </div>
            <div v-if="getDisplayDeliveries(floor, window).length > 0" class="icon-row players">
              <PlayerColorIcon v-for="(player, i) in getDisplayDeliveries(floor, window)"
                  :key="'d'+i" :player="player" class="player-icon"/>
            </div>
          </div>
          <div v-if="canDeliver(floor, window)" class="mt-2">
            <button class="btn btn-outline-primary btn-sm" @click="deliverHere(floor, window)">
              {{t('roundTurnPlayer.playerMakeDelivery.deliverHere')}}
            </button>
          </div>
        </div>
      </div>
    </div>

    <ModalDialog id="deliveryModal" :title="t('roundTurnPlayer.playerMakeDelivery.selectFlowersTitle')">
      <template #body>
        <p class="small mb-1" v-html="t('roundTurnPlayer.playerMakeDelivery.selectFlowers', {count: selectingFloor ?? 0})"/>
        <FlowerSelection v-model="selectedFlowers" :marketPrices="marketPrices" :max="selectingFloor ?? 0"/>
      </template>
      <template #footer>
        <button :disabled="selectedFlowers.length !== selectingFloor"
            class="btn btn-primary" @click="confirmDelivery">
          {{t('action.ok')}}
        </button>
        <button class="btn btn-secondary" data-bs-dismiss="modal">
          {{t('action.cancel')}}
        </button>
      </template>
    </ModalDialog>

    <button class="btn btn-secondary btn-sm mt-2" @click="$emit('cancel')">
      {{t('action.cancel')}}
    </button>
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
import ModalDialog from '@brdgm/brdgm-commons/src/components/structure/ModalDialog.vue'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import showModal from '@brdgm/brdgm-commons/src/util/modal/showModal'
import { Modal } from 'bootstrap'

const FLOOR_NUMBERS = [5, 4, 3, 2, 1]

export default defineComponent({
  name: 'PlayerMakeDelivery',
  components: {
    FlowerIcon,
    PlayerColorIcon,
    FlowerSelection,
    ModalDialog
  },
  emits: ['deliver', 'cancel'],
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
    floorNumbers() : number[] {
      return FLOOR_NUMBERS
    }
  },
  methods: {
    getWindowSelections(floor: number) : WindowSelection[] {
      if (floor === 5) return [WindowSelection.LEFT]
      return getAllEnumValues(WindowSelection)
    },
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
        showModal('deliveryModal')
      }
    },
    confirmDelivery() : void {
      if (this.selectingFloor == null || this.selectingWindow == null) return
      this.windowStates.setWindowState(this.selectingFloor, this.selectingWindow, [...this.selectedFlowers], [Player.PLAYER])
      const floor = this.selectingFloor
      this.selectingFloor = null
      this.selectingWindow = null
      const modalElement = document.querySelector('#deliveryModal')
      if (modalElement) {
        Modal.getInstance(modalElement)?.hide()
      }
      this.$emit('deliver', floor)
    }
  }
})
</script>

<style lang="scss" scoped>
.floor-windows {
  display: flex;
  gap: 0.75rem;
}
.window-box {
  display: flex;
  flex-direction: column;
  width: 8rem;
}
.icon-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.flowers {
  gap: 0.1rem;
}
.players {
  gap: 0.2rem;
}
.flower-icon {
  width: 1.25rem;
}
.player-icon {
  width: 1rem;
}
</style>

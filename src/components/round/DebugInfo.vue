<template>
  <div class="mt-4" v-if="state.setup.debugMode">
    <hr/>
    <p class="debug">
      <b>Current Card</b>: {{navigationState.botPersistence.cardDeck.currentCard}}<br/>
      <b>Card Deck</b>: {{ navigationState.botPersistence.cardDeck.toPersistence() }}<br/>
      <b>Bot Garden</b>: {{ navigationState.botPersistence.garden.toPersistence() }}<br/>
      <b>Window States</b>: {{ navigationState.botPersistence.windowStates.toPersistence() }}<br/>
      <b>Player Turn:</b> {{ navigationState.playerTurn}}/{{ navigationState.playerTurns }}, <b>Delivery Floor:</b> {{ navigationState.playerDeliveryFloor }}<br/>
      <b>Bot Turn:</b> {{ navigationState.botTurn}}/{{ navigationState.botTurns }}, <b>Claimed Milestones:</b> {{navigationState.botPersistence.claimedMilestones}}<br/>
      <b>Solo Board Pass Action</b>: {{ navigationState.soloBoardPassAction }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStateStore } from '@/store/state'
import NavigationState from '@/util/NavigationState'

export default defineComponent({
  name: 'DebugInfo',
  setup() {
    const state = useStateStore()
    return { state }
  },
  props: {
    navigationState: {
      type: NavigationState,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.debug {
  font-size: small;
}
p.debug, ul.debug {
  margin: 0;
}
</style>

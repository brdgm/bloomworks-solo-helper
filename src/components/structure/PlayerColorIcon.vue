<template>
  <svg viewBox="0 0 20 20">
    <rect x="0.5" y="0.5" width="19" height="19" :fill="color" stroke="#aaa" stroke-width="0.5"/>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Player from '@/services/enum/Player'
import getPlayerColorCode from '@/util/getPlayerColorCode'
import { useStateStore } from '@/store/state'

export default defineComponent({
  name: 'PlayerColorIcon',
  props: {
    player: {
      type: String as () => Player,
      required: true
    }
  },
  computed: {
    color() : string {
      const state = useStateStore()
      const playerColor = this.player === Player.PLAYER
        ? state.setup.playerColor
        : state.setup.botColor
      return getPlayerColorCode(playerColor)
    }
  }
})
</script>

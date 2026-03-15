<template>
  <h3 class="mt-4 mb-3">{{t('setup.playerColors.title')}}</h3>

  <div class="row mt-3">
    <div class="col-auto">
      <label class="form-label">{{t('setup.playerColors.playerColor')}}</label><br/>
      <PlayerColorPicker :modelValue="playerColor" @update:modelValue="playerColorChanged"/>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-auto">
      <label class="form-label">{{t('setup.playerColors.botColor')}}</label><br/>
      <PlayerColorPicker :modelValue="botColor" @update:modelValue="botColorChanged"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStateStore } from '@/store/state'
import PlayerColor from '@/services/enum/PlayerColor'
import PlayerColorPicker from '@/components/setup/PlayerColorPicker.vue'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'

export default defineComponent({
  name: 'PlayerColorSetup',
  components: {
    PlayerColorPicker
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    return { t, state }
  },
  computed: {
    playerColor() : PlayerColor {
      return this.state.setup.playerColor ?? PlayerColor.WHITE
    },
    botColor() : PlayerColor {
      return this.state.setup.botColor ?? PlayerColor.DARK_BLUE
    }
  },
  methods: {
    playerColorChanged(color : PlayerColor) : void {
      this.state.setup.playerColor = color
      if (this.state.setup.botColor === color) {
        const newColor = getAllEnumValues(PlayerColor).find(c => c !== color)
        if (newColor) {
          this.state.setup.botColor = newColor
        }
      }
    },
    botColorChanged(color : PlayerColor) : void {
      this.state.setup.botColor = color
      if (this.state.setup.playerColor === color) {
        const newColor = getAllEnumValues(PlayerColor).find(c => c !== color)
        if (newColor) {
          this.state.setup.playerColor = newColor
        }
      }
    }
  }
})
</script>

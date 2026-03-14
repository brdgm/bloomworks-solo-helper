<template>
  <h3 class="mt-4 mb-3">{{t('setup.botMode.title')}}</h3>

  <div class="row">
    <div class="col">
      <div class="form-check" v-for="botMode in botModes" :key="botMode">
        <label class="form-check-label">
          <input class="form-check-input" type="radio" name="botModeSelection" :value="botMode"
              :checked="state.setup.botMode === botMode" @change="selectBotMode(botMode)">
          {{t(`setup.botMode.${botMode}`)}}
        </label>
      </div>
    </div>
  </div>

  <p v-if="isAdvanced" class="mt-2 fst-italic" v-html="t('setup.botMode.advancedNote')"></p>

  <div v-if="isAdvanced" class="row mt-2">
    <div class="col-auto">
      <select class="form-select" v-model="state.setup.playerPower">
        <option v-for="playerPower in playerPowers" :key="playerPower" :value="playerPower">
          {{t(`playerPower.${playerPower}`)}}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStateStore } from '@/store/state'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import BotMode from '@/services/enum/BotMode'
import PlayerPower from '@/services/enum/PlayerPower'

export default defineComponent({
  name: 'BotModeSelection',
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    return { t, state }
  },
  computed: {
    botModes(): BotMode[] {
      return getAllEnumValues(BotMode)
    },
    playerPowers(): PlayerPower[] {
      return getAllEnumValues(PlayerPower)
    },
    isAdvanced() : boolean {
      return this.state.setup.botMode === BotMode.ADVANCED
    }
  },
  methods: {
    selectBotMode(botMode: BotMode) {
      this.state.setup.botMode = botMode
      if (botMode === BotMode.BASE) {
        this.state.setup.playerPower = undefined
      } else if (!this.state.setup.playerPower) {
        this.state.setup.playerPower = this.playerPowers[0]
      }
    }
  }
})
</script>

<template>
  <h3 class="mt-4 mb-3">{{t('setup.botMode.title')}}</h3>

  <div class="row">
    <div class="col">
      <div class="form-check" v-for="botMode in botModes" :key="botMode">
        <label class="form-check-label">
          <input class="form-check-input" type="radio" name="botModeSelection" v-model="state.setup.botMode" :value="botMode">
          {{t(`setup.botMode.${botMode}`)}}
        </label>
      </div>
    </div>
  </div>

  <p v-if="isAdvanced" class="mt-2 fst-italic" v-html="t('setup.botMode.advancedNote')"></p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStateStore } from '@/store/state'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import BotMode from '@/services/enum/BotMode'

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
    isAdvanced() : boolean {
      return this.state.setup.botMode === BotMode.ADVANCED
    }
  }
})
</script>

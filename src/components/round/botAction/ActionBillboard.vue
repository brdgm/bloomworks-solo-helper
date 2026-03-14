<template>
  <ActionBox :instruction-title="t('rules.action.billboard.title')" :currentCard="currentCard">
    <template #action>
      <div class="action">
        <div class="billboardMarker">{{t('roundTurnPlayer.passInfo.billboard', {floor:action.floor})}}</div>
      </div>
    </template>
    <template #instruction>
      <p v-html="t('rules.action.billboard.instruction', {floor:action.floor})"/>
    </template>
  </ActionBox>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import NavigationState from '@/util/NavigationState'
import Card from '@/services/Card'
import { BotAction } from '@/services/BotActions'
import ActionBox from '../ActionBox.vue'

export default defineComponent({
  name: 'ActionBillboard',
  inheritAttrs: false,
  components: {
    ActionBox
  },
  emits: ['ready'],
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    action: {
      type: Object as PropType<BotAction>,
      required: true
    },
    navigationState: {
      type: NavigationState,
      required: true
    },
    currentCard: {
      type: Object as PropType<Card>,
      required: false
    }
  },
  mounted() {
    this.$emit('ready')
  }
})
</script>

<style lang="scss" scoped>
.action {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.billboardMarker {
  font-weight: bold;
  font-size: 2rem;
}
</style>

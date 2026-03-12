<template>
  <ActionBox :instruction-title="t('rules.action.plant.title')" :currentCard="currentCard" :managedByApp="true">
    <template #action>
      <div class="action">
        <AppIcon type="action" name="plant" class="icon"/>: <FlowerIcon v-if="action.flower" :flower="action.flower" class="icon"/>
      </div>
    </template>
    <template #instruction>
      <p v-html="t('rules.action.plant.plant')"/>
      <p v-html="t('rules.action.plant.reducePrice')"/>
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
import AppIcon from '@/components/structure/AppIcon.vue'
import FlowerIcon from '@/components/structure/FlowerIcon.vue'

export default defineComponent({
  name: 'ActionPlant',
  inheritAttrs: false,
  components: {
    ActionBox,
    AppIcon,
    FlowerIcon
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
.icon {
  height: 3rem;
}
</style>

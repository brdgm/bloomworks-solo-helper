<template>
  <ActionBox :instruction-title="t('rules.action.xp.title')" :currentCard="currentCard">
    <template #action>
      <div class="action">
        <AppIcon type="action" name="xp" class="icon"/>
      </div>
    </template>
    <template #instruction>
      <p v-html="t('rules.action.xp.receiveXP')"/>
      <p>
        <span v-html="t('rules.action.xp.priority')"></span><br/>
        <FlowerPriority :flowerOrder="navigationState.marketPrices.flowerOrder"/>
      </p>
      <p class="alert alert-info" v-html="t('rules.action.xp.stars')"></p>
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
import FlowerPriority from '@/components/structure/FlowerPriority.vue'

export default defineComponent({
  name: 'ActionXp',
  inheritAttrs: false,
  components: {
    ActionBox,
    AppIcon,
    FlowerPriority
  },
  emits: {
    ready: () => true
  },
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

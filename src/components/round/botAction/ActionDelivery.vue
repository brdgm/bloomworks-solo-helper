<template>
  <ActionBox :instruction-title="t('rules.action.delivery.title')" :currentCard="currentCard" :vp="action.vp" :xp="action.xp">
    <template #action>
      <div class="action">
        <AppIcon type="action" name="delivery" class="icon"/>:
        <div class="windowSelection">{{floor}}{{floor < 5 ? action.windowSelection?.toUpperCase() : ''}}</div>
      </div>
    </template>
    <template #instruction>
      <p>
        <span v-html="t('rules.action.delivery.selectWindow')"></span><br/>
        <span v-if="floor < 5" class="fw-bold" v-html="t('rules.action.delivery.selectedWindow', {floor,selection:t(`windowSelection.${action.windowSelection}`)})"></span>
        <span v-else class="fw-bold" v-html="t('rules.action.delivery.selectedWindowFloorOnly', {floor})"></span><br/>
        <FlowerIcon v-for="flower in action.flowers ?? []" :key="flower" :flower="flower"/>
      </p>
      <p v-html="t('rules.action.delivery.gainVPandXP', {vp:action.vp})"/>
      <p v-html="t('rules.action.delivery.placeMarker')"/>
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

export default defineComponent({
  name: 'ActionDelivery',
  inheritAttrs: false,
  components: {
    ActionBox,
    AppIcon
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
  computed: {
    floor(): number {
      return this.action.floor ?? 1
    }
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
  height: 5rem;
}
.windowSelection {
  font-weight: bold;
  font-size: 1.5rem;
}
</style>

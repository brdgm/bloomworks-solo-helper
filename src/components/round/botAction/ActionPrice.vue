<template>
  <ActionBox :instruction-title="t('rules.action.price.title')" :currentCard="currentCard" :managedByApp="true">
    <template #action>
      <div class="action">
        <AppIcon type="action" :name="iconName" class="icon"/>
      </div>
      <div class="mt-2 mb-1" v-html="t('rules.action.price.priceIncreased', flowers.length)"></div>
      <FlowerIcon v-for="flower in flowers" :key="flower" :flower="flower"/>
    </template>
    <template #instruction>
      <p v-html="t('rules.action.price.definedWindowInstruction')"/>
      <p v-html="t(`rules.action.price.undefinedWindowInstruction.${action.priceSelection}`)"/>
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
import WindowSelection from '@/services/enum/WindowSelection'

export default defineComponent({
  name: 'ActionPrice',
  inheritAttrs: false,
  components: {
    ActionBox,
    AppIcon,
    FlowerIcon
  },
  emits: ['ready'],
  setup(props) {
    const { t } = useI18n()

    const floor = props.action.floor ?? 1
    const windowSelection = props.action.windowSelection ?? WindowSelection.LEFT
    const flowers = props.action.flowers ?? []

    return { t, floor, windowSelection, flowers }
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
  data() {
    return {
      done: false
    }
  },
  computed: {
    iconName(): string {
      return `price-${this.floor}${this.windowSelection.toLocaleLowerCase()}`
    },
    flowerCount() : number {
      return this.floor
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
  height: 5rem;
}
</style>

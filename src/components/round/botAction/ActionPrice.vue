<template>
  <ActionBox :instruction-title="t('rules.action.price.title')" :currentCard="currentCard" :managedByApp="managedByApp">
    <template #action>
      <div class="action">
        <AppIcon type="action" :name="iconName" class="icon"/>
      </div>
      <div class="mt-3" v-if="managedByApp || done">
        <div class="mb-2" v-html="t('rules.action.price.priceIncreased', selectedFlowers.length)"></div>
        <FlowerIcon v-for="flower in selectedFlowers" :key="flower" :flower="flower"/>
      </div>
      <div v-else class="mt-3" @click.stop>
        <p v-html="t('rules.action.price.selectFlowers')"></p>
        <FlowerSelection v-model="selectedFlowers" :marketPrices="navigationState.marketPrices" :max="flowerCount"/>
        <div v-if="selectedFlowers.length == flowerCount" class="mt-2">
          <button class="btn btn-secondary" @click="windowIsDefined()">{{t('rules.action.price.windowDefined')}}</button>
        </div>
        <div v-if="selectedFlowers.length == 0">
          <div>{{t('rules.action.price.or')}}</div>
          <div class="mt-1">
            <button class="btn btn-secondary" @click="windowIsUndefined()">{{t('rules.action.price.windowUndefined')}}</button>
          </div>
        </div>
      </div>
    </template>
    <template #instruction>
      <p v-html="t('rules.action.price.definedWindowInstruction')"/>
      <p v-html="t(`rules.action.price.undefinedWindowInstruction.${action.priceSelection}`)"/>
    </template>
  </ActionBox>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NavigationState from '@/util/NavigationState'
import Card from '@/services/Card'
import { BotAction } from '@/services/BotActions'
import ActionBox from '../ActionBox.vue'
import AppIcon from '@/components/structure/AppIcon.vue'
import FlowerSelection from '@/components/structure/FlowerSelection.vue'
import getWindowSelectionFloorCount from '@/util/getWindowSelectionFloorCount'
import PriceSelection from '@/services/enum/PriceSelection'
import FlowerIcon from '@/components/structure/FlowerIcon.vue'

export default defineComponent({
  name: 'ActionPrice',
  inheritAttrs: false,
  components: {
    ActionBox,
    AppIcon,
    FlowerSelection,
    FlowerIcon
  },
  emits: {
    ready: (_ready: boolean) => true
  },
  setup(props) {
    const { t } = useI18n()

    // window already defined?
    const definedFlowers = props.action.windowSelection ? props.navigationState.botPersistence.definedWindows.getDefinedWindow(props.action.windowSelection) : undefined
    const selectedFlowers = ref(definedFlowers ?? [])
    const managedByApp = (definedFlowers != undefined)

    return { t, selectedFlowers, managedByApp }
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
      return `price-${this.action.windowSelection?.toLocaleLowerCase()}`
    },
    flowerCount() : number {
      return this.action.windowSelection ? getWindowSelectionFloorCount(this.action.windowSelection) : 0
    }
  },
  methods: {
    windowIsDefined() : void {
      if (this.action.windowSelection) {
        this.navigationState.botPersistence.definedWindows.setDefinedWindow(this.action.windowSelection, this.selectedFlowers)
      }
      this.doIncreasePrices()
    },
    windowIsUndefined() : void {
      if (this.action.priceSelection == PriceSelection.MOST_EXPENSIVE) {
        this.selectedFlowers = [this.navigationState.marketPrices.getMostExpensiveFlower()]
      }
      else {
        this.selectedFlowers = [this.navigationState.marketPrices.getCheapestFlower()]
      }
      this.doIncreasePrices()
    },
    doIncreasePrices() : void {
      for (const flower of this.selectedFlowers) {
        this.navigationState.marketPrices.increase(flower)
      }
      this.done = true
      this.$emit('ready', true)
    }
  },
  mounted() {
    if (this.managedByApp) {
      this.$emit('ready', true)
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
</style>

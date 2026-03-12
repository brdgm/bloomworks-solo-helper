<template>
  <div class="actionItem">
    <component :is="componentName" :action="action" :navigationState="navigationState" :currentCard="currentCard"
        @ready="(ready: boolean) => $emit('ready', ready)"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import NavigationState from '@/util/NavigationState'
import { useI18n } from 'vue-i18n'
import Card from '@/services/Card'
import ActionPlant from './botAction/ActionPlant.vue'
import ActionXp from './botAction/ActionXp.vue'
import ActionBillboard from './botAction/ActionBillboard.vue'
import ActionDelivery from './botAction/ActionDelivery.vue'
import ActionPaid from './botAction/ActionPaid.vue'
import ActionPrice from './botAction/ActionPrice.vue'
import ActionSold from './botAction/ActionSold.vue'
import ActionVp5 from './botAction/ActionVp5.vue'
import ActionWindowBox from './botAction/ActionWindowBox.vue'
import { BotAction } from '@/services/BotActions'

export default defineComponent({
  name: 'BotAction',
  components: {
    ActionBillboard,
    ActionDelivery,
    ActionPaid,
    ActionPlant,
    ActionPrice,
    ActionSold,
    ActionVp5,
    ActionWindowBox,
    ActionXp
  },
  emits: {
    ready: (_ready: boolean) => true
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
    componentName() : string {
      return `action-${this.action.action}`
    }
  }
})
</script>

<style lang="scss" scoped>
.actionItem {
  margin-top: 15px;
  max-width: 38rem;
  padding-right: 10rem;
  @media (max-width: 600px) {
    padding-right: 8rem;
  }
}
</style>

<template>
  <template v-if="floorAction">
    <span class="text-nowrap income" v-if="floorAction.income">${{floorAction.income}}</span>
    <span class="text-nowrap" v-if="floorAction.action">
      <template v-for="action of floorAction.action" :key="action">
        <span v-if="isBillboardAction(action)" class="billboard">M{{floor}}</span>
        <AppIcon v-else type="action" :name="action" class="icon"/>
      </template>
    </span>
  </template>
  <span v-else class="text-muted">-</span>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { FloorAction } from '@/services/SoloBoard'
import Action from '@/services/enum/Action'
import AppIcon from '../structure/AppIcon.vue'

export default defineComponent({
  name: 'SoloBoardOverviewCellContent',
  components: {
    AppIcon
  },
  props: {
    floorAction: {
      type: Object as PropType<FloorAction>,
      required: false
    },
    floor: {
      type: Number,
      required: true
    }
  },
  methods: {
    isBillboardAction(action: Action) : boolean {
      return action === Action.BILLBOARD
    }
  }
})
</script>

<style lang="scss" scoped>
.income {
  color: darkgreen;
  font-weight: bold;
  margin-right: 0.25rem;
}
.icon {
  height: 1rem;
  margin-left: 0.15rem;
}
.billboard {
  font-weight: bold;
  margin-left: 0.15rem;
}
</style>

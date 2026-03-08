<template>
  <span>:</span>
  <span v-if="!(income || actions || burnCardCount)" class="noAction">-</span>
  <span v-if="income"><span class="income">$<span class="value">{{income}}</span></span></span>
  <div class="actions">
    <template v-for="action of actions" :key="action">
      <span v-if="isBillboardAction(action)" class="billboard">{{t('roundTurnPlayer.passInfo.billboard', {floor})}}</span>
      <AppIcon v-else type="action" :name="action" class="icon" :class="{small}"/>
    </template>
  </div>
  <div class="burnCards" v-if="burnCardCount">
    {{ burnCardCount }}✕
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStateStore } from '@/store/state'
import getSoloBoardPassAction from '@/util/getSoloBoardPassAction'
import Action from '@/services/enum/Action'
import AppIcon from '../structure/AppIcon.vue'

export default defineComponent({
  name: 'SoloBoardPassActionInfo',
  components: {
    AppIcon
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    return { t, state }
  },
  props: {
    soloBoardPassAction: {
      type: Object as () => ReturnType<typeof getSoloBoardPassAction>,
      required: true
    },
    small: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    income() : number|undefined {
      return this.soloBoardPassAction.income == 0 ? undefined : this.soloBoardPassAction.income
    },
    actions() : Action[]|undefined {
      return this.soloBoardPassAction.action.length == 0 ? undefined : this.soloBoardPassAction.action
    },
    burnCardCount() : number|undefined {
      return this.soloBoardPassAction.botBurnCardCount == 0 ? undefined : this.soloBoardPassAction.botBurnCardCount
    },
    floor() : number {
      return this.soloBoardPassAction.floor
    }
  },
  methods: {
    isBillboardAction(action : Action) : boolean {
      return action == Action.BILLBOARD
    }
  }
})
</script>

<style lang="scss" scoped>
.income {
  margin-left: 0.25rem;
  color: darkgreen;
  .value {
    font-weight: bold;
  }
}
.actions {
  display: inline-flex;
  margin-left: 0.5rem;
  gap: 0.25rem;
  .icon {
    height: 1.25rem;
    &.small {
      height: 1rem;
    }
  }
  .billboard {
    font-weight: bold;
    color: #000;
  }
}
.burnCards {
  margin-left: 0.25rem;
  color: #000;
}
.noAction {
  margin-left: 0.25rem;
}
</style>

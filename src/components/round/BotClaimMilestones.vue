<template>
  <div class="row" v-for="milestone of milestones" :key="milestone">
    <div class="col alert alert-danger">
      {{t('botClaimMilestones.botClaim')}} <b>{{isFifthFloor(milestone) ? t('botClaimMilestones.fifthFloor') : t(`season.${milestone}`)}}</b>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Milestone from '@/services/enum/Milestone'

export default defineComponent({
  name: 'BotClaimMilestones',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    milestones: {
      type: Array as () => Milestone[],
      required: true
    }
  },
  methods: {
    isFifthFloor(milestone: Milestone) : boolean {
      return milestone === Milestone.FIFTH_FLOOR
    }
  }
})
</script>

<template>
  <table>
    <tbody>
      <tr>
        <th scope="col">
        </th>
        <th scope="col">
          <span>{{t('player.player')}}</span>
        </th>
        <th scope="col">
          <span>{{t('player.bot')}}</span>
        </th>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="scoring-track" class="icon"/>
          <span v-html="t('endOfGameAmounts.vp')"></span>
        </th>
        <td v-for="index in playerCount" :key="index">
          <NumberInput v-model="amount.scoringTrackVP[index-1]"/>
        </td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="prosperity-max" class="icon"/>
          <span v-html="t('endOfGameAmounts.vp')"></span>
        </th>
        <td>
          <NumberInput v-model="amount.prosperityVP[0]" :max="35"/>
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="population-max" class="icon"/>
          <span v-html="t('endOfGameAmounts.vp')"></span>
        </th>
        <td>
          <NumberInput v-model="amount.populationVP[0]" :max="20"/>
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="culture-max" class="icon"/>
          <span v-html="t('endOfGameAmounts.vp')"></span>
        </th>
        <td>
          <NumberInput v-model="amount.cultureVP[0]" :max="20"/>
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="influence" class="icon small"/>
          <span v-html="t('endOfGameAmounts.steps')"></span>
        </th>
        <td>
          <NumberInput v-model="amount.influenceSteps[0]" :max="5"/>
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="politics" class="icon small"/>
          <span v-html="t('endOfGameAmounts.steps')"></span>
        </th>
        <td>
          <NumberInput v-model="amount.politicsSteps[0]" :max="10"/>
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="war" class="icon small"/>
          <span v-html="t('endOfGameAmounts.steps')"></span>
        </th>
        <td v-for="index in playerCount" :key="index">
          <NumberInput v-model="amount.warSteps[index-1]" :max="7"/>
        </td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="wonder" class="icon small"/>
          <span v-html="t('endOfGameAmounts.vp')"></span>
        </th>
        <td>
          <NumberInput v-model="amount.wonderVPs[0]"/>
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="yellow-building" class="icon small"/>
          <span v-html="t('endOfGameAmounts.vp')"></span>
        </th>
        <td>
          <NumberInput v-model="amount.yellowBuildingVPs[0]"/>
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="diplomacy-card" class="icon"/>
          <span v-html="t('endOfGameAmounts.count')"></span>
        </th>
        <td>
          <NumberInput v-model="amount.diplomacyCardCount[0]"/>
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>

  <button class="btn btn-primary btn-lg mt-4" @click="next()">
    {{t('action.next')}}
  </button>

</template>

<script lang="ts">
import { useStateStore, FinalScoringAmount } from '@/store/state'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '../structure/AppIcon.vue'
import { useRouter } from 'vue-router'
import NumberInput from '@brdgm/brdgm-commons/src/components/form/NumberInput.vue'

export default defineComponent({
  name: 'FinalAmounts',
  emits: ['next'],
  components: {
    AppIcon,
    NumberInput
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    const router = useRouter()

    const amount = state.finalScoringAmount ?? 
      {
        scoringTrackVP: [],
        prosperityVP: [],
        populationVP: [],
        cultureVP: [],
        influenceSteps: [],
        politicsSteps: [],
        warSteps: [],
        wonderVPs: [],
        yellowBuildingVPs: [],
        diplomacyCardCount: []
      } as FinalScoringAmount

    const playerCount = 2

    return { t, state, router, amount, playerCount }
  },
  methods: {
    next() : void {
      this.state.finalScoringAmount = this.amount
      this.$emit('next')
    }
  }
})
</script>

<style lang="scss" scoped>
.icon {
  height: 2.5rem;
  margin-right: 0.25rem;
  object-fit: contain;
  &.small {
    width: 2rem;
    height: 2rem;
  }
}
th, td {
  text-align: center;
  padding: 0.5rem;
}
tr:nth-child(even) {
  background-color: #f2f2f2;
}
th {
  white-space: nowrap;
  vertical-align: middle;
}
input {
  width: 5rem;
}
</style>

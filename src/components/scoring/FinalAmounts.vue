<template>
  <table>
    <thead>
      <tr>
        <th scope="col">
          <span v-html="t('endOfGameAmounts.vp.title')"></span>
        </th>
        <th scope="col">
          <span>{{t('player.player')}}</span>
        </th>
        <th scope="col">
          <span>{{t('player.bot')}}</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">
          <span v-html="t('endOfGameAmounts.vp.scoreTrack')"></span>
        </th>
        <td v-for="index in playerCount" :key="index">
          <NumberInput v-model="amount.scoreTrackVP[index-1]"/>
        </td>
      </tr>
      <tr>
        <th scope="row">
          <span v-html="t('endOfGameAmounts.vp.milestones')"></span>
        </th>
        <td v-for="index in playerCount" :key="index">
          <NumberInput v-model="amount.milestonesVP[index-1]"/>
        </td>
      </tr>
    </tbody>
  </table>
  <table>
    <thead>
      <tr>
        <th scope="col">
          <span v-html="t('endOfGameAmounts.billboards.title')"></span> *)
        </th>
        <th scope="col">
          <span>{{t('player.player')}}</span>
        </th>
        <th scope="col">
          <span>{{t('endOfGameAmounts.billboards.wonBy')}}</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="floor of floors" :key="floor">
        <th scope="row">
          <span>{{t('endOfGameAmounts.billboards.score', {floor})}}</span>
        </th>
        <td>
          <NumberInput v-model="amount.playerBillboardVP[floor-1]" :max="18"/>
        </td>
        <td v-for="player in billboardWonSelection" :key="player">
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" :name="`billboardWonFloor${floor}`" v-model="amount.billboardsWon[floor-1]" :value="player">
              {{t(player ? `player.${player}` : 'endOfGameAmounts.billboards.tied')}}
            </label>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <p class="mt-2">
    <b>*) </b>
    <span class=" fst-italic" v-html="t('endOfGameAmounts.billboards.scoreInstructions')"></span>
  </p>
  <table>
    <thead>
      <tr>
        <th scope="col">
          <span v-html="t('endOfGameAmounts.floricultureSteps.title')"></span>
        </th>
        <th scope="col">
          <span>{{t('player.player')}}</span>
        </th>
        <th scope="col">
          <span>{{t('player.bot')}}</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="flower of flowers" :key="flower">
        <th scope="row">
          <FlowerIcon :flower="flower"/>
        </th>
        <td v-for="index in playerCount" :key="index">
          <NumberInput v-model="amount.floricultureSteps[flower][index-1]" :max="getFloricultureTrack(flower).max"/>
        </td>
      </tr>
    </tbody>
  </table>
  <table>
    <thead>
      <tr>
        <th scope="col">
          <span v-html="t('endOfGameAmounts.playerStatus.title')"></span>
        </th>
        <th scope="col">
          <span>{{t('player.player')}}</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">
          <span v-html="t('endOfGameAmounts.playerStatus.gardenExtensionsSmall')"></span>
        </th>
        <td>
          <NumberInput v-model="amount.playerGardenExtensionsSmall" :max="3"/>
        </td>
      </tr>
      <tr>
        <th scope="row">
          <span v-html="t('endOfGameAmounts.playerStatus.gardenExtensionsLarge')"></span>
        </th>
        <td>
          <NumberInput v-model="amount.playerGardenExtensionsLarge" :max="3"/>
        </td>
      </tr>
      <tr>
        <th scope="row">
          <span v-html="t('endOfGameAmounts.playerStatus.sprays')"></span>
        </th>
        <td>
          <NumberInput v-model="amount.playerSprays"/>
        </td>
      </tr>
      <tr>
        <th scope="row">
          <span v-html="t('endOfGameAmounts.playerStatus.leftoverMoney')"></span>
        </th>
        <td>
          <NumberInput v-model="amount.playerLeftoverMoney"/>
        </td>
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
import { useRouter } from 'vue-router'
import NumberInput from '@brdgm/brdgm-commons/src/components/form/NumberInput.vue'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import Flower from '@/services/enum/Flower'
import FlowerIcon from '../structure/FlowerIcon.vue'
import Player from '@/services/enum/Player'
import getFloricultureTrack from '@/util/getFloricultureTracks'

export default defineComponent({
  name: 'FinalAmounts',
  emits: ['next'],
  components: {
    NumberInput,
    FlowerIcon
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    const router = useRouter()

    const amount = state.finalScoringAmount ?? 
      {
        scoreTrackVP: [],
        milestonesVP: [],
        floricultureSteps: Object.fromEntries(
          getAllEnumValues(Flower).map(f => [f, [] as number[]])
        ) as Record<Flower, number[]>,
        playerGardenExtensionsSmall: undefined,
        playerGardenExtensionsLarge: undefined,
        playerBillboardVP: [],
        billboardsWon: [],
        playerSprays: undefined,
        playerLeftoverMoney: undefined
      } as FinalScoringAmount

    const playerCount = 2

    return { t, state, router, amount, playerCount }
  },
  computed: {
    flowers() : Flower[] {
      return getAllEnumValues(Flower)
    },
    billboardWonSelection() : (Player|undefined)[] {
      return [...getAllEnumValues(Player), undefined]
    },
    floors() : number[] {
      return [4, 3, 2, 1]
    }
  },
  methods: {
    next() : void {
      this.state.finalScoringAmount = this.amount
      this.$emit('next')
    },
    getFloricultureTrack
  }
})
</script>

<style lang="scss" scoped>
th, td {
  text-align: center;
  padding: 0.5rem;
}
tbody th {
  font-weight: normal;
  min-width: 10rem;
}
tbody tr:nth-child(odd) {
  background-color: #f2f2f2;
}
th {
  white-space: nowrap;
  vertical-align: middle;
}
input[type=text] {
  width: 5rem;
}
</style>

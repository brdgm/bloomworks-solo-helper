<template>
  <div class="scoring-layout">
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
          </th>
          <td v-for="index in playerCount" :key="index">
            {{toNumber(amount.scoringTrackVP[index-1])}}
          </td>
        </tr>
        <tr>
          <th scope="row">
            <AppIcon type="final-scoring" name="prosperity" class="icon small"/>
          </th>
          <td>
            {{toNumber(amount.prosperityVP[0])}}
          </td>
          <td></td>
        </tr>
        <tr>
          <th scope="row">
            <AppIcon type="final-scoring" name="population" class="icon small"/>
          </th>
          <td>
            {{toNumber(amount.populationVP[0])}}
          </td>
          <td></td>
        </tr>
        <tr>
          <th scope="row">
            <AppIcon type="final-scoring" name="culture" class="icon small"/>
          </th>
          <td>
            {{toNumber(amount.cultureVP[0])}}
          </td>
          <td></td>
        </tr>
        <tr>
          <th scope="row">
            <AppIcon type="final-scoring" name="influence" class="icon small"/>
            <span>X </span>
            <AppIcon type="final-scoring" name="politics" class="icon small"/>
          </th>
          <td>
            {{toNumber(amount.influenceSteps[0]) * toNumber(amount.politicsSteps[0])}}
          </td>
          <td></td>
        </tr>
        <tr>
          <th scope="row">
            <AppIcon type="final-scoring" name="war" class="icon small"/>
            <span>X 2</span>
          </th>
          <td v-for="index in playerCount" :key="index">
            {{toNumber(amount.warSteps[index-1]) * 2}}
          </td>
        </tr>
        <tr>
          <th scope="row">
            <AppIcon type="final-scoring" name="wonder" class="icon small"/>
          </th>
          <td>
            {{toNumber(amount.wonderVPs[0])}}
          </td>
          <td></td>
        </tr>
        <tr>
          <th scope="row">
            <AppIcon type="final-scoring" name="yellow-building" class="icon small"/>
          </th>
          <td>
            {{toNumber(amount.yellowBuildingVPs[0])}}
          </td>
          <td></td>
        </tr>
        <tr>
          <th scope="row">
            <AppIcon type="final-scoring" name="diplomacy-card" class="icon"/>
            <span>X 3</span>
          </th>
          <td>
            {{toNumber(amount.diplomacyCardCount[0]) * 3}}
          </td>
          <td></td>
        </tr>
        <tr>
          <th scope="row">
            <AppIcon type="final-scoring" name="total" class="icon small"/>
          </th>
          <td v-for="index in playerCount" :key="index">
            <b>{{toNumber(totalVP[index-1])}}</b>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="finalResult">
      <p v-html="t('endOfGame.finalScore')"></p>
      <p class="totalVPPlayer">{{t(`endOfGame.vp`, {count:totalVPPlayer})}}</p>
      <p v-html="t('endOfGame.scoreTable')"></p>
      <table class="table">
        <tbody>
          <tr v-for="(vp,index) of starVP" :key="index" :class="{'markScore': index == starVPPlayerIndex}">
            <th scope="row"><span v-for="star of (index+1)" :key="star">★</span></th>
            <td>{{t(`endOfGame.vp`, {count:vp})}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>

<script lang="ts">
import { useStateStore, FinalScoringAmount } from '@/store/state'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '../structure/AppIcon.vue'
import toNumber from '@brdgm/brdgm-commons/src/util/form/toNumber'
import postGameStats from '@brdgm/brdgm-commons/src/util/stats/postGameStats'
import { version } from '@/../package.json'

export default defineComponent({
  name: 'FinalScoring',
  components: {
    AppIcon
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()

    const playerCount = 2

    return { t, state, playerCount }
  },
  props: {
    amount: {
      type: Object as PropType<FinalScoringAmount>,
      required: true
    }
  },
  computed: {
    totalVP() : number[] {
      const result = []
      for (let i=0; i<this.playerCount; i++) {
        result[i] = toNumber(this.amount.scoringTrackVP[i])
            + toNumber(this.amount.prosperityVP[i])
            + toNumber(this.amount.populationVP[i])
            + toNumber(this.amount.cultureVP[i])
            + (toNumber(this.amount.influenceSteps[i]) * toNumber(this.amount.politicsSteps[i]))
            + (toNumber(this.amount.warSteps[i]) * 2)
            + toNumber(this.amount.wonderVPs[i])
            + toNumber(this.amount.yellowBuildingVPs[i])
            + (toNumber(this.amount.diplomacyCardCount[i]) * 3)
      }
      return result
    },
    totalVPPlayer() : number {
      return this.totalVP[0] - this.totalVP[1]
    },
    starVP() : number[] {
      return [150, 175, 200, 225, 250, 275, 300]
    },
    starVPPlayerIndex() : number {
      for (let i=0; i<this.starVP.length; i++) {
        if (this.totalVPPlayer < this.starVP[i]) {
          return i - 1
        }
      }
      return this.starVP.length - 1
    }
  },
  methods: {
    toNumber
  },
  mounted() {
    // send anonymous game stats - max. once per game
    if (!this.state.gameStatsSend) {
      const totalWarSteps_Automa = 0
      const stats = {
        version,
        totalVP: this.totalVPPlayer,
        scoringTrackVP: this.amount.scoringTrackVP[0],
        prosperityVP: this.amount.prosperityVP[0],
        populationVP: this.amount.populationVP[0],
        cultureVP: this.amount.cultureVP[0],
        influenceSteps: this.amount.influenceSteps[0],
        politicsSteps: this.amount.politicsSteps[0],
        warSteps: this.amount.warSteps[0],
        wonderVPs: this.amount.wonderVPs[0],
        yellowBuildingVPs: this.amount.yellowBuildingVPs[0],
        diplomacyCardCount: this.amount.diplomacyCardCount[0],
        scoringTrackVP_Automa: this.amount.scoringTrackVP[1],
        warSteps_Automa: this.amount.warSteps[1],
        totalWarSteps_Automa
      }
      postGameStats(stats,
        import.meta.env.VITE_STATS_FORM_URL,
        import.meta.env.VITE_STATS_FIELD_MAPPING)
      this.state.gameStatsSend = true
    }
  }
})
</script>

<style lang="scss" scoped>
.scoring-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  .finalResult {
    max-width: 500px;
    .totalVPPlayer {
      font-size: 40px;
      text-align: center;
    }
    th {
      color: darkgoldenrod;
    }
    .markScore {
      th, td {
        background-color: #cfc;
      }
    }
  }
}
.icon {
  height: 2.5rem;
  margin-right: 0.25rem;
  object-fit: contain;
  &.small {
    width: 2rem;
    height: 2rem;
  }
}
.table-wrapper {
  overflow-x: auto;
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
</style>

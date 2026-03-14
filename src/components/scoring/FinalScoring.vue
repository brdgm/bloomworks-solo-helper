<template>
  <table>
    <thead>
      <tr>
        <th scope="col">
          <span v-html="t('endOfGame.vp.title')"></span>
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
          <span v-html="t('endOfGame.vp.scoreTrack')"></span>
        </th>
        <td v-for="index in playerCount" :key="index">
          {{toNumber(amount.scoreTrackVP[index-1])}}
        </td>
      </tr>
      <tr>
        <th scope="row">
          <span v-html="t('endOfGame.vp.milestones')"></span>
        </th>
        <td v-for="index in playerCount" :key="index">
          {{toNumber(amount.milestonesVP[index-1])}}
        </td>
      </tr>
      <tr>
        <th scope="row">
          <span v-html="t('endOfGame.vp.billboards')"></span>
        </th>
        <td v-for="index in playerCount" :key="index">
          {{getBillboardVP(index-1)}}
        </td>
      </tr>
      <tr>
        <th scope="row">
          <span v-html="t('endOfGame.vp.floriculture')"></span>
        </th>
        <td v-for="index in playerCount" :key="index">
          {{getFloricultureVP(index-1)}}
        </td>
      </tr>
      <tr>
        <th scope="row">
          <span v-html="t('endOfGame.vp.extensions')"></span>
        </th>
        <td v-for="index in playerCount" :key="index">
          {{getExtensionsVP(index-1)}}
        </td>
      </tr>
      <tr>
        <th scope="row">
          <span v-html="t('endOfGame.vp.leftoverResources')"></span>
        </th>
        <td v-for="index in playerCount" :key="index">
          {{getLeftoverResourcesVP(index-1)}}
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th scope="row">
          <span v-html="t('endOfGame.vp.total')"></span>
        </th>
        <td v-for="index in playerCount" :key="index">
          <b>{{toNumber(totalVP[index-1])}}</b>
        </td>
      </tr>    
    </tfoot>
  </table>
</template>

<script lang="ts">
import { useStateStore, FinalScoringAmount } from '@/store/state'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import toNumber from '@brdgm/brdgm-commons/src/util/form/toNumber'
import postGameStats from '@brdgm/brdgm-commons/src/util/stats/postGameStats'
import { version } from '@/../package.json'
import Player from '@/services/enum/Player'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import Flower from '@/services/enum/Flower'
import getFloricultureTrack from '@/util/getFloricultureTracks'

export default defineComponent({
  name: 'FinalScoring',
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
        result[i] = toNumber(this.amount.scoreTrackVP[i])
            + toNumber(this.amount.milestonesVP[i])
            + this.getBillboardVP(i)
            + this.getFloricultureVP(i)
            + this.getExtensionsVP(i)
            + this.getLeftoverResourcesVP(i)
      }
      return result
    },
    totalVPPlayer() : number {
      return this.totalVP[0] - this.totalVP[1]
    }
  },
  methods: {
    toNumber,
    getBillboardVP(playerIndex: number) : number {
      const player = playerIndex == 0 ? Player.PLAYER : Player.BOT
      let vp = 0
      for (let floor = 1; floor <= 4; floor++) {
        const floorVP = toNumber(this.amount.playerBillboardVP[floor-1])
        if (this.amount.billboardsWon[floor-1] == player) {
          vp += floorVP
        }
      }
      return vp
    },
    getFloricultureVP(playerIndex: number) : number {
      let vp = 0
      for (const flower of getAllEnumValues(Flower)) {
        const steps = toNumber(this.amount.floricultureSteps[flower][playerIndex])
        vp += getFloricultureTrack(flower as Flower).vp
            .filter(v => v.step <= steps)
            .reduce((max, v) => Math.max(max, v.vp), 0)
      }
      return vp
    },
    getExtensionsVP(playerIndex: number) : number {
      let vp = 0
      if (playerIndex == 0) {
        vp += toNumber(this.amount.playerGardenExtensionsSmall) * 1
        vp += toNumber(this.amount.playerGardenExtensionsLarge) * 2
      }
      return vp
    },
    getLeftoverResourcesVP(playerIndex: number) : number {
      let vp = 0
      if (playerIndex == 0) {
        vp += toNumber(this.amount.playerSprays) * 1
        vp += Math.floor(toNumber(this.amount.playerLeftoverMoney) / 5)
      }
      return vp
    }
  },
  mounted() {
    // send anonymous game stats - max. once per game
    /*
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
  */
  }
})
</script>

<style lang="scss" scoped>
.table-wrapper {
  overflow-x: auto;
}
th, td {
  text-align: center;
  padding: 0.5rem;
}
tbody th {
  font-weight: normal;
}
tbody tr:nth-child(odd) {
  background-color: #f2f2f2;
}
th {
  white-space: nowrap;
  vertical-align: middle;
}
tfoot {
  border-top: 1px solid black;
}
</style>

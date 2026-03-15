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
import NavigationState from '@/util/NavigationState'

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
    },
    navigationState: {
      type: NavigationState,
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
    if (!this.state.gameStatsSend) {
      const allTurns = this.state.rounds.flatMap(r => r.turns)
      const stats = {
        version,
        difficultyLevel: -1,
        playerPower: this.state.setup.playerPower ?? 'none',
        playerTotalVP: this.totalVP[0],
        playerScoreTrackVP: toNumber(this.amount.scoreTrackVP[0]),
        playerMilestonesVP: toNumber(this.amount.milestonesVP[0]),
        playerBillboardsVP: this.getBillboardVP(0),
        playerFloricultureVP: this.getFloricultureVP(0),
        playerExtensionsVP: this.getExtensionsVP(0),
        playerLeftoverResourcesVP: this.getLeftoverResourcesVP(0),
        botTotalVP: this.totalVP[1],
        botScoreTrackVP: toNumber(this.amount.scoreTrackVP[1]),
        botMilestonesVP: toNumber(this.amount.milestonesVP[1]),
        botBillboardsVP: this.getBillboardVP(1),
        botFloricultureVP: this.getFloricultureVP(1),
        playerBillboardsWon: this.amount.billboardsWon.filter(p => p == Player.PLAYER).length,
        botBillboardsWon: this.amount.billboardsWon.filter(p => p == Player.BOT).length,
        playerFloricultureSteps: getAllEnumValues(Flower).map(flower => toNumber(this.amount.floricultureSteps[flower][0])).reduce((sum, steps) => sum + steps, 0),
        botFloricultureSteps: getAllEnumValues(Flower).map(flower => toNumber(this.amount.floricultureSteps[flower][1])).reduce((sum, steps) => sum + steps, 0),
        playerExtensionSmall: toNumber(this.amount.playerGardenExtensionsSmall),
        playerExtensionLarge: toNumber(this.amount.playerGardenExtensionsLarge),
        playerTurnsRound1: allTurns.filter(t => t.round == 1 && t.player == Player.PLAYER && !t.playerPass).length,
        playerTurnsRound2: allTurns.filter(t => t.round == 2 && t.player == Player.PLAYER && !t.playerPass).length,
        playerTurnsRound3: allTurns.filter(t => t.round == 3 && t.player == Player.PLAYER && !t.playerPass).length,
        playerTurnsRound4: allTurns.filter(t => t.round == 4 && t.player == Player.PLAYER && !t.playerPass).length,
        playerTurnsRound5: allTurns.filter(t => t.round == 5 && t.player == Player.PLAYER && !t.playerPass).length,
        playerTurnsRound6: allTurns.filter(t => t.round == 6 && t.player == Player.PLAYER && !t.playerPass).length,
        playerTurnsRound7: allTurns.filter(t => t.round == 7 && t.player == Player.PLAYER && !t.playerPass).length,
        playerTurnsRound8: allTurns.filter(t => t.round == 8 && t.player == Player.PLAYER && !t.playerPass).length,
        playerTurnsRound9: allTurns.filter(t => t.round == 9 && t.player == Player.PLAYER && !t.playerPass).length,
        playerTurnsRound10: allTurns.filter(t => t.round == 10 && t.player == Player.PLAYER && !t.playerPass).length,
        playerTurnsRound11: allTurns.filter(t => t.round == 11 && t.player == Player.PLAYER && !t.playerPass).length,
        playerTurnsRound12: allTurns.filter(t => t.round == 12 && t.player == Player.PLAYER && !t.playerPass).length,
        playerTurnsTotal: allTurns.filter(t => t.player == Player.PLAYER && !t.playerPass).length,
        botTurnsTotal: allTurns.filter(t => t.player == Player.BOT && !t.botBonusTurn).length,
        playerDeliveryCount: this.navigationState.botPersistence.windowStates.getTotalDeliveriesByPlayer(Player.PLAYER),
        botDeliveryCount: this.navigationState.botPersistence.windowStates.getTotalDeliveriesByPlayer(Player.BOT),
        marketTotalPrice: this.navigationState.marketPrices.getTotalMarketPrice(),
        botPaidCardVP: allTurns.filter(t => t.player == Player.BOT).reduce((sum, t) => sum + toNumber(t.botPaidCardVP), 0),
        botSoloBoardVP: allTurns.filter(t => t.player == Player.BOT).reduce((sum, t) => sum + toNumber(t.botSoloBoardVP), 0),
        botDeliveryVP: allTurns.filter(t => t.player == Player.BOT).reduce((sum, t) => sum + toNumber(t.botDeliveryVP), 0),
        botFloricultureStarsVP: toNumber(this.amount.scoreTrackVP[1])
            - allTurns.filter(t => t.player == Player.BOT).reduce((sum, t) => sum + toNumber(t.botPaidCardVP) + toNumber(t.botSoloBoardVP) + toNumber(t.botDeliveryVP), 0)
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

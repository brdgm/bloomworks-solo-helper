<template>
  <ModalDialog id="soloBoardOverviewModal" :title="t('soloBoardOverview.title')" :sizeLg="true"  :fullscreenMdDown="true">
    <template #body>
      <table class="table table-bordered table-sm solo-board-table">
        <thead>
          <tr>
            <th>{{t('soloBoardOverview.playerTurns')}}</th>
            <th v-for="turn in turns" :key="turn" class="turnCount">{{turn}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="floorActions in sortedFloorActions" :key="floorActions.floor">
            <td class="fw-bold floor-cell">{{floorActions.floor}}</td>
            <td v-for="turn in turns" :key="turn" class="cell"
                :class="{active: turn === playerTurns && floorActions.floor === playerDeliveryFloor}">
              <CellContent :floorAction="floorActions.floorAction[turn]" :floor="floorActions.floor"/>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bot-card-row">
            <th class="fw-bold">{{t('soloBoardOverview.botCards')}}</th>
            <th v-for="turn in turns" :key="turn">
              {{soloBoard.botCardCount[turn]}}
            </th>
          </tr>
        </tfoot>
      </table>
    </template>
  </ModalDialog>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import ModalDialog from '@brdgm/brdgm-commons/src/components/structure/ModalDialog.vue'
import SoloBoard, { FloorActions } from '@/services/SoloBoard'
import CellContent from './SoloBoardOverviewCellContent.vue'

export default defineComponent({
  name: 'SoloBoardOverviewModal',
  components: {
    ModalDialog,
    CellContent
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    soloBoard: {
      type: Object as PropType<SoloBoard>,
      required: true
    },
    playerTurns: {
      type: Number,
      required: true
    },
    playerDeliveryFloor: {
      type: Number,
      required: true
    }
  },
  computed: {
    turns() : number[] {
      return [0, 1, 2, 3, 4, 5]
    },
    sortedFloorActions() : FloorActions[] {
      return [...this.soloBoard.floorActions].sort((a, b) => b.floor - a.floor)
    }
  }
})
</script>

<style lang="scss" scoped>
.solo-board-table {
  font-size: 0.85rem;
  th, td {
    border-color: #000;
    text-align: center;
  }
  thead th {
    background-color: #e7c5de;
    &:first-child {
      background-color: #ce82b7;
    }
  }
  tfoot th {
    background-color: #d4eace;
    &:first-child {
      background-color: #abd8aa;
    }
  }
  th, td {
    vertical-align: middle;
    height: 3rem;
  }
  .floor-cell {
    background-color: #f0f0f0;
    width: 3rem;
  }
  .cell {
    vertical-align: middle;
  }
  .active {
    background-color: #fff3cd;
    font-weight: bold;
  }
  .bot-card-row td {
    background-color: #f8f9fa;
  }
  .turnCount {
    width: 15%;
  }
}
</style>

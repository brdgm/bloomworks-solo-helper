<template>
  <h3 class="mt-4 mb-3">{{t('setup.milestoneSeasonOrder.title')}}</h3>
  <div v-html="t('setup.milestoneSeasonOrder.description')"></div>
  <ul>
    <li v-for="season in seasonOrder" :key="season">{{t(`season.${season}`)}}</li>
  </ul>
  <button class="btn btn-outline-secondary btn-sm" @click="randomize()">
    {{t('setup.milestoneSeasonOrder.randomize')}}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStateStore } from '@/store/state'
import Season from '@/services/enum/Season'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import randomEnum from '@brdgm/brdgm-commons/src/util/random/randomEnum'
import randomEnumDifferentValue from '@brdgm/brdgm-commons/src/util/random/randomEnumDifferentValue'

export default defineComponent({
  name: 'MilestoneSeasonOrder',
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    if (!state.setup.milestoneSeasonOrder) {
      state.setup.milestoneSeasonOrder = buildSeasonOrder(randomEnum(Season))
    }
    return { t, state }
  },
  computed: {
    seasonOrder() : Season[] {
      return this.state.setup.milestoneSeasonOrder ?? []
    }
  },
  methods: {
    randomize() : void {
      const currentFirst = this.seasonOrder[0]
      const newFirst = randomEnumDifferentValue(Season, currentFirst)
      this.state.setup.milestoneSeasonOrder = buildSeasonOrder(newFirst)
    }
  }
})

function buildSeasonOrder(startSeason : Season) : Season[] {
  const allSeasons = getAllEnumValues(Season)
  const startIndex = allSeasons.indexOf(startSeason)
  return [...allSeasons.slice(startIndex), ...allSeasons.slice(0, startIndex)]
}
</script>

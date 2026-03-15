import BotGarden from '@/services/BotGarden'
import Flower from '@/services/enum/Flower'
import Season from '@/services/enum/Season'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'

export default function mockBotGarden(params?: BotGardenParams) : BotGarden {
  const seasons = getAllEnumValues(Season).map(season => {
    const item = params?.seasons?.find(p => p.season === season)
    return {
      season,
      flowers: item?.flowers ?? [],
      bigExtension: item?.bigExtension ?? 0,
      smallExtensions: item?.smallExtensions ?? 0
    }
  })
  return BotGarden.fromPersistence(seasons, params?.flowerOrder ?? getAllEnumValues(Flower))
}

export interface BotGardenParams {
  seasons?: GardenSeasonParams[]
  flowerOrder?: Flower[]
}

export interface GardenSeasonParams {
  season?: Season
  flowers?: Flower[]
  bigExtension?: number
  smallExtensions?: number
}

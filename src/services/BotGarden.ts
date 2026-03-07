import { cloneDeep, shuffle } from 'lodash'
import { GardenSeason } from '@/store/state'
import { ref } from 'vue'
import Flower from './enum/Flower'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import Season from './enum/Season'

/**
 * Manages Lady Pei's garden.
 */
export default class BotGarden {

  private readonly _seasons
  private readonly _flowerOrder: Flower[]

  private constructor(seasons : GardenSeason[], flowerOrder: Flower[]) {
    this._seasons = ref(seasons)
    this._flowerOrder = flowerOrder
  }

  public get seasons() : readonly GardenSeason[] {
    return this._seasons.value
  }

  /**
   * Plants the given flower.
   * @param flower Flower to plan
   */
  public plant(flower: Flower) : void {

  }

  /**
   * Gets persistence view of garden seasons.
   */
  public toPersistence() : GardenSeason[] {
    return cloneDeep(this._seasons.value)
  }

  /**
   * Initialize Lady Pei's garden based on the player's selected flowers.
   * Take two flowers from each family not in the player's garden, one from each family that is.
   * Randomly assign one flower per season.
   * @param playerFlowers Flowers the player has in their garden
   * @param flowerOrder The order of flowers in the market (for Lady Pei's color priority)
   * @returns BotGarden
   */
  public static new(playerFlowers : Flower[], flowerOrder: Flower[]) : BotGarden {
    const allFlowers = getAllEnumValues(Flower)
    const pool : Flower[] = []
    for (const flower of allFlowers) {
      if (playerFlowers.includes(flower)) {
        pool.push(flower)
      }
      else {
        pool.push(flower, flower)
      }
    }
    const shuffled = shuffle(pool)
    const allSeasons = getAllEnumValues(Season)
    const seasons : GardenSeason[] = allSeasons.map((season, index) => ({
      season,
      flowers: [shuffled[index]],
      bigExtension: 0,
      smallExtensions: 0
    }))
    return new BotGarden(seasons, flowerOrder)
  }

  /**
   * Re-creates garden seasons from persistence.
   * Note that flower order must also be passed in, as it is not stored in the garden persistence (but rather market prices persistence).
   */
  public static fromPersistence(persistence : GardenSeason[], flowerOrder: Flower[]) : BotGarden {
    return new BotGarden(cloneDeep(persistence), flowerOrder)
  }

}

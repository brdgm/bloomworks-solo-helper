import { cloneDeep, shuffle } from 'lodash'
import { GardenSeason } from '@/store/state'
import { ref } from 'vue'
import Flower from './enum/Flower'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import Season from './enum/Season'
import getNextSeason from '@/util/getNextSeason'

/**
 * Manages Lady Pei's garden.
 */
export default class BotGarden {

  // Base garden holds 2 flowers per season
  static readonly BASE_CAPACITY = 2
  // Big extension adds 3 flower slots; max 1 per season, 3 total
  static readonly BIG_EXTENSION_CAPACITY = 3
  static readonly MAX_BIG_EXTENSIONS_PER_SEASON = 1
  static readonly MAX_TOTAL_BIG_EXTENSIONS = 3
  // Small extension adds 2 flower slots each; max 2 per season, 3 total; requires big extension
  static readonly SMALL_EXTENSION_CAPACITY = 2
  static readonly MAX_SMALL_EXTENSIONS_PER_SEASON = 2
  static readonly MAX_TOTAL_SMALL_EXTENSIONS = 3

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
   * Plants the given flower in Lady Pei's garden.
   * Chooses the first empty space beginning with the next season and continuing clockwise.
   * If every space is full, adds an extension (big first, then small) to the next eligible season.
   * @param flower Flower to plant
   * @param currentSeason The current season
   * @returns true if the flower was planted, false if the garden is full
   */
  public plant(flower: Flower, currentSeason: Season) : boolean {
    // Try to find an existing empty space, starting from next season clockwise
    let season = getNextSeason(currentSeason)
    for (let i = 0; i < 4; i++) {
      const gs = this.getGardenSeason(season)
      if (gs.flowers.length < BotGarden.getSeasonCapacity(gs)) {
        gs.flowers.push(flower)
        this.sortFlowers(gs)
        return true
      }
      season = getNextSeason(season)
    }

    // No empty space — add an extension and place the flower
    season = getNextSeason(currentSeason)
    for (let i = 0; i < 4; i++) {
      const gs = this.getGardenSeason(season)
      if (this.canAddBigExtension(gs)) {
        gs.bigExtension++
        gs.flowers.push(flower)
        this.sortFlowers(gs)
        return true
      }
      if (this.canAddSmallExtension(gs)) {
        gs.smallExtensions++
        gs.flowers.push(flower)
        this.sortFlowers(gs)
        return true
      }
      season = getNextSeason(season)
    }

    return false
  }

  /**
   * Gets the total flower capacity for a garden season (base + extensions).
   */
  static getSeasonCapacity(gardenSeason: GardenSeason) : number {
    return BotGarden.BASE_CAPACITY
      + gardenSeason.bigExtension * BotGarden.BIG_EXTENSION_CAPACITY
      + gardenSeason.smallExtensions * BotGarden.SMALL_EXTENSION_CAPACITY
  }

  private getGardenSeason(season: Season) : GardenSeason {
    const gs = this._seasons.value.find(s => s.season === season)
    if (!gs) {
      throw new Error(`Season ${season} not found in garden.`)
    }
    return gs
  }

  private get totalBigExtensions() : number {
    return this._seasons.value.reduce((sum, s) => sum + s.bigExtension, 0)
  }

  private get totalSmallExtensions() : number {
    return this._seasons.value.reduce((sum, s) => sum + s.smallExtensions, 0)
  }

  private canAddBigExtension(gardenSeason: GardenSeason) : boolean {
    return gardenSeason.bigExtension < BotGarden.MAX_BIG_EXTENSIONS_PER_SEASON
      && this.totalBigExtensions < BotGarden.MAX_TOTAL_BIG_EXTENSIONS
  }

  private canAddSmallExtension(gardenSeason: GardenSeason) : boolean {
    return gardenSeason.bigExtension > 0
      && gardenSeason.smallExtensions < BotGarden.MAX_SMALL_EXTENSIONS_PER_SEASON
      && this.totalSmallExtensions < BotGarden.MAX_TOTAL_SMALL_EXTENSIONS
  }

  private sortFlowers(gardenSeason: GardenSeason) : void {
    gardenSeason.flowers.sort((a, b) => this._flowerOrder.indexOf(a) - this._flowerOrder.indexOf(b))
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

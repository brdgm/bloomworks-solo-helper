import BotGarden from '@/services/BotGarden'
import Flower from '@/services/enum/Flower'
import Season from '@/services/enum/Season'
import { GardenSeason } from '@/store/state'
import { expect } from 'chai'
import mockBotGarden from '../helper/mockBotGarden'

function findSeason(garden: BotGarden, season: Season) : GardenSeason {
  return garden.seasons.find(s => s.season === season)!
}

describe('services/BotGarden', () => {

  describe('getSeasonCapacity', () => {
    it('base only', () => {
      expect(BotGarden.getSeasonCapacity({ season: Season.SPRING, flowers: [], bigExtension: 0, smallExtensions: 0 }))
        .to.eq(2)
    })

    it('with big extension', () => {
      expect(BotGarden.getSeasonCapacity({ season: Season.SPRING, flowers: [], bigExtension: 1, smallExtensions: 0 }))
        .to.eq(5)
    })

    it('with big and one small extension', () => {
      expect(BotGarden.getSeasonCapacity({ season: Season.SPRING, flowers: [], bigExtension: 1, smallExtensions: 1 }))
        .to.eq(7)
    })

    it('with big and two small extensions', () => {
      expect(BotGarden.getSeasonCapacity({ season: Season.SPRING, flowers: [], bigExtension: 1, smallExtensions: 2 }))
        .to.eq(9)
    })
  })

  describe('plant', () => {
    it('plants in next season when empty', () => {
      const garden = mockBotGarden()

      garden.plant(Flower.RED, Season.SPRING)

      expect(findSeason(garden, Season.SUMMER).flowers).to.eql([Flower.RED])
    })

    it('skips full seasons and plants in next available', () => {
      const garden = mockBotGarden({ seasons: [
        { season: Season.SUMMER, flowers: [Flower.RED, Flower.BLUE] },
      ] })

      garden.plant(Flower.YELLOW, Season.SPRING)

      expect(findSeason(garden, Season.SUMMER).flowers).to.have.length(2)
      expect(findSeason(garden, Season.AUTUMN).flowers).to.eql([Flower.YELLOW])
    })

    it('wraps around to earlier seasons', () => {
      const garden = mockBotGarden({ seasons: [
        { season: Season.SUMMER, flowers: [Flower.RED, Flower.BLUE] },
        { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE] },
        { season: Season.WINTER, flowers: [Flower.RED, Flower.BLUE] },
      ] })

      garden.plant(Flower.YELLOW, Season.SPRING)

      expect(findSeason(garden, Season.SPRING).flowers).to.eql([Flower.YELLOW])
    })

    it('plants multiple flowers sequentially', () => {
      const garden = mockBotGarden({ seasons: [
        { season: Season.SPRING, flowers: [Flower.RED] },
        { season: Season.SUMMER, flowers: [Flower.BLUE] },
        { season: Season.AUTUMN, flowers: [Flower.PURPLE] },
        { season: Season.WINTER, flowers: [Flower.ORANGE] },
      ] })

      garden.plant(Flower.YELLOW, Season.SPRING)
      garden.plant(Flower.RED, Season.SPRING)

      // First goes to SUMMER (next after SPRING, has 1 flower < 2 capacity)
      expect(findSeason(garden, Season.SUMMER).flowers).to.eql([Flower.YELLOW, Flower.BLUE])
      // Second goes to AUTUMN (SUMMER now full)
      expect(findSeason(garden, Season.AUTUMN).flowers).to.eql([Flower.RED, Flower.PURPLE])
    })

    it('adds big extension when all base spaces full', () => {
      const garden = mockBotGarden({ seasons: [
        { season: Season.SPRING, flowers: [Flower.RED, Flower.BLUE] },
        { season: Season.SUMMER, flowers: [Flower.RED, Flower.BLUE] },
        { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE] },
        { season: Season.WINTER, flowers: [Flower.RED, Flower.BLUE] },
      ] })

      garden.plant(Flower.YELLOW, Season.SPRING)

      const summer = findSeason(garden, Season.SUMMER)
      expect(summer.bigExtension).to.eq(1)
      expect(summer.flowers).to.eql([Flower.RED, Flower.YELLOW, Flower.BLUE])
    })

    it('adds big extension to next eligible season when first already has one', () => {
      const garden = mockBotGarden({ seasons: [
        { season: Season.SPRING, flowers: [Flower.RED, Flower.BLUE] },
        { season: Season.SUMMER, flowers: new Array(9).fill(Flower.RED), bigExtension: 1, smallExtensions: 2 },
        { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE] },
        { season: Season.WINTER, flowers: [Flower.RED, Flower.BLUE] },
      ] })

      garden.plant(Flower.YELLOW, Season.SPRING)

      // SUMMER is fully extended and full, so big extension goes to AUTUMN
      const autumn = findSeason(garden, Season.AUTUMN)
      expect(autumn.bigExtension).to.eq(1)
      expect(autumn.flowers).to.eql([Flower.RED, Flower.YELLOW, Flower.BLUE])
    })

    it('respects max 3 total big extensions', () => {
      const garden = mockBotGarden({ seasons: [
        { season: Season.SPRING, flowers: [Flower.RED, Flower.BLUE, Flower.RED, Flower.BLUE, Flower.RED], bigExtension: 1 },
        { season: Season.SUMMER, flowers: [Flower.RED, Flower.BLUE, Flower.RED, Flower.BLUE, Flower.RED], bigExtension: 1 },
        { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE, Flower.RED, Flower.BLUE, Flower.RED], bigExtension: 1 },
        { season: Season.WINTER, flowers: [Flower.RED] },
      ] })

      // WINTER has base space available — no new big extension needed
      garden.plant(Flower.YELLOW, Season.AUTUMN)

      expect(findSeason(garden, Season.WINTER).flowers).to.eql([Flower.RED, Flower.YELLOW])
      expect(findSeason(garden, Season.WINTER).bigExtension).to.eq(0)
    })

    it('uses existing big extension space before adding new extension', () => {
      const garden = mockBotGarden({ seasons: [
        { season: Season.SPRING, flowers: [Flower.RED, Flower.BLUE] },
        { season: Season.SUMMER, flowers: [Flower.RED, Flower.BLUE, Flower.PURPLE], bigExtension: 1 },
        { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE] },
        { season: Season.WINTER, flowers: [Flower.RED, Flower.BLUE] },
      ] })

      garden.plant(Flower.YELLOW, Season.SPRING)

      // SUMMER has big extension with 3/5 flowers — still has room
      const summer = findSeason(garden, Season.SUMMER)
      expect(summer.flowers).to.eql([Flower.RED, Flower.PURPLE, Flower.YELLOW, Flower.BLUE])
      expect(summer.bigExtension).to.eq(1)
    })

    it('adds small extension when big extensions exhausted', () => {
      const garden = mockBotGarden({ seasons: [
        { season: Season.SPRING, flowers: [Flower.RED, Flower.BLUE, Flower.RED, Flower.BLUE, Flower.RED], bigExtension: 1 },
        { season: Season.SUMMER, flowers: [Flower.RED, Flower.BLUE, Flower.RED, Flower.BLUE, Flower.RED], bigExtension: 1 },
        { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE, Flower.RED, Flower.BLUE, Flower.RED], bigExtension: 1 },
        { season: Season.WINTER, flowers: [Flower.RED] },
      ] })

      // Fill WINTER base
      garden.plant(Flower.YELLOW, Season.AUTUMN)  // goes to WINTER (base space)
      // Now all base + big extension spaces full, 3 big extensions used
      // WINTER can't get big (3 total) or small (no big). Next is SPRING which has big → gets small.
      garden.plant(Flower.PURPLE, Season.AUTUMN)

      const spring = findSeason(garden, Season.SPRING)
      expect(spring.smallExtensions).to.eq(1)
      expect(spring.flowers).to.have.length(6)
    })

    it('small extension requires big extension on same season', () => {
      const garden = mockBotGarden({ seasons: [
        { season: Season.SPRING, flowers: [Flower.RED, Flower.BLUE] },
        { season: Season.SUMMER, flowers: [Flower.RED, Flower.BLUE, Flower.RED, Flower.BLUE, Flower.RED], bigExtension: 1 },
        { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE, Flower.RED, Flower.BLUE, Flower.RED], bigExtension: 1 },
        { season: Season.WINTER, flowers: [Flower.RED, Flower.BLUE, Flower.RED, Flower.BLUE, Flower.RED], bigExtension: 1 },
      ] })

      // All big ext slots full. SPRING (no big ext) can't get small ext.
      // From WINTER: next is SPRING (full base, no big ext → skip big [max total], skip small [no big]),
      // then SUMMER (full 5/5 → needs ext, can't add big [max total], can add small [has big])
      garden.plant(Flower.ORANGE, Season.WINTER)

      expect(findSeason(garden, Season.SPRING).smallExtensions).to.eq(0)
      expect(findSeason(garden, Season.SUMMER).smallExtensions).to.eq(1)
      expect(findSeason(garden, Season.SUMMER).flowers).to.have.length(6)
    })

    it('max 2 small extensions per season', () => {
      const garden = mockBotGarden({ seasons: [
        { season: Season.SPRING, flowers: [Flower.RED, Flower.BLUE, Flower.RED, Flower.BLUE, Flower.RED, Flower.BLUE, Flower.RED, Flower.BLUE, Flower.RED], bigExtension: 1, smallExtensions: 2 },
        { season: Season.SUMMER, flowers: [Flower.RED, Flower.BLUE, Flower.RED, Flower.BLUE, Flower.RED], bigExtension: 1 },
        { season: Season.AUTUMN, flowers: [Flower.RED, Flower.BLUE, Flower.RED, Flower.BLUE, Flower.RED], bigExtension: 1 },
        { season: Season.WINTER, flowers: [Flower.RED, Flower.BLUE] },
      ] })

      // SPRING is 9/9 (base 2 + big 3 + 2 small * 2 = 9), can't add more small
      // From WINTER: next is SPRING (full, max small), SUMMER (full 5/5, add small)
      garden.plant(Flower.ORANGE, Season.WINTER)

      expect(findSeason(garden, Season.SPRING).smallExtensions).to.eq(2)
      expect(findSeason(garden, Season.SUMMER).smallExtensions).to.eq(1)
      expect(findSeason(garden, Season.SUMMER).flowers).to.have.length(6)
    })

    it('returns false when no space available at all', () => {
      // Max capacity: 4 seasons * 9 = 36 flowers
      // But only 3 big ext and 3 small ext available
      // Max = 3 seasons * (2+3+4) + 1 season * 2 = 3*9 + 2 = 29
      const garden = mockBotGarden({ seasons: [
        { season: Season.SPRING, flowers: new Array(9).fill(Flower.RED), bigExtension: 1, smallExtensions: 2 },
        { season: Season.SUMMER, flowers: new Array(7).fill(Flower.RED), bigExtension: 1, smallExtensions: 1 },
        { season: Season.AUTUMN, flowers: new Array(5).fill(Flower.RED), bigExtension: 1 },
        { season: Season.WINTER, flowers: [Flower.RED, Flower.RED] },
      ] })

      expect(garden.plant(Flower.YELLOW, Season.SPRING)).to.eq(false)
    })
  })
})

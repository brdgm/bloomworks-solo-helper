import Flower from '@/services/enum/Flower'
import getFloricultureTracks from '@/util/getFloricultureTracks'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import { expect } from 'chai'

describe('util/getFloricultureTracks', () => {
  it('has an entry for each Flower enum value', () => {
    const flowers = getAllEnumValues(Flower)
    for (const flower of flowers) {
      expect(() => getFloricultureTracks(flower), `entry for ${flower}`).to.not.throw()
    }
  })
})

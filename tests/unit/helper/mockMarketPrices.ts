import Flower from '@/services/enum/Flower'
import { FlowerPrice } from '@/store/state'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'

export default function mockMarketPrices(params?: FlowerPrice[]) : FlowerPrice[] {
  return getAllEnumValues(Flower).map(flower => {
    return {
      flower,
      price: params?.find(p => p.flower === flower)?.price ?? 4
    }
  })
}

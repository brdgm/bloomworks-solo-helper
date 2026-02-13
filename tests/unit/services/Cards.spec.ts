import Cards from '@/services/Cards'
import CardType from '@/services/enum/CardType'
import { expect } from 'chai'

describe('services/Cards', () => {
  it('get', () => {
    const card = Cards.get('delivery-1')

    expect(card).not.undefined
    expect(card?.id).to.eq('delivery-1')
  })

  it('getAll', () => {
    expect(Cards.getAll(CardType.STANDARD).length).to.eq(18)
    expect(Cards.getAll(CardType.ADVANCED).length).to.eq(2)
  })
})

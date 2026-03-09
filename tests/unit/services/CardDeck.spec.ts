import CardDeck from '@/services/CardDeck'
import { expect } from 'chai'

describe('services/CardDeck', () => {
  it('new', () => {
    const deck = CardDeck.new()

    expect(deck.currentCard, 'currentCard').to.undefined
    expect(deck.pile.length, 'pile').to.eq(18)
    expect(deck.discard.length, 'discard').to.eq(0)

    const persistence = deck.toPersistence()
    expect(persistence.pile.length, 'pile').to.eq(18)
    expect(persistence.discard.length, 'discard').to.eq(0)
  })

  it('draw', () => {
    const deck = CardDeck.fromPersistence({pile:['window-box-1','delivery-1','price-1'],discard:['plant-1']})

    deck.draw()
    expect(deck.currentCard?.id).to.eq('window-box-1')
    expect(deck.discard.map(card => card.id)).to.eql(['window-box-1', 'plant-1'])
    expect(deck.pile.length).to.eq(2)

    deck.draw()
    expect(deck.currentCard?.id).to.eq('delivery-1')
    expect(deck.discard.map(card => card.id)).to.eql(['delivery-1', 'window-box-1', 'plant-1'])
    expect(deck.pile.length).to.eq(1)

    deck.draw()
    expect(deck.currentCard?.id).to.eq('price-1')
    expect(deck.discard.map(card => card.id)).to.eql(['price-1', 'delivery-1', 'window-box-1', 'plant-1'])
    expect(deck.pile.length).to.eq(0)
  
    deck.draw()
    // two advanced cards added to pile together with shuffled discard
    expect(deck.discard.length).to.eq(1)
    expect(deck.pile.length).to.eq(5)
  })

})

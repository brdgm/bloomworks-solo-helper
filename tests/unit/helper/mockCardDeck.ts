import CardDeck from '@/services/CardDeck'

export default function mockCardDeck(params?: MockCardDeckParams) : CardDeck {  
  return CardDeck.fromPersistence({
    pile: params?.pile ?? [],
    played: params?.played ?? [],
    discard: params?.discard ?? []
  })
}

export interface MockCardDeckParams {
  pile?: string[]
  played?: string[]
  discard?: string[]
}

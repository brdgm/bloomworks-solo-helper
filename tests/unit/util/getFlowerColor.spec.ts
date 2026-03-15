import Flower from '@/services/enum/Flower'
import getFlowerColor from '@/util/getFlowerColor'
import { expect } from 'chai'

describe('util/getFlowerColor', () => {
  it('RED', () => {
    expect(getFlowerColor(Flower.RED)).to.eq('#e63946')
  })

  it('PURPLE', () => {
    expect(getFlowerColor(Flower.PURPLE)).to.eq('#7b2d8e')
  })

  it('YELLOW', () => {
    expect(getFlowerColor(Flower.YELLOW)).to.eq('#f4d03f')
  })

  it('BLUE', () => {
    expect(getFlowerColor(Flower.BLUE)).to.eq('#2a7de1')
  })

  it('ORANGE', () => {
    expect(getFlowerColor(Flower.ORANGE)).to.eq('#e67e22')
  })
})

import Flower from '@/services/enum/Flower'

/**
 * Maps a Flower enum value to its hex color.
 */
export default function getFlowerColor(flower: Flower) : string {
  switch (flower) {
    case Flower.RED:
      return '#e63946'
    case Flower.PURPLE:
      return '#7b2d8e'
    case Flower.YELLOW:
      return '#f4d03f'
    case Flower.BLUE:
      return '#2a7de1'
    case Flower.ORANGE:
      return '#e67e22'
  }
}

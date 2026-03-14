import Flower from '@/services/enum/Flower'

/**
 * Get floriculture tracks with VP thresholds.
 */
export default function getFloricultureTrack(flower: Flower) : FloricultureTrack {
  const track = TRACKS.find(t => t.flower === flower)
  if (!track) {
    throw new Error(`Floriculture track not found for flower ${flower}`)
  }
  return track
}

export interface FloricultureTrack {
  flower: Flower
  max: number
  vp: FloricultureVP[]
}

export interface FloricultureVP {
  step: number
  vp: number
}

const TRACKS : FloricultureTrack[] = [
  { flower: Flower.ORANGE, max: 15, vp: [
    { step: 6, vp: 6 },
    { step: 10, vp: 10 },
    { step: 12, vp: 13 },
    { step: 15, vp: 16 },
  ] },
  { flower: Flower.BLUE, max: 14, vp: [
    { step: 5, vp: 6 },
    { step: 8, vp: 10 },
    { step: 11, vp: 13 },
    { step: 14, vp: 16 },
  ] },
  { flower: Flower.YELLOW, max: 13, vp: [
    { step: 5, vp: 6 },
    { step: 8, vp: 10 },
    { step: 10, vp: 13 },
    { step: 13, vp: 16 },
  ] },
  { flower: Flower.PURPLE, max: 12, vp: [
    { step: 4, vp: 6 },
    { step: 7, vp: 10 },
    { step: 10, vp: 13 },
    { step: 12, vp: 16 },
  ] },
  { flower: Flower.RED, max: 11, vp: [
    { step: 4, vp: 6 },
    { step: 7, vp: 10 },
    { step: 9, vp: 13 },
    { step: 11, vp: 16 },
  ] }
]

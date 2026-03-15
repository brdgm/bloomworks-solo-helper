import PlayerColor from '@/services/enum/PlayerColor'

export default function getPlayerColorCode(playerColor: PlayerColor) : string {
  switch (playerColor) {
    case PlayerColor.WHITE:
      return '#e6e7e8'
    case PlayerColor.LIGHT_BLUE:
      return '#7ec8e3'
    case PlayerColor.MEDIUM_BLUE:
      return '#3a7ca5'
    case PlayerColor.DARK_BLUE:
      return '#1a3a5c'
    default:
      throw new Error(`Invalid player color: ${playerColor}.`)
  }
}

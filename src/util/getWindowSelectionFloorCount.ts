import WindowSelection from '@/services/enum/WindowSelection'

/**
 * Returns the floor number (1, 2 or 3) that the given window selection targets.
 */
export default function getWindowSelectionFloorCount(windowSelection: WindowSelection) : number {
  switch (windowSelection) {
    case WindowSelection.WINDOW_1L:
    case WindowSelection.WINDOW_1R:
      return 1
    case WindowSelection.WINDOW_2L:
    case WindowSelection.WINDOW_2R:
      return 2
    case WindowSelection.WINDOW_3L:
    case WindowSelection.WINDOW_3R:
      return 3
  }
}

import { Point, screen, Size } from 'electron';
import { WindowPosition } from '_main/enums';

function calculateX(position: WindowPosition, windowWidth: number) {
  let x = 0;
  const { width } = screen.getPrimaryDisplay().workAreaSize;

  switch (position) {
    case WindowPosition.BottomRight:
    case WindowPosition.Right:
    case WindowPosition.RightLowerThird:
    case WindowPosition.RightUpperThird:
    case WindowPosition.TopRight:
      x = width - windowWidth;
      break;
    case WindowPosition.Bottom:
    case WindowPosition.Center:
    case WindowPosition.Top:
      x = width / 2 - windowWidth / 2;
      break;
    default:
      break;
  }

  return Math.round(x);
}

function calculateY(position: WindowPosition, windowHeight: number) {
  let y = 0;
  const { height } = screen.getPrimaryDisplay().workAreaSize;

  switch (position) {
    case WindowPosition.Bottom:
    case WindowPosition.BottomLeft:
    case WindowPosition.BottomRight:
      y = height - windowHeight;
      break;
    case WindowPosition.Center:
    case WindowPosition.Left:
    case WindowPosition.Right:
      y = height / 2 - windowHeight / 2;
      break;
    case WindowPosition.LeftLowerThird:
    case WindowPosition.RightLowerThird:
      y = (height * 2) / 3 - windowHeight / 2;
      break;
    case WindowPosition.LeftUpperThird:
    case WindowPosition.RightUpperThird:
      y = height / 3 - windowHeight / 2;
      break;
    default:
      break;
  }

  return Math.round(y);
}

export function positionToCoords(size: Size, position: WindowPosition): Point {
  return {
    x: calculateX(position, size.width),
    y: calculateY(position, size.height),
  };
}

import {
  Coords,
  Dims,
  getElementCoords,
  getElementDims,
  isDefaultScrollingElement,
  isWithinAt,
} from './dom';
import { addAppropriateOffset, getCurrentScrollOffset } from './offset';

export function getViewportHeight(root: Element): number {
  return root.clientHeight;
}

export function getViewportWidth(root: Element): number {
  return root.clientWidth;
}

export function getViewportDims(root: Element): Dims {
  return {
    width: getViewportWidth(root),
    height: getViewportHeight(root),
  };
}

export function getViewportScrollHeight(root: Element): number {
  return root.scrollHeight;
}

export function getViewportScrollWidth(root: Element): number {
  return root.scrollWidth;
}

export function getViewportScrollDims(root: Element): Dims {
  return {
    width: getViewportScrollWidth(root),
    height: getViewportScrollHeight(root),
  };
}

export function getViewportStart(root: Element): Coords {
  if (isDefaultScrollingElement(root)) {
    return {
      x: 0,
      y: 0,
    };
  } else {
    return getElementCoords(root);
  }
}

export function getViewportEnd(root: Element): Coords {
  const startCoords: Coords = getViewportStart(root);
  return {
    x: startCoords.x + getViewportWidth(root),
    y: startCoords.y + getViewportHeight(root),
  };
}

export function getViewportScrollStart(root: Element): Coords {
  const curScrollOffset: Coords = getCurrentScrollOffset(root);
  const start: Coords = getViewportStart(root);

  return {
    x: start.x - curScrollOffset.x,
    y: start.y - curScrollOffset.y,
  };
}

export function getViewportScrollEnd(root: Element): Coords {
  const startCoords: Coords = getViewportScrollStart(root);
  const { width, height } = getViewportScrollDims(root);
  return {
    x: startCoords.x + width,
    y: startCoords.y + height,
  };
}

export function isElementInView(
  root: Element,
  element: HTMLElement,
  atPosition?: Coords,
  needsAdjusting?: boolean
): boolean {
  if (!root || !element) {
    return false;
  }
  const explicitPosition: Coords =
    atPosition &&
    (needsAdjusting ? addAppropriateOffset(root, atPosition) : atPosition);
  const position: Coords =
    explicitPosition || addAppropriateOffset(root, getElementCoords(element));
  const elementDims: Dims = getElementDims(element);
  const startCoords: Coords = addAppropriateOffset(
    root,
    getViewportStart(root)
  );
  const viewportDims: Dims = getViewportDims(root);

  return isWithinAt(elementDims, viewportDims, position, startCoords);
}

// if directed to scroll to a position which is outside the bounds of the scrolling container, the
// viewport will stop at the edges of that container. We want to get the coords that the viewport
// will end up when given certain coords
export function getScrolledViewportPosition(
  root: Element,
  scrollDestination: Coords
) {
  const dims = getViewportDims(root);
  const startCoords = getViewportScrollStart(root);
  const endCoords = getViewportScrollEnd(root);

  const rightmost = endCoords.x - dims.width;
  const bottommost = endCoords.y - dims.height;

  let coords: Coords = scrollDestination;

  if (scrollDestination.x < startCoords.x) {
    coords.x = startCoords.x;
  } else if (scrollDestination.x > rightmost) {
    coords.x = rightmost;
  } else {
    coords.x = scrollDestination.x;
  }

  if (scrollDestination.y < startCoords.y) {
    coords.y = startCoords.y;
  } else if (scrollDestination.y > bottommost) {
    coords.y = bottommost;
  } else {
    coords.y = scrollDestination.y;
  }

  return coords;
}

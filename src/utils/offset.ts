import {
  Coords,
  Dims,
  getCombinedData,
  getElementCoords,
  getElementDims,
  isDefaultScrollingElement,
} from './dom';
import { getViewportDims, getViewportStart } from './viewport';

export function getCurrentScrollOffset(root: Element): Coords {
  return {
    x: root.scrollLeft,
    y: root.scrollTop,
  };
}

export function addScrollOffset(root: Element, coords: Coords) {
  const curOffset: Coords = getCurrentScrollOffset(root);
  return {
    x: coords.x + curOffset.x,
    y: coords.y + curOffset.y,
  };
}

export function addAppropriateOffset(root: Element, coords: Coords) {
  if (!coords || !root) {
    return;
  }

  // if there's a custom root, then we need to offset by that root's positioning relative to the window
  // before adjusting for its scroll values
  if (!isDefaultScrollingElement(root)) {
    const rootCoords: Coords = getElementCoords(root);
    return addScrollOffset(root, {
      x: coords.x - rootCoords.x,
      y: coords.y - rootCoords.y,
    });
  } else {
    return addScrollOffset(root, coords);
  }
}

// apply a common offset calculation where b is centered relative to a. If b is larger than a, the result is that a will be centered within b.
// b is the moveable element: the returned value will specify where to place b to achieve centering.
export function applyCenterOffset(
  aCoords: Coords,
  aDims: Dims,
  b: Dims
): Coords {
  return {
    x: aCoords.x + aDims.width / 2 - b.width / 2,
    y: aCoords.y + aDims.height / 2 - b.height / 2,
  };
}

export function centerViewportAroundElements(
  root: Element,
  a: HTMLElement,
  b: HTMLElement,
  aPosition?: Coords,
  bPosition?: Coords
): Coords {
  if (!root || !a || !b) {
    return;
  }

  const aCoords = aPosition || getElementCoords(a);
  const bCoords = bPosition || getElementCoords(b);
  const aDims = getElementDims(a);
  const bDims = getElementDims(b);
  const { coords, dims } = getCombinedData(aCoords, aDims, bCoords, bDims);
  return centerViewportAround(root, coords, dims);
}

export function centerViewportAround(
  root: Element,
  coords: Coords,
  dims: Dims
): Coords {
  return applyCenterOffset(coords, dims, getViewportDims(root));
}

// get the coordinates the viewport would need to be placed for the element to be centered
export function centerViewportAroundElement(
  root: Element,
  element: HTMLElement
): Coords {
  const elementDims: Dims = getElementDims(element);
  const elementCoords: Coords = getElementCoords(element);

  return centerViewportAround(root, elementCoords, elementDims);
}

// get the center coord of the viewport. If element is provided, the return value is the origin
// which would align that element's center with the viewport center. If atViewportPosition is provided,
// gets the viewport's center at that position
export function getViewportCenter(
  root: Element,
  element?: HTMLElement,
  atViewportPosition?: Coords
): Coords {
  if (!root) {
    return;
  }
  const startCoords: Coords = atViewportPosition || getViewportStart(root);
  const viewportDims: Dims = getViewportDims(root);
  const elementDims: Dims = element
    ? getElementDims(element)
    : { height: 0, width: 0 };

  return applyCenterOffset(startCoords, viewportDims, elementDims);
}

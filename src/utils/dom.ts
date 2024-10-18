import { focusableSelector } from './constants';
import { getTargetPosition } from './positioning';

export interface Coords {
  x: number;
  y: number;
}

export interface Dims {
  width: number;
  height: number;
}

export interface ElementInfo {
  dims: Dims;
  coords: Coords;
}

export function isValidCoords(coords: Coords): boolean {
  if (!coords) {
    return false;
  } else if ((!coords.x && coords.x !== 0) || (!coords.y && coords.y !== 0)) {
    return false;
  } else {
    return true;
  }
}

export function isValidDims(dims: Dims): boolean {
  if (!dims) {
    return false;
  } else if (
    (!dims.height && dims.height !== 0) ||
    (!dims.width && dims.height !== 0)
  ) {
    return false;
  } else if (dims.height < 0 || dims.width < 0) {
    return false;
  } else {
    return true;
  }
}

export function dist(a: Coords, b: Coords): number {
  if (!isValidCoords(a) || !isValidCoords(b)) {
    return;
  }

  return Math.sqrt(
    Math.pow(Math.abs(a.x - b.x), 2) + Math.pow(Math.abs(a.y - b.y), 2)
  );
}

export function areaDiff(a: Dims, b: Dims): number {
  if (!isValidDims(a) || !isValidDims(b)) {
    return;
  }

  return Math.abs(a.height * a.width - b.height * b.width);
}

export function getElementCoords(element: Element): Coords {
  if (!element) {
    return;
  }
  const elementData: ClientRect = element.getBoundingClientRect();
  return {
    x: elementData.left,
    y: elementData.top,
  };
}

export function getElementDims(element: Element): Dims {
  if (!element) {
    return;
  }
  const elementData = element.getBoundingClientRect();
  return {
    width: elementData.width,
    height: elementData.height,
  };
}

//https://gist.github.com/gre/296291b8ce0d8fe6e1c3ea4f1d1c5c3b
export function getNearestScrollAncestor(element: Element): Element {
  const regex = /(auto|scroll)/;

  const style = (el: Element, prop: string) =>
    getComputedStyle(el, null).getPropertyValue(prop);

  const scroll = (el: Element) =>
    regex.test(
      style(el, 'overflow') + style(el, 'overflow-y') + style(el, 'overflow-x')
    );

  if (!element || isDefaultScrollingElement(element)) {
    return getDefaultScrollingElement();
  } else {
    if (scroll(element)) {
      return element;
    } else {
      return getNearestScrollAncestor(element.parentElement);
    }
  }
}

//https://github.com/GreenGremlin/scroll-doc/blob/master/index.js
export function getDefaultScrollingElement(): Element {
  const windowStart: number = window.pageYOffset; //slightly better support than scrollY
  document.documentElement.scrollTop = windowStart + 1;
  if (window.pageXOffset > windowStart) {
    document.documentElement.scrollTop = windowStart; //reset
    return document.documentElement;
  } else {
    return document.scrollingElement || document.body;
  }
}

export function isDefaultScrollingElement(root: Element) {
  return (
    root.isSameNode(document.body) ||
    root.isSameNode(document.scrollingElement) ||
    root.isSameNode(document.documentElement)
  );
}

//if we're not putting the portal in a custom container, it needs to be at the body level
export function getValidPortalRoot(root: Element) {
  // check for the potential default scrolling elements that might be returned from the above function
  if (isDefaultScrollingElement(root)) {
    return document.body;
  } else {
    return root;
  }
}

export function getCombinedData(
  aCoords: Coords,
  aDims: Dims,
  bCoords: Coords,
  bDims: Dims
): { coords: Coords; dims: Dims } {
  // generates similar data as getBoundingClientRect but using hypothetical positions
  const generateBounds = (
    coords: Coords,
    dims: Dims
  ): { left: number; right: number; top: number; bottom: number } => {
    return {
      left: coords.x,
      right: coords.x + dims.width,
      top: coords.y,
      bottom: coords.y + dims.height,
    };
  };

  const mostExtreme = (a: number, b: number, largest: boolean): number => {
    return a > b ? (largest ? a : b) : largest ? b : a;
  };

  const aBounds = generateBounds(aCoords, aDims);
  const bBounds = generateBounds(bCoords, bDims);

  const left: number = mostExtreme(aBounds.left, bBounds.left, false);
  const right: number = mostExtreme(aBounds.right, bBounds.right, true);
  const top: number = mostExtreme(aBounds.top, bBounds.top, false);
  const bottom: number = mostExtreme(aBounds.bottom, bBounds.bottom, true);

  return {
    coords: {
      x: left,
      y: top,
    },
    dims: {
      height: bottom - top,
      width: right - left,
    },
  };
}

// determines if a can fit within b
export function fitsWithin(aDims: Dims, bDims: Dims) {
  if (!isValidDims(aDims) || !isValidDims(bDims)) {
    return false;
  }

  return aDims.height <= bDims.height && aDims.width <= bDims.width;
}

// determines if a does fit within b at the given coords
export function isWithinAt(
  aDims: Dims,
  bDims: Dims,
  aCoords?: Coords,
  bCoords?: Coords
) {
  if (!isValidDims(aDims) || !isValidDims(bDims)) {
    return false;
  }

  const validCoordsA: Coords = isValidCoords(aCoords)
    ? aCoords
    : { x: 0, y: 0 };
  const validCoordsB: Coords = isValidCoords(bCoords)
    ? bCoords
    : { x: 0, y: 0 };
  const fitsDims: boolean = fitsWithin(aDims, bDims);
  const fitsHorizontally: boolean =
    validCoordsA.x >= validCoordsB.x &&
    validCoordsA.x + aDims.width <= validCoordsB.x + bDims.width;
  const fitsVertically: boolean =
    validCoordsA.y >= validCoordsB.y &&
    validCoordsA.y + aDims.height <= validCoordsB.y + bDims.height;

  return fitsDims && fitsHorizontally && fitsVertically;
}

export function getFocusableElements(
  root: Element,
  includeSelf?: boolean
): HTMLElement[] {
  const focusableChildren = root.querySelectorAll(focusableSelector);
  let array: HTMLElement[] = [];
  if (includeSelf && root.matches(focusableSelector)) {
    array.push(root as HTMLElement);
  }
  if (focusableChildren.length > 0) {
    focusableChildren.forEach(el => array.push(el as HTMLElement));
  }

  return array;
}

// helper function to get first/last focusable elements if possible
export function getEdgeFocusables(
  defaultElement: HTMLElement,
  container?: HTMLElement,
  includeSelf?: boolean
): { start: HTMLElement; end: HTMLElement } {
  if (container) {
    const containerFocusables: HTMLElement[] = getFocusableElements(
      container,
      includeSelf
    );
    if (containerFocusables.length > 0) {
      return {
        start: containerFocusables[0],
        end: containerFocusables[containerFocusables.length - 1],
      };
    }
  }

  return {
    start: defaultElement,
    end: defaultElement,
  };
}

export function getTargetInfo(
  root: Element,
  target?: HTMLElement
): ElementInfo | undefined {
  if (!root || !target) {
    return;
  }
  const dims: Dims = getElementDims(target);
  const coords: Coords = getTargetPosition(root, target);

  return {
    coords,
    dims,
  };
}

export function isForeignTarget(root: Element, selector: string): boolean {
  return !root.querySelector(selector);
}

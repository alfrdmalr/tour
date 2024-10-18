import {
  Coords,
  Dims,
  dist,
  fitsWithin,
  getCombinedData,
  getElementCoords,
  getElementDims,
  isForeignTarget,
  isWithinAt,
} from './dom';
import {
  addAppropriateOffset,
  applyCenterOffset,
  centerViewportAroundElement,
  centerViewportAroundElements,
  getCurrentScrollOffset,
  getViewportCenter,
} from './offset';
import {
  getScrolledViewportPosition,
  getViewportDims,
  getViewportScrollEnd,
  getViewportScrollStart,
  getViewportStart,
  isElementInView,
} from './viewport';

export enum CardinalOrientation {
  EAST = 'east',
  SOUTH = 'south',
  WEST = 'west',
  NORTH = 'north',
  CENTER = 'center',
  EASTNORTH = 'east-north',
  EASTSOUTH = 'east-south',
  SOUTHEAST = 'south-east',
  SOUTHWEST = 'south-west',
  WESTSOUTH = 'west-south',
  WESTNORTH = 'west-north',
  NORTHWEST = 'north-west',
  NORTHEAST = 'north-east',
}

export interface OrientationCoords {
  orientation: CardinalOrientation;
  coords: Coords;
}

export interface GetTooltipPositionArgs {
  target: HTMLElement;
  tooltip: HTMLElement;
  padding: number;
  tooltipSeparation: number;
  root: Element;
  orientationPreferences?: CardinalOrientation[];
  getPositionFromCandidates?: (
    candidates: OrientationCoords[]
  ) => OrientationCoords;
  disableAutoScroll?: boolean;
  allowForeignTarget?: boolean;
  selector?: string;
}

function getTooltipPositionCandidates(
  target: HTMLElement,
  tooltip: HTMLElement,
  padding: number,
  tooltipDistance: number,
  includeAllPositions?: boolean
): OrientationCoords[] {
  if (!target || !tooltip) {
    return;
  }

  const tooltipDims: Dims = getElementDims(tooltip);
  const targetCoords: Coords = getElementCoords(target);
  const targetDims: Dims = getElementDims(target);
  const centerX: number =
    targetCoords.x - (tooltipDims.width - targetDims.width) / 2;
  const centerY: number =
    targetCoords.y - (tooltipDims.height - targetDims.height) / 2;
  const eastOffset: number =
    targetCoords.x + targetDims.width + padding + tooltipDistance;
  const southOffset: number =
    targetCoords.y + targetDims.height + padding + tooltipDistance;
  const westOffset: number =
    targetCoords.x - tooltipDims.width - padding - tooltipDistance;
  const northOffset: number =
    targetCoords.y - tooltipDims.height - padding - tooltipDistance;

  const east: Coords = { x: eastOffset, y: centerY };
  const south: Coords = { x: centerX, y: southOffset };
  const west: Coords = { x: westOffset, y: centerY };
  const north: Coords = { x: centerX, y: northOffset };
  const center: Coords = applyCenterOffset(
    targetCoords,
    targetDims,
    tooltipDims
  );

  const standardPositions = [
    { orientation: CardinalOrientation.EAST, coords: east },
    { orientation: CardinalOrientation.SOUTH, coords: south },
    { orientation: CardinalOrientation.WEST, coords: west },
    { orientation: CardinalOrientation.NORTH, coords: north },
  ];

  let additionalPositions: OrientationCoords[];
  if (includeAllPositions) {
    const eastAlign: number =
      targetCoords.x - (tooltipDims.width - targetDims.width) + padding;
    const southAlign: number =
      targetCoords.y - (tooltipDims.height - targetDims.height) + padding;
    const westAlign: number = targetCoords.x - padding;
    const northAlign: number = targetCoords.y - padding;

    const eastNorth: Coords = { x: eastOffset, y: northAlign };
    const eastSouth: Coords = { x: eastOffset, y: southAlign };
    const southEast: Coords = { x: eastAlign, y: southOffset };
    const southWest: Coords = { x: westAlign, y: southOffset };
    const westSouth: Coords = { x: westOffset, y: southAlign };
    const westNorth: Coords = { x: westOffset, y: northAlign };
    const northWest: Coords = { x: westAlign, y: northOffset };
    const northEast: Coords = { x: eastAlign, y: northOffset };

    additionalPositions = [
      { orientation: CardinalOrientation.EASTNORTH, coords: eastNorth },
      { orientation: CardinalOrientation.EASTSOUTH, coords: eastSouth },
      { orientation: CardinalOrientation.SOUTHEAST, coords: southEast },
      { orientation: CardinalOrientation.SOUTHWEST, coords: southWest },
      { orientation: CardinalOrientation.WESTSOUTH, coords: westSouth },
      { orientation: CardinalOrientation.WESTNORTH, coords: westNorth },
      { orientation: CardinalOrientation.NORTHWEST, coords: northWest },
      { orientation: CardinalOrientation.NORTHEAST, coords: northEast },
    ];
  }

  return [
    ...standardPositions,
    ...additionalPositions,
    { orientation: CardinalOrientation.CENTER, coords: center },
  ];
}

// simple reducer who selects for coordinates closest to the current center of the viewport
function getCenterReducer(
  root: Element,
  tooltip: HTMLElement,
  target: HTMLElement,
  predictViewport?: boolean
): (
  acc: OrientationCoords,
  cur: OrientationCoords,
  ind: number,
  arr: OrientationCoords[]
) => OrientationCoords {
  const currentCenter: Coords = getViewportCenter(root, tooltip);

  // store the center of the predicted viewport location with the tooltip at acc
  // to have a meaningful distance comparison
  let accCenter: Coords = currentCenter;

  const getCenter = (coords: Coords) => {
    if (
      predictViewport &&
      (!isElementInView(root, target) ||
        !isElementInView(root, tooltip, coords, true))
    ) {
      return getViewportCenter(
        root,
        tooltip,
        getScrolledViewportPosition(
          root,
          centerViewportAroundElements(root, tooltip, target, coords)
        )
      );
    } else {
      return currentCenter;
    }
  };

  return (
    acc: OrientationCoords,
    cur: OrientationCoords,
    ind: number,
    arr: OrientationCoords[]
  ): OrientationCoords => {
    if (cur.orientation === CardinalOrientation.CENTER) {
      //ignore centered coords since those will always be closest to the center
      if (ind === arr.length - 1 && acc === undefined) {
        //unless  we're at the end and we still haven't picked a coord
        return cur;
      } else {
        return acc;
      }
    } else if (acc === undefined) {
      accCenter = getCenter(cur.coords);
      return cur;
    } else {
      const center: Coords = getCenter(cur.coords);

      if (dist(center, cur.coords) > dist(accCenter, acc.coords)) {
        return acc;
      } else {
        accCenter = center;
        return cur;
      }
    }
  };
}

// complex candidate reducer function that tries to place the tooltip as close to the center of the
// screen as possible, even after the screen has scrolled to a particular location.
function chooseBestTooltipPosition(
  preferredCandidates: OrientationCoords[],
  root: Element,
  tooltip: HTMLElement,
  target: HTMLElement,
  scrollDisabled: boolean
): OrientationCoords {
  if (preferredCandidates.length === 1) {
    //if there's only a single pref candidate, use that
    return preferredCandidates[0];
  } else if (scrollDisabled) {
    // if scrolling is disabled, there's not much we can do except use the naive center reducer
    return preferredCandidates.reduce(
      getCenterReducer(root, tooltip, target, false),
      undefined
    );
  } else {
    // scrolling is allowed, which means we have to figure out:
    // 1. what candidates are valid positions (not out of the scrolling root's bounds)
    // 2. which positions are absolutely compatible (allow both target & tooltip to fit within the viewport at the same time)
    // 3. which positions are currently compatible (allow both target & tooltip to fit with the CURRENT viewport)
    // 4. which of those positions is *best* - use same closest-to-center heuristic.
    // priority is 3 > 2 > 1 for the pool of positions from which 4 is chosen

    const viewportDims: Dims = getViewportDims(root);
    const viewportScrollStart: Coords = getViewportScrollStart(root);
    const viewportCurrentStart: Coords = getViewportStart(root);
    const viewportScrollEnd: Coords = getViewportScrollEnd(root);
    const tooltipDims: Dims = getElementDims(tooltip);
    const targetDims: Dims = getElementDims(target);
    const targetCoords: Coords = getElementCoords(target);
    const curriedGetCombinedData = (coords: Coords) =>
      getCombinedData(coords, tooltipDims, targetCoords, targetDims);

    const validPositions: OrientationCoords[] = preferredCandidates.filter(
      getInBoundsFilter(tooltipDims, viewportScrollStart, viewportScrollEnd)
    );
    const absoluteCompatiblePositions: OrientationCoords[] =
      validPositions.filter(
        getAbsoluteCompatibleArrangementFilter(
          curriedGetCombinedData,
          viewportDims
        )
      );
    const currentCompatiblePositions: OrientationCoords[] =
      absoluteCompatiblePositions.filter(
        getCurrentInViewFilter(
          curriedGetCombinedData,
          viewportDims,
          viewportCurrentStart
        )
      );

    // // if possible, use only those positions which don't force a scroll. Default back to those which can fit in the viewport, even if that means scrolling
    const compatiblePositions: OrientationCoords[] =
      currentCompatiblePositions.length > 0
        ? currentCompatiblePositions
        : absoluteCompatiblePositions;

    // if there are NO compatible positions, the viewport is too small to accomodate both the target/tooltip, in any arrangement.
    // we default to our valid positions, even if that means placing the elements slightly off screen.
    const filteredList =
      compatiblePositions.length > 0 ? compatiblePositions : validPositions;

    return filteredList.reduce(
      getCenterReducer(root, tooltip, target, true),
      undefined
    );
  }
}

// filter out any positions which would have the tooltip be out of the bounds of the root container
// (i.e. in a position that the viewport can't "reach"/scroll to)
function getInBoundsFilter(
  tooltipDims: Dims,
  viewportScrollStart: Coords,
  viewportScrollEnd: Coords
): (oc: OrientationCoords) => boolean {
  return (oc: OrientationCoords): boolean => {
    const coords: Coords = oc.coords;
    return !(
      coords.x < viewportScrollStart.x ||
      coords.y < viewportScrollStart.y ||
      coords.x + tooltipDims.width > viewportScrollEnd.x ||
      coords.y + tooltipDims.height > viewportScrollEnd.y
    );
  };
}

// filters out any positions which would cause the target/tooltip to not fit within the viewport
function getAbsoluteCompatibleArrangementFilter(
  curriedGetCombinedData: (coords: Coords) => { dims: Dims; coords: Coords },
  viewportDims: Dims
): (oc: OrientationCoords) => boolean {
  return (oc: OrientationCoords): boolean => {
    const coords: Coords = oc.coords;
    // we only care about the resultant dims but the input coords are critical here
    const { dims: combinedDims } = curriedGetCombinedData(coords);

    return fitsWithin(combinedDims, viewportDims);
  };
}

function getCurrentInViewFilter(
  curriedGetCombinedData: (coords: Coords) => { dims: Dims; coords: Coords },
  viewportDims: Dims,
  viewportCurrentStart: Coords
): (oc: OrientationCoords) => boolean {
  return (oc: OrientationCoords): boolean => {
    const coords: Coords = oc.coords;

    const { dims: combinedDims, coords: combinedCoords } =
      curriedGetCombinedData(coords);

    return isWithinAt(
      combinedDims,
      viewportDims,
      combinedCoords,
      viewportCurrentStart
    );
  };
}

function getPreferredCandidates(
  candidates: OrientationCoords[],
  orientationPreferences?: CardinalOrientation[]
): OrientationCoords[] {
  if (!orientationPreferences || orientationPreferences.length === 0) {
    return candidates;
  } else if (orientationPreferences.length === 1) {
    const specifiedCandidate = candidates.find(
      (oc: OrientationCoords) => oc.orientation === orientationPreferences[0]
    );
    if (specifiedCandidate) {
      return [specifiedCandidate];
    } else {
      return candidates; // if the specified orientation isn't available for whatever reason, default to standard behavior
    }
  } else {
    const preferenceFilter = (cc: OrientationCoords) =>
      orientationPreferences.indexOf(cc.orientation) !== -1;
    return candidates.filter(preferenceFilter);
  }
}

function restrictToCurrentViewport(
  root: Element,
  coords: Coords,
  dims: Dims,
  padding: number
): Coords {
  if (!root) {
    return coords;
  }

  const viewportStart: Coords = getCurrentScrollOffset(root);
  const viewportDims: Dims = getViewportDims(root);
  const viewportEnd: Coords = {
    x: viewportStart.x + viewportDims.width,
    y: viewportStart.y + viewportDims.height,
  };
  const sx = viewportStart.x + padding;
  const sy = viewportStart.y + padding;
  const ex = viewportEnd.x - dims.width - padding;
  const ey = viewportEnd.y - dims.height - padding;

  let x: number = coords.x;
  let y: number = coords.y;

  if (coords.x < sx) {
    x = sx;
  } else if (coords.x + dims.width > ex) {
    x = ex;
  }

  if (coords.y < sy) {
    y = sy;
  } else if (coords.y + dims.height > ey) {
    y = ey;
  }

  return { x, y };
}

export function getTooltipPosition(
  args: GetTooltipPositionArgs
): OrientationCoords {
  const {
    target,
    tooltip,
    padding,
    tooltipSeparation,
    orientationPreferences,
    getPositionFromCandidates,
    root: tourRoot,
    disableAutoScroll: scrollDisabled,
    allowForeignTarget,
    selector,
  } = args;
  const center: Coords = target
    ? getViewportCenter(
        tourRoot,
        tooltip,
        getScrolledViewportPosition(
          tourRoot,
          centerViewportAroundElement(tourRoot, target)
        )
      )
    : getViewportCenter(tourRoot, tooltip);
  const defaultPosition: Coords = addAppropriateOffset(tourRoot, center);

  if (!tooltip || !tourRoot) {
    return;
  }

  if (!target) {
    return { orientation: null, coords: defaultPosition };
  }

  const foreignTarget: boolean =
    allowForeignTarget && isForeignTarget(tourRoot, selector);
  const noScroll: boolean = scrollDisabled || foreignTarget;
  const candidates: OrientationCoords[] = getTooltipPositionCandidates(
    target,
    tooltip,
    padding,
    tooltipSeparation,
    true
  );
  const choosePosition =
    getPositionFromCandidates ||
    ((cans: OrientationCoords[]) =>
      chooseBestTooltipPosition(cans, tourRoot, tooltip, target, noScroll));

  const rawPosition: OrientationCoords = choosePosition(
    getPreferredCandidates(candidates, orientationPreferences)
  ); //position relative to current viewport

  if (!rawPosition) {
    return { orientation: CardinalOrientation.CENTER, coords: defaultPosition };
  }

  const adjustedPosition: OrientationCoords = {
    orientation: rawPosition.orientation,
    coords: addAppropriateOffset(tourRoot, rawPosition.coords),
  };

  if (foreignTarget) {
    return {
      orientation: adjustedPosition.orientation,
      coords: restrictToCurrentViewport(
        tourRoot,
        adjustedPosition.coords,
        getElementDims(tooltip),
        padding + tooltipSeparation
      ),
    };
  }

  return adjustedPosition;
}

export function getTargetPosition(root: Element, target: HTMLElement): Coords {
  return addAppropriateOffset(root, getElementCoords(target));
}

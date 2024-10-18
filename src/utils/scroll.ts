import { Coords } from './dom';
import { addAppropriateOffset, centerViewportAroundElement } from './offset';

export function scrollToElement(
  root: Element,
  element: HTMLElement,
  disableSmoothScrolling?: boolean
): void {
  if (!root || !element) {
    return;
  }

  const coords = addAppropriateOffset(
    root,
    centerViewportAroundElement(root, element)
  );

  scrollToDestination(root, coords, disableSmoothScrolling);
}

export function scrollToDestination(
  root: Element,
  destination: Coords,
  disableSmoothScrolling?: boolean
): void {
  if (!root || !destination) {
    return;
  }
  // check if the 'scrollBehavior' property is supported. Support for this property is consistent
  // with support for scrollToOptions, and if it's supported we can scroll smoothly
  const smoothScrollingIsSupported =
    'scrollBehavior' in document.documentElement.style;
  if (smoothScrollingIsSupported && !disableSmoothScrolling) {
    const scrollOptions: ScrollToOptions = {
      top: destination.y,
      left: destination.x,
      behavior: 'smooth',
    };

    root.scrollTo(scrollOptions);
  } else {
    root.scrollTop = destination.y;
    root.scrollLeft = destination.x;
  }
}

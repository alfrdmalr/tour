import * as React from 'react';

import { Coords, Dims, ElementInfo } from '../utils/dom';
import { getViewportScrollDims } from '../utils/viewport';

export interface MaskOptions {
  targetInfo?: ElementInfo;
  padding: number;
  radius: number;
  close: () => void;
  tourRoot: Element;
  disableMaskInteraction?: boolean;
  disableCloseOnClick?: boolean;
  maskId: string;
  maskFill?: string;
}

export function Mask(props: MaskOptions): JSX.Element {
  const {
    targetInfo,
    disableMaskInteraction,
    padding,
    radius,
    tourRoot,
    close,
    disableCloseOnClick,
    maskId,
    maskFill,
  } = props;
  const { width: containerWidth, height: containerHeight } =
    getViewportScrollDims(tourRoot);
  const pathId = `clip-path-${maskId}`;

  const getCutoutPath = (target?: { coords: Coords; dims: Dims }): string => {
    if (!target) {
      return '';
    }

    const { dims, coords } = target;

    const cutoutTop: number = coords.y - padding;
    const cutoutLeft: number = coords.x - padding;
    const cutoutRight: number = coords.x + dims.width + padding;
    const cutoutBottom: number = coords.y + dims.height + padding;

    if (radius > 0) {
      return `M 0, 0
              L 0, ${containerHeight}
              L ${cutoutLeft}, ${containerHeight}
              L ${cutoutLeft}, ${cutoutTop + radius}
              Q ${cutoutLeft}, ${cutoutTop}, ${
                cutoutLeft + radius
              }, ${cutoutTop}
              L ${cutoutRight - radius}, ${cutoutTop}
              Q ${cutoutRight}, ${cutoutTop}, ${cutoutRight}, ${
                cutoutTop + radius
              }
              L ${cutoutRight}, ${cutoutBottom - radius}
              Q ${cutoutRight}, ${cutoutBottom}, ${
                cutoutRight - radius
              }, ${cutoutBottom}
              L ${cutoutLeft + radius}, ${cutoutBottom}
              Q ${cutoutLeft}, ${cutoutBottom}, ${cutoutLeft}, ${
                cutoutBottom - radius
              }
              L ${cutoutLeft}, ${containerHeight}
              L ${containerWidth}, ${containerHeight}
              L ${containerWidth}, 0`;
    }

    return `M 0, 0
            L 0, ${containerHeight}
            L ${cutoutLeft}, ${containerHeight}
            L ${cutoutLeft}, ${cutoutTop}
            L ${cutoutRight}, ${cutoutTop}
            L ${cutoutRight}, ${cutoutBottom}
            L ${cutoutLeft}, ${cutoutBottom}
            L ${cutoutLeft}, ${containerHeight}
            L ${containerWidth}, ${containerHeight}
            L ${containerWidth}, 0`;
  };

  const svgStyle: React.CSSProperties = {
    height: containerHeight,
    width: containerWidth,
    pointerEvents: disableMaskInteraction ? 'auto' : 'none',
  };

  return (
    <svg style={svgStyle}>
      {targetInfo && (
        <defs>
          <clipPath id={pathId}>
            <path d={getCutoutPath(targetInfo)} />
          </clipPath>
        </defs>
      )}

      <rect
        onClick={disableCloseOnClick ? undefined : close}
        x={0}
        y={0}
        width={containerWidth}
        height={containerHeight}
        fill={maskFill ?? 'black'}
        fillOpacity={0.3}
        pointerEvents="auto"
        clipPath={targetInfo ? `url(#${pathId})` : undefined}
      />
    </svg>
  );
}

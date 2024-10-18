// have to mock getBoundingClientRect because jsdom isn't actually rendered
export function mockGBCR(args: {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}): void {
  const { x, y, h, w } = args;
  Element.prototype.getBoundingClientRect = jest.fn(() => {
    return {
      width: w,
      height: h,
      top: y,
      left: x,
      right: x + w,
      bottom: y + h,
      x: x,
      y: y,
      toJSON: () => ({
        width: w,
        height: h,
        top: y,
        left: x,
        right: x + w,
        bottom: y + h,
        x: x,
        y: y,
      }),
    };
  });
}

import * as React from 'react';
import { mount } from 'enzyme';

import {
  areaDiff,
  Coords,
  Dims,
  dist,
  fitsWithin,
  getElementCoords,
  getNearestScrollAncestor,
  isValidCoords,
  isValidDims,
  isWithinAt,
} from '../../src/utils/dom';
import { mockGBCR } from '../mocks';

// casting undefined as number to bypass noImplicitAny, which stops the tests from running
const mockDataGen = () => ({
  coordsOrigin: { x: 0, y: 0 },
  coords100: { x: 100, y: 100 },
  coordsTop: { x: 100, y: 0 },
  coordsLeft: { x: 0, y: 100 },
  coords100Negative: { x: -100, y: -100 },
  coordsTopNegative: { x: -100, y: 0 },
  coordsLeftNegative: { x: 0, y: -100 },
  coordsUgly1: { x: 65.2, y: 155.6 },
  coordsUgly2: { x: 0.003, y: 51.5 },
  coordsUgly3: { x: 678.12, y: -399 },
  coordsUndefY: { x: 34, y: undefined as number },
  coordsUndefX: { x: undefined as number, y: 45 },
  coordsUndef: undefined as Coords,
  dimsUndef: undefined as Dims,
  dimsEmpty: { height: 0, width: 0 },
  dimsSmall: { height: 10, width: 10 },
  dimsSmallCopy: { height: 10, width: 10 },
  dimsLarge: { height: 100, width: 100 },
  dimsNegative: { height: -50, width: -50 },
  dimsNegativeH: { height: -25, width: 30 },
  dimsNegativeW: { height: 49, width: -280 },
  dimsDecimal: { height: 233.33, width: 100.1 },
});

describe('isValidCoords', () => {
  const {
    coordsOrigin,
    coords100,
    coords100Negative,
    coordsUndef,
    coordsUgly2,
    coordsUndefX,
    coordsUndefY,
    coordsUgly3,
  } = mockDataGen();

  test('undefined is invalid', () => {
    expect(isValidCoords(coordsUndef)).toBe(false);
  });

  test('(0, 0) is valid', () => {
    expect(isValidCoords(coordsOrigin)).toBe(true);
  });

  test('negative is valid', () => {
    expect(isValidCoords(coords100Negative)).toBe(true);
  });

  test('individual undefined properties is invalid', () => {
    expect(isValidCoords(coordsUndefX)).toBe(false);
    expect(isValidCoords(coordsUndefY)).toBe(false);
  });

  test('normal is valid', () => {
    expect(isValidCoords(coords100)).toBe(true);
  });

  test('decimals are valid', () => {
    expect(isValidCoords(coordsUgly2)).toBe(true);
  });

  test('pos/neg split is valid', () => {
    expect(isValidCoords(coordsUgly3)).toBe(true);
  });
});

describe('isValidDims', () => {
  const {
    dimsEmpty,
    dimsNegative,
    dimsUndef,
    dimsSmall,
    dimsNegativeH,
    dimsNegativeW,
    dimsDecimal,
  } = mockDataGen();

  test('undefined is invalid', () => {
    expect(isValidDims(dimsUndef)).toBe(false);
  });

  test('(0x0) is valid', () => {
    expect(isValidDims(dimsEmpty)).toBe(true);
  });

  test('normal is valid', () => {
    expect(isValidDims(dimsSmall)).toBe(true);
  });

  test('negative is invalid', () => {
    expect(isValidDims(dimsNegative)).toBe(false);
    expect(isValidDims(dimsNegativeH)).toBe(false);
    expect(isValidDims(dimsNegativeW)).toBe(false);
  });

  test('decimal is valid', () => {
    expect(isValidDims(dimsDecimal)).toBe(true);
  });
});

// Testing "dist" function, which calculates the distance between two points
describe('dist', () => {
  const {
    coordsOrigin,
    coords100,
    coordsTop,
    coordsLeft,
    coords100Negative,
    coordsTopNegative,
    coordsLeftNegative,
    coordsUgly1,
    coordsUgly2,
    coordsUgly3,
    coordsUndef,
  } = mockDataGen();

  test('base case', () => {
    expect(dist(coordsUndef, coordsOrigin)).toBe(undefined);
    expect(dist(coordsOrigin, coordsOrigin)).toBe(0);
    expect(dist(coords100, coords100)).toBe(0);
  });

  test('different points', () => {
    //trivial
    expect(dist(coordsTop, coordsOrigin)).toBeCloseTo(100);
    expect(dist(coordsLeft, coordsOrigin)).toBeCloseTo(100);
    expect(dist(coordsLeft, coords100)).toBeCloseTo(100);

    //use pythag to roughly calculate
    expect(dist(coordsOrigin, coords100)).toBeCloseTo(141.4, 1);
    expect(dist(coordsUgly1, coordsOrigin)).toBeCloseTo(168.7, 1);
    expect(dist(coordsUgly1, coordsUgly2)).toBeCloseTo(122.8, 1);
  });

  //negatives shouldn't impact the distance.
  test('negative coordinates', () => {
    expect(dist(coordsTopNegative, coordsOrigin)).toBeCloseTo(100);
    expect(dist(coordsLeftNegative, coordsOrigin)).toBeCloseTo(100);
    expect(dist(coordsLeftNegative, coords100Negative)).toBeCloseTo(100);
    expect(dist(coordsUgly3, coordsUgly1)).toBeCloseTo(826.6, 1);
  });
});

describe('areaDiff', () => {
  const { dimsEmpty, dimsLarge, dimsSmall } = mockDataGen();

  test('no diff with self', () => {
    expect(areaDiff(dimsEmpty, dimsEmpty)).toBe(0);
    expect(areaDiff(dimsLarge, dimsLarge)).toBe(0);
  });

  test('diff with empty is self', () => {
    expect(areaDiff(dimsEmpty, dimsSmall)).toBe(
      dimsSmall.height * dimsSmall.width
    );
    expect(areaDiff(dimsEmpty, dimsSmall)).toBe(100); //validate area
    expect(areaDiff(dimsSmall, dimsEmpty)).toBe(
      dimsSmall.height * dimsSmall.width
    );
  });

  test('normal diff', () => {
    expect(areaDiff(dimsSmall, dimsLarge)).toBe(9900);
  });

  // test('invalid dims throw error' () => {

  // })
});

// testing "getElementCoords", which returns the coordinates of the element on the screen.
describe('getElementCoords', () => {
  test('origin', () => {
    mockGBCR({ x: 0, y: 0 });
    expect(getElementCoords(document.createElement('div'))).toStrictEqual({
      x: 0,
      y: 0,
    });
  });

  test('positioned', () => {
    mockGBCR({ x: 30, y: 90 });
    expect(getElementCoords(document.createElement('div'))).toStrictEqual({
      x: 30,
      y: 90,
    });
  });
});

// testing "getNearestScrollAncestor", which crawls up the dom tree looking for the nearest element that has scrolling capabilities.
describe('getNearestScrollAncestor', () => {
  const page = mount(
    <div id="parent">
      <div id="child-1">
        <button id="btn">button</button>
      </div>
      <div id="child-2" style={{ overflow: 'scroll' }}>
        <div id="grandchild">
          <div id="great-grandchild">
            <div id="great-great-grandchild" style={{ overflow: 'visible' }}>
              <div id="great-great-great-grandchild"></div>
            </div>
          </div>
        </div>
        <div id="grandchild-2" style={{ overflowY: 'auto' }}>
          <div id="great-grandchild-2">overflow y child</div>
        </div>
        <div id="grandchild-3" style={{ overflowX: 'hidden' }}>
          <div id="great-grandchild-3">overflow hidden child</div>
        </div>
        <div id="child-3" style={{ overflowX: 'visible', overflowY: 'scroll' }}>
          <div id="grandchild-4"></div>
        </div>
      </div>
    </div>
  );

  test('default scroll ancestor is document body', () => {
    const button = page.find('#btn').getDOMNode();
    expect(getNearestScrollAncestor(button)).toBe(document.body);
  });

  test('nested descendant finds correct element', () => {
    const nestedChild = page.find('#great-grandchild').getDOMNode();
    const c2 = page.find('#child-2').getDOMNode();

    expect(getNearestScrollAncestor(nestedChild)).not.toBe(document.body);
    expect(getNearestScrollAncestor(nestedChild)).toBe(c2);
  });

  test('overflow visible doesnt count as a scroll container', () => {
    const g3gc = page.find('#great-great-great-grandchild').getDOMNode();
    const gggc = page.find('#great-great-grandchild').getDOMNode();
    expect(getNearestScrollAncestor(g3gc)).not.toBe(gggc);
    expect(getNearestScrollAncestor(g3gc)).toBe(getNearestScrollAncestor(gggc)); //they should have the same ancestor, whatever it may be
  });

  test('direct descendant returns parent', () => {
    const grandchild = page.find('#grandchild').getDOMNode();
    const c2 = page.find('#child-2').getDOMNode();

    expect(getNearestScrollAncestor(grandchild)).toBe(c2);
  });

  test('self returns self', () => {
    const greatGrandchild = page.find('#great-grandchild-2').getDOMNode();
    const grandchildScroll = page.find('#grandchild-2').getDOMNode();

    expect(getNearestScrollAncestor(grandchildScroll)).toBe(grandchildScroll); //self
    expect(getNearestScrollAncestor(greatGrandchild)).toBe(grandchildScroll); //immediate descendant
  });

  test('overflow hidden doesnt count', () => {
    const ggc3 = page.find('#great-grandchild-3').getDOMNode();
    const g3 = page.find('#grandchild-3').getDOMNode();

    expect(getNearestScrollAncestor(ggc3)).not.toBe(g3); //overflow is hidden, don't put the tour there
  });

  test('only one axis needs to allow scrolling', () => {
    const gc4 = page.find('#grandchild-4').getDOMNode();
    const c3 = page.find('#child-3').getDOMNode();

    expect(getNearestScrollAncestor(gc4)).toBe(c3);
  });
});

// describe("getCombinedData", () => {

// })

describe('fitsWithin', () => {
  const {
    dimsEmpty,
    dimsSmall,
    dimsSmallCopy,
    dimsNegative,
    dimsLarge,
    dimsUndef,
    dimsNegativeH,
    dimsNegativeW,
  } = mockDataGen();

  test('base case', () => {
    expect(fitsWithin(dimsEmpty, dimsEmpty)).toBe(true);
    expect(fitsWithin(dimsUndef, dimsLarge)).toBe(false);
    expect(fitsWithin(dimsEmpty, dimsUndef)).toBe(false);
  });

  test('small fits within large', () => {
    expect(fitsWithin(dimsSmall, dimsLarge)).toBe(true);
  });

  test('large does not fit within small', () => {
    expect(fitsWithin(dimsLarge, dimsSmall)).toBe(false);
  });

  test('fits within same size', () => {
    expect(fitsWithin(dimsLarge, dimsLarge)).toBe(true);
    // same size, different object
    expect(fitsWithin(dimsSmall, dimsSmallCopy)).toBe(true);
  });

  test('negative dims fail', () => {
    expect(fitsWithin(dimsEmpty, dimsNegative)).toBe(false);
    expect(fitsWithin(dimsSmall, dimsNegative)).toBe(false);
    expect(fitsWithin(dimsNegative, dimsLarge)).toBe(false);
    expect(fitsWithin(dimsNegativeH, dimsLarge)).toBe(false);
    expect(fitsWithin(dimsNegativeW, dimsLarge)).toBe(false);
  });
});

describe('isWithinAt', () => {
  const {
    dimsEmpty,
    dimsSmall,
    dimsLarge,
    coordsOrigin,
    coordsUgly2,
    coords100,
    coordsTop,
  } = mockDataGen();

  test('not specifying coords has same behavior as fitsWithin', () => {
    expect(isWithinAt(dimsEmpty, dimsEmpty)).toEqual(
      fitsWithin(dimsEmpty, dimsEmpty)
    );
    expect(isWithinAt(dimsSmall, dimsLarge)).toEqual(
      fitsWithin(dimsSmall, dimsLarge)
    );
    expect(isWithinAt(dimsLarge, dimsSmall)).toEqual(
      fitsWithin(dimsLarge, dimsSmall)
    );
  });

  test('coordinates allow fit', () => {
    expect(fitsWithin(dimsSmall, dimsLarge)); //confirm that other tests take coords into account
    expect(isWithinAt(dimsSmall, dimsLarge, coordsOrigin, coordsOrigin)).toBe(
      true
    );
    expect(isWithinAt(dimsSmall, dimsLarge, coordsUgly2, coordsOrigin)).toBe(
      true
    );
    expect(isWithinAt(dimsSmall, dimsLarge, coords100, coordsTop)).toBe(false);
    expect(isWithinAt(dimsLarge, dimsSmall, coordsOrigin, coords100)).toBe(
      false
    );
  });
});

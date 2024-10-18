import * as React from 'react';
import { mount, shallow } from 'enzyme';

import { Walktour } from '../../src/components/Walktour';

describe('Walktour render structure', () => {
  test('walktour render', () => {
    const tour = shallow(<Walktour steps={[]} />);

    expect(tour.isEmptyRender()).toBe(true); //no step content, should render null
    expect(tour.children().length).toBe(0);
  });

  test('portal render', () => {
    const tour = mount(
      <Walktour
        steps={[
          { selector: null, description: 'hello world', title: 'Hey Earth!' },
        ]}
      />
    );
    const portal = tour.find('#walktour-portal');
    const mask = portal.find('Mask');
    const tooltip = portal.find('#walktour-tooltip-container');

    expect(portal.exists()).toBe(true);
    expect(portal.children().length).toBe(2); //mask and tooltip only
    expect(tooltip.exists()).toBe(true);
    expect(mask.exists()).toBe(true);
  });

  test('with target', () => {
    const tour = mount(
      <div>
        <div id="one" />
        <Walktour
          steps={[
            {
              selector: '#one',
              description: 'hello world',
              title: 'Hey Earth!',
            },
          ]}
        />
      </div>
    );

    const tooltip = tour.find('#walktour-tooltip-container');

    expect(tooltip.exists()).toBe(true);
    expect(tooltip.find('button')).toHaveLength(3); // skip, previous, next
  });
});

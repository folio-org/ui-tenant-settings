import React from 'react';
import { render } from '@testing-library/react';

import '../../../test/jest/__mocks__';

import { BursarExports } from './BursarExports';

const renderBursarExports = () => render(<BursarExports />);

describe('BursarExports', () => {
  it('should render configuration form', () => {
    const { getByText } = renderBursarExports();

    expect(getByText('Bursar exports configuration')).toBeDefined();
  });
});

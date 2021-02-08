import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import '../../../test/jest/__mocks__';

import { useOkapiKy } from '@folio/stripes/core';

import {
  useBursarConfigQuery,
  useBursarConfigMutation,
} from './apiQuery';
import {
  SCHEDULE_PERIODS,
  WEEKDAYS,
} from './BursarExportsConfiguration';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('Bursar configuration api queries', () => {
  describe('useBursarConfigQuery', () => {
    it('should return None schedule when config is not set up', async () => {
      useOkapiKy.mockClear().mockReturnValue({
        get: () => ({
          json: () => ({
            isLoading: false,
            records: [],
          }),
        }),
      });

      const { result, waitFor } = renderHook(() => useBursarConfigQuery(), { wrapper });

      await waitFor(() => {
        return !result.current.isLoading;
      });

      expect(result.current.bursarConfig.schedulePeriod).toBe(SCHEDULE_PERIODS.none);
    });

    it('should convert weekDays arrays to object', async () => {
      useOkapiKy.mockClear().mockReturnValue({
        get: () => ({
          json: () => ({
            isLoading: false,
            records: [{ weekDays: [WEEKDAYS[0]] }],
          }),
        }),
      });

      const { result, waitFor } = renderHook(() => useBursarConfigQuery(), { wrapper });

      await waitFor(() => {
        return Boolean(result.current.bursarConfig.weekDays);
      });

      expect(result.current.bursarConfig.weekDays[WEEKDAYS[0].toLowerCase()]).toBeTruthy();
    });
  });

  describe('useBursarConfigMutation', () => {
    it('should make post request when id is not provided', async () => {
      const postMock = jest.fn();

      useOkapiKy.mockClear().mockReturnValue({
        post: postMock,
      });

      const { result } = renderHook(
        () => useBursarConfigMutation(),
        { wrapper },
      );

      await result.current.mutateBursarConfig({ schedulePeriod: SCHEDULE_PERIODS.none });

      expect(postMock).toHaveBeenCalled();
    });

    it('should make put request when id is provided', async () => {
      const putMock = jest.fn();

      useOkapiKy.mockClear().mockReturnValue({
        put: putMock,
      });

      const { result } = renderHook(
        () => useBursarConfigMutation(),
        { wrapper },
      );

      await result.current.mutateBursarConfig({
        id: 1,
        schedulePeriod: SCHEDULE_PERIODS.none,
        weekDays: { [WEEKDAYS[0]]: true, [WEEKDAYS[1]]: false }
      });

      expect(putMock).toHaveBeenCalled();
    });
  });
});

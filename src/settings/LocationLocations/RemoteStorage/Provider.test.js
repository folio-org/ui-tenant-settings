import React from 'react';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useStripes } from '@folio/stripes/core';

import '../../../../test/jest/__mocks__';

import { RemoteStorageApiProvider, useRemoteStorageApi } from './Provider';
import { useRemoteStorageConfigurations } from '../../../hooks/useRemoteStorageConfigurations';
import { useRemoteStorageMappings } from '../../../hooks/useRemoteStorageMappings';
import { useRemoteStorageMappingUpdate } from '../../../hooks/useRemoteStorageMappingUpdate';
import { useRemoteStorageMappingDelete } from '../../../hooks/useRemoteStorageMappingDelete';

jest.mock('../../../hooks/useRemoteStorageConfigurations');
jest.mock('../../../hooks/useRemoteStorageMappings');
jest.mock('../../../hooks/useRemoteStorageMappingUpdate');
jest.mock('../../../hooks/useRemoteStorageMappingDelete');

const mockConfigurations = [
  {
    id: 'config-1',
    name: 'Remote Storage 1',
  },
  {
    id: 'config-2',
    name: 'Remote Storage 2',
  },
];

const mockMappings = [
  {
    folioLocationId: 'location-1',
    configurationId: 'config-1',
  },
  {
    folioLocationId: 'location-2',
    configurationId: 'config-2',
  },
];

describe('RemoteStorageApiProvider', () => {
  let queryClient;
  let mockUpdateMapping;
  let mockDeleteMapping;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    mockUpdateMapping = jest.fn(() => Promise.resolve({ success: true }));
    mockDeleteMapping = jest.fn(() => Promise.resolve({ success: true }));

    useRemoteStorageConfigurations.mockReturnValue({
      configurations: mockConfigurations,
      isConfigurationsLoading: false,
      isConfigurationsError: false,
    });

    useRemoteStorageMappings.mockReturnValue({
      mappings: mockMappings,
      isMappingsLoading: false,
      isMappingsError: false,
    });

    useRemoteStorageMappingUpdate.mockReturnValue({
      updateMapping: mockUpdateMapping,
    });

    useRemoteStorageMappingDelete.mockReturnValue({
      deleteMapping: mockDeleteMapping,
    });

    useStripes.mockReturnValue({
      hasInterface: jest.fn().mockReturnValue(true),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <RemoteStorageApiProvider>
        {children}
      </RemoteStorageApiProvider>
    </QueryClientProvider>
  );

  it('should provide configurations data', async () => {
    const { result } = renderHook(() => useRemoteStorageApi(), { wrapper });

    await waitFor(() => {
      expect(result.current.configurations).toEqual(mockConfigurations);
      expect(result.current.isConfigurationsLoading).toBe(false);
      expect(result.current.isConfigurationsError).toBe(false);
    });
  });

  it('should provide mappings data', async () => {
    const { result } = renderHook(() => useRemoteStorageApi(), { wrapper });

    await waitFor(() => {
      expect(result.current.mappings).toEqual(mockMappings);
      expect(result.current.isMappingsLoading).toBe(false);
      expect(result.current.isMappingsError).toBe(false);
    });
  });

  it('should create remoteMap from mappings', async () => {
    const { result } = renderHook(() => useRemoteStorageApi(), { wrapper });

    await waitFor(() => {
      expect(result.current.remoteMap).toEqual({
        'location-1': 'config-1',
        'location-2': 'config-2',
      });
    });
  });

  it('should provide translate function', async () => {
    const { result } = renderHook(() => useRemoteStorageApi(), { wrapper });

    await waitFor(() => {
      expect(result.current.translate).toBeDefined();
      expect(typeof result.current.translate).toBe('function');
    });
  });

  describe('setMapping', () => {
    it('should call updateMapping when configurationId is provided and mapping does not exist', async () => {
      const { result } = renderHook(() => useRemoteStorageApi(), { wrapper });

      await waitFor(() => expect(result.current.setMapping).toBeDefined());

      const newMapping = {
        folioLocationId: 'location-3',
        configurationId: 'config-3',
      };

      await result.current.setMapping(newMapping);

      expect(mockUpdateMapping).toHaveBeenCalledWith({
        data: newMapping,
      });
    });

    it('should call updateMapping when configurationId is provided and mapping is different', async () => {
      const { result } = renderHook(() => useRemoteStorageApi(), { wrapper });

      await waitFor(() => expect(result.current.setMapping).toBeDefined());

      const updatedMapping = {
        folioLocationId: 'location-1',
        configurationId: 'config-3',
      };

      await result.current.setMapping(updatedMapping);

      expect(mockUpdateMapping).toHaveBeenCalledWith({
        data: updatedMapping,
      });
    });

    it('should not call updateMapping when configurationId is the same', async () => {
      const { result } = renderHook(() => useRemoteStorageApi(), { wrapper });

      await waitFor(() => expect(result.current.setMapping).toBeDefined());

      const sameMapping = {
        folioLocationId: 'location-1',
        configurationId: 'config-1',
      };

      await result.current.setMapping(sameMapping);

      expect(mockUpdateMapping).not.toHaveBeenCalled();
      expect(mockDeleteMapping).not.toHaveBeenCalled();
    });

    it('should call deleteMapping when configurationId is null', async () => {
      const { result } = renderHook(() => useRemoteStorageApi(), { wrapper });

      await waitFor(() => expect(result.current.setMapping).toBeDefined());

      const deleteMapping = {
        folioLocationId: 'location-1',
        configurationId: null,
      };

      await result.current.setMapping(deleteMapping);

      expect(mockDeleteMapping).toHaveBeenCalledWith({
        folioLocationId: 'location-1',
      });
    });

    it('should call deleteMapping when configurationId is undefined', async () => {
      const { result } = renderHook(() => useRemoteStorageApi(), { wrapper });

      await waitFor(() => expect(result.current.setMapping).toBeDefined());

      const deleteMapping = {
        folioLocationId: 'location-1',
        configurationId: undefined,
      };

      await result.current.setMapping(deleteMapping);

      expect(mockDeleteMapping).toHaveBeenCalledWith({
        folioLocationId: 'location-1',
      });
    });

    it('should invalidate queries after successful update', async () => {
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useRemoteStorageApi(), { wrapper });

      await waitFor(() => expect(result.current.setMapping).toBeDefined());

      const newMapping = {
        folioLocationId: 'location-3',
        configurationId: 'config-3',
      };

      await result.current.setMapping(newMapping);

      expect(invalidateQueriesSpy).toHaveBeenCalledWith(['REMOTE_STORAGE_MAPPINGS']);
    });

    it('should invalidate queries after successful delete', async () => {
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useRemoteStorageApi(), { wrapper });

      await waitFor(() => expect(result.current.setMapping).toBeDefined());

      const deleteMapping = {
        folioLocationId: 'location-1',
        configurationId: null,
      };

      await result.current.setMapping(deleteMapping);

      expect(invalidateQueriesSpy).toHaveBeenCalledWith(['REMOTE_STORAGE_MAPPINGS']);
    });

    it('should not call update or delete when remote-storage-mappings interface is not available', async () => {
      useStripes.mockReturnValue({
        hasInterface: jest.fn().mockReturnValue(false),
      });

      const { result } = renderHook(() => useRemoteStorageApi(), { wrapper });

      await waitFor(() => expect(result.current.setMapping).toBeDefined());

      const newMapping = {
        folioLocationId: 'location-3',
        configurationId: 'config-3',
      };

      await result.current.setMapping(newMapping);

      expect(mockUpdateMapping).not.toHaveBeenCalled();
      expect(mockDeleteMapping).not.toHaveBeenCalled();
    });
  });

  describe('interface availability', () => {
    it('should pass enabled flag based on remote-storage-configurations interface', () => {
      const hasInterfaceMock = jest.fn((name) => name === 'remote-storage-configurations');

      useStripes.mockReturnValue({
        hasInterface: hasInterfaceMock,
      });

      renderHook(() => useRemoteStorageApi(), { wrapper });

      expect(useRemoteStorageConfigurations).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            enabled: true,
          }),
        })
      );

      expect(useRemoteStorageMappings).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            enabled: false,
          }),
        })
      );
    });

    it('should pass enabled flag based on remote-storage-mappings interface', () => {
      const hasInterfaceMock = jest.fn((name) => name === 'remote-storage-mappings');

      useStripes.mockReturnValue({
        hasInterface: hasInterfaceMock,
      });

      renderHook(() => useRemoteStorageApi(), { wrapper });

      expect(useRemoteStorageConfigurations).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            enabled: false,
          }),
        })
      );

      expect(useRemoteStorageMappings).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            enabled: true,
          }),
        })
      );
    });
  });

  describe('loading and error states', () => {
    it('should reflect configurations loading state', async () => {
      useRemoteStorageConfigurations.mockReturnValue({
        configurations: [],
        isConfigurationsLoading: true,
        isConfigurationsError: false,
      });

      const { result } = renderHook(() => useRemoteStorageApi(), { wrapper });

      await waitFor(() => {
        expect(result.current.isConfigurationsLoading).toBe(true);
      });
    });

    it('should reflect configurations error state', async () => {
      useRemoteStorageConfigurations.mockReturnValue({
        configurations: [],
        isConfigurationsLoading: false,
        isConfigurationsError: true,
      });

      const { result } = renderHook(() => useRemoteStorageApi(), { wrapper });

      await waitFor(() => {
        expect(result.current.isConfigurationsError).toBe(true);
      });
    });

    it('should reflect mappings loading state', async () => {
      useRemoteStorageMappings.mockReturnValue({
        mappings: [],
        isMappingsLoading: true,
        isMappingsError: false,
      });

      const { result } = renderHook(() => useRemoteStorageApi(), { wrapper });

      await waitFor(() => {
        expect(result.current.isMappingsLoading).toBe(true);
      });
    });

    it('should reflect mappings error state', async () => {
      useRemoteStorageMappings.mockReturnValue({
        mappings: [],
        isMappingsLoading: false,
        isMappingsError: true,
      });

      const { result } = renderHook(() => useRemoteStorageApi(), { wrapper });

      await waitFor(() => {
        expect(result.current.isMappingsError).toBe(true);
      });
    });
  });

  describe('remoteMap memoization', () => {
    it('should recalculate remoteMap when mappings change', async () => {
      const { result, rerender } = renderHook(() => useRemoteStorageApi(), { wrapper });

      await waitFor(() => {
        expect(result.current.remoteMap).toEqual({
          'location-1': 'config-1',
          'location-2': 'config-2',
        });
      });

      // Update mappings
      useRemoteStorageMappings.mockReturnValue({
        mappings: [
          {
            folioLocationId: 'location-1',
            configurationId: 'config-3',
          },
        ],
        isMappingsLoading: false,
        isMappingsError: false,
      });

      rerender();

      await waitFor(() => {
        expect(result.current.remoteMap).toEqual({
          'location-1': 'config-3',
        });
      });
    });
  });
});

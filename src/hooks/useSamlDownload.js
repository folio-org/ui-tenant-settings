import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const SAML_DOWNLOAD = 'SAML_DOWNLOAD';

export const useSamlDownload = (options) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: SAML_DOWNLOAD });

  const { data, isLoading: isSamlDownloadLoading, refetch } = useQuery(
    {
      queryKey: [SAML_DOWNLOAD, namespaceKey],
      queryFn: () => ky.get('saml/regenerate').json(),
      enabled: false,
      ...options
    }
  );

  return {
    fileData: data,
    downloadFile: refetch,
    isSamlDownloadLoading,
  };
};

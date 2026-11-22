import { getAccessTokenForCredentials } from 'test/integration/graphql/utils/get-access-token-for-credentials.util';

export const getYcombinatorAdminAccessToken = () =>
  getAccessTokenForCredentials({
    email: 'admin@sterlitee.in',
    workspaceSubdomain: 'sterlitee-partners',
  });

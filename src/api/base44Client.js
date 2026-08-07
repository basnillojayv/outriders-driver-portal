import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { applyDevAuthBypass } from '@/lib/dev-auth';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

//Create a client with authentication required
export const base44 = applyDevAuthBypass(createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
}));

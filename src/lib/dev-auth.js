/**
 * Demo mode — `VITE_DEMO_MODE=true` at build time.
 *
 * Unlike the dev bypass below this DOES apply to production builds. It exists
 * for the standalone Vercel deploy (see vercel.json): that build has no Base44
 * backend behind `/api`, so auth and every data call are served from the stubs
 * in this file instead of redirecting to a login that can never succeed.
 */
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

/**
 * Local-development auth bypass.
 *
 * Enabled when demo mode is on, or when BOTH hold:
 *   - the app is running under `vite dev` (`import.meta.env.DEV`)
 *   - `VITE_DEV_BYPASS_AUTH=true` is set (see .env.local.example)
 *
 * Vite statically replaces `import.meta.env.DEV` with `false` in a production
 * build, so the dev half collapses to dead code outside `vite dev`.
 */
export const DEV_BYPASS_AUTH =
  DEMO_MODE || (import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'true');

/**
 * Stand-in for the object `base44.auth.me()` normally resolves to. Fields match
 * what the app actually reads off the user; extend as pages need more.
 */
export const DEV_BYPASS_USER = {
  id: 'dev-user',
  email: import.meta.env.VITE_DEV_BYPASS_EMAIL || 'dev@linehaulstation.com',
  full_name: 'Dev User',
  first_name: 'Dev',
  last_name: 'User',
  username: 'devuser',
  // 'admin' unlocks the /admin portal; anything else is treated as a driver.
  role: import.meta.env.VITE_DEV_BYPASS_ROLE || 'user',
  profile_photo_url: null,
  phone: '',
  city: '',
  state: '',
  created_date: '2024-01-01T00:00:00.000Z',
};

/**
 * Replaces the auth surface of a base44 client with offline stand-ins, so the
 * ~25 components that call `base44.auth.me()` directly resolve instead of
 * failing against a backend we aren't authenticated to.
 */

/** The Member record the app resolves for the signed-in dev user. */
const DEV_MEMBER = {
  id: 'dev-member',
  lhs_member_id: 'LHS-00001',
  first_name: DEV_BYPASS_USER.first_name,
  last_name: DEV_BYPASS_USER.last_name,
  email: DEV_BYPASS_USER.email,
  phone: '',
  membership_status: 'active',
  portal_role: DEV_BYPASS_USER.role === 'admin' ? 'admin' : 'member',
  member_since: '2025-01-01',
  affiliate_id: 'dev-affiliate',
  affiliate_leads: 7,
  affiliate_tier2_leads: 64,
  affiliate_tier3_leads: 742,
  affiliate_credits: 0,
  created_date: DEV_BYPASS_USER.created_date,
};

/**
 * Canned responses for the backend functions the UI calls on load. Shapes mirror
 * base44/functions/<name>/entry.ts. Anything not listed resolves to `{ data: {} }`.
 */
const DEV_FUNCTION_RESPONSES = {
  getAffiliateCampaignData: {
    affiliate: {
      id: DEV_MEMBER.affiliate_id,
      referralLink: `https://membership.linehaulstation.com/join?am_id=${DEV_MEMBER.affiliate_id}`,
      campaignId: null,
      clicks: 0,
      leads: DEV_MEMBER.affiliate_leads,
      tier2Leads: DEV_MEMBER.affiliate_tier2_leads,
      tier3Leads: DEV_MEMBER.affiliate_tier3_leads,
      credits: DEV_MEMBER.affiliate_credits,
      networkLeads: DEV_MEMBER.affiliate_tier2_leads + DEV_MEMBER.affiliate_tier3_leads,
    },
  },
  linkPortalUser: { hasActiveMembership: true },
};

/** Seed rows per entity. Entities absent here resolve to an empty list. */
const DEV_ENTITY_SEEDS = {
  Member: [DEV_MEMBER],
  User: [DEV_BYPASS_USER],
};

/**
 * Offline stand-in for one entity module. Reads resolve against the seed rows,
 * writes echo their input back so optimistic UI keeps working.
 *
 * Without this, entity reads 404 against the absent backend and react-query
 * re-fires them forever — pages gated on `isLoading` (HomeV3, most driver
 * pages) never leave their loading screen.
 */
const createStubEntity = (name) => {
  const rows = DEV_ENTITY_SEEDS[name] || [];
  const matches = (row, query = {}) =>
    Object.entries(query).every(([k, v]) => row[k] === v);

  return {
    list: async () => [...rows],
    filter: async (query) => rows.filter((r) => matches(r, query)),
    get: async (id) => rows.find((r) => r.id === id) || null,
    create: async (data) => ({ id: `dev-${name}-${rows.length + 1}`, ...data }),
    update: async (id, data) => ({ id, ...data }),
    delete: async () => ({ success: true }),
    bulkCreate: async (items = []) => items.map((d, i) => ({ id: `dev-${name}-${i}`, ...d })),
    schema: async () => ({}),
    subscribe: () => () => {},
  };
};

export const applyDevAuthBypass = (client) => {
  if (!DEV_BYPASS_AUTH) return client;

  client.auth.me = async () => DEV_BYPASS_USER;
  client.auth.isAuthenticated = async () => true;
  client.auth.logout = () => {
    console.warn('[dev-auth] logout() ignored while the dev bypass is active.');
  };
  client.auth.redirectToLogin = () => {
    console.warn('[dev-auth] redirectToLogin() ignored while the dev bypass is active.');
  };

  // Serve entity reads from seeds. A Proxy covers every entity name the app
  // touches without us having to enumerate them.
  const entityCache = new Map();
  client.entities = new Proxy({}, {
    get: (_target, name) => {
      if (typeof name !== 'string') return undefined;
      if (!entityCache.has(name)) entityCache.set(name, createStubEntity(name));
      return entityCache.get(name);
    },
  });

  client.functions.invoke = async (functionName) => {
    const data = DEV_FUNCTION_RESPONSES[functionName];
    if (data === undefined) {
      console.warn(`[dev-auth] No stub for function "${functionName}" — returning {}.`);
    }
    return { data: data ?? {} };
  };

  console.warn(
    `[dev-auth] BYPASS ACTIVE — signed in as ${DEV_BYPASS_USER.email} (role: ${DEV_BYPASS_USER.role}). ` +
    'Auth, entities and backend functions are served from local stubs; no real data is loaded. ' +
    'Unset VITE_DEV_BYPASS_AUTH in .env.local to restore the real login flow.'
  );

  return client;
};

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const apiKey = Deno.env.get('GHL_API_KEY');
    const locationId = Deno.env.get('GHL_LOCATION_ID');
    const results = [];

    // 1. GHL API Key health check — hit a lightweight endpoint
    let ghlStatus = 'unknown';
    let ghlError = null;
    let ghlDetail = null;
    try {
      const res = await fetch(
        `https://services.leadconnectorhq.com/contacts/?locationId=${locationId}&limit=1`,
        { headers: { Authorization: `Bearer ${apiKey}`, Version: '2021-07-28' } }
      );
      if (res.status === 200) {
        ghlStatus = 'active';
        ghlDetail = null;
      } else {
        const body = await res.text();
        ghlStatus = 'error';
        ghlError = `HTTP ${res.status}: ${body.substring(0, 120)}`;
      }
    } catch (e) {
      ghlStatus = 'error';
      ghlError = e.message;
    }
    results.push({
      key: 'ghl_api',
      label: 'GoHighLevel API Key',
      description: ghlStatus === 'active'
        ? `Connected${ghlDetail ? ` — ${ghlDetail}` : ''}`
        : ghlError || 'Could not connect',
      status: ghlStatus,
    });

    // 2. Webhook secret configured
    const webhookSecret = Deno.env.get('GHL_WEBHOOK_SECRET');
    results.push({
      key: 'webhook',
      label: 'Member Webhook',
      description: webhookSecret ? 'Secret configured — receiving GHL agreement-signed events' : 'Webhook secret not set',
      status: webhookSecret ? 'active' : 'warning',
    });

    // 3. Affiliate sync — check last enriched member timestamp
    let syncStatus = 'unknown';
    let syncDetail = null;
    try {
      const members = await base44.asServiceRole.entities.Member.filter({ affiliate_lookup_status: 'found' }, '-affiliate_enriched_at', 1);
      if (members && members.length > 0 && members[0].affiliate_enriched_at) {
        const lastSync = new Date(members[0].affiliate_enriched_at);
        const hoursAgo = Math.round((Date.now() - lastSync.getTime()) / 3600000);
        if (hoursAgo < 26) {
          syncStatus = 'active';
          syncDetail = `Last synced ${hoursAgo}h ago`;
        } else {
          syncStatus = 'warning';
          syncDetail = `Last synced ${hoursAgo}h ago — may need manual trigger`;
        }
      } else {
        syncStatus = 'warning';
        syncDetail = 'No affiliate sync records found';
      }
    } catch (e) {
      syncStatus = 'error';
      syncDetail = e.message;
    }
    results.push({
      key: 'affiliate_sync',
      label: 'Affiliate Daily Sync',
      description: syncDetail || 'Checking sync history...',
      status: syncStatus,
    });

    // 4. Member ID counter check
    let counterStatus = 'unknown';
    let counterDetail = null;
    try {
      const counters = await base44.asServiceRole.entities.MemberIdCounter.list();
      if (counters && counters.length > 0) {
        counterStatus = 'active';
        const total = counters.reduce((sum, c) => sum + (c.current_seq || 0), 0);
        const latest = counters
          .map((c) => ({ period: c.period, seq: c.current_seq || 0 }))
          .sort((a, b) => (b.period || '').localeCompare(a.period || ''))[0];
        counterDetail = latest
          ? `${total} members assigned across ${counters.length} month(s) (latest ${latest.period}: ${latest.seq})`
          : `${total} members assigned across ${counters.length} month(s)`;
      } else {
        counterStatus = 'warning';
        counterDetail = 'Counter not initialized';
      }
    } catch (e) {
      counterStatus = 'error';
      counterDetail = e.message;
    }
    results.push({
      key: 'member_counter',
      label: 'Member ID Counter',
      description: counterDetail || 'Checking...',
      status: counterStatus,
    });

    const hasError = results.some(r => r.status === 'error');
    const hasWarning = results.some(r => r.status === 'warning');
    const overall = hasError ? 'error' : hasWarning ? 'warning' : 'active';

    return Response.json({ results, overall, checked_at: new Date().toISOString() });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});
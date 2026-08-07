import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Scan GHL contacts across many pages and tally ALL unique sources/tags found.
// Use max_pages to control how deep to scan (each page = 100 contacts).

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

    const apiKey = Deno.env.get('GHL_API_KEY');
    const locationId = Deno.env.get('GHL_LOCATION_ID');

    const { max_pages = 20 } = await req.json().catch(() => ({}));

    const sourceTally: Record<string, number> = {};
    const tagTally: Record<string, number> = {};
    let totalScanned = 0;
    let nextPageId: string | null = null;
    let nextPageAfter: number | null = null;
    let page = 0;

    while (page < max_pages) {
      let url = `https://services.leadconnectorhq.com/contacts/?locationId=${locationId}&limit=100`;
      if (nextPageId) url += `&startAfterId=${nextPageId}&startAfter=${nextPageAfter}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Version': '2021-07-28' },
      });
      const data = await res.json();
      const contacts = data.contacts || [];
      if (contacts.length === 0) break;

      for (const c of contacts) {
        const src = c.source || '(none)';
        sourceTally[src] = (sourceTally[src] || 0) + 1;
        for (const tag of (c.tags || [])) {
          tagTally[tag] = (tagTally[tag] || 0) + 1;
        }
      }

      totalScanned += contacts.length;
      nextPageId = data.meta?.startAfterId || null;
      nextPageAfter = data.meta?.startAfter || null;
      page++;

      if (!nextPageId) break;
      await new Promise(r => setTimeout(r, 100));
    }

    // Sort tallies descending
    const sortedSources = Object.entries(sourceTally).sort((a, b) => b[1] - a[1]);
    const sortedTags = Object.entries(tagTally).sort((a, b) => b[1] - a[1]);

    return Response.json({
      total_scanned: totalScanned,
      pages_scanned: page,
      sources: Object.fromEntries(sortedSources),
      tags: Object.fromEntries(sortedTags),
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});
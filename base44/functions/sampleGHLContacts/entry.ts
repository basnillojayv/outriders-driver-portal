import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Samples existing GHL contacts to inspect source, tags, and custom fields.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

    const apiKey = Deno.env.get('GHL_API_KEY');
    const locationId = Deno.env.get('GHL_LOCATION_ID');

    const { limit = 20, start_after_id = null, start_after = null } = await req.json().catch(() => ({}));

    let url = `https://services.leadconnectorhq.com/contacts/?locationId=${locationId}&limit=${limit}`;
    if (start_after_id) url += `&startAfterId=${start_after_id}&startAfter=${start_after}`;

    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Version': '2021-07-28' },
    });
    const data = await res.json();

    // Return only the fields we care about for source auditing
    const contacts = (data.contacts || []).map(c => ({
      id: c.id,
      email: c.email,
      name: `${c.firstName || ''} ${c.lastName || ''}`.trim(),
      source: c.source || null,
      tags: c.tags || [],
      customFields: c.customFields || [],
      dateAdded: c.dateAdded,
      createdBy: c.createdBy?.source || null,
    }));

    // Tally sources
    const sourceTally = {};
    for (const c of contacts) {
      const key = c.source || '(none)';
      sourceTally[key] = (sourceTally[key] || 0) + 1;
    }

    return Response.json({
      total_in_location: data.meta?.total,
      returned: contacts.length,
      next_page_id: data.meta?.startAfterId || null,
      next_page_after: data.meta?.startAfter || null,
      source_tally: sourceTally,
      contacts,
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});
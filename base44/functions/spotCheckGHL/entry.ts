import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

    const apiKey = Deno.env.get('GHL_API_KEY');
    const locationId = Deno.env.get('GHL_LOCATION_ID');

    const { emails } = await req.json();
    if (!emails || !Array.isArray(emails)) return Response.json({ error: 'emails array required' }, { status: 400 });

    const results = [];

    for (const email of emails) {
      const url = `https://services.leadconnectorhq.com/contacts/search?locationId=${locationId}&query=${encodeURIComponent(email)}&limit=1`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Version': '2021-07-28',
        },
      });
      const data = await res.json();
      const contacts = data.contacts || [];
      results.push({
        email,
        found: contacts.length > 0,
        ghl_id: contacts[0]?.id || null,
        name: contacts[0] ? `${contacts[0].firstName || ''} ${contacts[0].lastName || ''}`.trim() : null,
        tags: contacts[0]?.tags || [],
      });
    }

    const found = results.filter(r => r.found).length;
    return Response.json({ total_checked: results.length, found, not_found: results.length - found, results });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});
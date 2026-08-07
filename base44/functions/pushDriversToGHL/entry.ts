import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Push all Base44 Driver records into GHL as contacts (upsert by email)
// Safe to re-run — GHL deduplicates by email within a location

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

    const apiKey = Deno.env.get('GHL_API_KEY');
    const locationId = Deno.env.get('GHL_LOCATION_ID');
    if (!apiKey || !locationId) return Response.json({ error: 'Missing secrets' }, { status: 500 });

    const { dry_run = false, batch_size = 10, offset = 0, limit = 100 } = await req.json().catch(() => ({}));

    // Fetch a page of drivers (avoid loading all 1600 at once into memory)
    const allDrivers = await base44.asServiceRole.entities.Driver.list();
    const drivers = allDrivers.slice(offset, offset + limit);

    console.log(`[PushToGHL] Processing ${drivers.length} drivers (offset=${offset}, limit=${limit}), dry_run=${dry_run}`);

    const results = { created: 0, updated: 0, skipped: 0, errors: [] };

    // Process in small batches to avoid rate limits
    for (let i = 0; i < drivers.length; i += batch_size) {
      const batch = drivers.slice(i, i + batch_size);

      await Promise.all(batch.map(async (driver) => {
        if (!driver.email) {
          results.skipped++;
          return;
        }

        const payload = {
          locationId,
          email: driver.email,
          firstName: driver.first_name || '',
          lastName: driver.last_name || '',
          phone: driver.phone || undefined,
          companyName: driver.business_name || undefined,
          tags: driver.tags ? driver.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
          source: 'Base44 Import',
        };

        if (dry_run) {
          console.log(`[DryRun] Would upsert: ${driver.email}`);
          results.created++;
          return;
        }

        // Use upsert endpoint — creates if not found, updates if exists
        const res = await fetch(`https://services.leadconnectorhq.com/contacts/upsert`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Version': '2021-07-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(`[PushToGHL] Error for ${driver.email}: ${JSON.stringify(data)}`);
          results.errors.push({ email: driver.email, error: data.message || res.status });
          return;
        }

        if (data.traceId || data.new) {
          results.created++;
        } else {
          results.updated++;
        }
      }));

      // Small delay between batches to be kind to GHL rate limits
      if (i + batch_size < drivers.length) {
        await new Promise(r => setTimeout(r, 300));
      }
    }

    console.log(`[PushToGHL] Done — created:${results.created} updated:${results.updated} skipped:${results.skipped} errors:${results.errors.length}`);

    return Response.json({
      success: true,
      dry_run,
      offset,
      limit,
      drivers_in_batch: drivers.length,
      total_drivers: allDrivers.length,
      has_more: offset + limit < allDrivers.length,
      next_offset: offset + limit,
      ...results,
    });
  } catch (err) {
    console.error('[PushToGHL] Fatal error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});
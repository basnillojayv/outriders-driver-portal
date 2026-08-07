import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

async function ghlGet(apiKey, locationId, path) {
  const url = `https://services.leadconnectorhq.com/affiliate-manager/${locationId}/${path}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Version': '2021-07-28' },
  });
  const text = await res.text();
  if (!res.ok) {
    console.log(`[GHL] ${path} → ${res.status}`);
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

    const apiKey = Deno.env.get('GHL_API_KEY');
    const locationId = Deno.env.get('GHL_LOCATION_ID');
    if (!apiKey || !locationId) return Response.json({ error: 'Missing secrets' }, { status: 500 });

    const report = {
      timestamp: new Date().toISOString(),
      total_affiliates: 0,
      affiliates_with_parents: 0,
      affiliates_with_children: 0,
      chains_found: [],
      findings: [],
    };

    // Get all affiliates (paginated)
    console.log('[AnalyzeChains] Fetching all affiliates...');
    const allAffiliates = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore && page <= 10) {
      const res = await ghlGet(apiKey, locationId, `affiliates?limit=100&page=${page}`);
      if (!res?.affiliates || res.affiliates.length === 0) {
        hasMore = false;
      } else {
        allAffiliates.push(...res.affiliates);
        page++;
      }
    }

    report.total_affiliates = allAffiliates.length;
    console.log(`[AnalyzeChains] Total affiliates: ${allAffiliates.length}`);

    // Index affiliates by ID for quick lookup
    const affiliatesById = {};
    allAffiliates.forEach(aff => {
      affiliatesById[aff._id || aff.id] = aff;
    });

    // Find parent-child relationships
    const affiliatesWithParents = allAffiliates.filter(a => a.parentId || a.parent_id);
    const parentMap = {};
    
    affiliatesWithParents.forEach(child => {
      const parentId = child.parentId || child.parent_id;
      if (!parentMap[parentId]) parentMap[parentId] = [];
      parentMap[parentId].push(child);
    });

    report.affiliates_with_parents = affiliatesWithParents.length;
    report.affiliates_with_children = Object.keys(parentMap).length;

    console.log(`[AnalyzeChains] Affiliates with parents: ${affiliatesWithParents.length}`);
    console.log(`[AnalyzeChains] Affiliates with children: ${Object.keys(parentMap).length}`);

    // Analyze chains
    const chainsAnalyzed = [];
    const parentIds = Object.keys(parentMap).slice(0, 10); // Limit to first 10 parent chains

    for (const parentId of parentIds) {
      const parent = affiliatesById[parentId];
      if (!parent) continue;

      const children = parentMap[parentId];
      
      for (const child of children.slice(0, 3)) { // First 3 children per parent
        const chainAnalysis = {
          parent_id: parentId,
          parent_name: parent.name || parent.contactName || '(unknown)',
          parent_clicks: parent.clickCount || parent.clicks || 0,
          parent_tier1_leads: parent.lead || parent.leads || 0,
          parent_tier2_leads: parent.tier2_leads || parent.tier2Lead || 0,
          parent_tier3_leads: parent.tier3_leads || parent.tier3Lead || 0,
          
          child_id: child._id || child.id,
          child_name: child.name || child.contactName || '(unknown)',
          child_is_affiliate: true,
          child_clicks: child.clickCount || child.clicks || 0,
          child_tier1_leads: child.lead || child.leads || 0,
          child_tier2_leads: child.tier2_leads || child.tier2Lead || 0,
          child_tier3_leads: child.tier3_leads || child.tier3Lead || 0,
          
          observations: [],
        };

        // Key observations
        if (chainAnalysis.child_tier1_leads === 0) {
          chainAnalysis.observations.push('Child affiliate has 0 Tier 1 leads');
        }
        if (chainAnalysis.child_tier2_leads > 0 && chainAnalysis.child_tier1_leads === 0) {
          chainAnalysis.observations.push('INTERESTING: Child has Tier 2 but no Tier 1 (impossible?)');
        }
        if (chainAnalysis.parent_tier2_leads > 0) {
          chainAnalysis.observations.push(`Parent shows Tier 2 (${chainAnalysis.parent_tier2_leads}), may include this child's contributions`);
        }

        chainsAnalyzed.push(chainAnalysis);
      }
    }

    report.chains_found = chainsAnalyzed;

    // Findings
    report.findings = [
      `Total affiliates: ${report.total_affiliates}`,
      `Affiliates with parent-child relationship: ${report.affiliates_with_parents}`,
      `Parent affiliates (have children): ${report.affiliates_with_children}`,
      chainsAnalyzed.length > 0 
        ? `Sampled ${chainsAnalyzed.length} referral chains for analysis`
        : `No parent-child relationships found`,
      ...chainsAnalyzed.map((c, i) => 
        `Chain ${i+1}: "${c.parent_name}" (Tier1: ${c.parent_tier1_leads}, Tier2: ${c.parent_tier2_leads}) → ` +
        `"${c.child_name}" (Tier1: ${c.child_tier1_leads}, Tier2: ${c.child_tier2_leads}). ` +
        `${c.observations.join('; ')}`
      ),
    ];

    console.log(`[AnalyzeChains] Report complete with ${chainsAnalyzed.length} chains`);
    return Response.json(report);

  } catch (err) {
    console.error('[analyzeAffiliateChains]', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email, first_name } = await req.json();

    if (!email || !first_name) {
      return Response.json({ error: 'Missing email or first_name' }, { status: 400 });
    }

    const appUrl = "https://app.linehaulstation.com";

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      from_name: "Lulu — LineHaul Station",
      subject: `Welcome to the Outriders, ${first_name}!`,
      body: `
Hi ${first_name},

You're in. Welcome to the Outriders Drivers Club — the most exclusive drivers' club in trucking.

Your free membership is active. Complete your profile to unlock your full portal and get your Outriders avatar.

Complete your profile here:
${appUrl}/profile

Here's what's waiting for you inside:
• Career Center — build your professional driver profile
• Space — explore LineHaul Station access options
• Rewards — start earning through referrals
• OneHome — the lifestyle program built for drivers

If you have any questions, reply to this email or call us at (602) 898-8000.

Welcome to the Outriders.

— The LineHaul Station Team
lulu@linehaulstation.com
      `.trim(),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
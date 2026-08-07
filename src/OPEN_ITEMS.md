# Open Items & Follow-up Work

## Member Activation POC

### Email Synchronization Strategy (Deferred to post-MVP)

**Issue:**
If a member changes their email in GHL after their Base44 portal account exists, the Base44 User account, Base44 Member record, and GHL Contact can become misaligned. Currently, there is no automated sync to handle this scenario.

**Current MVP Handling:**
Email changes will be handled manually during POC testing.

**Preferred Future Approach:**

1. **Base44 as the source of truth for profile updates**
   - Members update their email in Base44 (not GHL), as part of their profile management
   
2. **Email change verification flow**
   - Any email change requires verification before it updates the login email
   - User confirms ownership of the new email address

3. **Bidirectional sync after verification**
   - Base44 updates the Member record with the new email
   - Base44 writes the new email back to GHL (via `ghlWebhook` or a dedicated function)
   - GHL Contact email is updated in sync

4. **GHL becomes read-only for member profile data**
   - GHL remains the source of truth for membership status and lifecycle events
   - Member contact info should be managed through Base44, not directly in GHL

**Why defer to post-MVP:**
- Keeps Member Activation scope stable and testable
- Requires additional verification infrastructure
- Can be implemented once portal is live and we have real user feedback

---

## Legal Documents — Membership Agreement URL (Deferred)

**Issue:**
The Legal tab in My Settings currently links to `"#"` for the Membership Agreement. A real URL needs to be provided and wired in.

**Action Required:**
- Obtain the hosted URL for the Membership Agreement (e.g. `https://www.linehaulstation.com/membership-agreement`)
- Update `src/pages/driver/AccountSettings.jsx` → `LegalSection` → `docs` array, replacing `href: "#"` for "Membership Agreement"

---

## Related Functions & Files
- `functions/ghlWebhook` – currently handles one-way sync (GHL → Base44)
- `lib/AuthContext.jsx` – member validation during login
- `entities/Member.json` – schema with `portal_user_id`, `ghl_contact_id`, `email
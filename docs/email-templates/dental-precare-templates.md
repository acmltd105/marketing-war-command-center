# Dental & Pre-Care Coverage Email Template Library

This library contains 50 fully copy-ready email templates designed for dental coverage and pre-care coverage communications. Each template is optimized for personalization, mobile responsiveness, and omni-channel delivery using the Twilio SendGrid Template API. Leverage these templates as starter content within your Supabase-driven customer engagement workflows and sync them to desktop Rust companions or React "liquid glass" interfaces for campaign orchestration.

## Using Twilio SendGrid Template API

- **Create dynamic templates**: `POST https://api.sendgrid.com/v3/templates` with `"generation": "dynamic"`.
- **Add a version**: `POST https://api.sendgrid.com/v3/templates/{template_id}/versions` and supply HTML, subject line, and plain-text bodies.
- **Activate a version**: `POST https://api.sendgrid.com/v3/templates/{template_id}/versions/{version_id}/activate`.
- **Send with a template**: include `"template_id"` in your `mail/send` payload and map the dynamic fields shown below (e.g., `first_name`, `plan_name`).

> 💡 Supabase Tip: Store these templates in a `templates` table with JSONB fields for metadata and dynamic variables, then hydrate them into Twilio payloads via edge functions for real-time personalization.

---

## Dental Coverage Campaigns (25)

### Dental Coverage 01 — "Welcome to Brighter Smiles"
- **Persona**: New plan subscribers.
- **Subject**: `Welcome to {{plan_name}} — Your path to brighter smiles starts now!`
- **Preview**: `Discover your dental benefits, schedule your first visit, and unlock member perks.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Welcome to {{plan_name}}! We’re thrilled to support your journey toward lasting oral health. Inside your member hub you’ll find:</p>
  <ul>
    <li>Your personalized coverage summary.</li>
    <li>A curated list of in-network dentists near {{city}}.</li>
    <li>Exclusive preventive care guides to keep your smile shining.</li>
  </ul>
  <p>Tap below to activate your digital ID card and schedule your first cleaning.</p>
  <p><a href="{{cta_url}}" style="background:#34d399;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;">Activate My Benefits</a></p>
  <p>We’re here for every smile,<br>{{brand_name}} Care Team</p>
  ```
- **Dynamic Fields**: `first_name`, `plan_name`, `city`, `cta_url`, `brand_name`.
- **CTA**: Activate account.

### Dental Coverage 02 — "Plan Orientation Reminder"
- **Persona**: Members who haven’t completed onboarding.
- **Subject**: `{{first_name}}, finish your {{plan_name}} setup in minutes`
- **Preview**: `Complete three quick steps to unlock your preventive care bonuses.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>Your {{plan_name}} benefits are moments away from being fully activated. Complete these steps to access annual cleanings and whitening allowances:</p>
  <ol>
    <li>Confirm your preferred dental provider.</li>
    <li>Upload prior X-rays (optional).</li>
    <li>Set your preventive care reminders.</li>
  </ol>
  <p>Need help? Our care concierges are standing by to assist via chat.</p>
  <p><a href="{{cta_url}}" style="background:#3b82f6;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;">Complete My Setup</a></p>
  <p>Smiles ahead,<br>{{brand_name}} Support</p>
  ```
- **Dynamic Fields**: `first_name`, `plan_name`, `cta_url`, `brand_name`.
- **CTA**: Complete onboarding.

### Dental Coverage 03 — "Annual Checkup Countdown"
- **Persona**: Members due for annual visit in 30 days.
- **Subject**: `30 days until your covered dental checkup`
- **Preview**: `Reserve your appointment now to keep your benefits on track.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Your annual comprehensive exam is fully covered — but appointment slots fill fast in {{city}}. Schedule today to secure your preferred date.</p>
  <p><strong>Why schedule now?</strong></p>
  <ul>
    <li>100% coverage on your preventive visit.</li>
    <li>Complimentary fluoride treatment with participating providers.</li>
    <li>Flexible weekend availability.</li>
  </ul>
  <p><a href="{{cta_url}}" style="background:#8b5cf6;color:#ffffff;padding:12px 22px;border-radius:9999px;text-decoration:none;">Book My Checkup</a></p>
  <p>Stay smiling,<br>{{brand_name}}</p>
  ```
- **Dynamic Fields**: `first_name`, `city`, `cta_url`, `brand_name`.
- **CTA**: Schedule appointment.

### Dental Coverage 04 — "In-Network Dentist Spotlight"
- **Persona**: Members without chosen provider.
- **Subject**: `Meet {{featured_dentist}} — now accepting {{plan_name}} members`
- **Preview**: `Award-winning care two miles from {{member_location}}.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>We’ve handpicked {{featured_dentist}}, a top-rated provider specializing in gentle preventive care. With extended hours and same-day emergency visits, they’re a perfect match for your {{plan_name}} membership.</p>
  <p><strong>Why members love them:</strong></p>
  <ul>
    <li>4.9-star rating across 1,200 reviews.</li>
    <li>Complimentary whitening trays for new patients.</li>
    <li>Family-friendly office with weekend appointments.</li>
  </ul>
  <p><a href="{{cta_url}}" style="background:#f97316;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;">Reserve a Visit</a></p>
  <p>Need alternatives? Reply to connect with our care concierges.</p>
  ```
- **Dynamic Fields**: `first_name`, `featured_dentist`, `plan_name`, `member_location`, `cta_url`.
- **CTA**: Reserve appointment.

### Dental Coverage 05 — "Benefits Utilization Snapshot"
- **Persona**: Members halfway through plan year.
- **Subject**: `Your coverage scorecard: {{benefits_used}}% used, {{benefits_remaining}}% remaining`
- **Preview**: `See what's covered next and how to maximize your remaining benefits.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>You’ve already saved {{savings_amount}} with {{plan_name}}. Here’s what’s left in your benefits pool:</p>
  <ul>
    <li>Preventive visits remaining: {{preventive_visits_remaining}}</li>
    <li>Orthodontic allowance: {{ortho_allowance_remaining}}</li>
    <li>Cosmetic credit: {{cosmetic_credit_remaining}}</li>
  </ul>
  <p>Use your benefits before {{plan_year_end}} to get the most from your membership.</p>
  <p><a href="{{cta_url}}" style="background:#06b6d4;color:#ffffff;padding:10px 20px;border-radius:10px;text-decoration:none;">Plan My Next Visit</a></p>
  <p>Questions? Call {{support_phone}} or chat 24/7.</p>
  ```
- **Dynamic Fields**: `first_name`, `plan_name`, `savings_amount`, `preventive_visits_remaining`, `ortho_allowance_remaining`, `cosmetic_credit_remaining`, `plan_year_end`, `cta_url`, `support_phone`.
- **CTA**: Plan visit.

### Dental Coverage 06 — "Open Enrollment Invite"
- **Persona**: Prospective members.
- **Subject**: `Dental coverage that actually covers — enroll by {{deadline_date}}`
- **Preview**: `Lock in zero-dollar preventive visits and flex pay options.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Join {{brand_name}} and get preventive visits, whitening perks, and teledentistry consults all for less than {{monthly_rate}}/month.</p>
  <p><a href="{{cta_url}}" style="background:#2563eb;color:#ffffff;padding:12px 26px;border-radius:9999px;text-decoration:none;">Compare Plans</a></p>
  <p>Enrollment closes {{deadline_date}} — secure your smile today.</p>
  ```
- **Dynamic Fields**: `first_name`, `brand_name`, `monthly_rate`, `cta_url`, `deadline_date`.
- **CTA**: Compare plans.

### Dental Coverage 07 — "Teledentistry Follow-Up"
- **Persona**: Members after virtual consult.
- **Subject**: `Your teledentistry follow-up & covered next steps`
- **Preview**: `Here’s how to turn today’s consult into actionable dental care.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Thanks for connecting with Dr. {{dentist_last_name}}. Based on today’s notes, your next preventive steps are fully covered:</p>
  <ol>
    <li>{{next_step_one}}</li>
    <li>{{next_step_two}}</li>
    <li>{{next_step_three}}</li>
  </ol>
  <p><a href="{{cta_url}}" style="background:#22c55e;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;">Schedule Follow-Up</a></p>
  <p>Need anything else? Text us at {{support_phone}} — powered by Twilio Conversations.</p>
  ```
- **Dynamic Fields**: `first_name`, `dentist_last_name`, `next_step_one`, `next_step_two`, `next_step_three`, `cta_url`, `support_phone`.
- **CTA**: Schedule follow-up.

### Dental Coverage 08 — "Family Plan Welcome"
- **Persona**: Families newly enrolled.
- **Subject**: `Your family coverage is live — here’s how to onboard everyone`
- **Preview**: `Set up each family member’s care path in a few taps.`
- **Body**:
  ```html
  <p>Hello {{primary_first_name}},</p>
  <p>Welcome the entire {{family_name}} family to {{plan_name}}! Here’s how to get everyone covered:</p>
  <ul>
    <li>Invite {{dependent_one}} and {{dependent_two}} to the member app.</li>
    <li>Download preventive care guides tailored for each age group.</li>
    <li>Sync reminders to your family calendar.</li>
  </ul>
  <p><a href="{{cta_url}}" style="background:#f97316;color:#ffffff;padding:12px 24px;border-radius:10px;text-decoration:none;">Complete Family Setup</a></p>
  <p>We’ll send SMS nudges via Twilio to keep everyone on track.</p>
  ```
- **Dynamic Fields**: `primary_first_name`, `family_name`, `plan_name`, `dependent_one`, `dependent_two`, `cta_url`.
- **CTA**: Complete setup.

### Dental Coverage 09 — "Lapsed Appointment Nudge"
- **Persona**: Members who missed appointment.
- **Subject**: `We saved your preferred time — reschedule in one click`
- **Preview**: `Your preventive visit is still fully covered. Grab a new slot now.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>We noticed you missed your appointment with {{provider_name}}. Good news: your benefits are still ready when you are.</p>
  <p><a href="{{cta_url}}" style="background:#ef4444;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;">Reschedule Now</a></p>
  <p>Prefer a different time? Reply to this email or text {{support_phone}}.</p>
  ```
- **Dynamic Fields**: `first_name`, `provider_name`, `cta_url`, `support_phone`.
- **CTA**: Reschedule.

### Dental Coverage 10 — "Coverage Upgrade Offer"
- **Persona**: Members approaching renewal.
- **Subject**: `Upgrade to {{upgrade_plan_name}} for just {{upgrade_price}} more`
- **Preview**: `Unlock orthodontic discounts and cosmetic credits before renewal day.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>Your renewal window is open! Upgrade to {{upgrade_plan_name}} and enjoy:</p>
  <ul>
    <li>{{benefit_one}}</li>
    <li>{{benefit_two}}</li>
    <li>{{benefit_three}}</li>
  </ul>
  <p><a href="{{cta_url}}" style="background:#facc15;color:#1f2937;padding:12px 20px;border-radius:9999px;text-decoration:none;">Review Upgrade</a></p>
  <p>Offer expires {{offer_expiration}}.</p>
  ```
- **Dynamic Fields**: `first_name`, `upgrade_plan_name`, `upgrade_price`, `benefit_one`, `benefit_two`, `benefit_three`, `cta_url`, `offer_expiration`.
- **CTA**: Review upgrade.

### Dental Coverage 11 — "Claims Assistance"
- **Persona**: Members with pending claim.
- **Subject**: `We’re reviewing your recent dental claim`
- **Preview**: `Track status updates and learn what’s covered next.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>We received your claim for {{procedure_name}} performed on {{procedure_date}}. Our team is reviewing it and will update you within {{sla_days}} business days.</p>
  <p>Meanwhile, explore additional services covered under your plan — many members pair this treatment with:</p>
  <ul>
    <li>{{suggested_service_one}}</li>
    <li>{{suggested_service_two}}</li>
  </ul>
  <p><a href="{{cta_url}}" style="background:#6366f1;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;">Track Claim Status</a></p>
  <p>Questions? Call {{support_phone}} or reply to this email.</p>
  ```
- **Dynamic Fields**: `first_name`, `procedure_name`, `procedure_date`, `sla_days`, `suggested_service_one`, `suggested_service_two`, `cta_url`, `support_phone`.
- **CTA**: Track claim.

### Dental Coverage 12 — "Coverage Success Story"
- **Persona**: Prospects.
- **Subject**: `How {{member_testimonial_name}} saved {{savings_amount}} with {{plan_name}}`
- **Preview**: `See why members stay with us for 5+ years on average.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Meet {{member_testimonial_name}}, who reduced their dental costs by {{savings_amount}} in one year. With {{plan_name}}, they enjoy same-day approvals, flexible payments, and nationwide coverage.</p>
  <p><a href="{{cta_url}}" style="background:#0ea5e9;color:#ffffff;padding:12px 24px;border-radius:10px;text-decoration:none;">Read Their Story</a></p>
  <p>Ready to create your own success story?</p>
  ```
- **Dynamic Fields**: `first_name`, `member_testimonial_name`, `savings_amount`, `plan_name`, `cta_url`.
- **CTA**: Read testimonial.

### Dental Coverage 13 — "Provider Network Expansion"
- **Persona**: Members in region with new providers.
- **Subject**: `New dentists just joined your network in {{city}}`
- **Preview**: `Explore expanded hours, specialties, and family-friendly offices near you.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>We’ve added {{new_provider_count}} new dentists to the {{plan_name}} network in {{city}}. From pediatric specialists to cosmetic experts, your options just got better.</p>
  <p><a href="{{cta_url}}" style="background:#14b8a6;color:#ffffff;padding:12px 20px;border-radius:9999px;text-decoration:none;">Browse New Providers</a></p>
  <p>Prefer SMS updates? Opt in via {{sms_opt_in_url}}.</p>
  ```
- **Dynamic Fields**: `first_name`, `new_provider_count`, `plan_name`, `city`, `cta_url`, `sms_opt_in_url`.
- **CTA**: Browse providers.

### Dental Coverage 14 — "Preventive Education Series"
- **Persona**: Members engaged in wellness.
- **Subject**: `Week 1: Prevent cavities with 4 micro-habits`
- **Preview**: `A bite-sized lesson tailored to your coverage benefits.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Welcome to your Preventive Education Series! This week we explore four micro-habits that keep cavities away — all covered by your {{plan_name}} benefits.</p>
  <ol>
    <li>{{habit_one}}</li>
    <li>{{habit_two}}</li>
    <li>{{habit_three}}</li>
    <li>{{habit_four}}</li>
  </ol>
  <p><a href="{{cta_url}}" style="background:#f43f5e;color:#ffffff;padding:10px 22px;border-radius:12px;text-decoration:none;">View Full Lesson</a></p>
  <p>We’ll text reminders each week so you stay on track.</p>
  ```
- **Dynamic Fields**: `first_name`, `plan_name`, `habit_one`, `habit_two`, `habit_three`, `habit_four`, `cta_url`.
- **CTA**: View lesson.

### Dental Coverage 15 — "Employer Partner Toolkit"
- **Persona**: HR admins.
- **Subject**: `Launch {{plan_name}} dental benefits with this ready-to-send toolkit`
- **Preview**: `Includes email drafts, Slack copy, and enrollment day run-of-show.`
- **Body**:
  ```html
  <p>Hello {{contact_first_name}},</p>
  <p>We’ve bundled everything you need to launch {{plan_name}} for your team:</p>
  <ul>
    <li>Employee welcome email (editable in Twilio templates).</li>
    <li>Benefits explainer deck.</li>
    <li>Enrollment day signage and FAQ.</li>
  </ul>
  <p><a href="{{cta_url}}" style="background:#0f172a;color:#ffffff;padding:12px 26px;border-radius:6px;text-decoration:none;">Download Toolkit</a></p>
  <p>Need custom co-branding? Reply and our design team will assist.</p>
  ```
- **Dynamic Fields**: `contact_first_name`, `plan_name`, `cta_url`.
- **CTA**: Download toolkit.

### Dental Coverage 16 — "Member Anniversary"
- **Persona**: Members hitting anniversary.
- **Subject**: `{{first_name}}, 1 year of healthy smiles with {{plan_name}}`
- **Preview**: `Celebrate your savings and unlock an anniversary bonus.`
- **Body**:
  ```html
  <p>Dear {{first_name}},</p>
  <p>It’s been a year since you joined {{plan_name}} — thank you for trusting us with your smile! To celebrate, enjoy a complimentary {{anniversary_bonus}} when you schedule your next preventive visit.</p>
  <p><a href="{{cta_url}}" style="background:#dc2626;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;">Claim My Bonus</a></p>
  <p>We appreciate you,<br>{{brand_name}} Team</p>
  ```
- **Dynamic Fields**: `first_name`, `plan_name`, `anniversary_bonus`, `cta_url`, `brand_name`.
- **CTA**: Claim bonus.

### Dental Coverage 17 — "Coverage Gap Alert"
- **Persona**: Members with expiring coverage.
- **Subject**: `Coverage ends soon — keep your dental benefits active`
- **Preview**: `Renew now to avoid waiting periods and keep your dentist.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Your coverage is set to expire on {{expiration_date}}. Renew before then to keep your favorite dentist in-network and avoid any waiting periods.</p>
  <p><a href="{{cta_url}}" style="background:#7c3aed;color:#ffffff;padding:12px 26px;border-radius:9999px;text-decoration:none;">Renew Coverage</a></p>
  <p>Call {{support_phone}} if you need assistance.</p>
  ```
- **Dynamic Fields**: `first_name`, `expiration_date`, `cta_url`, `support_phone`.
- **CTA**: Renew.

### Dental Coverage 18 — "Orthodontic Interest"
- **Persona**: Members viewing ortho resources.
- **Subject**: `Straighter smiles start here — orthodontics covered up to {{ortho_coverage_percent}}%`
- **Preview**: `Download your personalized ortho guide and financing options.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Thinking about braces or aligners? Your plan covers up to {{ortho_coverage_percent}}% of orthodontic treatments.</p>
  <p><a href="{{cta_url}}" style="background:#f59e0b;color:#ffffff;padding:12px 20px;border-radius:10px;text-decoration:none;">View Ortho Options</a></p>
  <p>We’ll text appointment reminders once you choose a provider.</p>
  ```
- **Dynamic Fields**: `first_name`, `ortho_coverage_percent`, `cta_url`.
- **CTA**: View options.

### Dental Coverage 19 — "Claims Approved"
- **Persona**: Members with approved claim.
- **Subject**: `Your dental claim was approved — here’s the breakdown`
- **Preview**: `Review your savings and recommended next steps.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>Great news! Your claim for {{procedure_name}} on {{procedure_date}} was approved. Here’s the summary:</p>
  <ul>
    <li>Total cost: {{total_cost}}</li>
    <li>Covered by {{plan_name}}: {{covered_amount}}</li>
    <li>Your responsibility: {{member_responsibility}}</li>
  </ul>
  <p><a href="{{cta_url}}" style="background:#22d3ee;color:#1f2937;padding:12px 24px;border-radius:8px;text-decoration:none;">View Statement</a></p>
  <p>Looking for next steps? Browse preventive care add-ons in your portal.</p>
  ```
- **Dynamic Fields**: `first_name`, `procedure_name`, `procedure_date`, `total_cost`, `plan_name`, `covered_amount`, `member_responsibility`, `cta_url`.
- **CTA**: View statement.

### Dental Coverage 20 — "Seasonal Whitening Promo"
- **Persona**: Members interested in cosmetic perks.
- **Subject**: `Brighten your smile for {{season}} — whitening is {{discount_percent}}% off`
- **Preview**: `Use your cosmetic credits before they expire.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Celebrate {{season}} with a brighter smile. Enjoy {{discount_percent}}% off whitening treatments at participating providers when you book by {{offer_expiration}}.</p>
  <p><a href="{{cta_url}}" style="background:#fb7185;color:#ffffff;padding:12px 22px;border-radius:12px;text-decoration:none;">Claim Whitening Offer</a></p>
  <p>Limited slots available!</p>
  ```
- **Dynamic Fields**: `first_name`, `season`, `discount_percent`, `offer_expiration`, `cta_url`.
- **CTA**: Claim offer.

### Dental Coverage 21 — "Pediatric Preventive Alert"
- **Persona**: Parents.
- **Subject**: `{{child_name}} is due for a preventive visit`
- **Preview**: `Keep their coverage active with a quick checkup.`
- **Body**:
  ```html
  <p>Hello {{parent_first_name}},</p>
  <p>{{child_name}} is due for a preventive dental visit this month. Your plan covers sealants, fluoride, and X-rays at 100%.</p>
  <p><a href="{{cta_url}}" style="background:#38bdf8;color:#0f172a;padding:12px 20px;border-radius:10px;text-decoration:none;">Schedule Pediatric Visit</a></p>
  <p>Need help finding weekend slots? Text {{support_phone}}.</p>
  ```
- **Dynamic Fields**: `parent_first_name`, `child_name`, `cta_url`, `support_phone`.
- **CTA**: Schedule visit.

### Dental Coverage 22 — "Emergency Coverage Guidance"
- **Persona**: Members experiencing emergency.
- **Subject**: `Dental emergency support — here’s what’s covered`
- **Preview**: `Follow these steps to access urgent coverage right now.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>If you’re experiencing a dental emergency, stay calm — your plan covers urgent visits with {{plan_name}} providers.</p>
  <ol>
    <li>Call {{emergency_hotline}} for immediate triage.</li>
    <li>Visit an in-network urgent care dentist.</li>
    <li>Upload your receipts via the member app for expedited reimbursement.</li>
  </ol>
  <p><a href="{{cta_url}}" style="background:#f87171;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;">Find Emergency Dentist</a></p>
  <p>Our SMS hotline (powered by Twilio) is available 24/7.</p>
  ```
- **Dynamic Fields**: `first_name`, `plan_name`, `emergency_hotline`, `cta_url`.
- **CTA**: Find emergency dentist.

### Dental Coverage 23 — "Coverage Comparison"
- **Persona**: Prospects evaluating plans.
- **Subject**: `Compare {{plan_name}} vs. traditional dental insurance`
- **Preview**: `Transparent pricing, zero waiting periods, and preventive perks.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>See how {{plan_name}} stacks up against traditional plans:</p>
  <table border="0" cellpadding="12" style="width:100%;border-collapse:collapse;">
    <tr>
      <th style="text-align:left;">Feature</th>
      <th style="text-align:left;">{{plan_name}}</th>
      <th style="text-align:left;">Traditional</th>
    </tr>
    <tr>
      <td>Preventive visits</td>
      <td>100% covered</td>
      <td>Subject to deductible</td>
    </tr>
    <tr>
      <td>Activation</td>
      <td>Immediate</td>
      <td>6-12 month waiting</td>
    </tr>
    <tr>
      <td>Virtual consults</td>
      <td>Included</td>
      <td>Not standard</td>
    </tr>
  </table>
  <p><a href="{{cta_url}}" style="background:#1d4ed8;color:#ffffff;padding:12px 24px;border-radius:9999px;text-decoration:none;">Start Enrollment</a></p>
  ```
- **Dynamic Fields**: `first_name`, `plan_name`, `cta_url`.
- **CTA**: Start enrollment.

### Dental Coverage 24 — "HSA/FSA Reminder"
- **Persona**: Members with unused HSA/FSA.
- **Subject**: `Use your HSA/FSA on covered dental care before {{deadline_date}}`
- **Preview**: `Maximize tax-advantaged dollars with approved treatments.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Your HSA/FSA funds expire soon. Apply them to covered treatments like night guards, mouthguards, and more.</p>
  <p><a href="{{cta_url}}" style="background:#16a34a;color:#ffffff;padding:12px 24px;border-radius:10px;text-decoration:none;">Plan Eligible Visits</a></p>
  <p>Need a receipt breakdown? Download it instantly in your portal.</p>
  ```
- **Dynamic Fields**: `first_name`, `deadline_date`, `cta_url`.
- **CTA**: Plan visits.

### Dental Coverage 25 — "Refer-a-Friend"
- **Persona**: Promoters.
- **Subject**: `Give a friend {{friend_reward}} and get {{member_reward}} for sharing {{plan_name}}`
- **Preview**: `Personal referral link inside. Track referrals in real time.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>Sharing smiles pays off! Give friends {{friend_reward}} toward enrollment and you’ll receive {{member_reward}} when they join.</p>
  <p>Your referral link:<br><strong>{{referral_link}}</strong></p>
  <p><a href="{{cta_url}}" style="background:#ec4899;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;">Share Now</a></p>
  <p>Track your progress in the member app or via Twilio SMS updates.</p>
  ```
- **Dynamic Fields**: `first_name`, `friend_reward`, `member_reward`, `referral_link`, `cta_url`.
- **CTA**: Share referral.

---

## Pre-Care Coverage Campaigns (25)

### Pre-Care Coverage 01 — "Preventive Program Welcome"
- **Persona**: Newly enrolled preventive care members.
- **Subject**: `Welcome to {{program_name}} preventive coverage`
- **Preview**: `Start your personalized care journey with step-by-step guidance.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Thanks for joining {{program_name}}! Your preventive care concierge is ready to guide you through your first 90 days.</p>
  <ul>
    <li>Schedule your baseline wellness assessment.</li>
    <li>Complete your digital intake form.</li>
    <li>Activate automated reminders via SMS or email.</li>
  </ul>
  <p><a href="{{cta_url}}" style="background:#4338ca;color:#ffffff;padding:12px 24px;border-radius:12px;text-decoration:none;">Start My Journey</a></p>
  <p>Your care team,<br>{{brand_name}}</p>
  ```
- **Dynamic Fields**: `first_name`, `program_name`, `cta_url`, `brand_name`.
- **CTA**: Start journey.

### Pre-Care Coverage 02 — "Risk Assessment Invitation"
- **Persona**: Members without baseline assessment.
- **Subject**: `Complete your 3-minute preventive risk assessment`
- **Preview**: `Unlock tailored pre-care coverage insights and next steps.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>Your coverage includes a complimentary risk assessment to pinpoint personalized preventive steps. It only takes three minutes.</p>
  <p><a href="{{cta_url}}" style="background:#4ade80;color:#0f172a;padding:12px 24px;border-radius:9999px;text-decoration:none;">Take Assessment</a></p>
  <p>We’ll text your summary via Twilio once it’s ready.</p>
  ```
- **Dynamic Fields**: `first_name`, `cta_url`.
- **CTA**: Take assessment.

### Pre-Care Coverage 03 — "Care Path Confirmation"
- **Persona**: Members with new care plans.
- **Subject**: `Your personalized pre-care path is ready`
- **Preview**: `Review steps, covered services, and scheduling tips.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Great news! We’ve curated a personalized pre-care path just for you. Here’s what’s next:</p>
  <ol>
    <li>{{care_step_one}}</li>
    <li>{{care_step_two}}</li>
    <li>{{care_step_three}}</li>
  </ol>
  <p><a href="{{cta_url}}" style="background:#2dd4bf;color:#1f2937;padding:12px 20px;border-radius:10px;text-decoration:none;">Review Care Path</a></p>
  <p>Sync your plan with the desktop companion for offline access.</p>
  ```
- **Dynamic Fields**: `first_name`, `care_step_one`, `care_step_two`, `care_step_three`, `cta_url`.
- **CTA**: Review path.

### Pre-Care Coverage 04 — "Habit Builder Series"
- **Persona**: Members wanting routine reminders.
- **Subject**: `Week {{week_number}}: Build the {{habit_focus}} habit`
- **Preview**: `Micro-actions that fit your lifestyle and coverage.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>This week we’re focusing on {{habit_focus}}. Here’s your habit stack:</p>
  <ul>
    <li>Morning: {{habit_morning}}</li>
    <li>Midday: {{habit_midday}}</li>
    <li>Evening: {{habit_evening}}</li>
  </ul>
  <p><a href="{{cta_url}}" style="background:#f97316;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;">Log Today’s Progress</a></p>
  <p>Enable Twilio SMS nudges for real-time accountability.</p>
  ```
- **Dynamic Fields**: `first_name`, `habit_focus`, `habit_morning`, `habit_midday`, `habit_evening`, `cta_url`.
- **CTA**: Log progress.

### Pre-Care Coverage 05 — "Care Team Introduction"
- **Persona**: Members assigned care team.
- **Subject**: `Meet your preventive care team`
- **Preview**: `Your dedicated nurse, health coach, and coverage specialist.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Say hello to the experts supporting your preventive plan:</p>
  <ul>
    <li><strong>{{nurse_name}}</strong> — Preventive nurse.</li>
    <li><strong>{{coach_name}}</strong> — Health coach.</li>
    <li><strong>{{coverage_specialist_name}}</strong> — Coverage specialist.</li>
  </ul>
  <p><a href="{{cta_url}}" style="background:#0ea5e9;color:#ffffff;padding:12px 22px;border-radius:12px;text-decoration:none;">Schedule Team Call</a></p>
  <p>Add them to your contacts with a single tap.</p>
  ```
- **Dynamic Fields**: `first_name`, `nurse_name`, `coach_name`, `coverage_specialist_name`, `cta_url`.
- **CTA**: Schedule call.

### Pre-Care Coverage 06 — "Screening Reminder"
- **Persona**: Members due for screenings.
- **Subject**: `It’s time for your covered preventive screening`
- **Preview**: `Lock in your appointment and stay ahead of potential issues.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>Your pre-care plan includes a fully covered {{screening_type}} screening. Booking today keeps your coverage in good standing.</p>
  <p><a href="{{cta_url}}" style="background:#38bdf8;color:#0f172a;padding:12px 24px;border-radius:8px;text-decoration:none;">Book Screening</a></p>
  <p>Need transportation? Reply YES for concierge support.</p>
  ```
- **Dynamic Fields**: `first_name`, `screening_type`, `cta_url`.
- **CTA**: Book screening.

### Pre-Care Coverage 07 — "Lifestyle Program Invite"
- **Persona**: Members flagged for high risk.
- **Subject**: `Reduce your risk with our 6-week pre-care accelerator`
- **Preview**: `Guided micro-habits, telehealth check-ins, and covered services.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Join our 6-week accelerator to reduce your preventive risk score by up to 30%. Enrollment is included in your coverage.</p>
  <p><a href="{{cta_url}}" style="background:#f87171;color:#ffffff;padding:12px 22px;border-radius:9999px;text-decoration:none;">Reserve My Spot</a></p>
  <p>Sessions start {{program_start_date}}.</p>
  ```
- **Dynamic Fields**: `first_name`, `cta_url`, `program_start_date`.
- **CTA**: Reserve spot.

### Pre-Care Coverage 08 — "Progress Milestone"
- **Persona**: Members hitting milestone.
- **Subject**: `You completed {{milestone_name}} — here’s what’s next`
- **Preview**: `Celebrate progress and queue up the next covered step.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Congratulations on completing {{milestone_name}}! Here’s what your care path recommends next:</p>
  <ul>
    <li>{{next_action_one}}</li>
    <li>{{next_action_two}}</li>
  </ul>
  <p><a href="{{cta_url}}" style="background:#22c55e;color:#ffffff;padding:12px 20px;border-radius:10px;text-decoration:none;">Plan Next Step</a></p>
  <p>Share your win in the community hub — the link is inside.</p>
  ```
- **Dynamic Fields**: `first_name`, `milestone_name`, `next_action_one`, `next_action_two`, `cta_url`.
- **CTA**: Plan next step.

### Pre-Care Coverage 09 — "Resource Library Highlight"
- **Persona**: Members exploring education.
- **Subject**: `3 pre-care resources personalized for you`
- **Preview**: `Handpicked guides, videos, and checklists.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>We curated three resources based on your risk profile:</p>
  <ol>
    <li>{{resource_one}}</li>
    <li>{{resource_two}}</li>
    <li>{{resource_three}}</li>
  </ol>
  <p><a href="{{cta_url}}" style="background:#6366f1;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;">Open Resource Hub</a></p>
  <p>Download them for offline use via the desktop companion.</p>
  ```
- **Dynamic Fields**: `first_name`, `resource_one`, `resource_two`, `resource_three`, `cta_url`.
- **CTA**: Open hub.

### Pre-Care Coverage 10 — "Appointment Follow-Up"
- **Persona**: Members post-visit.
- **Subject**: `Thanks for visiting — document your pre-care outcomes`
- **Preview**: `Log follow-up actions to stay covered and compliant.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>We hope your recent visit went smoothly. Take a minute to log outcomes so we can tailor your coverage recommendations.</p>
  <p><a href="{{cta_url}}" style="background:#d946ef;color:#ffffff;padding:12px 22px;border-radius:10px;text-decoration:none;">Log Outcomes</a></p>
  <p>Need clarification on coverage? Our support bots reply instantly.</p>
  ```
- **Dynamic Fields**: `first_name`, `cta_url`.
- **CTA**: Log outcomes.

### Pre-Care Coverage 11 — "Coverage Optimization Tips"
- **Persona**: Members mid-plan.
- **Subject**: `5 ways to stretch your pre-care coverage`
- **Preview**: `Discover hidden perks and scheduling hacks.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>Maximize your coverage with these insider tips:</p>
  <ol>
    <li>{{tip_one}}</li>
    <li>{{tip_two}}</li>
    <li>{{tip_three}}</li>
    <li>{{tip_four}}</li>
    <li>{{tip_five}}</li>
  </ol>
  <p><a href="{{cta_url}}" style="background:#14b8a6;color:#ffffff;padding:12px 24px;border-radius:9999px;text-decoration:none;">See Full Guide</a></p>
  <p>Bookmark your favorites directly in the Supabase-powered portal.</p>
  ```
- **Dynamic Fields**: `first_name`, `tip_one`, `tip_two`, `tip_three`, `tip_four`, `tip_five`, `cta_url`.
- **CTA**: View guide.

### Pre-Care Coverage 12 — "Telehealth Invite"
- **Persona**: Members needing virtual consult.
- **Subject**: `Connect with a preventive specialist from home`
- **Preview**: `Telehealth visits are covered and available this week.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Need guidance without leaving home? Schedule a covered telehealth consult and get personalized pre-care advice.</p>
  <p><a href="{{cta_url}}" style="background:#f59e0b;color:#ffffff;padding:12px 20px;border-radius:12px;text-decoration:none;">Book Telehealth</a></p>
  <p>Enable SMS confirmations for real-time updates.</p>
  ```
- **Dynamic Fields**: `first_name`, `cta_url`.
- **CTA**: Book telehealth.

### Pre-Care Coverage 13 — "Monthly Coverage Digest"
- **Persona**: All members.
- **Subject**: `{{month_name}} coverage digest`
- **Preview**: `Your progress, upcoming events, and recommended actions.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>Here’s your {{month_name}} pre-care snapshot:</p>
  <ul>
    <li>Coverage used: {{coverage_used_percent}}%</li>
    <li>Upcoming appointments: {{upcoming_appointments_count}}</li>
    <li>Recommended next action: {{recommended_action}}</li>
  </ul>
  <p><a href="{{cta_url}}" style="background:#06b6d4;color:#0f172a;padding:12px 24px;border-radius:9999px;text-decoration:none;">View Dashboard</a></p>
  <p>Sync this summary with your calendar via the desktop app.</p>
  ```
- **Dynamic Fields**: `first_name`, `month_name`, `coverage_used_percent`, `upcoming_appointments_count`, `recommended_action`, `cta_url`.
- **CTA**: View dashboard.

### Pre-Care Coverage 14 — "Coverage Compliance Alert"
- **Persona**: Members missing required action.
- **Subject**: `Action needed to keep your pre-care coverage active`
- **Preview**: `Complete a simple step to avoid pauses in coverage.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Complete {{compliance_action}} by {{deadline_date}} to keep your coverage active and uninterrupted.</p>
  <p><a href="{{cta_url}}" style="background:#ef4444;color:#ffffff;padding:12px 20px;border-radius:10px;text-decoration:none;">Complete Action</a></p>
  <p>We’ll send SMS confirmations as soon as it’s logged.</p>
  ```
- **Dynamic Fields**: `first_name`, `compliance_action`, `deadline_date`, `cta_url`.
- **CTA**: Complete action.

### Pre-Care Coverage 15 — "Healthy Habits Challenge"
- **Persona**: Engaged members.
- **Subject**: `Join the {{challenge_length}}-day Healthy Habits Challenge`
- **Preview**: `Earn rewards and unlock bonus coverage incentives.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>Gamify your preventive routine! Join the {{challenge_length}}-day challenge and earn {{reward_details}} upon completion.</p>
  <p><a href="{{cta_url}}" style="background:#f43f5e;color:#ffffff;padding:12px 24px;border-radius:12px;text-decoration:none;">Join Challenge</a></p>
  <p>Daily nudges arrive via Twilio SMS.</p>
  ```
- **Dynamic Fields**: `first_name`, `challenge_length`, `reward_details`, `cta_url`.
- **CTA**: Join challenge.

### Pre-Care Coverage 16 — "Nutrition Coaching"
- **Persona**: Members needing nutrition support.
- **Subject**: `Unlock covered nutrition coaching sessions`
- **Preview**: `Pair your preventive coverage with tailored meal plans.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Nutrition impacts prevention. Book a covered session with {{nutritionist_name}} to personalize your meal plan.</p>
  <p><a href="{{cta_url}}" style="background:#84cc16;color:#0f172a;padding:12px 24px;border-radius:9999px;text-decoration:none;">Book Nutrition Session</a></p>
  <p>Add your sessions to the Supabase calendar instantly.</p>
  ```
- **Dynamic Fields**: `first_name`, `nutritionist_name`, `cta_url`.
- **CTA**: Book session.

### Pre-Care Coverage 17 — "Sleep Health Integration"
- **Persona**: Members flagged for sleep issues.
- **Subject**: `Improve sleep to boost preventive outcomes`
- **Preview**: `Access covered sleep coaching and device integrations.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>Better sleep amplifies preventive results. Your coverage includes sleep coaching and device integrations.</p>
  <p><a href="{{cta_url}}" style="background:#1d4ed8;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;">Explore Sleep Resources</a></p>
  <p>Sync your wearable data via the desktop companion.</p>
  ```
- **Dynamic Fields**: `first_name`, `cta_url`.
- **CTA**: Explore resources.

### Pre-Care Coverage 18 — "Mindfulness Support"
- **Persona**: Members managing stress.
- **Subject**: `Mindfulness sessions covered by your plan`
- **Preview**: `Reduce stress and strengthen preventive adherence.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Stress can derail prevention. Tap into covered mindfulness sessions led by {{mindfulness_partner}}.</p>
  <p><a href="{{cta_url}}" style="background:#a855f7;color:#ffffff;padding:12px 22px;border-radius:10px;text-decoration:none;">Reserve a Session</a></p>
  <p>Get daily breathing prompts via Twilio SMS.</p>
  ```
- **Dynamic Fields**: `first_name`, `mindfulness_partner`, `cta_url`.
- **CTA**: Reserve session.

### Pre-Care Coverage 19 — "Care Gap Outreach"
- **Persona**: Members overdue for actions.
- **Subject**: `We spotted a care gap — let’s close it together`
- **Preview**: `Complete one step to stay covered and protected.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>Your dashboard shows a gap in your preventive coverage: {{care_gap_detail}}. Complete the next step to maintain full benefits.</p>
  <p><a href="{{cta_url}}" style="background:#fb7185;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;">Close My Care Gap</a></p>
  <p>Need a reminder? Enable automated voice calls via Twilio.</p>
  ```
- **Dynamic Fields**: `first_name`, `care_gap_detail`, `cta_url`.
- **CTA**: Close gap.

### Pre-Care Coverage 20 — "Coverage Renewal"
- **Persona**: Members approaching renewal.
- **Subject**: `Renew your preventive coverage for another year of progress`
- **Preview**: `Keep your care team, perks, and digital tools without interruption.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Stay on track with another year of {{program_name}} preventive coverage. Renew now to lock in your current rate.</p>
  <p><a href="{{cta_url}}" style="background:#0ea5e9;color:#ffffff;padding:12px 26px;border-radius:9999px;text-decoration:none;">Renew Now</a></p>
  <p>Questions? Chat live in the app or text {{support_phone}}.</p>
  ```
- **Dynamic Fields**: `first_name`, `program_name`, `cta_url`, `support_phone`.
- **CTA**: Renew coverage.

### Pre-Care Coverage 21 — "Coverage Pause Prevention"
- **Persona**: Members at risk of pause.
- **Subject**: `Prevent a pause in your pre-care benefits`
- **Preview**: `Resolve outstanding items in minutes.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>We noticed outstanding items that could pause your coverage. Resolve them now to keep your benefits active.</p>
  <p><a href="{{cta_url}}" style="background:#7c3aed;color:#ffffff;padding:12px 22px;border-radius:10px;text-decoration:none;">Resolve Items</a></p>
  <p>Receive status updates via SMS once completed.</p>
  ```
- **Dynamic Fields**: `first_name`, `cta_url`.
- **CTA**: Resolve items.

### Pre-Care Coverage 22 — "Wellness Webinar Invite"
- **Persona**: Members interested in education.
- **Subject**: `Reserve your seat: {{webinar_topic}}`
- **Preview**: `Live Q&A, expert insights, and downloadable checklists.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Join our upcoming webinar on {{webinar_topic}} and learn how to maximize your coverage. Seats are limited.</p>
  <p><a href="{{cta_url}}" style="background:#facc15;color:#0f172a;padding:12px 24px;border-radius:9999px;text-decoration:none;">Save My Seat</a></p>
  <p>We’ll send reminders via Twilio 24 hours before we go live.</p>
  ```
- **Dynamic Fields**: `first_name`, `webinar_topic`, `cta_url`.
- **CTA**: Register for webinar.

### Pre-Care Coverage 23 — "Family Enrollment"
- **Persona**: Members adding dependents.
- **Subject**: `Extend preventive coverage to your family`
- **Preview**: `Enroll dependents in less than five minutes.`
- **Body**:
  ```html
  <p>Hello {{first_name}},</p>
  <p>Add loved ones to your coverage and share preventive perks. Enrollment is seamless and instantly active.</p>
  <p><a href="{{cta_url}}" style="background:#fbbf24;color:#0f172a;padding:12px 22px;border-radius:8px;text-decoration:none;">Add Dependents</a></p>
  <p>Track family progress within your shared dashboard.</p>
  ```
- **Dynamic Fields**: `first_name`, `cta_url`.
- **CTA**: Add dependents.

### Pre-Care Coverage 24 — "Coverage Benefits Recap"
- **Persona**: Members needing reminders.
- **Subject**: `Remember everything your pre-care plan includes?`
- **Preview**: `A quick recap of your covered services and support.`
- **Body**:
  ```html
  <p>Hi {{first_name}},</p>
  <p>Your plan includes more than you might realize:</p>
  <ul>
    <li>{{benefit_one}}</li>
    <li>{{benefit_two}}</li>
    <li>{{benefit_three}}</li>
  </ul>
  <p><a href="{{cta_url}}" style="background:#ef4444;color:#ffffff;padding:12px 20px;border-radius:12px;text-decoration:none;">Explore Benefits</a></p>
  <p>Need help activating them? Our concierge is available 24/7.</p>
  ```
- **Dynamic Fields**: `first_name`, `benefit_one`, `benefit_two`, `benefit_three`, `cta_url`.
- **CTA**: Explore benefits.

### Pre-Care Coverage 25 — "Graduation Congratulations"
- **Persona**: Members completing program.
- **Subject**: `You’ve graduated from {{program_name}}!`
- **Preview**: `Celebrate your progress and maintain momentum.`
- **Body**:
  ```html
  <p>Dear {{first_name}},</p>
  <p>Congratulations on completing {{program_name}}! Your dedication to preventive care is inspiring.</p>
  <p><strong>Your results:</strong></p>
  <ul>
    <li>Risk score reduction: {{risk_reduction_percent}}%</li>
    <li>Visits completed: {{visits_completed}}</li>
    <li>Habits built: {{habits_built}}</li>
  </ul>
  <p><a href="{{cta_url}}" style="background:#10b981;color:#ffffff;padding:12px 26px;border-radius:9999px;text-decoration:none;">Download Completion Badge</a></p>
  <p>Keep your momentum with optional maintenance coverage — reply YES to learn more.</p>
  ```
- **Dynamic Fields**: `first_name`, `program_name`, `risk_reduction_percent`, `visits_completed`, `habits_built`, `cta_url`.
- **CTA**: Download badge.

---

## Implementation Checklist

1. Map each template’s dynamic fields to SendGrid substitution tags (e.g., `{{first_name}}`).
2. Store metadata in Supabase for querying by persona, lifecycle stage, and coverage type.
3. Use the desktop Rust companion app to pre-render fallback plain-text versions.
4. Enable Twilio Event Webhooks to capture engagement metrics (opens, clicks, bounces).
5. Run QA by sending test emails to Litmus/Email on Acid before launching campaigns.

---

## Suggested Automation Snippets

```sql
-- Supabase example for storing template metadata
insert into templates (id, name, category, twilio_template_id, dynamic_fields)
values
  ('dental_01', 'Welcome to Brighter Smiles', 'dental', 'tmpl_XXXX', '{"fields": ["first_name", "plan_name", "city", "cta_url", "brand_name"]}');
```

```json
// Twilio SendGrid mail/send payload excerpt
{
  "from": { "email": "care@{{brand_domain}}" },
  "personalizations": [
    {
      "to": [{ "email": "{{member_email}}", "name": "{{first_name}}" }],
      "dynamic_template_data": {
        "first_name": "Ava",
        "plan_name": "BrightGuard Premium",
        "cta_url": "https://example.com/activate"
      }
    }
  ],
  "template_id": "{{twilio_template_id}}"
}
```

Feel free to extend this library with localized variants, SMS follow-ups, and omnichannel automations.

# Petcare Coverage RCS Template Library

This library adds 20 rich communication service (RCS) templates tailored for petcare coverage and proactive wellness engagement. Each script is structured for Twilio's RCS Business Messaging channel and can be orchestrated from Supabase edge functions or your Rust desktop companion. Pair these with the email assets in `docs/email-templates/dental-precare-templates.md` to drive cohesive omnichannel care journeys.

## Twilio RCS Launch Checklist

1. **Provision Google Business Messages & RCS**: Register your brand in the [Twilio RCS Console](https://www.twilio.com/docs/rcs) and associate verified phone numbers through TrustHub compliance workflows.
2. **Create RCS templates via the Content API**: Use `POST /v1/Content` with `type: "rich_card"` for single cards or `carousel` for multi-card flows. Store the returned `sid` for each template.
3. **Send RCS with Programmable Messaging**:
   ```json
   {
     "from": "whatsapp:+1XXXXXXXXXX",
     "to": "+1YYYYYYYYYY",
     "contentSid": "HXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     "record": true,
     "provideFeedback": true
   }
   ```
   Replace the `from` field with your Twilio RCS-enabled phone number. Include `record` for Message Insights and `provideFeedback` to capture delivery status.
4. **Add SMS failover**: Configure the `smartEncodedFallback` object or send an SMS template when `deliveryStatus` indicates `failed` or `unsupported`.
5. **Supabase integration**: Persist templates in a `rcs_templates` table (JSONB) with metadata, dynamic fields, and Twilio `content_sid`. Use Row Level Security to scope templates by brand or care team.

> 💡 **Automation Tip**: Trigger RCS outreach from Supabase via Postgres `LISTEN/NOTIFY` events whenever a pet reaches a preventive milestone (e.g., vaccines due) or a claim status changes.

---

## Template Index

Each template below includes a rich card script, suggested media, smart reply buttons, and SMS fallback. Suggested actions align with Twilio `suggestions` types (`openUrl`, `dialerAction`, `postback`).

### RCS 01 — "Welcome to Pawsitive Protection"
- **Persona**: New pet insurance subscriber.
- **Scenario**: Post-enrollment confirmation and onboarding.
- **Primary Message**:
  ```text
  Hi {{pet_parent_name}}! 🎉 {{pet_name}} is officially covered by {{plan_name}}. Tap below to download the digital ID card and schedule your wellness exam credit.
  ```
- **Suggested Actions**:
  - `openUrl`: View Coverage Portal → `{{coverage_portal_url}}`
  - `openUrl`: Add Digital ID to Wallet → `{{wallet_pass_url}}`
  - `dialerAction`: Call Care Concierge → `{{concierge_phone}}`
- **Media**: Pet hero image hosted at `{{welcome_card_image_url}}` (1200×675).
- **Fallback SMS**: `Hi {{pet_parent_name}}, welcome to {{plan_name}}! Access your portal: {{coverage_portal_url}} or call {{concierge_phone}}.`
- **Dynamic Fields**: `pet_parent_name`, `pet_name`, `plan_name`, `coverage_portal_url`, `wallet_pass_url`, `concierge_phone`, `welcome_card_image_url`.

### RCS 02 — "Preventive Exam Countdown"
- **Persona**: Members with upcoming annual wellness exam.
- **Scenario**: 14-day reminder to book vet visit.
- **Primary Message**:
  ```text
  {{pet_name}} is due for a covered wellness visit before {{exam_due_date}}. Lock in a time at your preferred clinic and keep preventive rewards active.
  ```
- **Suggested Actions**:
  - `openUrl`: Schedule Visit → `{{booking_url}}`
  - `postback`: Text Me Options → payload `remind-me-exam`
  - `openUrl`: View Rewards → `{{rewards_url}}`
- **Media**: Countdown image or short looping GIF `{{exam_countdown_media_url}}`.
- **Fallback SMS**: `Reminder: book {{pet_name}}'s wellness visit before {{exam_due_date}}. Schedule: {{booking_url}}.`
- **Dynamic Fields**: `pet_name`, `exam_due_date`, `booking_url`, `rewards_url`, `exam_countdown_media_url`.

### RCS 03 — "Direct Pay Vet Locator"
- **Persona**: Members seeking in-network vet.
- **Scenario**: Provide top clinic recommendations with instant navigation.
- **Primary Message**:
  ```text
  Need a vet now? These {{city}} partners accept direct pay. Choose one to get directions or start a tele-vet triage.
  ```
- **Suggested Actions**:
  - `openUrl`: Map {{vet_one_name}} → `{{vet_one_map_url}}`
  - `openUrl`: Map {{vet_two_name}} → `{{vet_two_map_url}}`
  - `openUrl`: Start Tele-Vet → `{{tele_vet_url}}`
- **Media**: Carousel-ready clinic photos `{{clinic_carousel_media_url}}`.
- **Fallback SMS**: `Find a partner vet: {{vet_one_map_url}} or {{vet_two_map_url}}. Tele-vet: {{tele_vet_url}}.`
- **Dynamic Fields**: `city`, `vet_one_name`, `vet_one_map_url`, `vet_two_name`, `vet_two_map_url`, `tele_vet_url`, `clinic_carousel_media_url`.

### RCS 04 — "Claims Status Live"
- **Persona**: Members awaiting claim adjudication.
- **Scenario**: Push status change with document access.
- **Primary Message**:
  ```text
  Claim {{claim_number}} for {{pet_name}} is now {{claim_status}}. Review the explanation of benefits or chat with an adjuster in real time.
  ```
- **Suggested Actions**:
  - `openUrl`: View EOB → `{{eob_url}}`
  - `openUrl`: Upload Docs → `{{document_upload_url}}`
  - `postback`: Chat with Adjuster → payload `connect-adjuster-{{claim_number}}`
- **Media**: Status badge graphic `{{claim_status_media_url}}`.
- **Fallback SMS**: `Update: claim {{claim_number}} is {{claim_status}}. EOB: {{eob_url}}.`
- **Dynamic Fields**: `claim_number`, `pet_name`, `claim_status`, `eob_url`, `document_upload_url`, `claim_status_media_url`.

### RCS 05 — "Emergency Triage Workflow"
- **Persona**: Members reporting urgent symptom.
- **Scenario**: Provide triage checklist with direct dial fallback.
- **Primary Message**:
  ```text
  {{pet_name}}'s reported symptom: {{symptom_description}}. Use the triage checklist below or tap to call our 24/7 emergency vet.
  ```
- **Suggested Actions**:
  - `openUrl`: Open Triage Checklist → `{{triage_checklist_url}}`
  - `dialerAction`: Call Emergency Vet → `{{emergency_phone}}`
  - `postback`: Share Recent Photos → payload `upload-media`
- **Media**: Infographic `{{triage_media_url}}` optimized for 1080×1350.
- **Fallback SMS**: `Emergency support: call {{emergency_phone}} or review {{triage_checklist_url}}.`
- **Dynamic Fields**: `pet_name`, `symptom_description`, `triage_checklist_url`, `emergency_phone`, `triage_media_url`.

### RCS 06 — "Coverage Gap Outreach"
- **Persona**: Policyholders approaching lapse.
- **Scenario**: Payment failure or upcoming renewal gap.
- **Primary Message**:
  ```text
  We couldn't process {{plan_name}} for {{pet_name}}. Update payment before {{grace_period_end}} to avoid coverage gaps.
  ```
- **Suggested Actions**:
  - `openUrl`: Update Payment → `{{billing_url}}`
  - `openUrl`: Review Policy → `{{policy_url}}`
  - `dialerAction`: Talk to Billing → `{{billing_phone}}`
- **Media**: Alert banner `{{coverage_gap_media_url}}`.
- **Fallback SMS**: `Action needed: update payment {{billing_url}} before {{grace_period_end}}.`
- **Dynamic Fields**: `plan_name`, `pet_name`, `grace_period_end`, `billing_url`, `policy_url`, `billing_phone`, `coverage_gap_media_url`.

### RCS 07 — "Prescription Refill Assist"
- **Persona**: Chronic medication members.
- **Scenario**: Automate refill shipping and vet approval.
- **Primary Message**:
  ```text
  {{pet_name}}'s {{medication_name}} refill is ready. Choose delivery speed and confirm vet approval.
  ```
- **Suggested Actions**:
  - `openUrl`: Confirm Delivery → `{{refill_url}}`
  - `postback`: Ask Vet Question → payload `vet-chat-{{pet_id}}`
  - `openUrl`: Track Shipment → `{{tracking_url}}`
- **Media**: Medication flat lay `{{refill_media_url}}`.
- **Fallback SMS**: `Refill ready for {{pet_name}}. Confirm: {{refill_url}}.`
- **Dynamic Fields**: `pet_name`, `medication_name`, `refill_url`, `tracking_url`, `pet_id`, `refill_media_url`.

### RCS 08 — "Wellness Rewards Booster"
- **Persona**: Members under-using perks.
- **Scenario**: Mid-cycle engagement to increase reward redemption.
- **Primary Message**:
  ```text
  You still have {{reward_points_remaining}} Paw Points expiring on {{reward_expiry_date}}. Redeem for grooming, training, or nutrition consults.
  ```
- **Suggested Actions**:
  - `openUrl`: Redeem Rewards → `{{rewards_portal_url}}`
  - `postback`: Send Me Ideas → payload `rewards-ideas`
  - `openUrl`: Book Grooming → `{{grooming_url}}`
- **Media**: Rewards animation `{{rewards_media_url}}`.
- **Fallback SMS**: `Use {{reward_points_remaining}} points before {{reward_expiry_date}}: {{rewards_portal_url}}.`
- **Dynamic Fields**: `reward_points_remaining`, `reward_expiry_date`, `rewards_portal_url`, `grooming_url`, `rewards_media_url`.

### RCS 09 — "New Puppy Onboarding"
- **Persona**: First-time puppy parents.
- **Scenario**: Provide vaccine roadmap and training resources.
- **Primary Message**:
  ```text
  Welcome, {{pet_name}}! Start the puppy roadmap: vaccines, microchip, and first obedience class are all covered perks.
  ```
- **Suggested Actions**:
  - `openUrl`: View Puppy Checklist → `{{puppy_checklist_url}}`
  - `openUrl`: Book Vaccines → `{{vaccine_booking_url}}`
  - `postback`: Text Trainer → payload `trainer-intro`
- **Media**: Checklist illustration `{{puppy_media_url}}`.
- **Fallback SMS**: `Get started: checklist {{puppy_checklist_url}} | vaccines {{vaccine_booking_url}}.`
- **Dynamic Fields**: `pet_name`, `puppy_checklist_url`, `vaccine_booking_url`, `puppy_media_url`.

### RCS 10 — "Senior Pet Care Plan"
- **Persona**: Senior pet guardians.
- **Scenario**: Nudges around mobility screenings and nutrition consults.
- **Primary Message**:
  ```text
  {{pet_name}} qualifies for a complimentary senior mobility screening and nutrition consult this quarter. Reserve your slot below.
  ```
- **Suggested Actions**:
  - `openUrl`: Book Mobility Screening → `{{mobility_booking_url}}`
  - `openUrl`: Nutrition Consult → `{{nutrition_booking_url}}`
  - `postback`: Request Call → payload `senior-care-callback`
- **Media**: Senior pet photo `{{senior_media_url}}`.
- **Fallback SMS**: `Reserve senior care: mobility {{mobility_booking_url}}, nutrition {{nutrition_booking_url}}.`
- **Dynamic Fields**: `pet_name`, `mobility_booking_url`, `nutrition_booking_url`, `senior_media_url`.

### RCS 11 — "Claim Documentation Reminder"
- **Persona**: Members missing receipts.
- **Scenario**: Automate doc uploads before deadline.
- **Primary Message**:
  ```text
  We still need receipts for claim {{claim_number}}. Upload photos before {{documentation_deadline}} to keep reimbursement moving.
  ```
- **Suggested Actions**:
  - `openUrl`: Upload Receipts → `{{receipt_upload_url}}`
  - `postback`: Need Extension → payload `extension-request-{{claim_number}}`
  - `openUrl`: View Requirements → `{{documentation_requirements_url}}`
- **Media**: Document reminder graphic `{{documentation_media_url}}`.
- **Fallback SMS**: `Upload claim docs: {{receipt_upload_url}} before {{documentation_deadline}}.`
- **Dynamic Fields**: `claim_number`, `documentation_deadline`, `receipt_upload_url`, `documentation_requirements_url`, `documentation_media_url`.

### RCS 12 — "Petcare Community Invite"
- **Persona**: Engaged members.
- **Scenario**: Promote community livestream with veterinarians.
- **Primary Message**:
  ```text
  Join our live Ask-a-Vet session this {{event_day}}. RSVP to get reminders, submit questions, and claim attendance rewards.
  ```
- **Suggested Actions**:
  - `openUrl`: RSVP Now → `{{event_rsvp_url}}`
  - `postback`: Submit a Question → payload `submit-question-{{event_id}}`
  - `openUrl`: Add to Calendar → `{{calendar_url}}`
- **Media**: Livestream banner `{{event_media_url}}`.
- **Fallback SMS**: `RSVP for Ask-a-Vet: {{event_rsvp_url}}.`
- **Dynamic Fields**: `event_day`, `event_rsvp_url`, `event_id`, `calendar_url`, `event_media_url`.

### RCS 13 — "Nutrition Plan Renewal"
- **Persona**: Members on personalized nutrition program.
- **Scenario**: Renew nutrition plan before expiration.
- **Primary Message**:
  ```text
  {{pet_name}}'s custom nutrition plan ends {{plan_end_date}}. Renew now to keep fresh meal deliveries and dietitian chats active.
  ```
- **Suggested Actions**:
  - `openUrl`: Renew Plan → `{{nutrition_plan_url}}`
  - `postback`: Adjust Portions → payload `adjust-portions-{{plan_id}}`
  - `openUrl`: Chat with Dietitian → `{{dietitian_chat_url}}`
- **Media**: Meal preview `{{nutrition_media_url}}`.
- **Fallback SMS**: `Renew {{pet_name}}'s nutrition plan: {{nutrition_plan_url}}.`
- **Dynamic Fields**: `pet_name`, `plan_end_date`, `nutrition_plan_url`, `plan_id`, `dietitian_chat_url`, `nutrition_media_url`.

### RCS 14 — "Behavioral Support"
- **Persona**: Members flagged for behavior issues.
- **Scenario**: Provide training resources and coach scheduling.
- **Primary Message**:
  ```text
  We noticed {{pet_name}}'s recent behavior notes. Tap to watch calming techniques, schedule a trainer, or request a behaviorist call.
  ```
- **Suggested Actions**:
  - `openUrl`: Watch Training Video → `{{training_video_url}}`
  - `openUrl`: Book Trainer → `{{trainer_booking_url}}`
  - `postback`: Request Behaviorist → payload `behaviorist-request-{{pet_id}}`
- **Media**: Training tip video `{{training_media_url}}`.
- **Fallback SMS**: `Support for {{pet_name}}: video {{training_video_url}} | trainer {{trainer_booking_url}}.`
- **Dynamic Fields**: `pet_name`, `training_video_url`, `trainer_booking_url`, `pet_id`, `training_media_url`.

### RCS 15 — "Dental Cleaning Day"
- **Persona**: Members using dental add-on coverage.
- **Scenario**: Promote upcoming mobile dental clinic.
- **Primary Message**:
  ```text
  Sparkle Squad is in {{city}} on {{clinic_date}}! Reserve a covered dental cleaning for {{pet_name}} and save {{estimated_savings}}.
  ```
- **Suggested Actions**:
  - `openUrl`: Reserve Slot → `{{clinic_booking_url}}`
  - `openUrl`: Clinic Map → `{{clinic_map_url}}`
  - `postback`: Text Me Prep Tips → payload `dental-prep-{{pet_id}}`
- **Media**: Clinic hero image `{{dental_media_url}}`.
- **Fallback SMS**: `Book dental cleaning {{clinic_booking_url}} for {{clinic_date}}.`
- **Dynamic Fields**: `city`, `clinic_date`, `pet_name`, `estimated_savings`, `clinic_booking_url`, `clinic_map_url`, `pet_id`, `dental_media_url`.

### RCS 16 — "Claims Payout Confirmation"
- **Persona**: Members receiving reimbursement.
- **Scenario**: Confirm payout with finance breakdown.
- **Primary Message**:
  ```text
  Reimbursement of {{payout_amount}} for claim {{claim_number}} was sent to {{payout_method}}. Download the receipt or reinvest in preventive add-ons.
  ```
- **Suggested Actions**:
  - `openUrl`: Download Receipt → `{{receipt_url}}`
  - `openUrl`: Shop Add-ons → `{{addons_url}}`
  - `postback`: Ask About Taxes → payload `tax-question-{{claim_number}}`
- **Media**: Confirmation badge `{{payout_media_url}}`.
- **Fallback SMS**: `Claim {{claim_number}} paid {{payout_amount}} via {{payout_method}}.`
- **Dynamic Fields**: `payout_amount`, `claim_number`, `payout_method`, `receipt_url`, `addons_url`, `payout_media_url`.

### RCS 17 — "Coverage Upgrade Offer"
- **Persona**: Highly engaged members.
- **Scenario**: Upsell to holistic wellness tier.
- **Primary Message**:
  ```text
  Unlock Holistic+ care for {{pet_name}}: acupuncture, hydrotherapy, and tele-behavior are all included. Upgrade before {{offer_expiration_date}} for 15% off.
  ```
- **Suggested Actions**:
  - `openUrl`: Compare Plans → `{{upgrade_compare_url}}`
  - `openUrl`: Talk to Advisor → `{{advisor_booking_url}}`
  - `postback`: Keep My Plan → payload `decline-upgrade`
- **Media**: Upgrade infographic `{{upgrade_media_url}}`.
- **Fallback SMS**: `Upgrade offer ends {{offer_expiration_date}}: {{upgrade_compare_url}}.`
- **Dynamic Fields**: `pet_name`, `offer_expiration_date`, `upgrade_compare_url`, `advisor_booking_url`, `upgrade_media_url`.

### RCS 18 — "Wellness Survey Pulse"
- **Persona**: Members 90 days post-enrollment.
- **Scenario**: Capture NPS and service quality feedback.
- **Primary Message**:
  ```text
  Quick check-in: how satisfied are you and {{pet_name}} with {{plan_name}}? Share a rating and unlock bonus Paw Points.
  ```
- **Suggested Actions**:
  - `postback`: Rate 5 ⭐ → payload `nps-5`
  - `postback`: Rate 4 ⭐ → payload `nps-4`
  - `openUrl`: Leave Feedback → `{{feedback_url}}`
- **Media**: Feedback animation `{{survey_media_url}}`.
- **Fallback SMS**: `Rate {{plan_name}} for {{pet_name}}: {{feedback_url}}.`
- **Dynamic Fields**: `pet_name`, `plan_name`, `feedback_url`, `survey_media_url`.

### RCS 19 — "Seasonal Allergy Alert"
- **Persona**: Pets flagged for allergies.
- **Scenario**: Provide prevention tips with Rx escalation.
- **Primary Message**:
  ```text
  Allergy season has spiked in {{member_zip}}. Get personalized flare-up tips for {{pet_name}} and connect with a vet if symptoms appear.
  ```
- **Suggested Actions**:
  - `openUrl`: View Allergy Tips → `{{allergy_tips_url}}`
  - `postback`: Request Rx Review → payload `allergy-rx-{{pet_id}}`
  - `openUrl`: Order Supplements → `{{supplement_url}}`
- **Media**: Pollen heatmap `{{allergy_media_url}}`.
- **Fallback SMS**: `Allergy alert for {{pet_name}}. Tips: {{allergy_tips_url}}.`
- **Dynamic Fields**: `member_zip`, `pet_name`, `allergy_tips_url`, `supplement_url`, `pet_id`, `allergy_media_url`.

### RCS 20 — "Coverage Anniversary Celebration"
- **Persona**: Loyal members hitting 1-year milestone.
- **Scenario**: Celebrate and cross-sell partner perks.
- **Primary Message**:
  ```text
  Happy coverage anniversary, {{pet_parent_name}} & {{pet_name}}! Enjoy a loyalty gift and explore partner perks curated for your pet's next adventure.
  ```
- **Suggested Actions**:
  - `openUrl`: Claim Gift → `{{loyalty_gift_url}}`
  - `openUrl`: Browse Partner Perks → `{{partner_perks_url}}`
  - `postback`: Share a Testimonial → payload `testimonial-opt-in`
- **Media**: Celebration confetti `{{anniversary_media_url}}`.
- **Fallback SMS**: `Celebrate with us! Claim gift: {{loyalty_gift_url}}.`
- **Dynamic Fields**: `pet_parent_name`, `pet_name`, `loyalty_gift_url`, `partner_perks_url`, `anniversary_media_url`.

---

## Reference Sources
- Twilio — [RCS Business Messaging Overview](https://www.twilio.com/docs/rcs)
- Twilio — [Content API for Rich Messaging](https://www.twilio.com/docs/content-api)
- American Veterinary Medical Association — [Pet Preventive Care Guidelines](https://www.avma.org/resources-tools/pet-owners/petcare)

export type RcsSuggestedAction =
  | {
      type: 'openUrl';
      label: string;
      url: string;
    }
  | {
      type: 'dialerAction';
      label: string;
      phoneNumber: string;
    }
  | {
      type: 'postback';
      label: string;
      data: string;
    };

export type RcsMedia = {
  type: 'image' | 'gif' | 'video';
  url: string;
  alt: string;
};

export type RcsTemplate = {
  id: string;
  category: 'Petcare Coverage' | 'Petcare Wellness';
  title: string;
  persona: string;
  scenario: string;
  primaryMessage: string;
  suggestedActions: RcsSuggestedAction[];
  media?: RcsMedia;
  fallbackSms: string;
  dynamicFields: string[];
  twilioNotes: string;
};

export const spotlightPetcareRcsTemplates: RcsTemplate[] = [
  {
    id: 'petcare-rcs-01',
    category: 'Petcare Coverage',
    title: 'Welcome to Pawsitive Protection',
    persona: 'New pet insurance subscriber',
    scenario: 'Post-enrollment confirmation and onboarding',
    primaryMessage:
      "Hi {{pet_parent_name}}! 🎉 {{pet_name}} is officially covered by {{plan_name}}. Tap below to download the digital ID card and schedule your wellness exam credit.",
    suggestedActions: [
      {
        type: 'openUrl',
        label: 'View Coverage Portal',
        url: '{{coverage_portal_url}}',
      },
      {
        type: 'openUrl',
        label: 'Add Digital ID',
        url: '{{wallet_pass_url}}',
      },
      {
        type: 'dialerAction',
        label: 'Call Care Concierge',
        phoneNumber: '{{concierge_phone}}',
      },
    ],
    media: {
      type: 'image',
      url: '{{welcome_card_image_url}}',
      alt: 'Happy pet parent holding covered pet',
    },
    fallbackSms:
      'Hi {{pet_parent_name}}, welcome to {{plan_name}}! Access your portal: {{coverage_portal_url}} or call {{concierge_phone}}.',
    dynamicFields: [
      'pet_parent_name',
      'pet_name',
      'plan_name',
      'coverage_portal_url',
      'wallet_pass_url',
      'concierge_phone',
      'welcome_card_image_url',
    ],
    twilioNotes:
      'Store as a single rich_card in Twilio Content API. Enable smartEncodedFallback with this SMS copy for unsupported devices.',
  },
  {
    id: 'petcare-rcs-02',
    category: 'Petcare Wellness',
    title: 'Preventive Exam Countdown',
    persona: 'Members with upcoming annual wellness exam',
    scenario: '14-day reminder to book a covered vet visit',
    primaryMessage:
      "{{pet_name}} is due for a covered wellness visit before {{exam_due_date}}. Lock in a time at your preferred clinic and keep preventive rewards active.",
    suggestedActions: [
      {
        type: 'openUrl',
        label: 'Schedule Visit',
        url: '{{booking_url}}',
      },
      {
        type: 'postback',
        label: 'Text Me Options',
        data: 'remind-me-exam',
      },
      {
        type: 'openUrl',
        label: 'View Rewards',
        url: '{{rewards_url}}',
      },
    ],
    media: {
      type: 'gif',
      url: '{{exam_countdown_media_url}}',
      alt: 'Countdown animation for upcoming preventive exam',
    },
    fallbackSms:
      "Reminder: book {{pet_name}}'s wellness visit before {{exam_due_date}}. Schedule: {{booking_url}}.",
    dynamicFields: [
      'pet_name',
      'exam_due_date',
      'booking_url',
      'rewards_url',
      'exam_countdown_media_url',
    ],
    twilioNotes:
      'Attach to a Content API entry with suggestions. Configure status callbacks to detect postback payload `remind-me-exam`.',
  },
  {
    id: 'petcare-rcs-03',
    category: 'Petcare Coverage',
    title: 'Direct Pay Vet Locator',
    persona: 'Members seeking in-network vet',
    scenario: 'Deliver curated clinic list with navigation shortcuts',
    primaryMessage:
      'Need a vet now? These {{city}} partners accept direct pay. Choose one to get directions or start a tele-vet triage.',
    suggestedActions: [
      {
        type: 'openUrl',
        label: 'Map {{vet_one_name}}',
        url: '{{vet_one_map_url}}',
      },
      {
        type: 'openUrl',
        label: 'Map {{vet_two_name}}',
        url: '{{vet_two_map_url}}',
      },
      {
        type: 'openUrl',
        label: 'Start Tele-Vet',
        url: '{{tele_vet_url}}',
      },
    ],
    media: {
      type: 'image',
      url: '{{clinic_carousel_media_url}}',
      alt: 'Featured clinics collage',
    },
    fallbackSms:
      'Find a partner vet: {{vet_one_map_url}} or {{vet_two_map_url}}. Tele-vet: {{tele_vet_url}}.',
    dynamicFields: [
      'city',
      'vet_one_name',
      'vet_one_map_url',
      'vet_two_name',
      'vet_two_map_url',
      'tele_vet_url',
      'clinic_carousel_media_url',
    ],
    twilioNotes:
      'Consider rendering as a carousel with two cards if you capture more than two clinics per message.',
  },
  {
    id: 'petcare-rcs-04',
    category: 'Petcare Coverage',
    title: 'Claims Status Live',
    persona: 'Members awaiting claim adjudication',
    scenario: 'Notify members when claim status changes',
    primaryMessage:
      'Claim {{claim_number}} for {{pet_name}} is now {{claim_status}}. Review the explanation of benefits or chat with an adjuster in real time.',
    suggestedActions: [
      {
        type: 'openUrl',
        label: 'View EOB',
        url: '{{eob_url}}',
      },
      {
        type: 'openUrl',
        label: 'Upload Docs',
        url: '{{document_upload_url}}',
      },
      {
        type: 'postback',
        label: 'Chat with Adjuster',
        data: 'connect-adjuster-{{claim_number}}',
      },
    ],
    media: {
      type: 'image',
      url: '{{claim_status_media_url}}',
      alt: 'Claims status badge showing current outcome',
    },
    fallbackSms: 'Update: claim {{claim_number}} is {{claim_status}}. EOB: {{eob_url}}.',
    dynamicFields: [
      'claim_number',
      'pet_name',
      'claim_status',
      'eob_url',
      'document_upload_url',
      'claim_status_media_url',
    ],
    twilioNotes:
      'Map postback payloads to a Supabase Edge Function that opens a Twilio Conversations session with the adjuster.',
  },
  {
    id: 'petcare-rcs-05',
    category: 'Petcare Coverage',
    title: 'Emergency Triage Workflow',
    persona: 'Members reporting urgent symptom',
    scenario: 'Provide triage resources with immediate call option',
    primaryMessage:
      "{{pet_name}}'s reported symptom: {{symptom_description}}. Use the triage checklist below or tap to call our 24/7 emergency vet.",
    suggestedActions: [
      {
        type: 'openUrl',
        label: 'Open Triage Checklist',
        url: '{{triage_checklist_url}}',
      },
      {
        type: 'dialerAction',
        label: 'Call Emergency Vet',
        phoneNumber: '{{emergency_phone}}',
      },
      {
        type: 'postback',
        label: 'Share Recent Photos',
        data: 'upload-media',
      },
    ],
    media: {
      type: 'image',
      url: '{{triage_media_url}}',
      alt: 'Emergency triage steps graphic',
    },
    fallbackSms:
      'Emergency support: call {{emergency_phone}} or review {{triage_checklist_url}}.',
    dynamicFields: [
      'pet_name',
      'symptom_description',
      'triage_checklist_url',
      'emergency_phone',
      'triage_media_url',
    ],
    twilioNotes:
      'Use Twilio Studio to branch into voice escalation when the dialerAction is selected.',
  },
  {
    id: 'petcare-rcs-06',
    category: 'Petcare Coverage',
    title: 'Coverage Gap Outreach',
    persona: 'Policyholders approaching lapse',
    scenario: 'Warn about payment failure and offer help',
    primaryMessage:
      "We couldn't process {{plan_name}} for {{pet_name}}. Update payment before {{grace_period_end}} to avoid coverage gaps.",
    suggestedActions: [
      {
        type: 'openUrl',
        label: 'Update Payment',
        url: '{{billing_url}}',
      },
      {
        type: 'openUrl',
        label: 'Review Policy',
        url: '{{policy_url}}',
      },
      {
        type: 'dialerAction',
        label: 'Talk to Billing',
        phoneNumber: '{{billing_phone}}',
      },
    ],
    media: {
      type: 'image',
      url: '{{coverage_gap_media_url}}',
      alt: 'Payment issue alert graphic',
    },
    fallbackSms:
      'Action needed: update payment {{billing_url}} before {{grace_period_end}}.',
    dynamicFields: [
      'plan_name',
      'pet_name',
      'grace_period_end',
      'billing_url',
      'policy_url',
      'billing_phone',
      'coverage_gap_media_url',
    ],
    twilioNotes:
      'Send with high priority and log all delivery receipts to Supabase for compliance reporting.',
  },
  {
    id: 'petcare-rcs-07',
    category: 'Petcare Wellness',
    title: 'Prescription Refill Assist',
    persona: 'Members managing chronic medication',
    scenario: 'Automate medication refill workflow',
    primaryMessage:
      "{{pet_name}}'s {{medication_name}} refill is ready. Choose delivery speed and confirm vet approval.",
    suggestedActions: [
      {
        type: 'openUrl',
        label: 'Confirm Delivery',
        url: '{{refill_url}}',
      },
      {
        type: 'postback',
        label: 'Ask Vet Question',
        data: 'vet-chat-{{pet_id}}',
      },
      {
        type: 'openUrl',
        label: 'Track Shipment',
        url: '{{tracking_url}}',
      },
    ],
    media: {
      type: 'image',
      url: '{{refill_media_url}}',
      alt: 'Medication refill photo',
    },
    fallbackSms: 'Refill ready for {{pet_name}}. Confirm: {{refill_url}}.',
    dynamicFields: [
      'pet_name',
      'medication_name',
      'refill_url',
      'tracking_url',
      'pet_id',
      'refill_media_url',
    ],
    twilioNotes:
      'Use postback payload to trigger a Twilio Conversations webhook for two-way vet support.',
  },
  {
    id: 'petcare-rcs-08',
    category: 'Petcare Wellness',
    title: 'Wellness Rewards Booster',
    persona: 'Members under-using perks',
    scenario: 'Encourage redemption before points expire',
    primaryMessage:
      'You still have {{reward_points_remaining}} Paw Points expiring on {{reward_expiry_date}}. Redeem for grooming, training, or nutrition consults.',
    suggestedActions: [
      {
        type: 'openUrl',
        label: 'Redeem Rewards',
        url: '{{rewards_portal_url}}',
      },
      {
        type: 'postback',
        label: 'Send Me Ideas',
        data: 'rewards-ideas',
      },
      {
        type: 'openUrl',
        label: 'Book Grooming',
        url: '{{grooming_url}}',
      },
    ],
    media: {
      type: 'gif',
      url: '{{rewards_media_url}}',
      alt: 'Animated rewards celebration',
    },
    fallbackSms:
      'Use {{reward_points_remaining}} points before {{reward_expiry_date}}: {{rewards_portal_url}}.',
    dynamicFields: [
      'reward_points_remaining',
      'reward_expiry_date',
      'rewards_portal_url',
      'grooming_url',
      'rewards_media_url',
    ],
    twilioNotes:
      'Set TTL on Content API asset to align with reward expiration and avoid stale offers.',
  },
  {
    id: 'petcare-rcs-09',
    category: 'Petcare Coverage',
    title: 'New Puppy Onboarding',
    persona: 'First-time puppy parents',
    scenario: 'Share onboarding checklist and resources',
    primaryMessage:
      'Welcome, {{pet_name}}! Start the puppy roadmap: vaccines, microchip, and first obedience class are all covered perks.',
    suggestedActions: [
      {
        type: 'openUrl',
        label: 'Puppy Checklist',
        url: '{{puppy_checklist_url}}',
      },
      {
        type: 'openUrl',
        label: 'Book Vaccines',
        url: '{{vaccine_booking_url}}',
      },
      {
        type: 'postback',
        label: 'Text Trainer',
        data: 'trainer-intro',
      },
    ],
    media: {
      type: 'image',
      url: '{{puppy_media_url}}',
      alt: 'Puppy onboarding checklist graphic',
    },
    fallbackSms:
      'Get started: checklist {{puppy_checklist_url}} | vaccines {{vaccine_booking_url}}.',
    dynamicFields: [
      'pet_name',
      'puppy_checklist_url',
      'vaccine_booking_url',
      'puppy_media_url',
    ],
    twilioNotes:
      'Add a Supabase automation to update conversation state when trainer assistance is requested.',
  },
  {
    id: 'petcare-rcs-10',
    category: 'Petcare Wellness',
    title: 'Senior Pet Care Plan',
    persona: 'Senior pet guardians',
    scenario: 'Promote mobility screenings and nutrition consults',
    primaryMessage:
      '{{pet_name}} qualifies for a complimentary senior mobility screening and nutrition consult this quarter. Reserve your slot below.',
    suggestedActions: [
      {
        type: 'openUrl',
        label: 'Mobility Screening',
        url: '{{mobility_booking_url}}',
      },
      {
        type: 'openUrl',
        label: 'Nutrition Consult',
        url: '{{nutrition_booking_url}}',
      },
      {
        type: 'postback',
        label: 'Request Call',
        data: 'senior-care-callback',
      },
    ],
    media: {
      type: 'image',
      url: '{{senior_media_url}}',
      alt: 'Senior pet enjoying outdoor walk',
    },
    fallbackSms:
      'Reserve senior care: mobility {{mobility_booking_url}}, nutrition {{nutrition_booking_url}}.',
    dynamicFields: [
      'pet_name',
      'mobility_booking_url',
      'nutrition_booking_url',
      'senior_media_url',
    ],
    twilioNotes:
      'Route postback payload to a Supabase function that schedules a callback via Twilio Voice.',
  },
];

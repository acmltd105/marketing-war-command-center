
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import CampaignDetailsForm from './campaign/CampaignDetailsForm';
import MessageComposer from './campaign/MessageComposer';
import CampaignSummary from './campaign/CampaignSummary';

const CampaignCreator = () => {
  const [campaign, setCampaign] = useState({
    name: '',
    type: '',
    message: '',
    audience: '',
    schedule: 'immediate',
    scheduledTime: '',
  });

  const [messageCount, setMessageCount] = useState(0);

  const handleCampaignChange = (updates: Partial<typeof campaign>) => {
    setCampaign(prev => ({ ...prev, ...updates }));
  };

  const handleMessageChange = (value: string) => {
    setCampaign(prev => ({ ...prev, message: value }));
    setMessageCount(value.length);
  };

  const audienceSegments = [
    { name: "All Subscribers", count: 15420 },
    { name: "VIP Customers", count: 2840 },
    { name: "New Signups", count: 1250 },
    { name: "Inactive Users", count: 3670 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Plus className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Campaign Creator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignDetailsForm
          campaign={campaign}
          onCampaignChange={handleCampaignChange}
          audienceSegments={audienceSegments}
        />

        <MessageComposer
          message={campaign.message}
          messageCount={messageCount}
          onMessageChange={handleMessageChange}
        />
      </div>

      <CampaignSummary
        campaign={campaign}
        audienceSegments={audienceSegments}
      />
    </div>
  );
};

export default CampaignCreator;

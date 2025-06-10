
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Circle } from 'lucide-react';

const TwilioConfig = () => {
  const [config, setConfig] = useState({
    accountSid: '',
    authToken: '',
    phoneNumber: '',
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isTestMode, setIsTestMode] = useState(true);

  const handleConfigChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const testConnection = () => {
    // Mock connection test
    setTimeout(() => {
      setIsConnected(true);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Twilio Configuration</h2>
        <Badge variant={isConnected ? "default" : "secondary"} className="ml-auto">
          <Circle className={`h-2 w-2 mr-1 ${isConnected ? 'text-tactical-green' : 'text-muted-foreground'}`} />
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      <Alert>
        <AlertDescription>
          For security, store your Twilio credentials in environment variables or use the Supabase integration for secure secret management.
        </AlertDescription>
      </Alert>

      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>API Credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="accountSid">Account SID</Label>
            <Input
              id="accountSid"
              type="password"
              placeholder="Enter your Twilio Account SID"
              value={config.accountSid}
              onChange={(e) => handleConfigChange('accountSid', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="authToken">Auth Token</Label>
            <Input
              id="authToken"
              type="password"
              placeholder="Enter your Twilio Auth Token"
              value={config.authToken}
              onChange={(e) => handleConfigChange('authToken', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="phoneNumber">Twilio Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="+1234567890"
              value={config.phoneNumber}
              onChange={(e) => handleConfigChange('phoneNumber', e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={testConnection}
              className="flex-1"
              disabled={!config.accountSid || !config.authToken}
            >
              Test Connection
            </Button>
            <Button variant="outline" className="flex-1">
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Campaign Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Test Mode</Label>
              <p className="text-sm text-muted-foreground">Send messages to test numbers only</p>
            </div>
            <Button 
              variant={isTestMode ? "default" : "outline"}
              onClick={() => setIsTestMode(!isTestMode)}
            >
              {isTestMode ? 'ON' : 'OFF'}
            </Button>
          </div>
          
          <div>
            <Label>Rate Limiting</Label>
            <p className="text-sm text-muted-foreground">Messages per second: 10</p>
          </div>
          
          <div>
            <Label>Webhook URL</Label>
            <Input
              placeholder="https://your-app.com/webhooks/twilio"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwilioConfig;

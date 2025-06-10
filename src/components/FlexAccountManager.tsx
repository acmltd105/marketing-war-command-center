
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Plus, Circle } from 'lucide-react';

const FlexAccountManager = () => {
  const [accounts, setAccounts] = useState([
    {
      id: 'flex-1',
      name: 'Production Flex',
      sid: 'FLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      status: 'Active',
      workspace: 'Customer Support',
      agents: 24,
      queues: 8,
      region: 'US East'
    },
    {
      id: 'flex-2', 
      name: 'Dev Environment',
      sid: 'FLyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
      status: 'Active',
      workspace: 'Development',
      agents: 5,
      queues: 3,
      region: 'US West'
    },
    {
      id: 'flex-3',
      name: 'Staging Flex',
      sid: 'FLzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
      status: 'Inactive',
      workspace: 'Testing',
      agents: 0,
      queues: 2,
      region: 'EU'
    }
  ]);

  const [newAccount, setNewAccount] = useState({
    name: '',
    sid: '',
    workspace: '',
    region: ''
  });

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-tactical-green text-black' : 'bg-tactical-red text-white';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Flex Account Control</h2>
      </div>

      {/* Add New Account */}
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Flex Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                placeholder="Production Flex"
                value={newAccount.name}
                onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="accountSid">Account SID</Label>
              <Input
                id="accountSid"
                placeholder="FLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={newAccount.sid}
                onChange={(e) => setNewAccount(prev => ({ ...prev, sid: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Workspace</Label>
              <Input
                placeholder="Customer Support"
                value={newAccount.workspace}
                onChange={(e) => setNewAccount(prev => ({ ...prev, workspace: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Region</Label>
              <Select onValueChange={(value) => setNewAccount(prev => ({ ...prev, region: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us-east">US East</SelectItem>
                  <SelectItem value="us-west">US West</SelectItem>
                  <SelectItem value="eu">Europe</SelectItem>
                  <SelectItem value="asia">Asia Pacific</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-4 glow-blue">
            Connect Account
          </Button>
        </CardContent>
      </Card>

      {/* Account List */}
      <div className="grid gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="border-border bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{account.name}</h3>
                    <Badge className={getStatusColor(account.status)}>
                      {account.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">SID: {account.sid}</p>
                  <p className="text-sm text-muted-foreground">Workspace: {account.workspace}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Configure</Button>
                  <Button variant="outline" size="sm">Logs</Button>
                  <Button variant="outline" size="sm">Metrics</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Active Agents</p>
                  <p className="text-2xl font-bold text-tactical-green">{account.agents}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Queues</p>
                  <p className="text-2xl font-bold text-tactical-cyan">{account.queues}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Region</p>
                  <p className="text-2xl font-bold text-primary">{account.region}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Circle className={`h-6 w-6 mx-auto ${account.status === 'Active' ? 'text-tactical-green' : 'text-tactical-red'}`} fill="currentColor" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FlexAccountManager;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface MessageComposerProps {
  message: string;
  messageCount: number;
  onMessageChange: (value: string) => void;
}

const MessageComposer = ({ message, messageCount, onMessageChange }: MessageComposerProps) => {
  const maxLength = 160;
  
  const messageTemplates = [
    {
      name: "Flash Sale",
      content: "🔥 FLASH SALE ALERT! Get 50% OFF everything for the next 24 hours only! Use code FLASH50. Shop now: [link] Reply STOP to opt out."
    },
    {
      name: "Product Launch",
      content: "🚀 NEW PRODUCT ALERT! Be the first to experience our latest innovation. Early bird special: 30% OFF for the first 100 customers! [link]"
    },
    {
      name: "Abandoned Cart",
      content: "Hey [name]! You left something amazing in your cart. Complete your purchase now and get FREE shipping! [link] Reply STOP to opt out."
    }
  ];

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Message Composer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="message">Message Content</Label>
            <Badge variant={messageCount > maxLength ? "destructive" : "secondary"}>
              {messageCount}/{maxLength}
            </Badge>
          </div>
          <Textarea
            id="message"
            placeholder="Craft your message..."
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            className="min-h-32"
          />
          {messageCount > maxLength && (
            <p className="text-sm text-destructive">Message exceeds SMS character limit</p>
          )}
        </div>

        <div>
          <Label>Quick Templates</Label>
          <div className="grid gap-2 mt-2">
            {messageTemplates.map((template) => (
              <Button
                key={template.name}
                variant="outline"
                className="justify-start text-left h-auto p-3"
                onClick={() => onMessageChange(template.content)}
              >
                <div>
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {template.content.substring(0, 50)}...
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="border border-border rounded-lg p-3 bg-secondary/20">
          <Label className="text-sm">Preview</Label>
          <div className="mt-2 p-3 bg-background rounded border">
            <div className="text-sm">
              {message || "Your message preview will appear here..."}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageComposer;

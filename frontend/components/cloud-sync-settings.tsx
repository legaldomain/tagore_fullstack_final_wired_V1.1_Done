'use client';

import { useState, useEffect } from 'react';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, Cloud, Wifi } from 'lucide-react';

export function CloudSyncSettings() {
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check initial sync status
    checkSyncStatus();
  }, []);

  const checkSyncStatus = async () => {
    try {
      const response = await fetch('/api/cloud-sync/status');
      const data = await response.json();
      setSyncEnabled(data.synced);
      setIsAuthenticated(data.authenticated);
    } catch (error) {
      console.error('Error checking sync status:', error);
    }
  };

  const handleSyncToggle = async (checked: boolean) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cloud-sync/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: checked }),
      });
      const data = await response.json();
      setSyncEnabled(data.synced);
    } catch (error) {
      console.error('Error toggling sync:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cloud-sync/authenticate', {
        method: 'POST',
      });
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
    } catch (error) {
      console.error('Error authenticating:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Cloud Sync Settings
        </CardTitle>
        <CardDescription>
          Connect your Google Drive to automatically sync your documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
            <p className="text-sm text-center">
              You need to authenticate with Google Drive first
            </p>
            <Button
              onClick={handleAuthenticate}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Connecting...' : 'Connect Google Drive'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Enable Cloud Sync</label>
                <p className="text-sm text-muted-foreground">
                  Automatically sync your documents with Google Drive
                </p>
              </div>
              <Switch
                checked={syncEnabled}
                onCheckedChange={handleSyncToggle}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wifi className="h-4 w-4" />
              <span>Connected to Google Drive</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, EyeOff } from 'lucide-react';

interface ApiSetting {
  setting_key: string;
  setting_value: string;
  description: string;
}

const ApiSettings: React.FC = () => {
  const [settings, setSettings] = useState<ApiSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/settings.php', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to fetch settings');
    }
    setLoading(false);
  };

  const updateSetting = async (key: string, value: string) => {
    setSaving(key);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value })
      });
      const data = await response.json();
      if (data.success) {
        setSettings(prev => prev.map(s => s.setting_key === key ? { ...s, setting_value: value } : s));
      }
    } catch (error) {
      console.error('Failed to update setting');
    }
    setSaving(null);
  };

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isSecretField = (key: string) => {
    return key.includes('secret') || key.includes('key') || key.includes('token');
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(s => s.setting_key.startsWith(category));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">API Configuration</h1>
        <p className="text-muted-foreground">Configure API credentials for loan onboarding system</p>
      </div>

      <Tabs defaultValue="gemini" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gemini">Gemini AI</TabsTrigger>
          <TabsTrigger value="pan">PAN Verification</TabsTrigger>
          <TabsTrigger value="credit">Credit Bureau</TabsTrigger>
          <TabsTrigger value="rc">RC Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="gemini">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Gemini AI Configuration
                <Badge variant="outline">Car Valuation</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getSettingsByCategory('gemini').map((setting) => (
                <div key={setting.setting_key} className="space-y-2">
                  <Label>{setting.description}</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={isSecretField(setting.setting_key) && !showSecrets[setting.setting_key] ? 'password' : 'text'}
                        value={setting.setting_value}
                        onChange={(e) => {
                          const newSettings = settings.map(s => 
                            s.setting_key === setting.setting_key 
                              ? { ...s, setting_value: e.target.value }
                              : s
                          );
                          setSettings(newSettings);
                        }}
                        placeholder={setting.setting_key === 'gemini_api_key' ? 'AIzaSy...' : setting.setting_value || 'Enter value'}
                      />
                      {isSecretField(setting.setting_key) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => toggleSecret(setting.setting_key)}
                        >
                          {showSecrets[setting.setting_key] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      )}
                    </div>
                    <Button
                      onClick={() => updateSetting(setting.setting_key, setting.setting_value)}
                      disabled={saving === setting.setting_key}
                      size="sm"
                    >
                      {saving === setting.setting_key ? <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : <Save className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pan">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                PAN Verification API
                <Badge variant="outline">Neokred</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getSettingsByCategory('pan').map((setting) => (
                <div key={setting.setting_key} className="space-y-2">
                  <Label>{setting.description}</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={isSecretField(setting.setting_key) && !showSecrets[setting.setting_key] ? 'password' : 'text'}
                        value={setting.setting_value}
                        onChange={(e) => {
                          const newSettings = settings.map(s => 
                            s.setting_key === setting.setting_key 
                              ? { ...s, setting_value: e.target.value }
                              : s
                          );
                          setSettings(newSettings);
                        }}
                        placeholder="Enter API credential"
                      />
                      {isSecretField(setting.setting_key) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => toggleSecret(setting.setting_key)}
                        >
                          {showSecrets[setting.setting_key] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      )}
                    </div>
                    <Button
                      onClick={() => updateSetting(setting.setting_key, setting.setting_value)}
                      disabled={saving === setting.setting_key}
                      size="sm"
                    >
                      {saving === setting.setting_key ? <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : <Save className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Credit Bureau API
                <Badge variant="outline">Neokred</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getSettingsByCategory('credit').map((setting) => (
                <div key={setting.setting_key} className="space-y-2">
                  <Label>{setting.description}</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={isSecretField(setting.setting_key) && !showSecrets[setting.setting_key] ? 'password' : 'text'}
                        value={setting.setting_value}
                        onChange={(e) => {
                          const newSettings = settings.map(s => 
                            s.setting_key === setting.setting_key 
                              ? { ...s, setting_value: e.target.value }
                              : s
                          );
                          setSettings(newSettings);
                        }}
                        placeholder="Enter API credential"
                      />
                      {isSecretField(setting.setting_key) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => toggleSecret(setting.setting_key)}
                        >
                          {showSecrets[setting.setting_key] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      )}
                    </div>
                    <Button
                      onClick={() => updateSetting(setting.setting_key, setting.setting_value)}
                      disabled={saving === setting.setting_key}
                      size="sm"
                    >
                      {saving === setting.setting_key ? <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : <Save className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rc">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                RC Verification API
                <Badge variant="outline">SurePass</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getSettingsByCategory('surepass').map((setting) => (
                <div key={setting.setting_key} className="space-y-2">
                  <Label>{setting.description}</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={isSecretField(setting.setting_key) && !showSecrets[setting.setting_key] ? 'password' : 'text'}
                        value={setting.setting_value}
                        onChange={(e) => {
                          const newSettings = settings.map(s => 
                            s.setting_key === setting.setting_key 
                              ? { ...s, setting_value: e.target.value }
                              : s
                          );
                          setSettings(newSettings);
                        }}
                        placeholder="Enter API credential"
                      />
                      {isSecretField(setting.setting_key) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => toggleSecret(setting.setting_key)}
                        >
                          {showSecrets[setting.setting_key] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      )}
                    </div>
                    <Button
                      onClick={() => updateSetting(setting.setting_key, setting.setting_value)}
                      disabled={saving === setting.setting_key}
                      size="sm"
                    >
                      {saving === setting.setting_key ? <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : <Save className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Setup Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Gemini AI (Required)</h4>
              <p className="text-sm text-muted-foreground">Get API key from Google AI Studio for car valuation</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. PAN Verification</h4>
              <p className="text-sm text-muted-foreground">Neokred API credentials for PAN validation</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">3. Credit Bureau</h4>
              <p className="text-sm text-muted-foreground">Credit report API for real credit scores</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">4. RC Verification</h4>
              <p className="text-sm text-muted-foreground">SurePass API token for vehicle verification</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiSettings;
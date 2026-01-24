import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Save, Key, CreditCard, Bot } from "lucide-react";

interface SystemSetting {
  setting_key: string;
  setting_value: string;
  description: string;
  updated_at: string;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('https://api.finonest.com/api/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    setSaving(true);
    try {
      const response = await fetch(`https://api.finonest.com/api/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Setting updated successfully",
        });
        fetchSettings(); // Refresh settings
      } else {
        toast({
          title: "Error",
          description: "Failed to update setting",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getSettingValue = (key: string) => {
    const setting = settings.find(s => s.setting_key === key);
    return setting?.setting_value || '';
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => prev.map(setting => 
      setting.setting_key === key 
        ? { ...setting, setting_value: value }
        : setting
    ));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Configuration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="gemini_api_key">Gemini API Key</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="gemini_api_key"
                type="password"
                value={getSettingValue('gemini_api_key')}
                onChange={(e) => handleSettingChange('gemini_api_key', e.target.value)}
                placeholder="AIzaSy..."
              />
              <Button 
                onClick={() => updateSetting('gemini_api_key', getSettingValue('gemini_api_key'))}
                disabled={saving}
                size="sm"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Google Gemini API key for AI chat and blog generation
            </p>
          </div>
          
          <div>
            <Label htmlFor="gemini_model">Gemini Model</Label>
            <div className="flex gap-2 mt-1">
              <Select 
                value={getSettingValue('gemini_model')} 
                onValueChange={(value) => handleSettingChange('gemini_model', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-2.5-flash-lite">Gemini 2.5 Flash-Lite (Recommended)</SelectItem>
                  <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                  <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                  <SelectItem value="gemini-pro-latest">Gemini Pro Latest</SelectItem>
                  <SelectItem value="gemini-flash-latest">Gemini Flash Latest</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={() => updateSetting('gemini_model', getSettingValue('gemini_model'))}
                disabled={saving}
                size="sm"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Choose the Gemini model for AI operations
            </p>
          </div>
          
          <div>
            <Label htmlFor="ai_enabled">AI Features Status</Label>
            <div className="flex gap-2 mt-1">
              <Select 
                value={getSettingValue('ai_enabled')} 
                onValueChange={(value) => handleSettingChange('ai_enabled', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={() => updateSetting('ai_enabled', getSettingValue('ai_enabled'))}
                disabled={saving}
                size="sm"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Enable or disable AI chat and blog generation features
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateway Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Gateway Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="razorpay_key">Razorpay API Key</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="razorpay_key"
                type="text"
                value={getSettingValue('razorpay_key')}
                onChange={(e) => handleSettingChange('razorpay_key', e.target.value)}
                placeholder="rzp_test_xxxxxxxxxx"
              />
              <Button 
                onClick={() => updateSetting('razorpay_key', getSettingValue('razorpay_key'))}
                disabled={saving}
                size="sm"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your Razorpay API key for processing payments
            </p>
          </div>
          
          <div>
            <Label htmlFor="razorpay_secret">Razorpay Secret Key</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="razorpay_secret"
                type="password"
                value={getSettingValue('razorpay_secret')}
                onChange={(e) => handleSettingChange('razorpay_secret', e.target.value)}
                placeholder="Keep this secure"
              />
              <Button 
                onClick={() => updateSetting('razorpay_secret', getSettingValue('razorpay_secret'))}
                disabled={saving}
                size="sm"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your Razorpay secret key (keep this secure)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="site_name">Site Name</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="site_name"
                type="text"
                value={getSettingValue('site_name')}
                onChange={(e) => handleSettingChange('site_name', e.target.value)}
              />
              <Button 
                onClick={() => updateSetting('site_name', getSettingValue('site_name'))}
                disabled={saving}
                size="sm"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="contact_email">Contact Email</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="contact_email"
                type="email"
                value={getSettingValue('contact_email')}
                onChange={(e) => handleSettingChange('contact_email', e.target.value)}
              />
              <Button 
                onClick={() => updateSetting('contact_email', getSettingValue('contact_email'))}
                disabled={saving}
                size="sm"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Version</p>
              <p className="font-medium">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Database</p>
              <p className="font-medium">MySQL 8.0</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Server</p>
              <p className="font-medium">PHP 8.3</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="default">Online</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium text-xs">
                {settings.length > 0 ? new Date(settings[0].updated_at).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
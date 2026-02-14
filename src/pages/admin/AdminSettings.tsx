import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Save, Key, CreditCard, Bot, Eye, EyeOff, Shield, Car, Database, Plus } from "lucide-react";

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
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [showApiKey, setShowApiKey] = useState(false);
  const [creatingTable, setCreatingTable] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isSecretField = (key: string) => {
    return key.includes('secret') || key.includes('key') || key.includes('token');
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(s => s.setting_key.startsWith(category));
  };

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

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: `${key.replace('_', ' ')} updated successfully`,
        });
        fetchSettings(); // Refresh settings
      } else {
        console.error('Update error:', data);
        toast({
          title: "Error",
          description: data.error || "Failed to update setting",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      toast({
        title: "Error",
        description: "Network error. Please check your connection.",
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

  const createLoanOnboardingTable = async () => {
    setCreatingTable(true);
    try {
      const response = await fetch('https://api.finonest.com/setup-database.php', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Database tables created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create tables",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setCreatingTable(false);
    }
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
              <div className="relative flex-1">
                <Input
                  id="gemini_api_key"
                  type={showApiKey ? "text" : "password"}
                  value={getSettingValue('gemini_api_key')}
                  onChange={(e) => handleSettingChange('gemini_api_key', e.target.value)}
                  placeholder="AIzaSy..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
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
                  <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Higher Quota)</SelectItem>
                  <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                  <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                  <SelectItem value="gemini-2.5-flash-lite">Gemini 2.5 Flash-Lite (Recommended)</SelectItem>
                  <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                  <SelectItem value="gemini-pro-latest">Gemini Pro Latest</SelectItem>
                  <SelectItem value="gemini-flash-latest">Gemini Flash Latest</SelectItem>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
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

      {/* API Credentials Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Credentials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="client_user_id">Client User ID</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="client_user_id"
                type="text"
                value={getSettingValue('client_user_id')}
                onChange={(e) => handleSettingChange('client_user_id', e.target.value)}
                placeholder="Enter Client User ID"
              />
              <Button 
                onClick={() => updateSetting('client_user_id', getSettingValue('client_user_id'))}
                disabled={saving}
                size="sm"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="base_url">Base URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="base_url"
                type="url"
                value={getSettingValue('base_url')}
                onChange={(e) => handleSettingChange('base_url', e.target.value)}
                placeholder="https://api.example.com"
              />
              <Button 
                onClick={() => updateSetting('base_url', getSettingValue('base_url'))}
                disabled={saving}
                size="sm"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="secret_key">Secret Key</Label>
            <div className="flex gap-2 mt-1">
              <div className="relative flex-1">
                <Input
                  id="secret_key"
                  type={showSecrets['secret_key'] ? "text" : "password"}
                  value={getSettingValue('secret_key')}
                  onChange={(e) => handleSettingChange('secret_key', e.target.value)}
                  placeholder="Enter Secret Key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => toggleSecret('secret_key')}
                >
                  {showSecrets['secret_key'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <Button 
                onClick={() => updateSetting('secret_key', getSettingValue('secret_key'))}
                disabled={saving}
                size="sm"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="access_key">Access Key</Label>
            <div className="flex gap-2 mt-1">
              <div className="relative flex-1">
                <Input
                  id="access_key"
                  type={showSecrets['access_key'] ? "text" : "password"}
                  value={getSettingValue('access_key')}
                  onChange={(e) => handleSettingChange('access_key', e.target.value)}
                  placeholder="Enter Access Key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => toggleSecret('access_key')}
                >
                  {showSecrets['access_key'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <Button 
                onClick={() => updateSetting('access_key', getSettingValue('access_key'))}
                disabled={saving}
                size="sm"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="surepass_token">SurePass API Token</Label>
            <div className="flex gap-2 mt-1">
              <div className="relative flex-1">
                <Input
                  id="surepass_token"
                  type={showSecrets['surepass_token'] ? "text" : "password"}
                  value={getSettingValue('surepass_token')}
                  onChange={(e) => handleSettingChange('surepass_token', e.target.value)}
                  placeholder="Enter SurePass API token"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => toggleSecret('surepass_token')}
                >
                  {showSecrets['surepass_token'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <Button 
                onClick={() => updateSetting('surepass_token', getSettingValue('surepass_token'))}
                disabled={saving}
                size="sm"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Auto Create Tables</Label>
            <div className="flex gap-2 mt-1">
              <Button 
                onClick={createLoanOnboardingTable}
                disabled={creatingTable}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {creatingTable ? 'Creating...' : 'Setup Database'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Creates loan_applications, system_settings, and lender_policies tables with sample data
            </p>
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
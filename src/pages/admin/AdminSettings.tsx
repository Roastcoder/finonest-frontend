import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Finonest',
    maintenanceMode: false,
    emailNotifications: true,
    autoApproval: false
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Site Name</label>
            <input 
              type="text" 
              value={settings.siteName}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">Enable to show maintenance page</p>
            </div>
            <button 
              onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
              className={`w-12 h-6 rounded-full ${settings.maintenanceMode ? 'bg-primary' : 'bg-gray-300'} relative transition-colors`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Send email alerts for new applications</p>
            </div>
            <button 
              onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
              className={`w-12 h-6 rounded-full ${settings.emailNotifications ? 'bg-primary' : 'bg-gray-300'} relative transition-colors`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto Approval</p>
              <p className="text-sm text-muted-foreground">Automatically approve eligible applications</p>
            </div>
            <button 
              onClick={() => setSettings({...settings, autoApproval: !settings.autoApproval})}
              className={`w-12 h-6 rounded-full ${settings.autoApproval ? 'bg-primary' : 'bg-gray-300'} relative transition-colors`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.autoApproval ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>
        </CardContent>
      </Card>

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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
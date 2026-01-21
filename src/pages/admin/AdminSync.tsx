import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { RefreshCw, Download } from "lucide-react";

const AdminSync = () => {
  const [syncing, setSyncing] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();

  const syncExternalData = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "External data synced successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to sync data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          External Data Sync
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sync products and leads from external API to local database for admin management.
          </p>
          <Button 
            onClick={syncExternalData} 
            disabled={syncing}
            className="w-full"
          >
            {syncing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Sync External Data
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSync;

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Send, Clock } from 'lucide-react';
import { Alert } from '@/contexts/AlertContext';

interface PilotAlertsProps {
  isForPilot?: boolean;
  alerts: Alert[];
  onSendAlert?: (message: string, severity: 'info' | 'warning' | 'critical') => void;
}

const PilotAlerts = ({ isForPilot = false, alerts, onSendAlert }: PilotAlertsProps) => {
  const [newAlert, setNewAlert] = useState('');
  const [severity, setSeverity] = useState<'info' | 'warning' | 'critical'>('info');

  const handleSendAlert = () => {
    if (newAlert.trim() && onSendAlert) {
      onSendAlert(newAlert.trim(), severity);
      setNewAlert('');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          {isForPilot ? 'Send Passenger Alerts' : 'Crew Communications'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isForPilot && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Alert Message</label>
              <Textarea
                placeholder="Enter message for passengers..."
                value={newAlert}
                onChange={(e) => setNewAlert(e.target.value)}
                className="min-h-20"
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as 'info' | 'warning' | 'critical')}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <Button onClick={handleSendAlert} disabled={!newAlert.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send Alert
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium">Recent Communications</h4>
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No alerts at this time.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs opacity-70 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.timestamp.toLocaleTimeString()}
                        </span>
                        <span className="text-xs opacity-70">
                          from {alert.from}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PilotAlerts;

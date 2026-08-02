import React, { useState, useEffect } from 'react';
import { HeaderNav, TabType } from './components/HeaderNav';
import { SecurityLock } from './components/SecurityLock';
import { CurrentOnCallTab } from './components/CurrentOnCallTab';
import { FullRotaTab } from './components/FullRotaTab';
import { DirectoriesTab } from './components/DirectoriesTab';
import { AiAssistantTab } from './components/AiAssistantTab';
import { OnCallRoleInfo, RotaPeriod, CriticalIncident, EscalationPlaybook } from './types';
import { DEDICATED_ROLES, INITIAL_ROTA_PERIODS, PLAYBOOKS, INITIAL_INCIDENTS } from './data/rotaData';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const [showSecurityLock, setShowSecurityLock] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [directoryLevel, setDirectoryLevel] = useState<'GOLD' | 'SILVER' | 'INPATIENT'>('GOLD');

  const handleNavigateToDirectory = (level: 'GOLD' | 'SILVER' | 'INPATIENT' = 'GOLD') => {
    setDirectoryLevel(level);
    setActiveTab('directories');
  };

  // App Data
  const [roles, setRoles] = useState<OnCallRoleInfo[]>(DEDICATED_ROLES);
  const [rotaPeriods, setRotaPeriods] = useState<RotaPeriod[]>(INITIAL_ROTA_PERIODS);
  const [incidents, setIncidents] = useState<CriticalIncident[]>(INITIAL_INCIDENTS);
  const [playbooks, setPlaybooks] = useState<EscalationPlaybook[]>(PLAYBOOKS);
  const [broadcastTargetRole, setBroadcastTargetRole] = useState<string | undefined>(undefined);

  // Load backend data
  useEffect(() => {
    fetch('/api/rota')
      .then(res => res.json())
      .then(data => {
        if (data.roles) setRoles(data.roles);
        if (data.rotaPeriods) setRotaPeriods(data.rotaPeriods);
        if (data.playbooks) setPlaybooks(data.playbooks);
      })
      .catch(() => {
        // Fallback to local data
      });

    fetch('/api/incidents')
      .then(res => res.json())
      .then(data => {
        if (data.incidents) setIncidents(data.incidents);
      })
      .catch(() => {
        // Fallback
      });
  }, []);

  const handleAuthenticated = (sessionToken: string) => {
    localStorage.setItem('doc_session_token', sessionToken);
    setIsAuthenticated(true);
    setShowSecurityLock(false);
  };

  const handleLockSession = () => {
    localStorage.removeItem('doc_session_token');
    setIsAuthenticated(false);
    setShowSecurityLock(true);
  };

  const handleCreateIncident = async (newIncidentData: Partial<CriticalIncident>) => {
    try {
      const res = await fetch('/api/incidents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIncidentData),
      });
      const data = await res.json();
      if (data.success && data.incident) {
        setIncidents(prev => [data.incident, ...prev]);
      }
    } catch (err) {
      console.error("Error creating incident:", err);
    }
  };

  const handleLogDecision = async (
    incidentId: string, 
    decisionData: { author: string; role: string; decision: string; category: any; actionAssignedTo?: string }
  ) => {
    try {
      const res = await fetch('/api/incidents/log-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentId, ...decisionData }),
      });
      const data = await res.json();
      if (data.success && data.incident) {
        setIncidents(prev => prev.map(inc => inc.id === incidentId ? data.incident : inc));
      }
    } catch (err) {
      console.error("Error logging decision:", err);
    }
  };

  const handleUpdateStatus = async (incidentId: string, status: any) => {
    try {
      const res = await fetch('/api/incidents/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentId, status }),
      });
      const data = await res.json();
      if (data.success && data.incident) {
        setIncidents(prev => prev.map(inc => inc.id === incidentId ? data.incident : inc));
      }
    } catch (err) {
      console.error("Error updating incident status:", err);
    }
  };

  const handleSendBroadcast = async (broadcastData: any) => {
    try {
      await fetch('/api/incidents/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(broadcastData),
      });
    } catch (err) {
      console.error("Error sending broadcast:", err);
    }
  };

  const handleUpdateRotaPeriods = async (updated: RotaPeriod[]) => {
    setRotaPeriods(updated);
    try {
      await fetch('/api/rota/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updatedPeriods: updated }),
      });
    } catch (err) {
      console.error("Error updating rota:", err);
    }
  };

  const activeIncidentCount = incidents.filter(i => i.status === 'ACTIVE' || i.status === 'ESCALATED').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-20 md:pb-8">
      {/* Top Header & Nav */}
      <HeaderNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isAuthenticated={isAuthenticated}
        onLockSession={handleLockSession}
        activeIncidentCount={activeIncidentCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {activeTab === 'active' && (
          <CurrentOnCallTab
            roles={roles}
            rotaPeriods={rotaPeriods}
            isAuthenticated={isAuthenticated}
            onRequestAuthenticate={() => setShowSecurityLock(true)}
            onNavigateToDirectory={handleNavigateToDirectory}
          />
        )}

        {activeTab === 'directories' && (
          <DirectoriesTab
            isAuthenticated={isAuthenticated}
            onRequestAuthenticate={() => setShowSecurityLock(true)}
            initialCommandLevel={directoryLevel}
          />
        )}

        {activeTab === 'full' && (
          <FullRotaTab
            roles={roles}
            rotaPeriods={rotaPeriods}
            isAuthenticated={isAuthenticated}
            onUpdatePeriods={handleUpdateRotaPeriods}
            onRequestAuthenticate={() => setShowSecurityLock(true)}
          />
        )}

        {activeTab === 'ai' && (
          <AiAssistantTab />
        )}
      </main>

      {/* Security Lock Modal overlay */}
      {showSecurityLock && (
        <SecurityLock onAuthenticated={handleAuthenticated} />
      )}
    </div>
  );
}

"use client";
import { useState, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import AlertBell from "@/components/layout/AlertBell";
import BottomNav from "@/components/layout/BottomNav";
import CoachTab from "@/components/coach/CoachTab";
import WorkshopTab from "@/components/workshop/WorkshopTab";
import InterventionsTab from "@/components/tabs/InterventionsTab";
import PlaybookTab from "@/components/tabs/PlaybookTab";
import ReportsTab from "@/components/tabs/ReportsTab";
import { CoachProvider } from "@/context/CoachContext";
import { ALERTS_DATA, INTERVENTIONS_SEED, TAB_LABELS } from "@/data/constants";
import { IcoSliders } from "@/components/icons";

let _intId = 300;

export default function App() {
  const [tab, setTab] = useState("coach");
  const [alerts, setAlerts] = useState(ALERTS_DATA);
  const [interventions, setInterventions] = useState(INTERVENTIONS_SEED);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPlaybookId, setSelectedPlaybookId] = useState(null);

  const handleAddIntervention = useCallback((newInt) => {
    setInterventions(prev => [...prev, { ...newInt, id: newInt.id || `int-${++_intId}` }]);
  }, []);

  const handleViewPlaybook = useCallback((pbId) => {
    setSelectedPlaybookId(pbId);
    setTab("playbook");
  }, []);

  const handleDeleteIntervention = (id) => {
    setInterventions(prev => prev.filter(i => i.id !== id));
  };

  const handleAlertRead = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, read: true } : a));
  };

  const handleAlertReadAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const renderTab = () => {
    switch (tab) {
      case "coach": return <CoachTab />;
      case "workshop": return <WorkshopTab />;
      case "playbook": return <PlaybookTab onAddIntervention={handleAddIntervention} selectedPlaybookId={selectedPlaybookId} onPlaybookHighlighted={() => setSelectedPlaybookId(null)} />;
      case "interventions": return <InterventionsTab interventions={interventions} onAddIntervention={handleAddIntervention} onDeleteIntervention={handleDeleteIntervention} onViewPlaybook={handleViewPlaybook} />;
      case "reports": return <ReportsTab />;
      default: return <CoachTab />;
    }
  };

  return (
    <CoachProvider
      alerts={alerts} interventions={interventions}
      addIntervention={handleAddIntervention}
      setTab={setTab}
    >
      <div className="flex h-screen bg-white overflow-hidden">
        <Sidebar tab={tab} setTab={setTab} open={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="hidden md:flex items-center px-3 py-2 border-b border-neutral-200 bg-white flex-shrink-0">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors mr-2"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <IcoSliders size={16} />
            </button>
            <p className="text-sm font-semibold text-neutral-800">{TAB_LABELS[tab]}</p>
            <div className="ml-auto flex-shrink-0">
              <AlertBell alerts={alerts} onRead={handleAlertRead} onReadAll={handleAlertReadAll} />
            </div>
          </div>
          <div className="flex-1 overflow-hidden pb-14 md:pb-0">
            {renderTab()}
          </div>
        </div>
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    </CoachProvider>
  );
}

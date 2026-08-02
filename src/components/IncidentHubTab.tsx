import React, { useState } from 'react';
import { CriticalIncident } from '../types';
import { 
  AlertOctagon, 
  FileText, 
  Check, 
  Copy, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  User, 
  Clock, 
  ShieldAlert,
  Info,
  PhoneCall,
  ChevronRight,
  Send,
  BookOpen
} from 'lucide-react';

interface IncidentHubTabProps {
  incidents: CriticalIncident[];
}

export const IncidentHubTab: React.FC<IncidentHubTabProps> = ({ incidents }) => {
  const [activeTab, setActiveTab] = useState<'methane_builder' | 'severity_levels' | 'case_studies'>('methane_builder');
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string>(incidents[0]?.id || 'INC-2026-001');

  // Interactive METHANE Builder State (Client-side helper to draft & copy formatted string)
  const [majorDeclared, setMajorDeclared] = useState(false);
  const [exactLocation, setExactLocation] = useState('St Charles Hospital, Park Royal Ward 2');
  const [typeOfIncident, setTypeOfIncident] = useState('EPRR Clinical System Failure / Power Outage');
  const [hazardsPresent, setHazardsPresent] = useState('Backup generator active, restricted electronic access');
  const [accessRoute, setAccessRoute] = useState('Main Emergency Gate 2 via Exmoor Street');
  const [numberCasualties, setNumberCasualties] = useState('0 casualties; 18 inpatients monitored');
  const [emergencyServices, setEmergencyServices] = useState('Internal Estates On-Call, Local Silver Command');
  const [directorInCharge, setDirectorInCharge] = useState('Director on Call');

  const [copiedMethaneText, setCopiedMethaneText] = useState(false);
  const [copiedCaseStudyMethane, setCopiedCaseStudyMethane] = useState(false);

  // Generate formatted METHANE string
  const formattedMethane = `*** CNWL NHS METHANE INCIDENT REPORT ***
M - Major Incident Declared: ${majorDeclared ? 'YES (GOLD COMMAND ACTIVATED)' : 'NO (STANDBY / LEVEL 2)'}
E - Exact Location: ${exactLocation}
T - Type of Incident: ${typeOfIncident}
H - Hazards Present: ${hazardsPresent}
A - Access Route: ${accessRoute}
N - Number of Casualties: ${numberCasualties}
E - Emergency Services Required: ${emergencyServices}
----------------------------------------
Logged By: ${directorInCharge}
Timestamp: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

  const handleCopyBuilderText = () => {
    navigator.clipboard.writeText(formattedMethane);
    setCopiedMethaneText(true);
    setTimeout(() => setCopiedMethaneText(false), 2000);
  };

  const currentCaseStudy = incidents.find(i => i.id === selectedCaseStudyId) || incidents[0];

  const handleCopyCaseStudyMethane = () => {
    if (!currentCaseStudy || !currentCaseStudy.methane) return;
    const m = currentCaseStudy.methane;
    const text = `*** CNWL METHANE REPORT (${currentCaseStudy.id}) ***
M - Major Incident: ${m.majorIncidentDeclared ? 'YES' : 'NO'}
E - Location: ${m.exactLocation}
T - Type: ${m.typeOfIncident}
H - Hazards: ${m.hazardsPresent}
A - Access: ${m.accessRoute}
N - Casualties: ${m.numberCasualties}
E - Services: ${m.emergencyServicesRequired}
Director: ${currentCaseStudy.directorInCharge}`;

    navigator.clipboard.writeText(text);
    setCopiedCaseStudyMethane(true);
    setTimeout(() => setCopiedCaseStudyMethane(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold mb-2">
            <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
            EPRR INFORMATIONAL REFERENCE RESOURCE
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            METHANE Guidance & Incident Escalation Framework
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Standard reporting templates, NHS incident severity definitions & reference case studies for Directors on Call
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab('methane_builder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
              activeTab === 'methane_builder'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            METHANE Formatter
          </button>
          <button
            onClick={() => setActiveTab('severity_levels')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
              activeTab === 'severity_levels'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Severity Levels
          </button>
          <button
            onClick={() => setActiveTab('case_studies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
              activeTab === 'case_studies'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sample Logs
          </button>
        </div>
      </div>

      {/* TAB 1: METHANE FORMATTER TOOL */}
      {activeTab === 'methane_builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Form Fields */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                METHANE Report Template Draft
              </h3>
              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono font-semibold">
                Copy-Paste Ready
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Fill in the fields below to quickly compose an emergency METHANE notification to copy and transmit via trust email, SMS, or Gold Command communication channels.
            </p>

            <div className="space-y-3 text-xs">
              {/* Major Incident Check */}
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-2">
                <label htmlFor="majorCheck" className="text-xs font-bold text-red-900 cursor-pointer">
                  [M] Declare Major Incident (Gold Command Activation)
                </label>
                <input
                  id="majorCheck"
                  type="checkbox"
                  checked={majorDeclared}
                  onChange={(e) => setMajorDeclared(e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">[E] Exact Location / Site / Ward</label>
                <input
                  type="text"
                  value={exactLocation}
                  onChange={(e) => setExactLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">[T] Type of Incident</label>
                <input
                  type="text"
                  value={typeOfIncident}
                  onChange={(e) => setTypeOfIncident(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">[H] Hazards Present</label>
                  <input
                    type="text"
                    value={hazardsPresent}
                    onChange={(e) => setHazardsPresent(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">[A] Access Route</label>
                  <input
                    type="text"
                    value={accessRoute}
                    onChange={(e) => setAccessRoute(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">[N] Casualties / Patient Impact</label>
                  <input
                    type="text"
                    value={numberCasualties}
                    onChange={(e) => setNumberCasualties(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">[E] Services Required</label>
                  <input
                    type="text"
                    value={emergencyServices}
                    onChange={(e) => setEmergencyServices(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Director on Call Reporting</label>
                <input
                  type="text"
                  value={directorInCharge}
                  onChange={(e) => setDirectorInCharge(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Formatted Text Preview & Copy Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Copy className="w-4 h-4 text-emerald-600" />
                  Formatted Output Stream
                </h3>
                <button
                  onClick={handleCopyBuilderText}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs min-h-[36px]"
                >
                  {copiedMethaneText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMethaneText ? 'Copied to Clipboard!' : 'Copy Formatted Report'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 font-mono text-xs whitespace-pre-wrap leading-relaxed shadow-inner">
                {formattedMethane}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 space-y-1">
              <span className="font-bold block flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                Transmission Instructions:
              </span>
              <p className="text-blue-800 leading-relaxed text-[11px]">
                Copy the block above and send via trusted channels to the On-Call Switchboard, Silver Command Lead, or Gold Command Director. Always follow up with a telephone call to confirm receipt.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NHS INCIDENT SEVERITY LEVELS */}
      {activeTab === 'severity_levels' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Level 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase inline-block mb-2">
                  Level 1 Incident
                </span>
                <h3 className="text-base font-extrabold text-slate-900">Local Incident / Monitoring</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Localized operational disruption managed within normal operational resources and shift rosters without formal Silver Command activation.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block">Typical Examples:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                    <li>Single ward staffing shortfall resolved locally</li>
                    <li>Minor localized water leak contained by Estates</li>
                    <li>Short-term IT system glitch with manual workaround</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700 font-medium">
                <strong>Lead Authority:</strong> Duty Senior Nurse / On-Call Manager
              </div>
            </div>

            {/* Level 2 */}
            <div className="bg-white rounded-2xl border border-amber-300 p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <span className="bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase inline-block mb-2">
                  Level 2 Incident
                </span>
                <h3 className="text-base font-extrabold text-slate-900">Silver Command Escalation</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Moderate disruption affecting multiple units or clinical safety. Requires multi-site coordination, tactical Silver Command activation, and potential Gold notification.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block">Typical Examples:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                    <li>Full ward evacuation or partial site power loss</li>
                    <li>EPR electronic patient record failure across Trust</li>
                    <li>Norovirus outbreak affecting multiple inpatient bays</li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-medium">
                <strong>Lead Authority:</strong> Director on Call (Tactical / Silver Command)
              </div>
            </div>

            {/* Level 3 */}
            <div className="bg-white rounded-2xl border border-red-300 p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <span className="bg-red-50 text-red-700 border border-red-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase inline-block mb-2">
                  Level 3 Incident
                </span>
                <h3 className="text-base font-extrabold text-slate-900">Major Incident / Gold Command</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Severe disruption threatening life safety, critical infrastructure, or statutory compliance. Full Gold Command activation and statutory CQC & NHS England escalation.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block">Typical Examples:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                    <li>Major structural fire, explosion, or severe flood</li>
                    <li>Trust-wide cyber attack / ransomware lockout</li>
                    <li>Mass casualty external emergency or regional collapse</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-[11px] text-red-900 font-medium">
                <strong>Lead Authority:</strong> Chief Executive / Gold Command Director
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAMPLE INCIDENT LOGS & CASE STUDIES */}
      {activeTab === 'case_studies' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* List Sidebar */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              Reference Case Studies ({incidents.length})
            </h3>

            <div className="space-y-2">
              {incidents.map((inc) => {
                const isSelected = inc.id === selectedCaseStudyId;
                return (
                  <button
                    key={inc.id}
                    onClick={() => setSelectedCaseStudyId(inc.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-2 min-h-[50px] ${
                      isSelected
                        ? 'bg-white text-slate-900 border-blue-500 shadow-xs ring-2 ring-blue-500/20'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-700 block mb-0.5">
                        {inc.id} • LEVEL {inc.severityLevel}
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-snug">
                        {inc.title}
                      </h4>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-transform ${isSelected ? 'text-blue-600 translate-x-1' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Case Detail Display */}
          {currentCaseStudy && (
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block mb-0.5">
                      SAMPLE CASE REF: {currentCaseStudy.id}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {currentCaseStudy.title}
                    </h3>
                  </div>
                  <div className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-lg text-xs font-mono font-bold">
                    Severity Level {currentCaseStudy.severityLevel}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                  <strong className="text-slate-900 block font-bold">Executive Summary:</strong>
                  <p className="text-slate-700 leading-relaxed">
                    {currentCaseStudy.summary}
                  </p>
                </div>

                {/* Sample METHANE */}
                {currentCaseStudy.methane && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-blue-600" />
                        Reference METHANE Breakdown:
                      </h4>
                      <button
                        onClick={handleCopyCaseStudyMethane}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1 font-medium"
                      >
                        {copiedCaseStudyMethane ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCaseStudyMethane ? 'Copied' : 'Copy METHANE'}</span>
                      </button>
                    </div>

                    <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5 leading-relaxed">
                      <div><span className="text-amber-400 font-bold">[M] MAJOR INCIDENT:</span> {currentCaseStudy.methane.majorIncidentDeclared ? 'YES' : 'NO'}</div>
                      <div><span className="text-amber-400 font-bold">[E] EXACT LOCATION:</span> {currentCaseStudy.methane.exactLocation}</div>
                      <div><span className="text-amber-400 font-bold">[T] TYPE:</span> {currentCaseStudy.methane.typeOfIncident}</div>
                      <div><span className="text-amber-400 font-bold">[H] HAZARDS:</span> {currentCaseStudy.methane.hazardsPresent}</div>
                      <div><span className="text-amber-400 font-bold">[A] ACCESS:</span> {currentCaseStudy.methane.accessRoute}</div>
                      <div><span className="text-amber-400 font-bold">[N] CASUALTIES:</span> {currentCaseStudy.methane.numberCasualties}</div>
                      <div><span className="text-amber-400 font-bold">[E] SERVICES:</span> {currentCaseStudy.methane.emergencyServicesRequired}</div>
                    </div>
                  </div>
                )}

                {/* Sample Decision Log */}
                {currentCaseStudy.decisionLogs && currentCaseStudy.decisionLogs.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      Sample Decision Audit Trail:
                    </h4>

                    <div className="space-y-2">
                      {currentCaseStudy.decisionLogs.map((log) => (
                        <div key={log.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="font-mono text-blue-700 font-bold">{log.timestamp}</span>
                            <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">
                              {log.category}
                            </span>
                          </div>
                          <p className="text-slate-900 font-medium">{log.decision}</p>
                          <div className="text-[10px] text-slate-500 pt-0.5">
                            Logged by: <strong className="text-slate-700">{log.author}</strong> ({log.role})
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

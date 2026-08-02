export type RoleCategory = 
  | 'DoC_MentalHealth' 
  | 'DoC_Community' 
  | 'Ldn_SNoC' 
  | 'MK_MoC' 
  | 'MH_SMoC' 
  | 'Com_SMoC';

export interface OnCallRoleInfo {
  id: RoleCategory;
  title: string;
  shortCode: string;
  phone: string;
  description: string;
  color: string;
}

export interface RotaPersonRole {
  roleCategory: RoleCategory;
  personName: string;
  startDate?: string;
  endDate?: string;
  phoneOverride?: string;
}

export interface RotaPeriod {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  displayStart: string;
  displayEnd: string;
  assignments: RotaPersonRole[];
}

export interface DecisionLogItem {
  id: string;
  timestamp: string;
  author: string;
  role: string;
  decision: string;
  category: 'Strategic' | 'Operational' | 'Communications' | 'Clinical' | 'Legal_CQC';
  actionAssignedTo?: string;
}

export interface MethaneReport {
  majorIncidentDeclared: boolean;
  exactLocation: string;
  typeOfIncident: string;
  hazardsPresent: string;
  accessRoute: string;
  numberCasualties: string;
  emergencyServicesRequired: string;
}

export interface CriticalIncident {
  id: string;
  title: string;
  severityLevel: 1 | 2 | 3; // 1: Local, 2: Silver Command, 3: Gold/Major Incident
  status: 'ACTIVE' | 'ESCALATED' | 'STAND_DOWN' | 'RESOLVED';
  createdTime: string;
  location: string;
  directorInCharge: string;
  summary: string;
  methane?: MethaneReport;
  decisionLogs: DecisionLogItem[];
}

export interface BroadcastAlert {
  id: string;
  timestamp: string;
  incidentTitle: string;
  severity: string;
  message: string;
  recipients: string[];
  sentBy: string;
}

export interface EscalationPlaybook {
  id: string;
  title: string;
  category: string;
  severityThreshold: string;
  immediateActions: string[];
  mandatoryNotifications: string[];
  keyContacts: string[];
  cqcRequirement?: string;
}

export interface GoldContact {
  id: string;
  name: string;
  title: string;
  category: 'Executive' | 'Divisions' | 'Communication' | 'QTS' | 'DoC' | string;
  commandLevel: 'GOLD';
  phone: string;
  alternativePhone?: string;
  email: string;
  organization: string;
  notes?: string;
  updatedAt?: string;
}

export interface SilverContact {
  id: string;
  name: string;
  title: string;
  category: 'Operational Leads' | 'Borough Commanders' | 'Estates & Facilities' | 'IT & Cyber On-Call' | 'Clinical Leads' | 'Other Operational';
  commandLevel: 'SILVER';
  phone: string;
  alternativePhone?: string;
  email: string;
  siteLocation?: string;
  notes?: string;
  updatedAt?: string;
}

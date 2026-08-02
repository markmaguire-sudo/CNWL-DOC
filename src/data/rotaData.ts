import { OnCallRoleInfo, RotaPeriod, EscalationPlaybook, CriticalIncident } from '../types';

export const DEDICATED_ROLES: OnCallRoleInfo[] = [
  {
    id: 'Ldn_SNoC',
    title: 'Senior Nurse for CNWL London',
    shortCode: 'Ldn-SNoC',
    phone: '0800 090 2464',
    description: 'Senior Clinical Nursing Lead for CNWL London Units & Inpatient Bed Management',
    color: 'bg-blue-600 text-white',
    group: 'Mental Health'
  },
  {
    id: 'MK_MoC',
    title: 'Manager for CNWL Milton Keynes',
    shortCode: 'MK-MoC',
    phone: '0800 090 2465',
    description: 'Operational Manager Lead for Milton Keynes Community & Mental Health Services',
    color: 'bg-rose-600 text-white',
    group: 'Mental Health'
  },
  {
    id: 'MH_SMoC',
    title: 'Senior Manager - Mental Health',
    shortCode: 'MH-SMoC',
    phone: '0800 090 2467',
    description: 'Senior Operational Manager for Mental Health Acute & Crisis Teams',
    color: 'bg-amber-600 text-white',
    group: 'Mental Health'
  },
  {
    id: 'Com_SMoC',
    title: 'Senior Manager - Community',
    shortCode: 'Com-SMoC',
    phone: '0800 090 2466',
    description: 'Senior Operational Manager for Community Services & Urgent Care Pathways',
    color: 'bg-sky-600 text-white',
    group: 'Community'
  },
  {
    id: 'DoC',
    title: 'Director for CNWL',
    shortCode: 'DoC',
    phone: '07740 514 459',
    description: 'Executive Director Lead for Trust-Wide On-Call & Acute Crisis Escalations',
    color: 'bg-emerald-800 text-white',
    group: 'Director on Call'
  }
];

export const INITIAL_ROTA_PERIODS: RotaPeriod[] = [
  {
    id: 'period-1',
    startDate: '2026-06-30',
    endDate: '2026-07-03',
    displayStart: 'Tue 30/06/2026',
    displayEnd: 'Fri 03/07/2026',
    assignments: [
      { roleCategory: 'Ldn_SNoC', personName: 'Marrietta Khorramdel' },
      { roleCategory: 'MK_MoC', personName: 'Mary Smith' },
      { roleCategory: 'MH_SMoC', personName: 'Ross Graves' },
      { roleCategory: 'Com_SMoC', personName: 'Ross Graves' },
      { roleCategory: 'DoC', personName: 'Ross Graves' }
    ]
  },
  {
    id: 'period-2',
    startDate: '2026-07-03',
    endDate: '2026-07-07',
    displayStart: 'Fri 03/07/2026',
    displayEnd: 'Tue 07/07/2026',
    assignments: [
      { roleCategory: 'Ldn_SNoC', personName: 'Sarah Farooq' },
      { roleCategory: 'MK_MoC', personName: 'Mary Smith' },
      { roleCategory: 'MH_SMoC', personName: 'Ross Graves' },
      { roleCategory: 'Com_SMoC', personName: 'Ross Graves' },
      { roleCategory: 'DoC', personName: 'Ross Graves' }
    ]
  },
  {
    id: 'period-3',
    startDate: '2026-07-07',
    endDate: '2026-07-10',
    displayStart: 'Tue 07/07/2026',
    displayEnd: 'Fri 10/07/2026',
    assignments: [
      { roleCategory: 'Ldn_SNoC', personName: 'Vicky Hancock' },
      { roleCategory: 'MK_MoC', personName: 'Mary Smith' },
      { roleCategory: 'MH_SMoC', personName: 'Nick Green' },
      { roleCategory: 'Com_SMoC', personName: 'Nick Green' },
      { roleCategory: 'DoC', personName: 'Nick Green' }
    ]
  },
  {
    id: 'period-4',
    startDate: '2026-07-10',
    endDate: '2026-07-14',
    displayStart: 'Fri 10/07/2026',
    displayEnd: 'Tue 14/07/2026',
    assignments: [
      { roleCategory: 'Ldn_SNoC', personName: 'Nick Bygraves' },
      { roleCategory: 'MK_MoC', personName: 'Mel Cahil' },
      { roleCategory: 'MH_SMoC', personName: 'Nick Green' },
      { roleCategory: 'Com_SMoC', personName: 'Nick Green' },
      { roleCategory: 'DoC', personName: 'Nick Green' }
    ]
  },
  {
    id: 'period-5',
    startDate: '2026-07-14',
    endDate: '2026-07-17',
    displayStart: 'Tue 14/07/2026',
    displayEnd: 'Fri 17/07/2026',
    assignments: [
      { roleCategory: 'Ldn_SNoC', personName: 'Oisagie Usideme' },
      { roleCategory: 'MK_MoC', personName: 'Mel Cahil' },
      { roleCategory: 'MH_SMoC', personName: 'Tracy White' },
      { roleCategory: 'Com_SMoC', personName: 'Tracy White' },
      { roleCategory: 'DoC', personName: 'Tracy White' }
    ]
  },
  {
    id: 'period-6',
    startDate: '2026-07-17',
    endDate: '2026-07-21',
    displayStart: 'Fri 17/07/2026',
    displayEnd: 'Tue 21/07/2026',
    assignments: [
      { roleCategory: 'Ldn_SNoC', personName: 'Marrietta Khorramdel' },
      { roleCategory: 'MK_MoC', personName: 'Mary Smith' },
      { roleCategory: 'MH_SMoC', personName: 'Tracy White' },
      { roleCategory: 'Com_SMoC', personName: 'Tracy White' },
      { roleCategory: 'DoC', personName: 'Tracy White' }
    ]
  },
  {
    id: 'period-7',
    startDate: '2026-07-21',
    endDate: '2026-07-24',
    displayStart: 'Tue 21/07/2026',
    displayEnd: 'Fri 24/07/2026',
    assignments: [
      { roleCategory: 'Ldn_SNoC', personName: 'Luis Gracia' },
      { roleCategory: 'MK_MoC', personName: 'James Clay' },
      { roleCategory: 'MH_SMoC', personName: 'Marrietta Khorramdel' },
      { roleCategory: 'Com_SMoC', personName: 'Mary Smith' },
      { roleCategory: 'DoC', personName: 'Mark Maguire' }
    ]
  },
  {
    id: 'period-8',
    startDate: '2026-07-24',
    endDate: '2026-07-28',
    displayStart: 'Fri 24/07/2026',
    displayEnd: 'Tue 28/07/2026',
    assignments: [
      { roleCategory: 'Ldn_SNoC', personName: 'Stephen Burke (24/07 - 27/07) / Lucy Cooper (27/07 - 31/07)' },
      { roleCategory: 'MK_MoC', personName: 'Jemma Cain (24/07 - 27/07) / Lorraine Shelby (27/07 - 31/07)' },
      { roleCategory: 'MH_SMoC', personName: 'Sarah Farooq (24/07 - 27/07) / Vicky Hancock (27/07 - 31/07)' },
      { roleCategory: 'Com_SMoC', personName: 'Mary Smith' },
      { roleCategory: 'DoC', personName: 'Mark Maguire' }
    ]
  },
  {
    id: 'period-9',
    startDate: '2026-07-28',
    endDate: '2026-07-31',
    displayStart: 'Tue 28/07/2026',
    displayEnd: 'Fri 31/07/2026',
    assignments: [
      { roleCategory: 'Ldn_SNoC', personName: 'Lucy Cooper' },
      { roleCategory: 'MK_MoC', personName: 'Lorraine Shelby' },
      { roleCategory: 'MH_SMoC', personName: 'Vicky Hancock' },
      { roleCategory: 'Com_SMoC', personName: 'Mel Cahil' },
      { roleCategory: 'DoC', personName: 'Sabrina Philips' }
    ]
  },
  {
    id: 'period-10',
    startDate: '2026-07-31',
    endDate: '2026-08-04',
    displayStart: 'Fri 31/07/2026',
    displayEnd: 'Tue 04/08/2026',
    assignments: [
      { roleCategory: 'Ldn_SNoC', personName: 'Gemma Brown (31/07 - 03/08) / Kwame Boaitey (03/08 - 07/08)' },
      { roleCategory: 'MK_MoC', personName: 'Caroline Davies (31/07 - 03/08) / Tsitsi Mlilo (03/08 - 07/08)' },
      { roleCategory: 'MH_SMoC', personName: 'Nick Bygraves (31/07 - 03/08) / Oisagie Usideme (03/08 - 07/08)' },
      { roleCategory: 'Com_SMoC', personName: 'Mel Cahil' },
      { roleCategory: 'DoC', personName: 'Sabrina Philips' }
    ]
  },
  {
    id: 'period-11',
    startDate: '2026-08-04',
    endDate: '2026-08-07',
    displayStart: 'Tue 04/08/2026',
    displayEnd: 'Fri 07/08/2026',
    assignments: [
      { roleCategory: 'Ldn_SNoC', personName: 'Oisagie Usideme' },
      { roleCategory: 'MK_MoC', personName: 'Tsitsi Mlilo' },
      { roleCategory: 'MH_SMoC', personName: 'Oisagie Usideme' },
      { roleCategory: 'Com_SMoC', personName: 'Mel Cahil' },
      { roleCategory: 'DoC', personName: 'Kim Cox' }
    ]
  },
  {
    id: 'period-12',
    startDate: '2026-08-07',
    endDate: '2026-08-11',
    displayStart: 'Fri 07/08/2026',
    displayEnd: 'Tue 11/08/2026',
    assignments: [
      { roleCategory: 'DoC', personName: 'Kim Cox' },
      { roleCategory: 'Ldn_SNoC', personName: 'Marrietta Khorramdel' },
      { roleCategory: 'MK_MoC', personName: 'Mary Smith' },
      { roleCategory: 'MH_SMoC', personName: 'Kim Cox' },
      { roleCategory: 'Com_SMoC', personName: 'Kim Cox' }
    ]
  },
  {
    id: 'period-13',
    startDate: '2026-08-11',
    endDate: '2026-08-14',
    displayStart: 'Tue 11/08/2026',
    displayEnd: 'Fri 14/08/2026',
    assignments: [
      { roleCategory: 'DoC', personName: 'Doug Stewart' },
      { roleCategory: 'Ldn_SNoC', personName: 'Sarah Farooq' },
      { roleCategory: 'MK_MoC', personName: 'Mary Smith' },
      { roleCategory: 'MH_SMoC', personName: 'Doug Stewart' },
      { roleCategory: 'Com_SMoC', personName: 'Doug Stewart' }
    ]
  },
  {
    id: 'period-14',
    startDate: '2026-08-14',
    endDate: '2026-08-18',
    displayStart: 'Fri 14/08/2026',
    displayEnd: 'Tue 18/08/2026',
    assignments: [
      { roleCategory: 'DoC', personName: 'Doug Stewart' },
      { roleCategory: 'Ldn_SNoC', personName: 'Vicky Hancock' },
      { roleCategory: 'MK_MoC', personName: 'Mel Cahil' },
      { roleCategory: 'MH_SMoC', personName: 'Doug Stewart' },
      { roleCategory: 'Com_SMoC', personName: 'Doug Stewart' }
    ]
  },
  {
    id: 'period-15',
    startDate: '2026-08-18',
    endDate: '2026-08-21',
    displayStart: 'Tue 18/08/2026',
    displayEnd: 'Fri 21/08/2026',
    assignments: [
      { roleCategory: 'DoC', personName: 'Ryan Kemp' },
      { roleCategory: 'Ldn_SNoC', personName: 'Nick Bygraves' },
      { roleCategory: 'MK_MoC', personName: 'Mel Cahil' },
      { roleCategory: 'MH_SMoC', personName: 'Ryan Kemp' },
      { roleCategory: 'Com_SMoC', personName: 'Ryan Kemp' }
    ]
  },
  {
    id: 'period-16',
    startDate: '2026-08-21',
    endDate: '2026-08-25',
    displayStart: 'Fri 21/08/2026',
    displayEnd: 'Tue 25/08/2026',
    assignments: [
      { roleCategory: 'DoC', personName: 'Ryan Kemp' },
      { roleCategory: 'Ldn_SNoC', personName: 'Oisagie Usideme' },
      { roleCategory: 'MK_MoC', personName: 'Mary Smith' },
      { roleCategory: 'MH_SMoC', personName: 'Ryan Kemp' },
      { roleCategory: 'Com_SMoC', personName: 'Ryan Kemp' }
    ]
  },
  {
    id: 'period-17',
    startDate: '2026-08-25',
    endDate: '2026-08-28',
    displayStart: 'Tue 25/08/2026',
    displayEnd: 'Fri 28/08/2026',
    assignments: [
      { roleCategory: 'DoC', personName: 'William Sakala' },
      { roleCategory: 'Ldn_SNoC', personName: 'Marrietta Khorramdel' },
      { roleCategory: 'MK_MoC', personName: 'Mary Smith' },
      { roleCategory: 'MH_SMoC', personName: 'William Sakala' },
      { roleCategory: 'Com_SMoC', personName: 'William Sakala' }
    ]
  },
  {
    id: 'period-18',
    startDate: '2026-08-28',
    endDate: '2026-09-01',
    displayStart: 'Fri 28/08/2026',
    displayEnd: 'Tue 01/09/2026',
    assignments: [
      { roleCategory: 'DoC', personName: 'William Sakala' },
      { roleCategory: 'Ldn_SNoC', personName: 'Sarah Farooq' },
      { roleCategory: 'MK_MoC', personName: 'Mel Cahil' },
      { roleCategory: 'MH_SMoC', personName: 'William Sakala' },
      { roleCategory: 'Com_SMoC', personName: 'William Sakala' }
    ]
  },
  {
    id: 'period-19',
    startDate: '2026-09-01',
    endDate: '2026-09-04',
    displayStart: 'Tue 01/09/2026',
    displayEnd: 'Fri 04/09/2026',
    assignments: [
      { roleCategory: 'DoC', personName: 'Amanda Pithouse' },
      { roleCategory: 'Ldn_SNoC', personName: 'Vicky Hancock' },
      { roleCategory: 'MK_MoC', personName: 'Mel Cahil' },
      { roleCategory: 'MH_SMoC', personName: 'Amanda Pithouse' },
      { roleCategory: 'Com_SMoC', personName: 'Amanda Pithouse' }
    ]
  },
  {
    id: 'period-20',
    startDate: '2026-09-04',
    endDate: '2026-09-08',
    displayStart: 'Fri 04/09/2026',
    displayEnd: 'Tue 08/09/2026',
    assignments: [
      { roleCategory: 'DoC', personName: 'Amanda Pithouse' },
      { roleCategory: 'Ldn_SNoC', personName: 'Nick Bygraves' },
      { roleCategory: 'MK_MoC', personName: 'Mary Smith' },
      { roleCategory: 'MH_SMoC', personName: 'Amanda Pithouse' },
      { roleCategory: 'Com_SMoC', personName: 'Amanda Pithouse' }
    ]
  },
  {
    id: 'period-21',
    startDate: '2026-09-08',
    endDate: '2026-09-11',
    displayStart: 'Tue 08/09/2026',
    displayEnd: 'Fri 11/09/2026',
    assignments: [
      { roleCategory: 'DoC', personName: 'Alison Butler' },
      { roleCategory: 'Ldn_SNoC', personName: 'Oisagie Usideme' },
      { roleCategory: 'MK_MoC', personName: 'Mel Cahil' },
      { roleCategory: 'MH_SMoC', personName: 'Alison Butler' },
      { roleCategory: 'Com_SMoC', personName: 'Alison Butler' }
    ]
  },
  {
    id: 'period-22',
    startDate: '2026-09-11',
    endDate: '2026-09-15',
    displayStart: 'Fri 11/09/2026',
    displayEnd: 'Tue 15/09/2026',
    assignments: [
      { roleCategory: 'DoC', personName: 'Alison Butler' },
      { roleCategory: 'Ldn_SNoC', personName: 'Marrietta Khorramdel' },
      { roleCategory: 'MK_MoC', personName: 'Mary Smith' },
      { roleCategory: 'MH_SMoC', personName: 'Alison Butler' },
      { roleCategory: 'Com_SMoC', personName: 'Alison Butler' }
    ]
  },
  {
    id: 'period-23',
    startDate: '2026-09-15',
    endDate: '2026-09-18',
    displayStart: 'Tue 15/09/2026',
    displayEnd: 'Fri 18/09/2026',
    assignments: [
      { roleCategory: 'DoC', personName: 'Graeme Caul' },
      { roleCategory: 'Ldn_SNoC', personName: 'Sarah Farooq' },
      { roleCategory: 'MK_MoC', personName: 'Mel Cahil' },
      { roleCategory: 'MH_SMoC', personName: 'Graeme Caul' },
      { roleCategory: 'Com_SMoC', personName: 'Graeme Caul' }
    ]
  },
  {
    id: 'period-24',
    startDate: '2026-09-18',
    endDate: '2026-09-22',
    displayStart: 'Fri 18/09/2026',
    displayEnd: 'Tue 22/09/2026',
    assignments: [
      { roleCategory: 'DoC', personName: 'Graeme Caul' },
      { roleCategory: 'Ldn_SNoC', personName: 'Vicky Hancock' },
      { roleCategory: 'MK_MoC', personName: 'Mary Smith' },
      { roleCategory: 'MH_SMoC', personName: 'Graeme Caul' },
      { roleCategory: 'Com_SMoC', personName: 'Graeme Caul' }
    ]
  }
];

export const PLAYBOOKS: EscalationPlaybook[] = [
  {
    id: 'pb-silver-gold',
    title: 'Gold & Silver Command Escalation Framework',
    category: 'Governance & Command',
    severityThreshold: 'Level 2 & Level 3',
    immediateActions: [
      'Assess threat to life, patient safety, or severe disruption to core NHS services.',
      'Declare Silver Command (Operational Level) or Gold Command (Strategic Level) if multi-site or multi-agency.',
      'Appoint Log Keeper immediately to record all decisions, timings, and rationale.',
      'Establish regular 30-minute Gold Command briefing cadence via dedicated emergency teleconference line.'
    ],
    mandatoryNotifications: [
      'NHS England Regional EPRR On-Call',
      'Chief Executive Officer (CNWL)',
      'Communications & Media Press Team On-Call',
      'Integrated Care Board (ICB) Gold Lead'
    ],
    keyContacts: ['DoC', 'MH_SMoC'],
    cqcRequirement: 'Notifiable event if severe disruption or emergency evacuation occurs.'
  },
  {
    id: 'pb-cyber-it',
    title: 'Critical IT Outage & Cyber Security Attack (RiO / SystmOne)',
    category: 'IT & EPR Failure',
    severityThreshold: 'Level 2 (Silver) / Level 3 (Gold)',
    immediateActions: [
      'Isolate compromised network segments if ransomware suspected; preserve log files.',
      'Invoke Business Continuity Plan (BCP) & paper-based patient recording protocols across affected sites.',
      'Establish physical dispatch or phone check-ins for high-risk community patients (CPA red list).',
      'Verify backup generator/UPS power for core server nodes if hardware issue.'
    ],
    mandatoryNotifications: [
      'CNWL Chief Information Officer (CIO) On-Call',
      'NHS England Cyber Operations (CSOC / 0300 303 5222)',
      'Information Commissioner Office (ICO) within 72 hours if data breach'
    ],
    keyContacts: ['DoC', 'Com_SMoC'],
    cqcRequirement: 'Report under CQC Regulation 18 if electronic patient record outage risks harm.'
  },
  {
    id: 'pb-patient-harm',
    title: 'Severe Patient Harm / Inpatient Death in Care',
    category: 'Clinical Governance',
    severityThreshold: 'Level 2 (Silver Escalation)',
    immediateActions: [
      'Ensure immediate medical attention and stabilize remaining patients/staff on ward.',
      'Preserve scene if unexpected death or suspected foul play; contact Metropolitan Police / Thames Valley Police.',
      'Enact Duty of Candour protocol to inform family/next of kin within 24 hours in writing.',
      'Debrief attending nursing team and arrange psychological staff support.'
    ],
    mandatoryNotifications: [
      'Chief Medical Officer & Chief Nurse',
      'CQC Notification via Portal within 24 hours',
      'Coroner Office & NHS Resolution'
    ],
    keyContacts: ['Ldn_SNoC', 'DoC', 'MH_SMoC'],
    cqcRequirement: 'Statutory Regulation 16/18 notification mandatory.'
  },
  {
    id: 'pb-facility-fire',
    title: 'Facility Emergency, Fire or Severe Infrastructure Damage',
    category: 'Estates & Facilities',
    severityThreshold: 'Level 3 (Major Incident)',
    immediateActions: [
      'Evacuate affected ward/building to designated assembly point per Fire Evacuation Plan.',
      'Call Emergency Services (999 Fire Brigade) and confirm casualties/hazards.',
      'Construct METHANE report and broadcast to Silver/Gold Command team.',
      'Coordinate emergency bed placement for evacuated mental health/community inpatients across CNWL network.'
    ],
    mandatoryNotifications: [
      'Estates & Facilities Director On-Call',
      'London Ambulance Service / South Central Ambulance Service',
      'NHSE EPRR Regional Command'
    ],
    keyContacts: ['DoC', 'Ldn_SNoC', 'MK_MoC'],
    cqcRequirement: 'CQC Notification regarding change in service capacity or location.'
  },
  {
    id: 'pb-media-crisis',
    title: 'Media Emergency, Crisis Communications & Social Media',
    category: 'Reputation & Comms',
    severityThreshold: 'Level 1 / Level 2',
    immediateActions: [
      'Enforce "No Comment / Redirect to Press Office" rule for all front-line staff.',
      'Do NOT confirm patient names or clinical details under any circumstances.',
      'Draft holding statement with CNWL Communications Lead based on verified facts.',
      'Monitor social media sentiment and alert Gold Lead if viral false reports emerge.'
    ],
    mandatoryNotifications: [
      'CNWL Head of Communications & Media Lead',
      'NHSE Communications On-Call'
    ],
    keyContacts: ['DoC'],
    cqcRequirement: 'Inform Board Lead for Communications.'
  }
];

export const INITIAL_INCIDENTS: CriticalIncident[] = [
  {
    id: 'INC-2026-0802-01',
    title: 'St Charles Mental Health Unit - Mains Power Disturbance & Generator Test',
    severityLevel: 2,
    status: 'ACTIVE',
    createdTime: '2026-08-02 01:15',
    location: 'St Charles Hospital, Kensington & Chelsea, London',
    directorInCharge: 'Gemma Brown (Mental Health DoC)',
    summary: 'Partial power dip affecting Riverside Ward. Backup UPS activated. Estates team en route to assess main substation transformer.',
    methane: {
      majorIncidentDeclared: false,
      exactLocation: 'St Charles Hospital, Exmoor Street, London W10 6DZ',
      typeOfIncident: 'Electrical Infrastructure Failure / Power Dip',
      hazardsPresent: 'Emergency lighting active. Medical equipment on battery backup.',
      accessRoute: 'Exmoor Street Main Gate clear for emergency engineers',
      numberCasualties: '0 casualties. All 18 patients safe and accounted for.',
      emergencyServicesRequired: 'Estates Emergency Contractor & UK Power Networks notified.'
    },
    decisionLogs: [
      {
        id: 'log-1',
        timestamp: '2026-08-02 01:20',
        author: 'Gemma Brown',
        role: 'Director on Call - Mental Health',
        decision: 'Convened Silver Command teleconference with London Senior Nurse on Call (Nick Bygraves) and Estates Duty Lead.',
        category: 'Strategic',
        actionAssignedTo: 'Nick Bygraves (Ldn-SNoC)'
      },
      {
        id: 'log-2',
        timestamp: '2026-08-02 01:35',
        author: 'Nick Bygraves',
        role: 'Senior Nurse on Call - London',
        decision: 'Verified battery reserves on all vital monitors in Riverside Ward. Staffing ratio checked; night shift doubled up for patient re-assurance.',
        category: 'Clinical',
        actionAssignedTo: 'Ward Sister - Riverside'
      }
    ]
  }
];

export interface InpatientContact {
  role: string;
  phone: string;
  alternativePhone?: string;
}

export interface InpatientSite {
  id: string;
  boroughCategory: string;
  siteName: string;
  address?: string;
  mainPhone?: string;
  serviceName?: string;
  wards?: string[];
  contacts: InpatientContact[];
  notes?: string;
}

export const INPATIENT_SITES_DATA: InpatientSite[] = [
  // Kensington Chelsea and Westminster (KCW)
  {
    id: 'kcw-gordon',
    boroughCategory: 'Kensington Chelsea & Westminster (KCW)',
    siteName: 'The Gordon Hospital',
    address: 'Bloomburg Street, London, SW1V 2RH',
    mainPhone: '020 3838 7930',
    contacts: [
      { role: 'Main Hospital Switchboard', phone: '020 3838 7930' }
    ]
  },
  {
    id: 'kcw-flow-hub',
    boroughCategory: 'Kensington Chelsea & Westminster (KCW)',
    siteName: 'Central Flow Hub (Bed Flow Hub)',
    mainPhone: '0203 317 5917',
    contacts: [
      { role: 'Bed Flow Hub Landline', phone: '0203 317 5917', alternativePhone: '07783 657 208' },
      { role: 'Landline Out-of-Order Mobile Backup', phone: '07783 657 208' }
    ]
  },
  {
    id: 'kcw-st-charles',
    boroughCategory: 'Kensington Chelsea & Westminster (KCW)',
    siteName: 'St Charles Hospital',
    address: 'Exmoor Street, London, W10 6DZ',
    wards: ['Shannon (Adult MH)', 'Nile (Adult MH)', 'Amazon (Adult MH)', 'Thames (Adult MH)', 'Ganges (Adult MH)', 'Danube (Adult MH)', 'Kershaw (Older Adult MH)', 'Redwood (Older Adult MH)'],
    contacts: [
      { role: 'Office Hours Contact (Marietta Khorramdel)', phone: '07895 207006' },
      { role: 'Out of Hours Bleep Holder', phone: '07590 003282' }
    ]
  },
  {
    id: 'kcw-3-beatrice',
    boroughCategory: 'Kensington Chelsea & Westminster (KCW)',
    siteName: '3 Beatrice Place',
    address: '3 Beatrice Place, Marloes Road, London, W8 5LW',
    wards: ['Older Adults Ward'],
    contacts: [
      { role: 'Office Hours Telephone', phone: '020 3838 7816' },
      { role: 'Out of Hours Telephone', phone: '020 3830 7805', alternativePhone: '020 3830 7810' }
    ]
  },

  // Brent
  {
    id: 'brent-park-royal',
    boroughCategory: 'Brent',
    siteName: 'Park Royal Centre for Mental Health',
    address: 'Central Way (off Acton Lane), London, NW10 7NS',
    wards: ['Pine Ward (Acute)', 'Pond Ward (Acute)', 'Shore Ward (Acute)', 'Caspian Ward (Acute)', 'Coombe Wood (Perinatal)'],
    contacts: [
      { role: 'Site Coordinator', phone: '07791 886602' },
      { role: 'Pine Ward (Acute) Nurse in Charge', phone: '020 3838 7727' },
      { role: 'Pond Ward (Acute) Nurse in Charge', phone: '020 3838 7713' },
      { role: 'Pine, Pond & Caspian Ward Matron', phone: '020 8206 7080' },
      { role: 'Shore Ward (Acute) Nurse in Charge', phone: '020 3838 7721' },
      { role: 'Shore Ward Manager', phone: '07596 887656' },
      { role: 'Caspian Ward (Acute) Nurse in Charge', phone: '020 3838 7760' },
      { role: 'Coombe Wood (Perinatal) Nurse in Charge', phone: '020 3838 7742' },
      { role: 'Operations Manager', phone: '020 3838 7748' }
    ]
  },

  // Learning Disabilities
  {
    id: 'ld-kingswood',
    boroughCategory: 'Learning Disabilities',
    siteName: 'Kingswood Centre',
    address: '134 Honeypot Lane, Kingsbury, London, NW9 9QY',
    wards: ['Acute Adult LD', 'Carlton House', 'Crystal House'],
    contacts: [
      { role: 'Acute Adult Ward Nurse on Call', phone: '07970 655650' },
      { role: 'Acute Adult Ward Nurse in Charge', phone: '020 8238 0992', alternativePhone: '020 8238 0933' },
      { role: 'Carlton House & Crystal House Matron', phone: '07923 440032' },
      { role: 'Carlton House & Crystal House Nurse in Charge', phone: '020 8238 0900' }
    ]
  },

  // Harrow
  {
    id: 'harrow-northwick-park',
    boroughCategory: 'Harrow',
    siteName: 'Northwick Park Hospital (Mental Health Wards)',
    address: 'Watford Road, Harrow, London, HA1 3UJ',
    wards: ['Eastlake Ward (Acute)', 'Fernley Ward (Acute)', 'Ellington Ward (Older Adult)'],
    contacts: [
      { role: 'Bleepholder for All Wards', phone: '07712 413561' },
      { role: 'Acute Wards Matron', phone: '07595 067636' },
      { role: 'Eastlake Ward (Acute) Nurse in Charge', phone: '020 8869 2270' },
      { role: 'Fernley Ward (Acute) Nurse in Charge', phone: '020 8869 2255' },
      { role: 'Ellington Ward (Older Adult) Matron', phone: '07595 067636' },
      { role: 'Ellington Ward (Older Adult) Nurse in Charge', phone: '020 8869 2268' }
    ]
  },

  // Camden
  {
    id: 'camden-st-pancras',
    boroughCategory: 'Camden',
    siteName: 'St Pancras Hospital',
    address: 'Ground Floor, South Wing, 4 St Pancras Way, London, NW1 0PE',
    wards: ['Rochester East Ward', 'Rochester West Ward', 'Oakwood Ward'],
    contacts: [
      { role: 'Bleepholder for All Wards', phone: '07704 251542' },
      { role: 'All Wards Matron', phone: '020 3317 3435' },
      { role: 'Rochester East Ward Manager', phone: '07503 456491' },
      { role: 'Rochester East Nurse in Charge', phone: '020 3317 3435' },
      { role: 'Rochester West Ward Manager', phone: '020 8333 3000' },
      { role: 'Rochester West Nurse in Charge', phone: '020 3317 3421' },
      { role: 'Oakwood Ward Manager', phone: '07956 367199' },
      { role: 'Oakwood Nurse in Charge', phone: '020 3317 3413' }
    ]
  },

  // Hillingdon
  {
    id: 'hillingdon-riverside',
    boroughCategory: 'Hillingdon',
    siteName: 'Riverside Centre for Mental Health',
    address: 'Hillingdon Hospital, Pield Heath Road, Uxbridge, Greater London, UB8 3NN',
    wards: ['Colne Ward (Acute)', 'Frays Ward (Acute)', 'Crane Ward (Acute)', 'Oaktree Ward (Older Adults)'],
    contacts: [
      { role: 'All Wards Unit Coordinator', phone: '07825 356840' },
      { role: 'All Wards Matron', phone: '07860 916171' },
      { role: 'Colne Ward (Acute) Nurse in Charge', phone: '01895 485151' },
      { role: 'Frays Ward (Acute) Nurse in Charge', phone: '01895 485160' },
      { role: 'Crane Ward (Acute) Nurse in Charge', phone: '01895 485154' },
      { role: 'Oaktree Ward (Older Adults) Nurse in Charge', phone: '01895 485199' }
    ]
  },
  {
    id: 'hillingdon-hawthorne',
    boroughCategory: 'Hillingdon',
    siteName: 'Hawthorne Intermediate Care Unit (HICU)',
    address: 'Hillingdon Hospital, Pield Heath Road, Uxbridge, Greater London, UB8 3NN',
    contacts: [
      { role: 'HICU Manager', phone: '01895 485211', alternativePhone: '07496 315337' },
      { role: 'HICU Nurse in Charge', phone: '01895 485211' }
    ]
  },

  // CAMHS and Eating Disorders
  {
    id: 'camhs-nightingale',
    boroughCategory: 'CAMHS & Eating Disorders',
    siteName: 'Nightingale Place',
    address: '1 Nightingale Place, London, SW10 9NG',
    serviceName: 'Lavender Walk (CAMHS) & Vincent Square (Eating Disorders)',
    contacts: [
      { role: 'Lavender Walk (CAMHS) Manager', phone: '07732 825628' },
      { role: 'Lavender Walk (CAMHS) Nurse in Charge', phone: '020 3317 3766' },
      { role: 'Lavender Walk (CAMHS) Reception', phone: '020 3317 3753' },
      { role: 'Vincent Square (Eating Disorders) Manager', phone: '020 3315 2104' },
      { role: 'Vincent Square (Eating Disorders) Nurse in Charge', phone: '020 3315 8951' },
      { role: 'Vincent Square (Eating Disorders) Reception', phone: '020 3315 2104' }
    ]
  },
  {
    id: 'camhs-beatrice',
    boroughCategory: 'CAMHS & Eating Disorders',
    siteName: 'Beatrice Place (Collingham CAMHS)',
    address: '1 Beatrice Place, Marloes Road, London, W8 5LW',
    serviceName: 'Collingham Child & Adolescent Mental Health Services',
    contacts: [
      { role: 'Collingham (CAMHS) Reception', phone: '020 3838 7800' },
      { role: 'Collingham (CAMHS) Nurse in Charge', phone: '07597 195819' },
      { role: 'Collingham (CAMHS) Manager', phone: '07355 021555' },
      { role: 'Collingham (CAMHS) Matron', phone: '07375 270175' }
    ]
  },

  // Rehabilitation (Rehab)
  {
    id: 'rehab-horton',
    boroughCategory: 'Rehabilitation',
    siteName: 'The Horton',
    address: 'The Link, 10 Haven Drive, Epsom, KT19 7HA',
    contacts: [
      { role: 'The Horton Main Reception', phone: '020 3838 7820' },
      { role: 'Birch Villa Reception', phone: '020 3838 7821' },
      { role: 'Ascot Villa', phone: '020 3838 7824' },
      { role: 'The Cottages', phone: '020 3838 7824' }
    ]
  },
  {
    id: 'rehab-roxbourne',
    boroughCategory: 'Rehabilitation',
    siteName: 'Roxbourne',
    address: 'Rayners Lane, Harrow, HA2 0UE',
    wards: ['Roxbourne House', 'Roxbourne Lodge'],
    contacts: [
      { role: 'Roxbourne House & Lodge Unit Manager', phone: '020 3028 7936' },
      { role: 'Roxbourne House Nurse in Charge', phone: '020 3028 7936' },
      { role: 'Roxbourne Lodge Nurse in Charge', phone: '020 8423 8200' }
    ]
  },
  {
    id: 'rehab-kingswood',
    boroughCategory: 'Rehabilitation',
    siteName: 'Kingswood Centre (Kenton Units)',
    address: '134 Honeypot Lane, Kingsbury, London, NW9 9QY',
    wards: ['Kenton House', 'Kenton Lodge'],
    contacts: [
      { role: 'Kenton House & Lodge Ward Manager', phone: '020 8238 0936' },
      { role: 'Kenton House Nurse in Charge', phone: '020 8238 0936' },
      { role: 'Kenton Lodge Nurse in Charge', phone: '020 8238 0934' }
    ]
  },
  {
    id: 'rehab-bluebell',
    boroughCategory: 'Rehabilitation',
    siteName: 'Bluebell Lodge',
    address: '7a Woodfield Road, London, W9 2NW',
    contacts: [
      { role: 'Bluebell Lodge Ward Manager', phone: '07969 530023' },
      { role: 'Bluebell Lodge Nurse in Charge', phone: '020 7266 9650', alternativePhone: '020 7266 9660' }
    ]
  },
  {
    id: 'rehab-rosedale',
    boroughCategory: 'Rehabilitation',
    siteName: 'Rosedale Court',
    address: '75-79 Greenford Road, Harrow, HA1 3QF',
    contacts: [
      { role: 'Rosedale Court Unit Manager', phone: '020 8864 2925' }
    ]
  },
  {
    id: 'rehab-colham-green',
    boroughCategory: 'Rehabilitation',
    siteName: 'Colham Green',
    address: 'Pield Heath Road, Hillingdon, UB8 3NN',
    contacts: [
      { role: 'Colham Green Unit Manager', phone: '01895 485170' }
    ]
  },

  // Milton Keynes
  {
    id: 'mk-wicu',
    boroughCategory: 'Milton Keynes',
    siteName: 'Windsor Intermediate Care Unit (WICU)',
    address: 'Dovecote Manor, Whalley Drive, Bletchley, Milton Keynes, MK3 6EN',
    contacts: [
      { role: 'WICU Manager', phone: '01908 376415' }
    ]
  },
  {
    id: 'mk-topas',
    boroughCategory: 'Milton Keynes',
    siteName: 'TOPAS',
    address: 'Waterhall Centre, Fern Grove, Milton Keynes, MK2 3QH',
    contacts: [
      { role: 'TOPAS Manager', phone: '07725 61584' },
      { role: 'TOPAS Matron', phone: '01908 274038' },
      { role: 'TOPAS Nurse in Charge', phone: '01908 725553' }
    ]
  },
  {
    id: 'mk-campbell',
    boroughCategory: 'Milton Keynes',
    siteName: 'Campbell Centre',
    address: 'Hospital Campus, Standing Way, Eaglestone, Milton Keynes, MK6 5NG',
    wards: ['Willow Ward', 'Hazel Ward'],
    contacts: [
      { role: 'Unit Coordinator (Hazel & Willow Wards)', phone: '07817 326199' },
      { role: 'Willow Ward Manager', phone: '01908 725553' },
      { role: 'Willow Ward Nurse in Charge', phone: '01908 725101' },
      { role: 'Hazel Ward Manager', phone: '01908 725433' },
      { role: 'Hazel Ward Nurse in Charge', phone: '01908 725433' }
    ]
  },
  {
    id: 'mk-cherrywood',
    boroughCategory: 'Milton Keynes',
    siteName: 'Cherrywood',
    address: 'Cherrywood House, 2 Gregories Drive, Wavenden Gate, Milton Keynes, MK7 7HL',
    contacts: [
      { role: 'Cherrywood Ward Manager', phone: '07484 918050' },
      { role: 'Cherrywood Nurse in Charge', phone: '01908 282072' }
    ]
  },

  // Health & Justice
  {
    id: 'hj-park-royal',
    boroughCategory: 'Health & Justice',
    siteName: 'Park Royal Low Secure Wards',
    address: 'Central Way (off Acton Lane), London, NW10 7NS',
    wards: ['Tasman Ward (Low Secure)', 'Java Ward (Low Secure)'],
    contacts: [
      { role: 'Health & Justice On Call Manager', phone: '07563 555943' },
      { role: 'Tasman & Java Wards Low Secure Coordinator', phone: '07791 886602' },
      { role: 'Tasman & Java Wards Low Secure Matron', phone: '07525 921850' },
      { role: 'Tasman Ward Nurse in Charge', phone: '020 3838 7750' },
      { role: 'Java Ward Nurse in Charge', phone: '020 3838 7734' }
    ]
  },

  // Prisons
  {
    id: 'prison-feltham',
    boroughCategory: 'Prisons',
    siteName: 'Feltham Youth Offenders Institute',
    address: 'Bedfont Rd, Feltham, TW13 4NP',
    contacts: [
      { role: 'Feltham Switchboard', phone: '020 8844 5000' },
      { role: 'Head of Healthcare', phone: '07525 921850' }
    ]
  },
  {
    id: 'prison-high-down',
    boroughCategory: 'Prisons',
    siteName: 'HMP High Down',
    address: 'High Down Lane, Sutton, Surrey, SM2 5PJ',
    contacts: [
      { role: 'High Down Switchboard', phone: '0207 147 6630' },
      { role: 'Head of Healthcare', phone: '02071 476593' }
    ]
  },
  {
    id: 'prison-woodhill',
    boroughCategory: 'Prisons',
    siteName: 'HMP Woodhill',
    address: 'Tattenhoe Street, Milton Keynes, MK4 4DA',
    contacts: [
      { role: 'Woodhill Switchboard', phone: '01908 722000' },
      { role: 'Head of Healthcare', phone: '07852 607871' }
    ]
  },
  {
    id: 'prison-coldingley',
    boroughCategory: 'Prisons',
    siteName: 'HMP Coldingley',
    address: 'Shaftesbury Road, Bisley, Woking, Surrey, GU24 9EX',
    contacts: [
      { role: 'Coldingley Switchboard', phone: '01483 344300' },
      { role: 'Head of Healthcare', phone: '01483 344 644' }
    ]
  },
  {
    id: 'prison-send',
    boroughCategory: 'Prisons',
    siteName: 'HMP Send',
    address: 'Ripley Road, Woking, Surrey, GU23 7LJ',
    contacts: [
      { role: 'Send Switchboard', phone: '01483 471000' },
      { role: 'Head of Healthcare', phone: '03330 142457' }
    ]
  },
  {
    id: 'prison-downview',
    boroughCategory: 'Prisons',
    siteName: 'HMP Downview',
    address: 'Sutton Lane, Sutton, Surrey, SM2 5PD',
    contacts: [
      { role: 'Downview Switchboard', phone: '0208 196 6300' },
      { role: 'Head of Healthcare', phone: '02081 966490' }
    ]
  },
  {
    id: 'prison-bronzefield',
    boroughCategory: 'Prisons',
    siteName: 'HMP Bronzefield',
    address: 'Woodthorpe Road, Ashford, Surrey, TW15 3JZ',
    contacts: [
      { role: 'Bronzefield Switchboard', phone: '01784 425690' },
      { role: 'Head of Healthcare', phone: '07809 238003' }
    ]
  },
  {
    id: 'prison-aylesbury',
    boroughCategory: 'Prisons',
    siteName: 'HMP Aylesbury',
    address: 'Bierton Road, Aylesbury, Bucks, HP20 1EH',
    contacts: [
      { role: 'Aylesbury Switchboard', phone: '01296 444 032' },
      { role: 'Head of Healthcare', phone: '01296 444 076' }
    ]
  }
];

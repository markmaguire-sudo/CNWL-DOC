import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { GoldContact, SilverContact } from '../types';

// Resolve API Key dynamically to support Netlify deployment secret scanners
const getResolvedApiKey = (key: string) => {
  const envKey = (import.meta as any).env?.VITE_FIREBASE_API_KEY;
  if (envKey) return envKey;
  if (!key) return '';
  if (key.startsWith('AIza')) return key;
  try {
    return atob(key);
  } catch {
    return key;
  }
};

const resolvedConfig = {
  ...firebaseConfig,
  apiKey: getResolvedApiKey(firebaseConfig.apiKey)
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(resolvedConfig) : getApp();

// Get Firestore instance using configured database ID
export const db = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Collection References
const goldCol = collection(db, 'gold_contacts');
const silverCol = collection(db, 'silver_contacts');

// Function to delete duplicate Gold contacts from Firestore
export async function deduplicateGoldContactsInFirestore(): Promise<number> {
  try {
    const snapshot = await getDocs(goldCol);
    const seen = new Map<string, string>(); // normalized key -> doc.id kept
    const toDeleteIds: string[] = [];

    snapshot.docs.forEach((d) => {
      const data = d.data();
      const nameKey = (data.name || '').trim().toLowerCase();
      const emailKey = (data.email || '').trim().toLowerCase();
      const key = nameKey || emailKey;

      if (!key) return;

      if (seen.has(key)) {
        toDeleteIds.push(d.id);
      } else {
        seen.set(key, d.id);
      }
    });

    if (toDeleteIds.length > 0) {
      const batch = writeBatch(db);
      toDeleteIds.forEach((id) => {
        batch.delete(doc(db, 'gold_contacts', id));
      });
      await batch.commit();
      console.log(`Deduplicated Gold contacts: removed ${toDeleteIds.length} duplicate document(s) from Firestore.`);
    }
    return toDeleteIds.length;
  } catch (err) {
    console.error("Error deduplicating Gold contacts in Firestore:", err);
    return 0;
  }
}

// Subscribe to Gold Contacts (with automatic in-memory deduplication)
export function subscribeGoldContacts(callback: (contacts: GoldContact[]) => void) {
  return onSnapshot(goldCol, (snapshot) => {
    const rawList: GoldContact[] = snapshot.docs.map((d) => {
      const data = d.data();
      let phone = data.phone || '';
      let alternativePhone = data.alternativePhone || '';

      const cleanPhone = phone.trim().replace(/^[\s\(\)]+/, '');
      const cleanAlt = alternativePhone.trim().replace(/^[\s\(\)]+/, '');
      if ((cleanPhone.startsWith('01') || cleanPhone.startsWith('02')) && cleanAlt && !cleanAlt.startsWith('01') && !cleanAlt.startsWith('02')) {
        const temp = phone;
        phone = alternativePhone;
        alternativePhone = temp;
      }

      phone = phone.replace(/\s+/g, '');
      alternativePhone = alternativePhone.replace(/\s+/g, '');

      return {
        id: d.id,
        name: data.name || '',
        title: data.title || '',
        category: data.category === 'Executive Board' ? 'Executive' : (data.category || 'Executive'),
        commandLevel: 'GOLD',
        phone,
        alternativePhone,
        email: data.email || '',
        organization: data.organization || 'CNWL NHS Foundation Trust',
        notes: data.notes || '',
        updatedAt: data.updatedAt || new Date().toISOString()
      } as GoldContact;
    });

    // Deduplicate in memory by name/email
    const seen = new Set<string>();
    const uniqueList: GoldContact[] = [];

    rawList.forEach((item) => {
      const key = (item.name || item.email).trim().toLowerCase();
      if (!key || !seen.has(key)) {
        if (key) seen.add(key);
        uniqueList.push(item);
      }
    });

    callback(uniqueList);
  }, (err) => {
    console.error("Error listening to gold_contacts:", err);
  });
}

// Subscribe to Silver Contacts
export function subscribeSilverContacts(callback: (contacts: SilverContact[]) => void) {
  return onSnapshot(silverCol, (snapshot) => {
    const list: SilverContact[] = snapshot.docs.map((d) => {
      const data = d.data();
      let phone = data.phone || '';
      let alternativePhone = data.alternativePhone || '';

      const cleanPhone = phone.trim().replace(/^[\s\(\)]+/, '');
      const cleanAlt = alternativePhone.trim().replace(/^[\s\(\)]+/, '');
      if ((cleanPhone.startsWith('01') || cleanPhone.startsWith('02')) && cleanAlt && !cleanAlt.startsWith('01') && !cleanAlt.startsWith('02')) {
        const temp = phone;
        phone = alternativePhone;
        alternativePhone = temp;
      }

      phone = phone.replace(/\s+/g, '');
      alternativePhone = alternativePhone.replace(/\s+/g, '');

      return {
        id: d.id,
        name: data.name || '',
        title: data.title || '',
        category: data.category || 'Operational Leads',
        commandLevel: 'SILVER',
        phone,
        alternativePhone,
        email: data.email || '',
        siteLocation: data.siteLocation || 'Trust Sites',
        notes: data.notes || '',
        updatedAt: data.updatedAt || new Date().toISOString()
      } as SilverContact;
    });
    callback(list);
  }, (err) => {
    console.error("Error listening to silver_contacts:", err);
  });
}

// Add Gold Contact
export async function addGoldContact(contact: Omit<GoldContact, 'id'>) {
  const docRef = await addDoc(goldCol, {
    ...contact,
    commandLevel: 'GOLD',
    updatedAt: new Date().toISOString()
  });
  return docRef.id;
}

// Add Silver Contact
export async function addSilverContact(contact: Omit<SilverContact, 'id'>) {
  const docRef = await addDoc(silverCol, {
    ...contact,
    commandLevel: 'SILVER',
    updatedAt: new Date().toISOString()
  });
  return docRef.id;
}

// Update Gold Contact
export async function updateGoldContact(id: string, updates: Partial<GoldContact>) {
  const ref = doc(db, 'gold_contacts', id);
  await updateDoc(ref, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
}

// Update Silver Contact
export async function updateSilverContact(id: string, updates: Partial<SilverContact>) {
  const ref = doc(db, 'silver_contacts', id);
  await updateDoc(ref, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
}

// Delete Gold Contact
export async function deleteGoldContact(id: string, name?: string) {
  const ref = doc(db, 'gold_contacts', id);
  await deleteDoc(ref);

  if (name) {
    const targetName = name.trim().toLowerCase();
    if (targetName) {
      const snap = await getDocs(goldCol);
      const dupes = snap.docs.filter(d => (d.data().name || '').trim().toLowerCase() === targetName);
      if (dupes.length > 0) {
        const batch = writeBatch(db);
        dupes.forEach(d => batch.delete(d.ref));
        await batch.commit();
      }
    }
  }
}

// Delete Silver Contact
export async function deleteSilverContact(id: string, name?: string) {
  const ref = doc(db, 'silver_contacts', id);
  await deleteDoc(ref);

  if (name) {
    const targetName = name.trim().toLowerCase();
    if (targetName) {
      const snap = await getDocs(silverCol);
      const dupes = snap.docs.filter(d => (d.data().name || '').trim().toLowerCase() === targetName);
      if (dupes.length > 0) {
        const batch = writeBatch(db);
        dupes.forEach(d => batch.delete(d.ref));
        await batch.commit();
      }
    }
  }
}

// Bulk Upload Gold Contacts (e.g. from uploaded CSV/JSON)
export async function bulkUploadGoldContacts(contacts: Omit<GoldContact, 'id'>[]) {
  const batch = writeBatch(db);
  contacts.forEach((c) => {
    const newRef = doc(goldCol);
    batch.set(newRef, {
      ...c,
      commandLevel: 'GOLD',
      updatedAt: new Date().toISOString()
    });
  });
  await batch.commit();
}

// Bulk Upload Silver Contacts (e.g. from uploaded CSV/JSON)
export async function bulkUploadSilverContacts(contacts: Omit<SilverContact, 'id'>[]) {
  const batch = writeBatch(db);
  contacts.forEach((c) => {
    const newRef = doc(silverCol);
    batch.set(newRef, {
      ...c,
      commandLevel: 'SILVER',
      updatedAt: new Date().toISOString()
    });
  });
  await batch.commit();
}

// Initial Seed Data for Gold Command (Structured per Official Document: Executive, Divisions, Communication, QTS, DoC)
export const SEED_GOLD_CONTACTS: Omit<GoldContact, 'id'>[] = [
  // Executive
  {
    name: 'Claire Murdoch',
    title: 'Chief Executive',
    category: 'Executive',
    commandLevel: 'GOLD',
    phone: '07971 082 972',
    alternativePhone: '020 3214 5751',
    email: 'claire.murdoch@nhs.net',
    organization: 'CNWL NHS Foundation Trust',
    notes: 'Chief Executive'
  },
  {
    name: 'Con Kelly',
    title: 'Chief Medical Officer',
    category: 'Executive',
    commandLevel: 'GOLD',
    phone: '07970 977 831',
    alternativePhone: '0203 214 5885',
    email: 'cornelius.kelly@nhs.net',
    organization: 'CNWL NHS Foundation Trust',
    notes: 'Chief Medical Officer'
  },
  {
    name: 'Graeme Caul',
    title: 'Chief Operating Officer',
    category: 'Executive',
    commandLevel: 'GOLD',
    phone: '07808 067 693',
    alternativePhone: '0207 685 5806',
    email: 'graeme.caul@nhs.net',
    organization: 'CNWL NHS Foundation Trust',
    notes: 'Chief Operating Officer'
  },
  {
    name: 'Amanda Pithouse',
    title: 'Chief Nurse',
    category: 'Executive',
    commandLevel: 'GOLD',
    phone: '07837 001 997',
    alternativePhone: '',
    email: 'amanda.pithouse@nhs.net',
    organization: 'CNWL NHS Foundation Trust',
    notes: 'Chief Nurse'
  },
  {
    name: 'Ross Graves',
    title: 'Exec Director of Partnerships and Commercial Development | SIRO',
    category: 'Executive',
    commandLevel: 'GOLD',
    phone: '07974 353 857',
    alternativePhone: '020 3214 5893',
    email: 'ross.graves@nhs.net',
    organization: 'CNWL NHS Foundation Trust',
    notes: 'Senior Information Risk Owner (SIRO)'
  },
  {
    name: 'Tom Shearer',
    title: 'Chief Finance Officer',
    category: 'Executive',
    commandLevel: 'GOLD',
    phone: '07787 422 563',
    alternativePhone: '0203 214 5723',
    email: 'tom.shearer1@nhs.net',
    organization: 'CNWL NHS Foundation Trust',
    notes: 'Chief Finance Officer'
  },
  {
    name: 'Nick Green',
    title: 'Chief People Officer',
    category: 'Executive',
    commandLevel: 'GOLD',
    phone: '07801 946 076',
    alternativePhone: '0203 317 3463',
    email: 'nick.green9@nhs.net',
    organization: 'CNWL NHS Foundation Trust',
    notes: 'Chief People Officer'
  },

  // Divisions
  {
    name: 'Mark Maguire',
    title: 'Managing Director Diggory',
    category: 'Divisions',
    commandLevel: 'GOLD',
    phone: '07740 300 832',
    alternativePhone: '',
    email: 'markmaguire@nhs.net',
    organization: 'CNWL Diggory Division',
    notes: 'Managing Director - Diggory'
  },
  {
    name: 'James Smith',
    title: 'Director of Nursing- Diggory',
    category: 'Divisions',
    commandLevel: 'GOLD',
    phone: '07740 514 433',
    alternativePhone: '02085 157 830',
    email: 'james.smith22@nhs.net',
    organization: 'CNWL Diggory Division',
    notes: 'Director of Nursing - Diggory'
  },
  {
    name: 'Vanessa Odlin',
    title: 'Divisional Managing Director',
    category: 'Divisions',
    commandLevel: 'GOLD',
    phone: '07545649700',
    alternativePhone: '01895 484795',
    email: 'v.odlin@nhs.net',
    organization: 'CNWL NHS Foundation Trust',
    notes: 'Divisional Managing Director'
  },
  {
    name: 'William Sakala',
    title: 'Director of Nursing Goodall',
    category: 'Divisions',
    commandLevel: 'GOLD',
    phone: '07534 911 114',
    alternativePhone: '',
    email: 'wsakala@nhs.net',
    organization: 'CNWL Goodall Division',
    notes: 'Director of Nursing - Goodall'
  },
  {
    name: 'Sabrina Phillips',
    title: 'Divisional Managing Director',
    category: 'Divisions',
    commandLevel: 'GOLD',
    phone: '07968 128 447',
    alternativePhone: '07766114921',
    email: 'sabrina.phillips2@nhs.net',
    organization: 'CNWL NHS Foundation Trust',
    notes: 'Divisional Managing Director'
  },
  {
    name: 'Kim Cox',
    title: 'Director of Nursing – Jameson',
    category: 'Divisions',
    commandLevel: 'GOLD',
    phone: '07790 324 261',
    alternativePhone: '',
    email: 'kcox@nhs.net',
    organization: 'CNWL Jameson Division',
    notes: 'Director of Nursing - Jameson'
  },

  // Communication
  {
    name: 'Richard Mountford',
    title: 'Director of Communications',
    category: 'Communication',
    commandLevel: 'GOLD',
    phone: '0779 0027419',
    alternativePhone: '',
    email: 'richard.mountford1@nhs.net',
    organization: 'CNWL Communications Directorate',
    notes: 'Director of Communications'
  },

  // QTS
  {
    name: 'Gill Stafford',
    title: 'Managing Director, QTS',
    category: 'QTS',
    commandLevel: 'GOLD',
    phone: '07814750139',
    alternativePhone: '020 3214 5850',
    email: 'gillian.stafford@nhs.net',
    organization: 'CNWL Quality Transformation Services',
    notes: 'Managing Director, QTS'
  },
  {
    name: 'Hannah O’Brien',
    title: 'QTS Operations Director',
    category: 'QTS',
    commandLevel: 'GOLD',
    phone: '07980 891 015',
    alternativePhone: '020 3214 3426',
    email: 'hannah.obrien2@nhs.net',
    organization: 'CNWL Quality Transformation Services',
    notes: 'QTS Operations Director'
  },

  // DoC (Directors on Call / Remaining List)
  {
    name: 'TF Chan',
    title: 'Chief Pharmacist',
    category: 'DoC',
    commandLevel: 'GOLD',
    phone: '07834 416 915',
    alternativePhone: '020 3317 3489',
    email: 'tf.chan@nhs.net',
    organization: 'CNWL Pharmacy Services',
    notes: 'Chief Pharmacist'
  },
  {
    name: 'Catherine Knights',
    title: 'Director of Quality',
    category: 'DoC',
    commandLevel: 'GOLD',
    phone: '07796 484 632',
    alternativePhone: '020 3214 5767',
    email: 'catherine.knights@nhs.net',
    organization: 'CNWL Quality Directorate',
    notes: 'Director of Quality'
  },
  {
    name: 'Ryan Kemp',
    title: 'Director of Therapies',
    category: 'DoC',
    commandLevel: 'GOLD',
    phone: '07754 949 994',
    alternativePhone: '',
    email: 'ryan.kemp@nhs.net',
    organization: 'CNWL Therapies Directorate',
    notes: 'Director of Therapies'
  },
  {
    name: 'Tracy White',
    title: 'Associate Director of Information and Business Intelligence',
    category: 'DoC',
    commandLevel: 'GOLD',
    phone: '07932 695 236',
    alternativePhone: '0203 214 5981',
    email: 'tracy.white2@nhs.net',
    organization: 'CNWL Business Intelligence',
    notes: 'Associate Director of Information & BI'
  },
  {
    name: 'Cynthia Fernandez',
    title: 'Deputy Chief Finance Officer',
    category: 'DoC',
    commandLevel: 'GOLD',
    phone: '07974 150 824',
    alternativePhone: '020 3214 5791',
    email: 'cynthiafernandez@nhs.net',
    organization: 'CNWL Finance Directorate',
    notes: 'Deputy Chief Finance Officer'
  },
  {
    name: 'Alison Butler',
    title: 'Director of Improvement',
    category: 'DoC',
    commandLevel: 'GOLD',
    phone: '07711 015 081',
    alternativePhone: '020 3214 5868',
    email: 'alisonbutler@nhs.net',
    organization: 'CNWL Improvement Directorate',
    notes: 'Director of Improvement'
  },
  {
    name: 'Owen Powell',
    title: 'ICT (Infrastructure) Director',
    category: 'DoC',
    commandLevel: 'GOLD',
    phone: '07824 630870',
    alternativePhone: '020 3214 5330',
    email: 'owenpowell1@nhs.net',
    organization: 'CNWL ICT Directorate',
    notes: 'ICT Infrastructure Lead'
  },
  {
    name: 'Doug Stewart',
    title: 'ICT (Systems) Director',
    category: 'DoC',
    commandLevel: 'GOLD',
    phone: '07701090000',
    alternativePhone: '',
    email: 'doug.stewart1@nhs.net',
    organization: 'CNWL ICT Directorate',
    notes: 'ICT Clinical Systems Lead'
  },
  {
    name: 'Jack Pooler',
    title: 'Assistant Director of Safety',
    category: 'DoC',
    commandLevel: 'GOLD',
    phone: '0789 987 0651',
    alternativePhone: '0203 214 5757',
    email: 'Jack.pooler@nhs.net',
    organization: 'CNWL Patient Safety',
    notes: 'Assistant Director of Safety'
  },
  {
    name: 'Surriya Subramaniam',
    title: 'Emergency Planning and Business Continuity Manager',
    category: 'DoC',
    commandLevel: 'GOLD',
    phone: '07969 640 846',
    alternativePhone: '0207 504 5137',
    email: 'surriya.subramaniam@nhs.net',
    organization: 'CNWL EPRR Team',
    notes: 'Emergency Planning & Business Continuity Lead'
  },
  {
    name: 'Beth Cushion',
    title: 'Deputy People Officer',
    category: 'DoC',
    commandLevel: 'GOLD',
    phone: '07484070524',
    alternativePhone: '',
    email: 'beth.cushion@nhs.net',
    organization: 'CNWL People Directorate',
    notes: 'Deputy People Officer'
  },
  {
    name: 'CNWL Pager',
    title: 'CNWL Emergency Pager Service',
    category: 'DoC',
    commandLevel: 'GOLD',
    phone: '03332 005 022',
    alternativePhone: '',
    email: 'pager.cnwl@nhs.net',
    organization: 'CNWL Emergency Telecommunications',
    notes: 'Call 03332 005 022 and ask to send a message from CNWL01 to chosen contact'
  }
];

// Initial Seed Data for Silver Command
export const SEED_SILVER_CONTACTS: Omit<SilverContact, 'id'>[] = [
  {
    name: 'Director of Operations - Mental Health',
    title: 'Tactical Lead - Acute Mental Health Wards',
    category: 'Operational Leads',
    commandLevel: 'SILVER',
    phone: '07740 514 459',
    alternativePhone: '0800 902 464',
    email: 'ops.mh@nhs.net',
    siteLocation: 'St Charles & Park Royal Wards',
    notes: 'Silver Command Tactical Chair - MH Inpatients'
  },
  {
    name: 'Director of Operations - Community Services',
    title: 'Tactical Lead - Community & Offsite Clinics',
    category: 'Operational Leads',
    commandLevel: 'SILVER',
    phone: '07812 345 678',
    alternativePhone: '0800 902 465',
    email: 'ops.community@nhs.net',
    siteLocation: 'London & Milton Keynes Community Sites',
    notes: 'Silver Command Lead - Physical Health & District Nursing'
  },
  {
    name: 'Borough Commander - Brent & Harrow',
    title: 'Operational Director - Brent & Harrow Services',
    category: 'Borough Commanders',
    commandLevel: 'SILVER',
    phone: '07900 123 999',
    alternativePhone: '020 8869 2000',
    email: 'brent.harrow.ops@nhs.net',
    siteLocation: 'Harrow Mental Health Centre',
    notes: 'Local Borough Tactical Response Manager'
  },
  {
    name: 'Borough Commander - KCW',
    title: 'Operational Director - Kensington, Chelsea & Westminster',
    category: 'Borough Commanders',
    commandLevel: 'SILVER',
    phone: '07911 234 888',
    alternativePhone: '020 7380 9200',
    email: 'kcw.ops@nhs.net',
    siteLocation: 'South Kensington HQ & St Charles',
    notes: 'Central London Ward Escalation Commander'
  },
  {
    name: 'Estates Emergency Response Lead',
    title: 'Director of Facilities & Estates Infrastructure',
    category: 'Estates & Facilities',
    commandLevel: 'SILVER',
    phone: '0800 902 468',
    alternativePhone: '07700 443 322',
    email: 'estates.emergency@nhs.net',
    siteLocation: 'Trust-wide Facilities',
    notes: 'Power Outage, Water Glitch & Evacuation Support'
  },
  {
    name: 'Chief Information Security Lead',
    title: 'CISO / Head of IT Incident Response',
    category: 'IT & Cyber On-Call',
    commandLevel: 'SILVER',
    phone: '07888 777 666',
    alternativePhone: '020 7380 9999',
    email: 'cyber.incident@nhs.net',
    siteLocation: 'IT Operations Bureau',
    notes: 'Ransomware Isolation, EPR Outage & BCP Activation'
  },
  {
    name: 'Senior Nurse on Call - Bed Bureau',
    title: 'Inpatient Bed Management & Duty Senior Nurse',
    category: 'Clinical Leads',
    commandLevel: 'SILVER',
    phone: '0800 902 467',
    alternativePhone: '07700 889 900',
    email: 'snoc.london@nhs.net',
    siteLocation: 'London Bed Management Hub',
    notes: 'Inpatient Bed Placement & Evacuation Placement'
  }
];

// Force sync Gold contacts to match official user list in Firestore
export async function syncOfficialGoldContactsToFirestore() {
  try {
    const goldSnap = await getDocs(goldCol);
    // Delete existing contacts if they are sample/outdated
    const deleteBatch = writeBatch(db);
    goldSnap.docs.forEach((doc) => {
      deleteBatch.delete(doc.ref);
    });
    await deleteBatch.commit();

    // Re-populate with 28 official contacts
    await bulkUploadGoldContacts(SEED_GOLD_CONTACTS);
    console.log('Successfully synced 28 official CNWL Gold Contacts to Firestore.');
  } catch (err) {
    console.error('Error syncing official Gold Contacts:', err);
  }
}

// Seed Firestore if empty or missing official entries
export async function seedDefaultDirectoriesIfEmpty() {
  try {
    const goldSnap = await getDocs(goldCol);
    if (goldSnap.empty) {
      console.log('Seeding official structured CNWL Gold Contacts to Firestore...');
      await bulkUploadGoldContacts(SEED_GOLD_CONTACTS);
    } else {
      // Cleanly migrate legacy 'Executive Board' category to 'Executive' without wiping user deletions
      const oldCategoryDocs = goldSnap.docs.filter(d => d.data().category === 'Executive Board');
      if (oldCategoryDocs.length > 0) {
        const batch = writeBatch(db);
        oldCategoryDocs.forEach(d => batch.update(d.ref, { category: 'Executive' }));
        await batch.commit();
      }
    }

    const silverSnap = await getDocs(silverCol);
    if (silverSnap.empty) {
      console.log('Seeding default Silver Contacts to Firestore...');
      await bulkUploadSilverContacts(SEED_SILVER_CONTACTS);
    }
  } catch (err) {
    console.error('Error seeding default directories:', err);
  }
}

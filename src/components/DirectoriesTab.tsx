import React, { useState, useEffect } from 'react';
import { GoldContact, SilverContact } from '../types';
import { INPATIENT_SITES_DATA, InpatientSite, InpatientContact } from '../data/inpatientSitesData';
import { 
  subscribeGoldContacts, 
  subscribeSilverContacts, 
  addGoldContact, 
  addSilverContact, 
  updateGoldContact, 
  updateSilverContact, 
  deleteGoldContact, 
  deleteSilverContact, 
  bulkUploadGoldContacts, 
  bulkUploadSilverContacts,
  seedDefaultDirectoriesIfEmpty,
  syncOfficialGoldContactsToFirestore,
  deduplicateGoldContactsInFirestore,
  SEED_GOLD_CONTACTS,
  SEED_SILVER_CONTACTS
} from '../lib/firebase';
import { 
  Users, 
  ShieldAlert, 
  Search, 
  Plus, 
  Upload, 
  Download, 
  Phone, 
  Mail, 
  Building, 
  MapPin, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Database, 
  RefreshCw, 
  Info, 
  X,
  Sparkles,
  Award,
  AlertCircle,
  Hospital,
  Layers
} from 'lucide-react';

interface DirectoriesTabProps {
  isAuthenticated: boolean;
  onRequestAuthenticate: () => void;
  initialCommandLevel?: 'GOLD' | 'SILVER' | 'INPATIENT';
}

export const DirectoriesTab: React.FC<DirectoriesTabProps> = ({
  isAuthenticated,
  onRequestAuthenticate,
  initialCommandLevel = 'GOLD'
}) => {
  const [commandLevel, setCommandLevel] = useState<'GOLD' | 'SILVER' | 'INPATIENT'>(initialCommandLevel);

  useEffect(() => {
    if (initialCommandLevel) {
      setCommandLevel(initialCommandLevel);
    }
  }, [initialCommandLevel]);
  const [goldContacts, setGoldContacts] = useState<GoldContact[]>([]);
  const [silverContacts, setSilverContacts] = useState<SilverContact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<GoldContact | SilverContact | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAltPhone, setFormAltPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formOrgSite, setFormOrgSite] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Bulk upload text
  const [uploadText, setUploadText] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Subscribe to Firestore on mount
  useEffect(() => {
    let unsubscribeGold: () => void;
    let unsubscribeSilver: () => void;

    // Seed defaults first if database is empty
    seedDefaultDirectoriesIfEmpty().then(() => {
      unsubscribeGold = subscribeGoldContacts((data) => {
        setGoldContacts(data);
        setLoading(false);
      });

      unsubscribeSilver = subscribeSilverContacts((data) => {
        setSilverContacts(data);
        setLoading(false);
      });
    });

    return () => {
      if (unsubscribeGold) unsubscribeGold();
      if (unsubscribeSilver) unsubscribeSilver();
    };
  }, []);

  const handleCopyPhone = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openAddModal = () => {
    if (!isAuthenticated) {
      onRequestAuthenticate();
      return;
    }
    setEditingContact(null);
    setFormName('');
    setFormTitle('');
    setFormCategory(commandLevel === 'GOLD' ? 'Executive' : 'Operational Leads');
    setFormPhone('');
    setFormAltPhone('');
    setFormEmail('');
    setFormOrgSite(commandLevel === 'GOLD' ? 'CNWL NHS Foundation Trust' : 'Trust Sites');
    setFormNotes('');
    setFormError('');
    setShowAddModal(true);
  };

  const openEditModal = (contact: GoldContact | SilverContact) => {
    setEditingContact(contact);
    setFormName(contact.name);
    setFormTitle(contact.title);
    setFormCategory(contact.category);
    setFormPhone(contact.phone);
    setFormAltPhone(contact.alternativePhone || '');
    setFormEmail(contact.email);
    setFormOrgSite(contact.commandLevel === 'GOLD' ? (contact as GoldContact).organization : (contact as SilverContact).siteLocation || '');
    setFormNotes(contact.notes || '');
    setFormError('');
    setShowAddModal(true);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim() || !formTitle.trim()) {
      setFormError('Please enter Name, Title, and Direct Phone Number.');
      return;
    }

    try {
      if (editingContact) {
        if (editingContact.commandLevel === 'GOLD') {
          await updateGoldContact(editingContact.id, {
            name: formName,
            title: formTitle,
            category: formCategory as any,
            phone: formPhone,
            alternativePhone: formAltPhone,
            email: formEmail,
            organization: formOrgSite,
            notes: formNotes
          });
        } else {
          await updateSilverContact(editingContact.id, {
            name: formName,
            title: formTitle,
            category: formCategory as any,
            phone: formPhone,
            alternativePhone: formAltPhone,
            email: formEmail,
            siteLocation: formOrgSite,
            notes: formNotes
          });
        }
      } else {
        if (commandLevel === 'GOLD') {
          await addGoldContact({
            name: formName,
            title: formTitle,
            category: formCategory as any,
            commandLevel: 'GOLD',
            phone: formPhone,
            alternativePhone: formAltPhone,
            email: formEmail,
            organization: formOrgSite || 'CNWL NHS Foundation Trust',
            notes: formNotes
          });
        } else {
          await addSilverContact({
            name: formName,
            title: formTitle,
            category: formCategory as any,
            commandLevel: 'SILVER',
            phone: formPhone,
            alternativePhone: formAltPhone,
            email: formEmail,
            siteLocation: formOrgSite || 'Trust Sites',
            notes: formNotes
          });
        }
      }
      setShowAddModal(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save contact to Firestore.');
    }
  };

  const handleDeleteContact = async (contact: GoldContact | SilverContact) => {
    if (!contact || !contact.id) {
      alert('Cannot delete contact: Document ID missing.');
      return;
    }
    const contactName = contact.name.trim();
    if (window.confirm(`Are you sure you want to remove "${contactName}" from the ${contact.commandLevel} Directory?`)) {
      try {
        const normalizedTarget = contactName.toLowerCase();
        if (contact.commandLevel === 'GOLD') {
          setGoldContacts(prev => prev.filter(c => c.id !== contact.id && c.name.trim().toLowerCase() !== normalizedTarget));
          await deleteGoldContact(contact.id, contactName);
        } else {
          setSilverContacts(prev => prev.filter(c => c.id !== contact.id && c.name.trim().toLowerCase() !== normalizedTarget));
          await deleteSilverContact(contact.id, contactName);
        }
        if (editingContact && (editingContact.id === contact.id || editingContact.name.trim().toLowerCase() === normalizedTarget)) {
          setShowAddModal(false);
          setEditingContact(null);
        }
      } catch (err: any) {
        console.error('Failed to delete contact:', err);
        alert(`Failed to delete contact: ${err.message || 'Unknown error'}`);
      }
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess('');

    if (!uploadText.trim()) {
      setUploadError('Please paste JSON contact array or CSV lines.');
      return;
    }

    try {
      // Try JSON parse first
      let parsed: any[];
      if (uploadText.trim().startsWith('[')) {
        parsed = JSON.parse(uploadText);
      } else {
        // Simple CSV parser
        const lines = uploadText.trim().split('\n');
        parsed = lines.map(line => {
          const parts = line.split(',');
          return {
            name: parts[0]?.trim() || 'New Contact',
            title: parts[1]?.trim() || 'Command Member',
            phone: parts[2]?.trim() || '0800 000 0000',
            email: parts[3]?.trim() || '',
            category: parts[4]?.trim() || (commandLevel === 'GOLD' ? 'Executive Board' : 'Operational Leads'),
            organization: parts[5]?.trim() || 'CNWL NHS Foundation Trust',
            siteLocation: parts[5]?.trim() || 'Trust Sites'
          };
        });
      }

      if (commandLevel === 'GOLD') {
        const formattedGold: Omit<GoldContact, 'id'>[] = parsed.map(p => ({
          name: p.name || 'Unknown Name',
          title: p.title || 'Gold Executive Lead',
          category: p.category || 'Executive Board',
          commandLevel: 'GOLD',
          phone: p.phone || '0800 000 0000',
          alternativePhone: p.alternativePhone || p.altPhone || '',
          email: p.email || '',
          organization: p.organization || p.org || 'CNWL NHS Foundation Trust',
          notes: p.notes || 'Uploaded via Firestore Directory Importer'
        }));
        await bulkUploadGoldContacts(formattedGold);
      } else {
        const formattedSilver: Omit<SilverContact, 'id'>[] = parsed.map(p => ({
          name: p.name || 'Unknown Name',
          title: p.title || 'Silver Operational Lead',
          category: p.category || 'Operational Leads',
          commandLevel: 'SILVER',
          phone: p.phone || '0800 000 0000',
          alternativePhone: p.alternativePhone || p.altPhone || '',
          email: p.email || '',
          siteLocation: p.siteLocation || p.location || 'Trust Sites',
          notes: p.notes || 'Uploaded via Firestore Directory Importer'
        }));
        await bulkUploadSilverContacts(formattedSilver);
      }

      setUploadSuccess(`Successfully uploaded ${parsed.length} contacts to Firestore ${commandLevel} Directory.`);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadText('');
        setUploadSuccess('');
      }, 1500);
    } catch (err: any) {
      setUploadError('Invalid format. Please supply a valid JSON array or CSV text lines.');
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm(`Sync the official CNWL ${commandLevel} Command contacts directory into Firebase?`)) {
      if (commandLevel === 'GOLD') {
        await syncOfficialGoldContactsToFirestore();
      } else {
        await bulkUploadSilverContacts(SEED_SILVER_CONTACTS);
      }
    }
  };

  const handleDeduplicate = async () => {
    if (commandLevel === 'GOLD') {
      const removedCount = await deduplicateGoldContactsInFirestore();
      alert(`Deduplication complete. Removed ${removedCount} duplicate document(s) from Gold directory.`);
    }
  };

  const handleExportJSON = () => {
    const data = commandLevel === 'GOLD' ? goldContacts : silverContacts;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CNWL_${commandLevel}_Command_Directory_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const GOLD_CATEGORY_ORDER = ['Executive', 'Divisions', 'Communication', 'QTS', 'DoC'];

  // Filter and sort contacts
  const currentRawList = commandLevel === 'GOLD' ? goldContacts : silverContacts;
  const filteredContacts = currentRawList.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.notes && c.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (commandLevel === 'GOLD') {
      const idxA = GOLD_CATEGORY_ORDER.indexOf(a.category);
      const idxB = GOLD_CATEGORY_ORDER.indexOf(b.category);
      if (idxA !== -1 && idxB !== -1 && idxA !== idxB) return idxA - idxB;
      if (idxA !== -1 && idxB === -1) return -1;
      if (idxA === -1 && idxB !== -1) return 1;
    }
    return 0; // preserve document order within category
  });

  // Filter Inpatient Sites
  const filteredInpatientSites = INPATIENT_SITES_DATA.filter(site => {
    const matchesSearch = 
      site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.boroughCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (site.address && site.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (site.serviceName && site.serviceName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (site.wards && site.wards.some(w => w.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      site.contacts.some(c => 
        c.role.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.phone.includes(searchTerm) || 
        (c.alternativePhone && c.alternativePhone.includes(searchTerm))
      );

    const matchesCategory = selectedCategory === 'ALL' || site.boroughCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Extract categories in document order
  const categories: string[] = commandLevel === 'INPATIENT'
    ? Array.from(new Set<string>(INPATIENT_SITES_DATA.map(s => s.boroughCategory)))
    : Array.from(new Set<string>(currentRawList.map(c => c.category))).sort((a: string, b: string) => {
        if (commandLevel === 'GOLD') {
          const idxA = GOLD_CATEGORY_ORDER.indexOf(a);
          const idxB = GOLD_CATEGORY_ORDER.indexOf(b);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
        }
        return a.localeCompare(b);
      });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner & Control Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              FIREBASE FIRESTORE SYNC ACTIVE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Live updates for Emergency Directories & Inpatient Contacts
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            CNWL Trust Emergency & Inpatient Directories
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Access Director on-call list, Silver Command & Inpatient site ward contacts across all CNWL boroughs and services
          </p>
        </div>

        {/* Directory Command Level Toggle */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => {
              setCommandLevel('GOLD');
              setSelectedCategory('ALL');
            }}
            className={`px-1.5 sm:px-3 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 min-h-[40px] text-center ${
              commandLevel === 'GOLD'
                ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/60'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">Director on-call ({goldContacts.length})</span>
          </button>

          <button
            onClick={() => {
              setCommandLevel('SILVER');
              setSelectedCategory('ALL');
            }}
            className={`px-1.5 sm:px-3 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 min-h-[40px] text-center ${
              commandLevel === 'SILVER'
                ? 'bg-green-100 text-green-950 border border-green-300 shadow-xs'
                : 'text-slate-600 hover:text-green-900 hover:bg-green-50/60'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-green-700 shrink-0" />
            <span className="truncate">Silver ({silverContacts.length})</span>
          </button>

          <button
            onClick={() => {
              setCommandLevel('INPATIENT');
              setSelectedCategory('ALL');
            }}
            className={`px-1.5 sm:px-3 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 min-h-[40px] text-center ${
              commandLevel === 'INPATIENT'
                ? 'bg-teal-100 text-teal-950 border border-teal-300 shadow-xs'
                : 'text-slate-600 hover:text-teal-900 hover:bg-teal-50/60'
            }`}
          >
            <Hospital className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span className="truncate">Inpatient ({INPATIENT_SITES_DATA.length})</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search, Filters & Action Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                commandLevel === 'INPATIENT' 
                  ? "Search sites, wards, bleepholders, matrons, phone numbers..." 
                  : `Search ${commandLevel} contacts by name, title, phone...`
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors shadow-xs min-h-[44px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
            {commandLevel === 'GOLD' && (
              <button
                onClick={handleDeduplicate}
                title="Remove duplicate documents from Firestore"
                className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-amber-200 transition-all min-h-[44px] shadow-xs"
              >
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Remove Duplicates</span>
              </button>
            )}

            {commandLevel !== 'INPATIENT' && (
              <>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-slate-200 transition-all min-h-[44px] shadow-xs"
                >
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>Upload CSV / JSON</span>
                </button>

                <button
                  onClick={openAddModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all min-h-[44px] shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add {commandLevel} Contact</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Category Pills & Export Options */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              {commandLevel === 'INPATIENT' ? 'Borough/Division:' : 'Category:'}
            </span>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[32px] ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({commandLevel === 'INPATIENT' ? INPATIENT_SITES_DATA.length : currentRawList.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[32px] ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {commandLevel !== 'INPATIENT' && (
              <>
                <button
                  onClick={handleExportJSON}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-50"
                  title="Export contacts as JSON backup file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>

                <button
                  onClick={handleResetDefaults}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-50"
                  title="Restore initial NHS default contacts"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Seed Defaults</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Directory Grid Display */}
      {commandLevel === 'INPATIENT' ? (
        filteredInpatientSites.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
            <Hospital className="w-8 h-8 mx-auto text-slate-400" />
            <h3 className="text-sm font-bold text-slate-800">No Inpatient Sites Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No inpatient sites or wards matched "{searchTerm}". Try clearing your search or selecting a different borough filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInpatientSites.map((site) => (
              <div
                key={site.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
              >
                <div className="space-y-3">
                  {/* Borough / Division Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase border bg-blue-50 text-blue-800 border-blue-200 truncate">
                      {site.boroughCategory}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {site.contacts.length} Contact{site.contacts.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  {/* Site Title */}
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug flex items-center gap-1.5">
                      <Hospital className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{site.siteName}</span>
                    </h3>
                    {site.serviceName && (
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {site.serviceName}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  {site.address && (
                    <div className="flex items-start gap-1.5 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="leading-normal">{site.address}</span>
                    </div>
                  )}

                  {/* Wards List */}
                  {site.wards && site.wards.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Layers className="w-3 h-3 text-slate-400" />
                        <span>Wards & Units ({site.wards.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {site.wards.map((ward, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                          >
                            {ward}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contacts List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Site Contacts & Bleepholders
                    </div>
                    <div className="space-y-1.5">
                      {site.contacts.map((c, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs flex flex-col gap-1 hover:bg-slate-100/70 transition-colors"
                        >
                          <div className="font-semibold text-slate-800 leading-snug">
                            {c.role}
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-0.5">
                            <a
                              href={`tel:${c.phone.replace(/\s+/g, '')}`}
                              className="font-mono font-bold text-blue-700 hover:underline flex items-center gap-1.5 text-xs"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{c.phone}</span>
                            </a>
                            <button
                              onClick={() => handleCopyPhone(c.phone, `${site.id}-${idx}`)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white border border-slate-200/60 transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center shrink-0"
                              title="Copy telephone number"
                            >
                              {copiedId === `${site.id}-${idx}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          {c.alternativePhone && (
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 pl-5">
                              <span>Alt:</span>
                              <a
                                href={`tel:${c.alternativePhone.replace(/\s+/g, '')}`}
                                className="text-slate-700 hover:underline font-bold"
                              >
                                {c.alternativePhone}
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs font-mono animate-pulse">
          <Database className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          Synchronizing with Firebase Firestore {commandLevel} Directory...
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
          <AlertCircle className="w-8 h-8 mx-auto text-slate-400" />
          <h3 className="text-sm font-bold text-slate-800">No {commandLevel} Contacts Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'ALL' 
              ? 'Try adjusting your search query or category filter.' 
              : `The ${commandLevel} Command directory is currently empty. Click "Add Contact" or "Upload CSV / JSON" to add entries.`}
          </p>
          <div className="pt-2">
            <button
              onClick={openAddModal}
              className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Contact</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
            >
              <div className="space-y-3">
                {/* Category Badge & Actions */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                    contact.commandLevel === 'GOLD'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {contact.category}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(contact);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                      title="Edit contact details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteContact(contact);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                      title="Delete contact from Firestore"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                </div>

                {/* Name & Title */}
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                    {contact.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    {contact.title}
                  </p>
                </div>

                {/* Organization / Site Location */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  {contact.commandLevel === 'GOLD' ? (
                    <>
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{(contact as GoldContact).organization}</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{(contact as SilverContact).siteLocation || 'Trust Sites'}</span>
                    </>
                  )}
                </div>

                {/* Phone Numbers */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <a href={`tel:${contact.phone}`} className="font-mono font-bold text-slate-900 hover:text-emerald-700">
                        {contact.phone}
                      </a>
                    </div>
                    <button
                      onClick={() => handleCopyPhone(contact.phone, contact.id)}
                      className="text-[10px] text-slate-500 hover:text-slate-800 font-mono font-medium flex items-center gap-0.5"
                    >
                      {copiedId === contact.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === contact.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {contact.alternativePhone && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                      <span className="text-slate-500 font-mono">Alt Phone:</span>
                      <a href={`tel:${contact.alternativePhone}`} className="font-mono text-slate-700 font-semibold hover:text-emerald-700">
                        {contact.alternativePhone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Email */}
                {contact.email && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono truncate">
                    <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <a href={`mailto:${contact.email}`} className="hover:underline truncate text-blue-700">
                      {contact.email}
                    </a>
                  </div>
                )}

                {/* Notes */}
                {contact.notes && (
                  <div className="text-[11px] text-slate-500 italic bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                    "{contact.notes}"
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT CONTACT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                {editingContact ? `Edit ${editingContact.commandLevel} Contact` : `Add New ${commandLevel} Command Contact`}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Jane Smith"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Title / On-Call Role *</label>
                <input
                  type="text"
                  placeholder="e.g. Chief Executive / Borough Operational Director"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    {commandLevel === 'GOLD' ? (
                      <>
                        <option value="Executive">Executive</option>
                        <option value="Divisions">Divisions</option>
                        <option value="Communication">Communication</option>
                        <option value="QTS">QTS</option>
                        <option value="DoC">DoC (Directors on Call)</option>
                      </>
                    ) : (
                      <>
                        <option value="Operational Leads">Operational Leads</option>
                        <option value="Borough Commanders">Borough Commanders</option>
                        <option value="Estates & Facilities">Estates & Facilities</option>
                        <option value="IT & Cyber On-Call">IT & Cyber On-Call</option>
                        <option value="Clinical Leads">Clinical Leads</option>
                        <option value="Other Operational">Other Operational</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {commandLevel === 'GOLD' ? 'Organization' : 'Site Location'}
                  </label>
                  <input
                    type="text"
                    placeholder={commandLevel === 'GOLD' ? 'e.g. CNWL NHS Trust' : 'e.g. St Charles Hospital'}
                    value={formOrgSite}
                    onChange={(e) => setFormOrgSite(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Direct Phone *</label>
                  <input
                    type="text"
                    placeholder="e.g. 020 7380 9000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alternative Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. 07800 123 456"
                    value={formAltPhone}
                    onChange={(e) => setFormAltPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NHS Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. jane.smith@nhs.net"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Command Responsibilities & Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Strategic Press Lead / On-Call Evacuation Lead..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {editingContact ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteContact(editingContact)}
                    className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold flex items-center gap-1.5 min-h-[44px] shadow-xs"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span>Delete Contact</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold min-h-[44px] shadow-xs"
                  >
                    Save to Firestore
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Bulk Import Directory Data to Firestore ({commandLevel} Command)
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Paste a JSON contact array or CSV lines below to upload multiple contacts into the Firestore <strong>{commandLevel} Command Directory</strong>.
            </p>

            {uploadError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <form onSubmit={handleBulkUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Format Example (JSON Array or CSV lines):
                </label>
                <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] mb-2 space-y-1">
                  <div className="text-slate-400">// CSV Format: Name, Title, Phone, Email, Category, Organization/Site</div>
                  <div>Jane Smith, Duty Lead, 02073809000, jane@nhs.net, Executive Board, CNWL Trust</div>
                </div>

                <textarea
                  rows={8}
                  placeholder={`Paste JSON array or CSV lines here...\nJane Doe, Strategic Lead, 08000902464, jane.doe@nhs.net, Executive Board, CNWL Trust`}
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold min-h-[44px] shadow-xs"
                >
                  Upload to Firestore {commandLevel} Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

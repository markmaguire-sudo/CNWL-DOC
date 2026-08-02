import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck, 
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface AiAssistantTabProps {
  onCopyAdviceToLog?: (adviceText: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistantTab: React.FC<AiAssistantTabProps> = ({ onCopyAdviceToLog }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `**CNWL Director on Call Executive AI Advisor Ready.**

I can assist you with:
- **Command Level Decision Trees**: Evaluating Gold vs Silver Command criteria under NHS EPRR Framework.
- **Statutory Notifications**: CQC Regulation 16/18 guidance, HSE RIDDOR, Duty of Candour timeline rules.
- **METHANE Report Drafting**: Formatting emergency service dispatch reports.
- **Crisis Comms & Press Statements**: Holding statements and media risk management.

How can I advise your Director on Call response today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [copiedCopilotUrl, setCopiedCopilotUrl] = useState(false);

  const COPILOT_AGENT_URL = "https://nhs.sharepoint.com/:u:/r/sites/RV3_NDEPRR/Data/Director%20On%20Call%20Folder/Director%20On%20Call%20Advice.agent?d=w75d069ef117b4649871a6c841b42dedf&csf=1&web=1&e=1nvVNr";

  const handleLaunchCopilot = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      const win = window.open(COPILOT_AGENT_URL, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = COPILOT_AGENT_URL;
      }
    } catch {
      window.location.href = COPILOT_AGENT_URL;
    }
  };

  const handleCopyCopilotUrl = () => {
    navigator.clipboard.writeText(COPILOT_AGENT_URL);
    setCopiedCopilotUrl(true);
    setTimeout(() => setCopiedCopilotUrl(false), 2500);
  };

  const queryShortcuts = [
    'Should a 4-hour RiO electronic patient record outage trigger Silver Command?',
    'Draft a METHANE report for a ward fire evacuation at St Charles Hospital',
    'What are the mandatory CQC notification deadlines for an unexpected patient death?',
    'Draft a media holding statement for a suspected acute staffing shortage'
  ];

  const handleSendPrompt = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        const errorMsg: Message = {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ **Advisory Error**: ${data.error || 'Failed to retrieve AI advice.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (err) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: '⚠️ **Network Error**: Unable to connect to Director AI Advisor server.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* NHS SharePoint Copilot Bot Integration Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-md border border-blue-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-[11px] font-semibold">
            <Bot className="w-3.5 h-3.5 text-blue-300" />
            NHS TRUST SHAREPOINT COPILOT
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            Director On Call Advice Agent
          </h3>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            Access your organization's official NHS SharePoint Copilot bot directly for synchronized Trust policies and advice.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href={COPILOT_AGENT_URL}
            onClick={handleLaunchCopilot}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs shadow-sm transition-all shrink-0 hover:shadow-md min-h-[44px] cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Launch NHS Copilot Bot</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <button
            type="button"
            onClick={handleCopyCopilotUrl}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl bg-blue-950/80 hover:bg-blue-900 active:scale-95 text-blue-200 border border-blue-700/60 font-semibold text-xs transition-all shrink-0 min-h-[44px] cursor-pointer"
            title="Copy Direct Copilot Agent URL for Teams or Copilot app"
          >
            {copiedCopilotUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-blue-300" />}
            <span className="text-[11px]">{copiedCopilotUrl ? 'Link Copied!' : 'Copy Agent Link'}</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 text-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            SERVER-SIDE GEMINI 3.6 FLASH ENGINE
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Director on Call AI Executive Advisor</h2>
          <p className="text-xs text-slate-500">
            Instant guidance on NHS Gold/Silver Command, statutory CQC reporting & crisis communications
          </p>
        </div>
      </div>

      {/* Query Shortcuts */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block px-1">
          Recommended Advisor Shortcuts:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {queryShortcuts.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(sc)}
              disabled={loading}
              className="text-left bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-purple-300 p-3 rounded-xl text-xs flex items-center justify-between gap-2 transition-all group min-h-[44px] shadow-xs"
            >
              <span className="line-clamp-1 font-medium">{sc}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 min-h-[350px] max-h-[500px] overflow-y-auto shadow-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mb-1 px-1">
              <span>{msg.sender === 'user' ? 'Director on Call' : 'Executive AI Advisor'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">
                {msg.text}
              </div>

              {msg.sender === 'assistant' && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                  <button
                    onClick={() => handleCopyText(msg.text, msg.id)}
                    className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-mono font-medium"
                  >
                    {copiedMsgId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy Advice Text'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-purple-700 p-2 font-mono animate-pulse">
            <Bot className="w-4 h-4 text-purple-600" />
            <span>Analyzing NHS EPRR protocols & drafting executive response...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask AI Advisor for Gold Command advice, CQC rules, or crisis drafting..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          disabled={loading}
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors shadow-xs min-h-[44px]"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || loading}
          className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all min-h-[44px] ${
            inputPrompt.trim() && !loading
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};

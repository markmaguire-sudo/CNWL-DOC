import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { INITIAL_ROTA_PERIODS, DEDICATED_ROLES, INITIAL_INCIDENTS, PLAYBOOKS } from "./src/data/rotaData";
import { CriticalIncident, DecisionLogItem, RotaPeriod } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store with initial values from user prompt
let rotaPeriods: RotaPeriod[] = [...INITIAL_ROTA_PERIODS];
let incidents: CriticalIncident[] = [...INITIAL_INCIDENTS];
let validDirectorPIN = "2464"; // Default NHS Director PIN

// Shared Gemini AI instance
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// --- AUTH API ---
app.post("/api/auth/login", (req, res) => {
  const { pin } = req.body;
  if (!pin) {
    return res.status(400).json({ error: "PIN is required" });
  }

  if (pin === validDirectorPIN) {
    const sessionToken = "doc_session_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
    return res.json({
      success: true,
      sessionToken,
      message: "Director authentication successful",
      role: "Director on Call"
    });
  } else {
    return res.status(401).json({ success: false, error: "Invalid Director PIN. Please try again." });
  }
});

app.post("/api/auth/update-pin", (req, res) => {
  const { currentPin, newPin } = req.body;
  if (currentPin !== validDirectorPIN) {
    return res.status(401).json({ error: "Current PIN is incorrect" });
  }
  if (!newPin || newPin.length < 4) {
    return res.status(400).json({ error: "New PIN must be at least 4 digits" });
  }
  validDirectorPIN = newPin;
  return res.json({ success: true, message: "Director PIN updated successfully" });
});

// --- ROTA API ---
app.get("/api/rota", (req, res) => {
  // Return roles, rota periods, and playbooks
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
  
  res.json({
    roles: DEDICATED_ROLES,
    rotaPeriods,
    currentDateStr: dateStr,
    playbooks: PLAYBOOKS
  });
});

app.post("/api/rota/update", (req, res) => {
  const { updatedPeriods } = req.body;
  if (Array.isArray(updatedPeriods)) {
    rotaPeriods = updatedPeriods;
    return res.json({ success: true, rotaPeriods });
  }
  return res.status(400).json({ error: "Invalid rota data format" });
});

// --- INCIDENTS API ---
app.get("/api/incidents", (req, res) => {
  res.json({ incidents });
});

app.post("/api/incidents/create", (req, res) => {
  const { title, severityLevel, location, directorInCharge, summary, methane } = req.body;
  
  if (!title || !location) {
    return res.status(400).json({ error: "Title and location are required" });
  }

  const newIncident: CriticalIncident = {
    id: `INC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`,
    title,
    severityLevel: severityLevel || 1,
    status: 'ACTIVE',
    createdTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
    location,
    directorInCharge: directorInCharge || 'Director on Call',
    summary: summary || '',
    methane,
    decisionLogs: [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        author: directorInCharge || 'Director on Call',
        role: 'Director on Call',
        decision: `Incident logged with Severity Level ${severityLevel || 1}. Initial response initiated.`,
        category: 'Strategic'
      }
    ]
  };

  incidents.unshift(newIncident);
  res.json({ success: true, incident: newIncident });
});

app.post("/api/incidents/log-decision", (req, res) => {
  const { incidentId, author, role, decision, category, actionAssignedTo } = req.body;
  
  const incident = incidents.find(i => i.id === incidentId);
  if (!incident) {
    return res.status(404).json({ error: "Incident not found" });
  }

  const newLog: DecisionLogItem = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    author: author || 'Director on Call',
    role: role || 'Director on Call',
    decision,
    category: category || 'Operational',
    actionAssignedTo
  };

  incident.decisionLogs.push(newLog);
  res.json({ success: true, incident });
});

app.post("/api/incidents/update-status", (req, res) => {
  const { incidentId, status } = req.body;
  const incident = incidents.find(i => i.id === incidentId);
  if (!incident) {
    return res.status(404).json({ error: "Incident not found" });
  }
  
  incident.status = status;
  res.json({ success: true, incident });
});

app.post("/api/incidents/broadcast", (req, res) => {
  const { incidentTitle, severity, message, recipients, sentBy } = req.body;
  
  const alert = {
    id: `alert-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    incidentTitle,
    severity,
    message,
    recipients: recipients || ['All On-Call Staff'],
    sentBy: sentBy || 'Director on Call'
  };

  res.json({
    success: true,
    alert,
    broadcastChannel: 'SMS & Critical Push Notification Network',
    recipientsNotifiedCount: Array.isArray(recipients) ? recipients.length : 6
  });
});

// --- AI ADVISOR API (Server-side Gemini API) ---
app.post("/api/ai/advisor", async (req, res) => {
  try {
    const { prompt, incidentContext } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured in server environment."
      });
    }

    const systemInstruction = `You are an expert NHS Executive Incident Response Advisor & Gold Command Consultant specializing in CNWL (Central and North West London NHS Foundation Trust) Director on Call protocols.
Your job is to provide direct, authoritative, calm, and actionable advice to the Director on Call during critical incidents.
You provide:
1. Immediate Gold / Silver command escalation criteria & decision trees.
2. Statutory notifications required (e.g. CQC Regulation 18/16, Duty of Candour, NHS England EPRR, HSE RIDDOR, Information Commissioner's Office).
3. Risk mitigation & clinical safety guidance (Mental Health Act, Inpatient bed placement, staffing crisis, RiO/EPR outage).
4. Crisis communications & press handling advice.
5. Standard METHANE report drafting if requested.
Keep advice structured, highly clear with bullet points, concise, and focused on executive decision-making.`;

    const userMessage = incidentContext 
      ? `Incident Context: ${JSON.stringify(incidentContext)}\n\nUser Question: ${prompt}`
      : prompt;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.3
      }
    });

    return res.json({
      success: true,
      reply: response.text
    });
  } catch (error: any) {
    console.error("AI Advisor Error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate AI advice." });
  }
});

// --- VITE / STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Director on Call Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

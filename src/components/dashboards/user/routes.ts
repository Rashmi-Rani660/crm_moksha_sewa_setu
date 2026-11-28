/** URLs of the User Panel module pages (US-011 … US-025). */
const B = "/dashboard/user";

export const userRoutes = {
  home: B,
  myTasks: `${B}/my-tasks`,
  taskExecution: `${B}/my-tasks/execution`,
  communicationHub: `${B}/communication-hub`,
  officialEmail: `${B}/communication-hub/email`,
  whatsappDesk: `${B}/communication-hub/whatsapp`,
  callingFollowups: `${B}/communication-hub/calling`,
  aiChatbot: `${B}/communication-hub/chatbot`,
  aiWorkAssistant: `${B}/ai-work-assistant`,
  vehicleRequests: `${B}/resources-expenses`,
  expenses: `${B}/resources-expenses/expenses`,
  training: `${B}/training-knowledge`,
  assessments: `${B}/training-knowledge/assessments`,
  performance: `${B}/my-performance`,
  knowledgeBase: `${B}/knowledge-base`,
  reportsSupport: `${B}/help-support`,
} as const;

export const userScreenPicker = [
  { code: "US-011", title: "My Tasks", href: userRoutes.myTasks },
  { code: "US-012", title: "Task Acceptance, Execution & Completion", href: userRoutes.taskExecution },
  { code: "US-013", title: "Communication & Collaboration Hub", href: userRoutes.communicationHub },
  { code: "US-014", title: "Official Email Workspace", href: userRoutes.officialEmail },
  { code: "US-015", title: "WhatsApp Business Desk", href: userRoutes.whatsappDesk },
  { code: "US-016", title: "Calling & Follow-ups", href: userRoutes.callingFollowups },
  { code: "US-017", title: "AI Chatbot & Human Assistance", href: userRoutes.aiChatbot },
  { code: "US-018", title: "AI Smart Search & Work Assistant", href: userRoutes.aiWorkAssistant },
  { code: "US-019", title: "Vehicle & Material Requests", href: userRoutes.vehicleRequests },
  { code: "US-020", title: "Expenses & Reimbursement", href: userRoutes.expenses },
  { code: "US-021", title: "US-021 · My Training & AI Virtual Trainer", href: userRoutes.training },
  { code: "US-022", title: "US-022 · Assessment & Certification", href: userRoutes.assessments },
  { code: "US-023", title: "US-023 · My Performance & Recognition", href: userRoutes.performance },
  { code: "US-024", title: "US-024 · Knowledge Base & SOPs", href: userRoutes.knowledgeBase },
  { code: "US-025", title: "US-025 · Daily Reports, Settings & Support", href: userRoutes.reportsSupport },
] as const;

export type UserScreenCode = (typeof userScreenPicker)[number]["code"];

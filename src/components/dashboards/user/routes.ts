/** URLs of the User Panel module pages (US-011 … US-020). */
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
] as const;

export type UserScreenCode = (typeof userScreenPicker)[number]["code"];

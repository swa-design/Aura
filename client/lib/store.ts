import { create } from "zustand";

export type ThemePreference = "dark" | "light" | "blue";

export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskStatus = "not-started" | "in-progress" | "waiting" | "blocked" | "completed";
export type TaskRepeat = "never" | "daily" | "weekly" | "monthly" | "custom";
export type TaskReminder = "none" | "5-minutes" | "15-minutes" | "30-minutes" | "1-hour" | "1-day" | "custom";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

export interface TaskAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface TaskComment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface TaskActivity {
  id: string;
  type: "created" | "updated" | "completed" | "commented";
  userId: string;
  timestamp: Date;
  details?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: string;
  priority: TaskPriority;
  status: TaskStatus;
  startDate?: Date;
  dueDate?: Date;
  dueTime?: string;
  estimatedDuration?: number; // minutes
  actualDuration?: number; // minutes
  repeat: TaskRepeat;
  reminder: TaskReminder;
  customReminder?: number; // minutes before due
  tags: string[];
  project?: string;
  colorLabel?: string;
  icon?: string;
  attachments: TaskAttachment[];
  notes?: string;
  location?: string;
  relatedLink?: string;
  relatedEmail?: string;
  relatedCalendarEvent?: string;
  relatedNote?: string;
  relatedFinanceRecord?: string;
  relatedLearningTopic?: string;
  relatedHealthGoal?: string;
  aiSuggestedCategory?: string;
  aiSuggestedPriority?: TaskPriority;
  aiEstimatedDuration?: number;
  aiRecommendedDueDate?: Date;
  important: boolean;
  personal: boolean;
  work: boolean;
  study: boolean;
  requiresInternet: boolean;
  highFocus: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  subtasks: Subtask[];
  comments: TaskComment[];
  activity: TaskActivity[];
  versionHistory: Array<{
    version: number;
    timestamp: Date;
    changes: string;
  }>;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
  recurring?: "daily" | "weekly" | "monthly" | "none";
  category?: "meeting" | "task" | "personal" | "health" | "birthday";
}

export interface HealthMetric {
  date: Date;
  sleep: number;
  steps: number;
  calories: number;
  water: number;
  exercise: number;
  mood: number;
  weight?: number;
  bloodPressure?: { systolic: number; diastolic: number };
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  paymentMethod: "cash" | "card" | "bank";
  tags?: string[];
}

export type EmailCategory = "inbox" | "primary" | "promotions" | "social" | "updates" | "sent" | "drafts" | "archive" | "spam" | "trash" | "starred" | "important" | "unread" | "scheduled";

export interface EmailAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface Email {
  id: string;
  threadId: string;
  from: { name?: string; email: string };
  to: Array<{ name?: string; email: string }>;
  cc?: Array<{ name?: string; email: string }>;
  bcc?: Array<{ name?: string; email: string }>;
  subject: string;
  preview: string;
  body: string;
  htmlBody?: string;
  date: Date;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  category: EmailCategory;
  labels: string[];
  attachments: EmailAttachment[];
  aiSummary?: string;
  aiSuggestedReply?: string[];
  aiActionItems?: string[];
  aiExtractedDeadlines?: Date[];
  aiExtractedMeetings?: CalendarEvent[];
  aiDetectedSpam?: boolean;
  aiCategory?: EmailCategory;
  isScheduled?: boolean;
  scheduledAt?: Date;
  hasAttachment: boolean;
}

export interface GmailAccount {
  id: string;
  email: string;
  name?: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiry: Date;
  lastSyncAt?: Date;
}

// === Learning Types ===
export type MessageRole = "user" | "assistant" | "system";
export interface AITutorMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isPinned?: boolean;
  isFavorite?: boolean;
  attachments?: Array<{ id: string; name: string; type: string; url: string }>;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  tags?: string[];
  progress: number;
  lessons: Lesson[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  content?: string;
  completed: boolean;
  duration?: number;
  resources?: string[];
  createdAt: Date;
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  courseId?: string;
  dueDate?: Date;
  status: "pending" | "in-progress" | "submitted" | "graded";
  priority: "low" | "medium" | "high";
  attachments?: string[];
  grade?: number;
  createdAt: Date;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
  tags?: string[];
  lastReviewed?: Date;
  nextReview?: Date;
  streak: number;
}

export interface StudySession {
  id: string;
  subject: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  tasksCompleted: number;
  notes?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  folder?: string;
  createdAt: Date;
  updatedAt: Date;
  isPinned?: boolean;
}

// === Family Hub Types ===
export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "parent" | "child" | "guest";
  online: boolean;
  lastSeen?: Date;
  location?: { lat: number; lng: number; address?: string; lastUpdated: Date };
  batteryLevel?: number;
  locationSharingEnabled: boolean;
}

export interface FamilyGroup {
  id: string;
  name: string;
  members: FamilyMember[];
  createdAt: Date;
}

export interface FamilyInvitation {
  id: string;
  email: string;
  name: string;
  invitedBy: string;
  status: "pending" | "accepted" | "declined";
  invitedAt: Date;
}

export interface FamilyChatMessage {
  id: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file" | "audio" | "video" | "location";
  timestamp: Date;
  isRead: boolean;
  readBy: string[];
  attachments?: Array<{ id: string; name: string; type: string; url: string; size: number }>;
  replies?: FamilyChatMessage[];
  replyTo?: string;
  reactions?: Array<{ userId: string; emoji: string; timestamp: Date }>;
  isPinned?: boolean;
  editedAt?: Date;
}

export interface ShoppingListItem {
  id: string;
  title: string;
  quantity: number;
  unit?: string;
  category?: string;
  priority: "low" | "medium" | "high";
  purchased: boolean;
  assignedTo?: string;
  estimatedPrice?: number;
  notes?: string;
  image?: string;
  addedBy: string;
  addedAt: Date;
  completedBy?: string;
  completedAt?: Date;
}

export interface ShoppingList {
  id: string;
  title: string;
  items: ShoppingListItem[];
  isShared: boolean;
  createdAt: Date;
}

export interface HouseholdTask {
  id: string;
  title: string;
  description?: string;
  assignedTo: string[];
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  dueTime?: string;
  repeat?: TaskRepeat;
  reminder?: TaskReminder;
  attachments: TaskAttachment[];
  subtasks: Subtask[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string[];
  instructions?: string;
  prescribedBy?: string;
  refillDate?: Date;
  image?: string;
}

export interface ProductivityEntry {
  id: string;
  taskName: string;
  category: string;
  startTime: Date;
  endTime: Date;
  totalHours: number;
  breakDuration: number; // in minutes
  productivityScore: number; // 0-100
  priority: "low" | "medium" | "high";
  status: "not-started" | "in-progress" | "completed";
  notes?: string;
  linkedTask?: string; // Task ID
  createdAt: Date;
  updatedAt: Date;
}

// === Automation Types ===
export type TriggerType =
  | "email-received"
  | "email-sent"
  | "calendar-event-created"
  | "calendar-reminder"
  | "task-created"
  | "task-updated"
  | "task-completed"
  | "assignment-created"
  | "assignment-due"
  | "focus-session-started"
  | "focus-session-completed"
  | "course-created"
  | "smart-note-created"
  | "finance-expense-added"
  | "budget-exceeded"
  | "health-record-updated"
  | "medication-reminder"
  | "family-member-added"
  | "shopping-list-updated"
  | "manual-trigger"
  | "manual"
  | "time-based"
  | "scheduled"
  | "file-uploaded"
  | "user-login"
  | "user-logout"
  | "ai-tutor-conversation-completed";

export type ActionType =
  | "create-task"
  | "update-task"
  | "delete-task"
  | "create-calendar-event"
  | "send-notification"
  | "send-email"
  | "compose-email"
  | "save-smart-note"
  | "generate-ai-summary"
  | "generate-ai-notes"
  | "convert-email-to-task"
  | "convert-email-to-calendar-event"
  | "convert-assignment-to-task"
  | "launch-focus-timer"
  | "add-finance-record"
  | "update-health-reminder"
  | "add-shopping-item"
  | "notify-family-members"
  | "upload-file"
  | "download-report"
  | "export-pdf"
  | "generate-analytics-report"
  | "execute-ai-tutor-prompt"
  | "play-music"
  | "open-module"
  | "delay-execution";

export type ConditionOperator = "eq" | "neq" | "gt" | "lt" | "gte" | "lte" | "contains" | "startsWith" | "endsWith" | "in" | "not-in";
export type ConditionType = "if" | "else" | "and" | "or" | "not";

export interface WorkflowCondition {
  id: string;
  type: ConditionType;
  field?: string;
  operator?: ConditionOperator;
  value?: any;
  conditions?: WorkflowCondition[]; // for AND/OR
}

export interface WorkflowTrigger {
  id: string;
  type: TriggerType;
  config: Record<string, any>;
}

export interface WorkflowAction {
  id: string;
  type: ActionType;
  config: Record<string, any>;
}

export interface WorkflowVariable {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "boolean" | "dynamic";
  value?: any;
}

export type WorkflowScheduleType = "once" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "custom" | "specific-date" | "cron";

export interface WorkflowSchedule {
  type: WorkflowScheduleType;
  timezone?: string;
  dateTime?: Date;
  cronExpression?: string;
  custom?: Record<string, any>;
}

export type WorkflowStatus = "active" | "inactive" | "archived" | "disabled";

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  category: "student" | "productivity" | "learning" | "email" | "calendar" | "finance" | "health" | "family" | "general";
  status: WorkflowStatus;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  schedule?: WorkflowSchedule;
  variables: WorkflowVariable[];
  createdAt: Date;
  updatedAt: Date;
  lastExecution?: Date;
  executionCount: number;
  successCount: number;
  failureCount: number;
  notes?: string;
}

export type ExecutionStatus = "pending" | "running" | "success" | "failed" | "skipped";

export interface ExecutionLog {
  id: string;
  workflowId: string;
  workflowName: string;
  status: ExecutionStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number; // ms
  triggerSource: string;
  executedActions: string[];
  errorMessage?: string;
  logs: string[];
  canRetry: boolean;
  createdAt: Date;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: Workflow["category"];
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  variables: WorkflowVariable[];
  schedule?: WorkflowSchedule;
  icon: string;
}

export interface FamilyEvent extends CalendarEvent {
  isAllDay?: boolean;
  reminder?: Date;
  isRecurring?: boolean;
  recurrenceRule?: string;
  location?: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio: string;
  occupation: string;
  organization: string;
  location: string;
  phone?: string;
  preferences: {
    theme: ThemePreference;
    accentColor?: string | null;
    notifications: boolean;
    emailDigest: boolean;
  };
}

interface SerializedSubtask extends Omit<Subtask, "completedAt"> {
  completedAt?: string;
}

interface SerializedTask extends Omit<Task, "createdAt" | "updatedAt" | "startDate" | "dueDate" | "completedAt" | "aiRecommendedDueDate" | "subtasks" | "comments" | "activity" | "versionHistory"> {
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  dueDate?: string;
  completedAt?: string;
  aiRecommendedDueDate?: string;
  subtasks: SerializedSubtask[];
  comments: Array<Omit<TaskComment, "createdAt"> & { createdAt: string }>;
  activity: Array<Omit<TaskActivity, "timestamp"> & { timestamp: string }>;
  versionHistory: Array<{
    version: number;
    timestamp: string;
    changes: string;
  }>;
}

interface SerializedCalendarEvent extends Omit<CalendarEvent, "startTime" | "endTime"> {
  startTime: string;
  endTime: string;
}

interface SerializedHealthMetric extends Omit<HealthMetric, "date"> {
  date: string;
}

interface SerializedExpense extends Omit<Expense, "date"> {
  date: string;
}

interface SerializedNote extends Omit<Note, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

interface SerializedEmail extends Omit<Email, "date" | "scheduledAt" | "aiExtractedDeadlines" | "aiExtractedMeetings"> {
  date: string;
  scheduledAt?: string;
  aiExtractedDeadlines?: string[];
  aiExtractedMeetings?: SerializedCalendarEvent[];
}

interface SerializedGmailAccount extends Omit<GmailAccount, "tokenExpiry" | "lastSyncAt"> {
  tokenExpiry: string;
  lastSyncAt?: string;
}

interface SerializedProductivityEntry extends Omit<ProductivityEntry, "createdAt" | "updatedAt" | "startTime" | "endTime"> {
  createdAt: string;
  updatedAt: string;
  startTime: string;
  endTime: string;
}

// === Automation Serialized Types ===
interface SerializedWorkflowSchedule extends Omit<WorkflowSchedule, "dateTime"> {
  dateTime?: string;
}

interface SerializedWorkflow extends Omit<Workflow, "createdAt" | "updatedAt" | "lastExecution" | "schedule"> {
  createdAt: string;
  updatedAt: string;
  lastExecution?: string;
  schedule?: SerializedWorkflowSchedule;
}

interface SerializedExecutionLog extends Omit<ExecutionLog, "startTime" | "endTime" | "createdAt"> {
  startTime: string;
  endTime?: string;
  createdAt: string;
}

// === Learning Serialized Types ===
interface SerializedAITutorMessage extends Omit<AITutorMessage, "timestamp"> {
  timestamp: string;
}

interface SerializedLesson extends Omit<Lesson, "createdAt"> {
  createdAt: string;
}

interface SerializedCourse extends Omit<Course, "createdAt" | "updatedAt" | "lessons"> {
  createdAt: string;
  updatedAt: string;
  lessons: SerializedLesson[];
}

interface SerializedAssignment extends Omit<Assignment, "createdAt" | "dueDate"> {
  createdAt: string;
  dueDate?: string;
}

interface SerializedFlashcard extends Omit<Flashcard, "lastReviewed" | "nextReview"> {
  lastReviewed?: string;
  nextReview?: string;
}

interface SerializedStudySession extends Omit<StudySession, "startTime" | "endTime"> {
  startTime: string;
  endTime?: string;
}

// === Family Serialized Types ===
interface SerializedFamilyMember extends Omit<FamilyMember, "lastSeen" | "location"> {
  lastSeen?: string;
  location?: { lat: number; lng: number; address?: string; lastUpdated: string };
}

interface SerializedFamilyGroup extends Omit<FamilyGroup, "createdAt" | "members"> {
  createdAt: string;
  members: SerializedFamilyMember[];
}

interface SerializedFamilyInvitation extends Omit<FamilyInvitation, "invitedAt"> {
  invitedAt: string;
}

interface SerializedFamilyChatMessage extends Omit<FamilyChatMessage, "timestamp" | "replies" | "reactions" | "editedAt"> {
  timestamp: string;
  replies?: SerializedFamilyChatMessage[];
  reactions?: Array<{ userId: string; emoji: string; timestamp: string }>;
  editedAt?: string;
}

interface SerializedShoppingListItem extends Omit<ShoppingListItem, "addedAt" | "completedAt"> {
  addedAt: string;
  completedAt?: string;
}

interface SerializedShoppingList extends Omit<ShoppingList, "createdAt" | "items"> {
  createdAt: string;
  items: SerializedShoppingListItem[];
}

interface SerializedHouseholdTask extends Omit<HouseholdTask, "createdAt" | "updatedAt" | "dueDate" | "completedAt" | "attachments" | "subtasks"> {
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  completedAt?: string;
  attachments: Array<Omit<TaskAttachment, never>>;
  subtasks: SerializedSubtask[];
}

interface SerializedMedication extends Omit<Medication, "refillDate"> {
  refillDate?: string;
}

interface WorkspaceRecord {
  tasks: SerializedTask[];
  events: SerializedCalendarEvent[];
  metrics: SerializedHealthMetric[];
  expenses: SerializedExpense[];
  budget: number;
  notes: SerializedNote[];
  emails: SerializedEmail[];
  gmailAccounts: SerializedGmailAccount[];
  deletedTasks: SerializedTask[];
  archivedTasks: SerializedTask[];
  // Learning
  aiTutorMessages: SerializedAITutorMessage[];
  courses: SerializedCourse[];
  assignments: SerializedAssignment[];
  flashcards: SerializedFlashcard[];
  studySessions: SerializedStudySession[];
  // Family
  familyGroup: SerializedFamilyGroup | null;
  familyInvitations: SerializedFamilyInvitation[];
  familyChatMessages: SerializedFamilyChatMessage[];
  shoppingLists: SerializedShoppingList[];
  householdTasks: SerializedHouseholdTask[];
  medications: SerializedMedication[];
  // Productivity
  productivityEntries: SerializedProductivityEntry[];
  // Automation
  workflows: SerializedWorkflow[];
  executionLogs: SerializedExecutionLog[];
}

type WorkspaceStorage = Record<string, WorkspaceRecord>;

const WORKSPACE_STORAGE_KEY = "aura-os-workspaces-v1";

const createId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const canUseStorage = () => typeof window !== "undefined" && !!window.localStorage;

const createEmptyWorkspace = (): WorkspaceRecord => ({
  tasks: [],
  events: [],
  metrics: [],
  expenses: [],
  budget: 0,
  notes: [],
  emails: [],
  gmailAccounts: [],
  deletedTasks: [],
  archivedTasks: [],
  // Learning
  aiTutorMessages: [],
  courses: [],
  assignments: [],
  flashcards: [],
  studySessions: [],
  // Family
  familyGroup: null,
  familyInvitations: [],
  familyChatMessages: [],
  shoppingLists: [],
  householdTasks: [],
  medications: [],
  // Productivity
  productivityEntries: [],
  // Automation
  workflows: [],
  executionLogs: [],
});

const readWorkspaceStorage = (): WorkspaceStorage => {
  if (!canUseStorage()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as WorkspaceStorage;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeWorkspaceStorage = (storage: WorkspaceStorage) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(storage));
};

const getWorkspaceRecord = (userId: string | null): WorkspaceRecord => {
  if (!userId) {
    return createEmptyWorkspace();
  }

  const storage = readWorkspaceStorage();
  if (!storage[userId]) {
    storage[userId] = createEmptyWorkspace();
    writeWorkspaceStorage(storage);
  } else {
    // Merge with empty workspace to ensure all properties exist (for existing users who don't have new fields
    storage[userId] = { ...createEmptyWorkspace(), ...storage[userId] };
  }

  return storage[userId];
};

const updateWorkspaceRecord = (
  userId: string,
  updater: (workspace: WorkspaceRecord) => WorkspaceRecord,
) => {
  const storage = readWorkspaceStorage();
  const current = storage[userId] ?? createEmptyWorkspace();
  storage[userId] = updater(current);
  writeWorkspaceStorage(storage);
  return storage[userId];
};

const serializeSubtask = (subtask: Subtask): SerializedSubtask => ({
  ...subtask,
  completedAt: subtask.completedAt?.toISOString(),
});

const deserializeSubtask = (subtask: SerializedSubtask): Subtask => ({
  ...subtask,
  completedAt: subtask.completedAt ? new Date(subtask.completedAt) : undefined,
});

const serializeTask = (task: Task): SerializedTask => ({
  ...task,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
  startDate: task.startDate?.toISOString(),
  dueDate: task.dueDate?.toISOString(),
  completedAt: task.completedAt?.toISOString(),
  aiRecommendedDueDate: task.aiRecommendedDueDate?.toISOString(),
  subtasks: task.subtasks.map(serializeSubtask),
  comments: task.comments.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })),
  activity: task.activity.map((a) => ({ ...a, timestamp: a.timestamp.toISOString() })),
  versionHistory: task.versionHistory.map((v) => ({ ...v, timestamp: v.timestamp.toISOString() })),
});

const deserializeTask = (task: SerializedTask): Task => ({
  ...task,
  createdAt: new Date(task.createdAt),
  updatedAt: new Date(task.updatedAt),
  startDate: task.startDate ? new Date(task.startDate) : undefined,
  dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
  completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
  aiRecommendedDueDate: task.aiRecommendedDueDate ? new Date(task.aiRecommendedDueDate) : undefined,
  subtasks: task.subtasks.map(deserializeSubtask),
  comments: task.comments.map((c) => ({ ...c, createdAt: new Date(c.createdAt) })),
  activity: task.activity.map((a) => ({ ...a, timestamp: new Date(a.timestamp) })),
  versionHistory: task.versionHistory.map((v) => ({ ...v, timestamp: new Date(v.timestamp) })),
});

const serializeEmail = (email: Email): SerializedEmail => ({
  ...email,
  date: email.date.toISOString(),
  scheduledAt: email.scheduledAt?.toISOString(),
  aiExtractedDeadlines: email.aiExtractedDeadlines?.map((d) => d.toISOString()),
  aiExtractedMeetings: email.aiExtractedMeetings?.map(serializeEvent),
});

const deserializeEmail = (email: SerializedEmail): Email => ({
  ...email,
  date: new Date(email.date),
  scheduledAt: email.scheduledAt ? new Date(email.scheduledAt) : undefined,
  aiExtractedDeadlines: email.aiExtractedDeadlines?.map((d) => new Date(d)),
  aiExtractedMeetings: email.aiExtractedMeetings?.map(deserializeEvent),
});

const serializeGmailAccount = (account: GmailAccount): SerializedGmailAccount => ({
  ...account,
  tokenExpiry: account.tokenExpiry.toISOString(),
  lastSyncAt: account.lastSyncAt?.toISOString(),
});

const deserializeGmailAccount = (account: SerializedGmailAccount): GmailAccount => ({
  ...account,
  tokenExpiry: new Date(account.tokenExpiry),
  lastSyncAt: account.lastSyncAt ? new Date(account.lastSyncAt) : undefined,
});

const serializeEvent = (event: CalendarEvent): SerializedCalendarEvent => ({
  ...event,
  startTime: event.startTime.toISOString(),
  endTime: event.endTime.toISOString(),
});

const deserializeEvent = (event: SerializedCalendarEvent): CalendarEvent => ({
  ...event,
  startTime: new Date(event.startTime),
  endTime: new Date(event.endTime),
});

const serializeMetric = (metric: HealthMetric): SerializedHealthMetric => ({
  ...metric,
  date: metric.date.toISOString(),
});

const deserializeMetric = (metric: SerializedHealthMetric): HealthMetric => ({
  ...metric,
  date: new Date(metric.date),
});

const serializeExpense = (expense: Expense): SerializedExpense => ({
  ...expense,
  date: expense.date.toISOString(),
});

const deserializeExpense = (expense: SerializedExpense): Expense => ({
  ...expense,
  date: new Date(expense.date),
});

const serializeNote = (note: Note): SerializedNote => ({
  ...note,
  createdAt: note.createdAt.toISOString(),
  updatedAt: note.updatedAt.toISOString(),
});

const deserializeNote = (note: SerializedNote): Note => ({
  ...note,
  createdAt: new Date(note.createdAt),
  updatedAt: new Date(note.updatedAt),
});

// === Learning Serialization/Deserialization ===
const serializeAITutorMessage = (msg: AITutorMessage): SerializedAITutorMessage => ({
  ...msg,
  timestamp: msg.timestamp.toISOString(),
});
const deserializeAITutorMessage = (msg: SerializedAITutorMessage): AITutorMessage => ({
  ...msg,
  timestamp: new Date(msg.timestamp),
});

const serializeLesson = (lesson: Lesson): SerializedLesson => ({
  ...lesson,
  createdAt: lesson.createdAt.toISOString(),
});
const deserializeLesson = (lesson: SerializedLesson): Lesson => ({
  ...lesson,
  createdAt: new Date(lesson.createdAt),
});

const serializeCourse = (course: Course): SerializedCourse => ({
  ...course,
  createdAt: course.createdAt.toISOString(),
  updatedAt: course.updatedAt.toISOString(),
  lessons: course.lessons.map(serializeLesson),
});
const deserializeCourse = (course: SerializedCourse): Course => ({
  ...course,
  createdAt: new Date(course.createdAt),
  updatedAt: new Date(course.updatedAt),
  lessons: course.lessons.map(deserializeLesson),
});

const serializeAssignment = (assignment: Assignment): SerializedAssignment => ({
  ...assignment,
  createdAt: assignment.createdAt.toISOString(),
  dueDate: assignment.dueDate?.toISOString(),
});
const deserializeAssignment = (assignment: SerializedAssignment): Assignment => ({
  ...assignment,
  createdAt: new Date(assignment.createdAt),
  dueDate: assignment.dueDate ? new Date(assignment.dueDate) : undefined,
});

const serializeFlashcard = (card: Flashcard): SerializedFlashcard => ({
  ...card,
  lastReviewed: card.lastReviewed?.toISOString(),
  nextReview: card.nextReview?.toISOString(),
});
const deserializeFlashcard = (card: SerializedFlashcard): Flashcard => ({
  ...card,
  lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : undefined,
  nextReview: card.nextReview ? new Date(card.nextReview) : undefined,
});

const serializeStudySession = (session: StudySession): SerializedStudySession => ({
  ...session,
  startTime: session.startTime.toISOString(),
  endTime: session.endTime?.toISOString(),
});
const deserializeStudySession = (session: SerializedStudySession): StudySession => ({
  ...session,
  startTime: new Date(session.startTime),
  endTime: session.endTime ? new Date(session.endTime) : undefined,
});

// === Family Serialization/Deserialization ===
const serializeFamilyMember = (member: FamilyMember): SerializedFamilyMember => ({
  ...member,
  lastSeen: member.lastSeen?.toISOString(),
  location: member.location ? { ...member.location, lastUpdated: member.location.lastUpdated.toISOString() } : undefined,
});
const deserializeFamilyMember = (member: SerializedFamilyMember): FamilyMember => ({
  ...member,
  lastSeen: member.lastSeen ? new Date(member.lastSeen) : undefined,
  location: member.location ? { ...member.location, lastUpdated: new Date(member.location.lastUpdated) } : undefined,
});

const serializeFamilyGroup = (group: FamilyGroup): SerializedFamilyGroup => ({
  ...group,
  createdAt: group.createdAt.toISOString(),
  members: group.members.map(serializeFamilyMember),
});
const deserializeFamilyGroup = (group: SerializedFamilyGroup): FamilyGroup => ({
  ...group,
  createdAt: new Date(group.createdAt),
  members: group.members.map(deserializeFamilyMember),
});

const serializeFamilyInvitation = (invitation: FamilyInvitation): SerializedFamilyInvitation => ({
  ...invitation,
  invitedAt: invitation.invitedAt.toISOString(),
});
const deserializeFamilyInvitation = (invitation: SerializedFamilyInvitation): FamilyInvitation => ({
  ...invitation,
  invitedAt: new Date(invitation.invitedAt),
});

const serializeFamilyChatMessage = (msg: FamilyChatMessage): SerializedFamilyChatMessage => ({
  ...msg,
  timestamp: msg.timestamp.toISOString(),
  replies: msg.replies?.map(serializeFamilyChatMessage),
  reactions: msg.reactions?.map(r => ({ ...r, timestamp: r.timestamp.toISOString() })),
  editedAt: msg.editedAt?.toISOString(),
});
const deserializeFamilyChatMessage = (msg: SerializedFamilyChatMessage): FamilyChatMessage => ({
  ...msg,
  timestamp: new Date(msg.timestamp),
  replies: msg.replies?.map(deserializeFamilyChatMessage),
  reactions: msg.reactions?.map(r => ({ ...r, timestamp: new Date(r.timestamp) })),
  editedAt: msg.editedAt ? new Date(msg.editedAt) : undefined,
});

const serializeShoppingListItem = (item: ShoppingListItem): SerializedShoppingListItem => ({
  ...item,
  addedAt: item.addedAt.toISOString(),
  completedAt: item.completedAt?.toISOString(),
});
const deserializeShoppingListItem = (item: SerializedShoppingListItem): ShoppingListItem => ({
  ...item,
  addedAt: new Date(item.addedAt),
  completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
});

const serializeShoppingList = (list: ShoppingList): SerializedShoppingList => ({
  ...list,
  createdAt: list.createdAt.toISOString(),
  items: list.items.map(serializeShoppingListItem),
});
const deserializeShoppingList = (list: SerializedShoppingList): ShoppingList => ({
  ...list,
  createdAt: new Date(list.createdAt),
  items: list.items.map(deserializeShoppingListItem),
});

const serializeHouseholdTask = (task: HouseholdTask): SerializedHouseholdTask => ({
  ...task,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
  dueDate: task.dueDate?.toISOString(),
  completedAt: task.completedAt?.toISOString(),
  subtasks: task.subtasks.map(serializeSubtask),
});
const deserializeHouseholdTask = (task: SerializedHouseholdTask): HouseholdTask => ({
  ...task,
  createdAt: new Date(task.createdAt),
  updatedAt: new Date(task.updatedAt),
  dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
  completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
  subtasks: task.subtasks.map(deserializeSubtask),
});

const serializeMedication = (med: Medication): SerializedMedication => ({
  ...med,
  refillDate: med.refillDate?.toISOString(),
});
const deserializeMedication = (med: SerializedMedication): Medication => ({
  ...med,
  refillDate: med.refillDate ? new Date(med.refillDate) : undefined,
});

const serializeProductivityEntry = (entry: ProductivityEntry): SerializedProductivityEntry => ({
  ...entry,
  createdAt: entry.createdAt.toISOString(),
  updatedAt: entry.updatedAt.toISOString(),
  startTime: entry.startTime.toISOString(),
  endTime: entry.endTime.toISOString(),
});
const deserializeProductivityEntry = (entry: SerializedProductivityEntry): ProductivityEntry => ({
  ...entry,
  createdAt: new Date(entry.createdAt),
  updatedAt: new Date(entry.updatedAt),
  startTime: new Date(entry.startTime),
  endTime: new Date(entry.endTime),
});

// === Automation Serialization/Deserialization ===
const serializeWorkflowSchedule = (sched: WorkflowSchedule): SerializedWorkflowSchedule => ({
  ...sched,
  dateTime: sched.dateTime?.toISOString(),
});
const deserializeWorkflowSchedule = (sched: SerializedWorkflowSchedule): WorkflowSchedule => ({
  ...sched,
  dateTime: sched.dateTime ? new Date(sched.dateTime) : undefined,
});

const serializeWorkflow = (workflow: Workflow): SerializedWorkflow => ({
  ...workflow,
  createdAt: workflow.createdAt.toISOString(),
  updatedAt: workflow.updatedAt.toISOString(),
  lastExecution: workflow.lastExecution?.toISOString(),
  schedule: workflow.schedule ? serializeWorkflowSchedule(workflow.schedule) : undefined,
});
const deserializeWorkflow = (workflow: SerializedWorkflow): Workflow => ({
  ...workflow,
  createdAt: new Date(workflow.createdAt),
  updatedAt: new Date(workflow.updatedAt),
  lastExecution: workflow.lastExecution ? new Date(workflow.lastExecution) : undefined,
  schedule: workflow.schedule ? deserializeWorkflowSchedule(workflow.schedule) : undefined,
});

const serializeExecutionLog = (log: ExecutionLog): SerializedExecutionLog => ({
  ...log,
  startTime: log.startTime.toISOString(),
  endTime: log.endTime?.toISOString(),
  createdAt: log.createdAt.toISOString(),
});
const deserializeExecutionLog = (log: SerializedExecutionLog): ExecutionLog => ({
  ...log,
  startTime: new Date(log.startTime),
  endTime: log.endTime ? new Date(log.endTime) : undefined,
  createdAt: new Date(log.createdAt),
});

interface UserScopedState {
  currentUserId: string | null;
  syncUser: (userId: string | null) => void;
}

interface TaskStore extends UserScopedState {
  tasks: Task[];
  deletedTasks: Task[];
  archivedTasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "subtasks" | "comments" | "activity" | "versionHistory">) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  restoreTask: (id: string) => void;
  archiveTask: (id: string) => void;
  unarchiveTask: (id: string) => void;
  duplicateTask: (id: string) => void;
  completeTask: (id: string) => void;
  getTasks: (status?: TaskStatus) => Task[];
  getTasksByCategory: (category: string) => Task[];
  searchTasks: (query: string) => Task[];
  addSubtask: (taskId: string, title: string) => void;
  updateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  addComment: (taskId: string, userId: string, content: string) => void;
  exportTasks: () => string;
  importTasks: (jsonData: string) => void;
  toggleTaskStatus: (id: string) => void;
}

export const useTaskStore = create<TaskStore>()((set, get) => ({
  currentUserId: null,
  tasks: [],
  deletedTasks: [],
  archivedTasks: [],
  syncUser: (userId) => {
    const workspace = getWorkspaceRecord(userId);
    set({
      currentUserId: userId,
      tasks: workspace.tasks.map(deserializeTask),
      deletedTasks: workspace.deletedTasks.map(deserializeTask),
      archivedTasks: workspace.archivedTasks.map(deserializeTask),
    });
  },
  addTask: (task) => {
    const userId = get().currentUserId;
    if (!userId) {
      throw new Error("No user logged in");
    }

    const now = new Date();
    const nextTask: Task = {
      ...task,
      id: createId(),
      createdAt: now,
      updatedAt: now,
      subtasks: [],
      comments: [],
      activity: [{
        id: createId(),
        type: "created",
        userId: userId,
        timestamp: now,
        details: "Task created"
      }],
      versionHistory: [{
        version: 1,
        timestamp: now,
        changes: "Initial version"
      }]
    };

    const tasks = [...get().tasks, nextTask];
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      tasks: tasks.map(serializeTask),
    }));
    set({ tasks });
    return nextTask;
  },
  updateTask: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const now = new Date();
    const task = get().tasks.find(t => t.id === id);
    const newVersion = task ? task.versionHistory.length + 1 : 1;

    const tasks = get().tasks.map((t) =>
      t.id === id ? {
        ...t,
        ...updates,
        updatedAt: now,
        activity: [
          ...t.activity,
          {
            id: createId(),
            type: "updated" as const,
            userId: userId,
            timestamp: now,
            details: "Task updated"
          }
        ],
        versionHistory: [
          ...t.versionHistory,
          {
            version: newVersion,
            timestamp: now,
            changes: Object.keys(updates).join(", ")
          }
        ]
      } : t
    );
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      tasks: tasks.map(serializeTask),
    }));
    set({ tasks });
  },
  deleteTask: (id) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const task = get().tasks.find(t => t.id === id);
    if (!task) return;

    const tasks = get().tasks.filter((t) => t.id !== id);
    const deletedTasks = [...get().deletedTasks, task];
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      tasks: tasks.map(serializeTask),
      deletedTasks: deletedTasks.map(serializeTask),
    }));
    set({ tasks, deletedTasks });
  },
  restoreTask: (id) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const task = get().deletedTasks.find(t => t.id === id);
    if (!task) return;

    const deletedTasks = get().deletedTasks.filter((t) => t.id !== id);
    const tasks = [...get().tasks, task];
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      tasks: tasks.map(serializeTask),
      deletedTasks: deletedTasks.map(serializeTask),
    }));
    set({ tasks, deletedTasks });
  },
  archiveTask: (id) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const task = get().tasks.find(t => t.id === id);
    if (!task) return;

    const tasks = get().tasks.filter((t) => t.id !== id);
    const archivedTasks = [...get().archivedTasks, task];
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      tasks: tasks.map(serializeTask),
      archivedTasks: archivedTasks.map(serializeTask),
    }));
    set({ tasks, archivedTasks });
  },
  unarchiveTask: (id) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const task = get().archivedTasks.find(t => t.id === id);
    if (!task) return;

    const archivedTasks = get().archivedTasks.filter((t) => t.id !== id);
    const tasks = [...get().tasks, task];
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      tasks: tasks.map(serializeTask),
      archivedTasks: archivedTasks.map(serializeTask),
    }));
    set({ tasks, archivedTasks });
  },
  duplicateTask: (id) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const task = get().tasks.find(t => t.id === id);
    if (!task) return;

    const now = new Date();
    const duplicated: Task = {
      ...task,
      id: createId(),
      title: `${task.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
      completedAt: undefined,
      status: "not-started"
    };

    const tasks = [...get().tasks, duplicated];
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      tasks: tasks.map(serializeTask),
    }));
    set({ tasks });
  },
  completeTask: (id) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const task = get().tasks.find(t => t.id === id);
    if (!task) return;

    const now = new Date();
    const actualDuration = task.startDate
      ? Math.round((now.getTime() - task.startDate.getTime()) / (1000 * 60))
      : undefined;

    get().updateTask(id, {
      status: "completed",
      completedAt: now,
      actualDuration
    });
  },
  getTasks: (status) => {
    const tasks = get().tasks;
    return status ? tasks.filter((task) => task.status === status) : tasks;
  },
  getTasksByCategory: (category) => get().tasks.filter((task) => task.category === category),
  searchTasks: (query) => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return get().tasks;
    return get().tasks.filter(task =>
      task.title.toLowerCase().includes(normalized) ||
      (task.description?.toLowerCase().includes(normalized) || false) ||
      task.tags.some(tag => tag.toLowerCase().includes(normalized)) ||
      (task.category?.toLowerCase().includes(normalized) || false) ||
      (task.project?.toLowerCase().includes(normalized) || false)
    );
  },
  addSubtask: (taskId, title) => {
    const userId = get().currentUserId;
    if (!userId) return;

    const subtask: Subtask = {
      id: createId(),
      title,
      completed: false
    };

    const tasks = get().tasks.map(t =>
      t.id === taskId ? { ...t, subtasks: [...t.subtasks, subtask], updatedAt: new Date() } : t
    );

    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      tasks: tasks.map(serializeTask)
    }));
    set({ tasks });
  },
  updateSubtask: (taskId, subtaskId, updates) => {
    const userId = get().currentUserId;
    if (!userId) return;

    const tasks = get().tasks.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, ...updates } : st),
        updatedAt: new Date()
      };
    });

    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      tasks: tasks.map(serializeTask)
    }));
    set({ tasks });
  },
  deleteSubtask: (taskId, subtaskId) => {
    const userId = get().currentUserId;
    if (!userId) return;

    const tasks = get().tasks.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: t.subtasks.filter(st => st.id !== subtaskId),
        updatedAt: new Date()
      };
    });

    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      tasks: tasks.map(serializeTask)
    }));
    set({ tasks });
  },
  addComment: (taskId, userId, content) => {
    const storeUserId = get().currentUserId;
    if (!storeUserId) return;

    const comment: TaskComment = {
      id: createId(),
      userId,
      content,
      createdAt: new Date()
    };

    const tasks = get().tasks.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        comments: [...t.comments, comment],
        updatedAt: new Date()
      };
    });

    updateWorkspaceRecord(storeUserId, workspace => ({
      ...workspace,
      tasks: tasks.map(serializeTask)
    }));
    set({ tasks });
  },
  exportTasks: () => {
    return JSON.stringify(get().tasks.map(serializeTask), null, 2);
  },
  importTasks: (jsonData) => {
    const userId = get().currentUserId;
    if (!userId) return;

    try {
      const imported = JSON.parse(jsonData) as SerializedTask[];
      const tasks = [...get().tasks, ...imported.map(deserializeTask)];
      updateWorkspaceRecord(userId, workspace => ({
        ...workspace,
        tasks: tasks.map(serializeTask)
      }));
      set({ tasks });
    } catch (e) {
      console.error("Failed to import tasks:", e);
    }
  },
  toggleTaskStatus: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;

    let newStatus: TaskStatus;
    switch (task.status) {
      case "not-started":
        newStatus = "in-progress";
        break;
      case "in-progress":
        newStatus = "completed";
        break;
      case "completed":
        newStatus = "not-started";
        break;
      default:
        newStatus = "not-started";
    }

    get().updateTask(id, {
      status: newStatus,
      completedAt: newStatus === "completed" ? new Date() : undefined
    });
  }
}));

interface CalendarStore extends UserScopedState {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: Date) => CalendarEvent[];
  getEventsInRange: (start: Date, end: Date) => CalendarEvent[];
}

export const useCalendarStore = create<CalendarStore>()((set, get) => ({
  currentUserId: null,
  events: [],
  syncUser: (userId) => {
    const workspace = getWorkspaceRecord(userId);
    set({
      currentUserId: userId,
      events: workspace.events.map(deserializeEvent),
    });
  },
  addEvent: (event) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const events = [...get().events, { ...event, id: createId() }];
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      events: events.map(serializeEvent),
    }));
    set({ events });
  },
  updateEvent: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const events = get().events.map((event) => (event.id === id ? { ...event, ...updates } : event));
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      events: events.map(serializeEvent),
    }));
    set({ events });
  },
  deleteEvent: (id) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const events = get().events.filter((event) => event.id !== id);
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      events: events.map(serializeEvent),
    }));
    set({ events });
  },
  getEventsByDate: (date) => get().events.filter((event) => event.startTime.toDateString() === date.toDateString()),
  getEventsInRange: (start, end) =>
    get().events.filter((event) => event.startTime >= start && event.startTime <= end),
}));

interface HealthStore extends UserScopedState {
  metrics: HealthMetric[];
  addMetric: (metric: Omit<HealthMetric, "date">) => void;
  updateMetric: (date: Date, updates: Partial<HealthMetric>) => void;
  getMetricsByDate: (date: Date) => HealthMetric | undefined;
  getMetricsByRange: (start: Date, end: Date) => HealthMetric[];
  getLatestMetric: () => HealthMetric | undefined;
}

export const useHealthStore = create<HealthStore>()((set, get) => ({
  currentUserId: null,
  metrics: [],
  syncUser: (userId) => {
    const workspace = getWorkspaceRecord(userId);
    set({
      currentUserId: userId,
      metrics: workspace.metrics.map(deserializeMetric),
    });
  },
  addMetric: (metric) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const metrics = [...get().metrics, { ...metric, date: new Date() }];
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      metrics: metrics.map(serializeMetric),
    }));
    set({ metrics });
  },
  updateMetric: (date, updates) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const metrics = get().metrics.map((metric) =>
      metric.date.toDateString() === date.toDateString() ? { ...metric, ...updates } : metric,
    );
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      metrics: metrics.map(serializeMetric),
    }));
    set({ metrics });
  },
  getMetricsByDate: (date) => get().metrics.find((metric) => metric.date.toDateString() === date.toDateString()),
  getMetricsByRange: (start, end) => get().metrics.filter((metric) => metric.date >= start && metric.date <= end),
  getLatestMetric: () => {
    const metrics = get().metrics;
    return metrics.length > 0 ? metrics[metrics.length - 1] : undefined;
  },
}));

interface FinanceStore extends UserScopedState {
  expenses: Expense[];
  budget: number;
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpensesByDate: (date: Date) => Expense[];
  getExpensesByCategory: (category: string) => Expense[];
  getTotalExpenses: (start?: Date, end?: Date) => number;
  setBudget: (amount: number) => void;
}

export const useFinanceStore = create<FinanceStore>()((set, get) => ({
  currentUserId: null,
  expenses: [],
  budget: 0,
  syncUser: (userId) => {
    const workspace = getWorkspaceRecord(userId);
    set({
      currentUserId: userId,
      expenses: workspace.expenses.map(deserializeExpense),
      budget: workspace.budget,
    });
  },
  addExpense: (expense) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const expenses = [...get().expenses, { ...expense, id: createId() }];
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      expenses: expenses.map(serializeExpense),
    }));
    set({ expenses });
  },
  updateExpense: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const expenses = get().expenses.map((expense) =>
      expense.id === id ? { ...expense, ...updates } : expense
    );
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      expenses: expenses.map(serializeExpense),
    }));
    set({ expenses });
  },
  deleteExpense: (id) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const expenses = get().expenses.filter((expense) => expense.id !== id);
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      expenses: expenses.map(serializeExpense),
    }));
    set({ expenses });
  },
  getExpensesByDate: (date) => get().expenses.filter((expense) => expense.date.toDateString() === date.toDateString()),
  getExpensesByCategory: (category) => get().expenses.filter((expense) => expense.category === category),
  getTotalExpenses: (start, end) =>
    get()
      .expenses.filter((expense) => (!start || expense.date >= start) && (!end || expense.date <= end))
      .reduce((sum, expense) => sum + expense.amount, 0),
  setBudget: (amount) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      budget: amount,
    }));
    set({ budget: amount });
  },
}));

interface NotesStore extends UserScopedState {
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNotesByFolder: (folder: string) => Note[];
  searchNotes: (query: string) => Note[];
  togglePin: (id: string) => void;
}

export const useNotesStore = create<NotesStore>()((set, get) => ({
  currentUserId: null,
  notes: [],
  syncUser: (userId) => {
    const workspace = getWorkspaceRecord(userId);
    set({
      currentUserId: userId,
      notes: workspace.notes.map(deserializeNote),
    });
  },
  addNote: (note) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const now = new Date();
    const notes = [
      ...get().notes,
      {
        ...note,
        id: createId(),
        createdAt: now,
        updatedAt: now,
      },
    ];

    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      notes: notes.map(serializeNote),
    }));
    set({ notes });
  },
  updateNote: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const notes = get().notes.map((note) =>
      note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note,
    );
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      notes: notes.map(serializeNote),
    }));
    set({ notes });
  },
  deleteNote: (id) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const notes = get().notes.filter((note) => note.id !== id);
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      notes: notes.map(serializeNote),
    }));
    set({ notes });
  },
  getNotesByFolder: (folder) => get().notes.filter((note) => note.folder === folder),
  searchNotes: (query) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return get().notes;
    }

    return get().notes.filter(
      (note) =>
        note.title.toLowerCase().includes(normalized) ||
        note.content.toLowerCase().includes(normalized),
    );
  },
  togglePin: (id) => {
    const note = get().notes.find((item) => item.id === id);
    if (!note) {
      return;
    }

    get().updateNote(id, { isPinned: !note.isPinned });
  },
}));

interface UserStore {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  updatePreferences: (prefs: Partial<UserProfile["preferences"]>) => void;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updatePreferences: (prefs) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            preferences: {
              ...state.user.preferences,
              ...prefs,
            },
          }
        : null,
    })),
}));

interface EmailStore extends UserScopedState {
  emails: Email[];
  gmailAccounts: GmailAccount[];
  addEmail: (email: Omit<Email, "id">) => void;
  updateEmail: (id: string, updates: Partial<Email>) => void;
  deleteEmail: (id: string) => void;
  addGmailAccount: (account: Omit<GmailAccount, "id">) => void;
  removeGmailAccount: (accountId: string) => void;
  searchEmails: (query: string) => Email[];
  getEmailsByCategory: (category: EmailCategory) => Email[];
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  toggleStar: (id: string) => void;
  moveToCategory: (id: string, category: EmailCategory) => void;
}

export const useEmailStore = create<EmailStore>()((set, get) => ({
  currentUserId: null,
  emails: [],
  gmailAccounts: [],
  syncUser: (userId) => {
    const workspace = getWorkspaceRecord(userId);
    set({
      currentUserId: userId,
      emails: workspace.emails.map(deserializeEmail),
      gmailAccounts: workspace.gmailAccounts.map(deserializeGmailAccount),
    });
  },
  addEmail: (email) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const nextEmail: Email = {
      ...email,
      id: createId()
    };

    const emails = [...get().emails, nextEmail];
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      emails: emails.map(serializeEmail),
    }));
    set({ emails });
  },
  updateEmail: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const emails = get().emails.map((email) => (email.id === id ? { ...email, ...updates } : email));
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      emails: emails.map(serializeEmail),
    }));
    set({ emails });
  },
  deleteEmail: (id) => {
    const userId = get().currentUserId;
    if (!userId) {
      return;
    }

    const emails = get().emails.filter((email) => email.id !== id);
    updateWorkspaceRecord(userId, (workspace) => ({
      ...workspace,
      emails: emails.map(serializeEmail),
    }));
    set({ emails });
  },
  addGmailAccount: (account) => {
    const userId = get().currentUserId;
    if (!userId) return;

    const nextAccount: GmailAccount = {
      ...account,
      id: createId()
    };
    const accounts = [...get().gmailAccounts, nextAccount];
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      gmailAccounts: accounts.map(serializeGmailAccount)
    }));
    set({ gmailAccounts: accounts });
  },
  removeGmailAccount: (accountId) => {
    const userId = get().currentUserId;
    if (!userId) return;

    const accounts = get().gmailAccounts.filter(a => a.id !== accountId);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      gmailAccounts: accounts.map(serializeGmailAccount)
    }));
    set({ gmailAccounts: accounts });
  },
  searchEmails: (query) => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return get().emails;
    return get().emails.filter(email =>
      email.subject.toLowerCase().includes(normalized) ||
      email.from.email.toLowerCase().includes(normalized) ||
      email.from.name?.toLowerCase().includes(normalized) ||
      email.body.toLowerCase().includes(normalized)
    );
  },
  getEmailsByCategory: (category) => get().emails.filter(email => email.category === category),
  markAsRead: (id) => get().updateEmail(id, { isRead: true }),
  markAsUnread: (id) => get().updateEmail(id, { isRead: false }),
  toggleStar: (id) => {
    const email = get().emails.find(e => e.id === id);
    if (email) {
      get().updateEmail(id, { isStarred: !email.isStarred });
    }
  },
  moveToCategory: (id, category) => get().updateEmail(id, { category })
}));

// === Learning Store ===
interface LearningStore extends UserScopedState {
  aiTutorMessages: AITutorMessage[];
  courses: Course[];
  assignments: Assignment[];
  flashcards: Flashcard[];
  studySessions: StudySession[];
  addAITutorMessage: (msg: Omit<AITutorMessage, "id" | "timestamp">) => void;
  updateAITutorMessage: (id: string, updates: Partial<AITutorMessage>) => void;
  deleteAITutorMessage: (id: string) => void;
  clearAITutorMessages: () => void;
  addCourse: (course: Omit<Course, "id" | "createdAt" | "updatedAt">) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addAssignment: (assignment: Omit<Assignment, "id" | "createdAt">) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  addFlashcard: (card: Omit<Flashcard, "id">) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  addStudySession: (session: Omit<StudySession, "id" | "startTime">) => void;
  updateStudySession: (id: string, updates: Partial<StudySession>) => void;
  deleteStudySession: (id: string) => void;
}

export const useLearningStore = create<LearningStore>()((set, get) => ({
  currentUserId: null,
  aiTutorMessages: [],
  courses: [],
  assignments: [],
  flashcards: [],
  studySessions: [],
  syncUser: (userId) => {
    const workspace = getWorkspaceRecord(userId);
    set({
      currentUserId: userId,
      aiTutorMessages: workspace.aiTutorMessages.map(deserializeAITutorMessage),
      courses: workspace.courses.map(deserializeCourse),
      assignments: workspace.assignments.map(deserializeAssignment),
      flashcards: workspace.flashcards.map(deserializeFlashcard),
      studySessions: workspace.studySessions.map(deserializeStudySession),
    });
  },
  addAITutorMessage: (msg) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const nextMsg: AITutorMessage = {
      ...msg,
      id: createId(),
      timestamp: new Date(),
    };
    const messages = [...get().aiTutorMessages, nextMsg];
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      aiTutorMessages: messages.map(serializeAITutorMessage),
    }));
    set({ aiTutorMessages: messages });
  },
  updateAITutorMessage: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const messages = get().aiTutorMessages.map(m => m.id === id ? { ...m, ...updates } : m);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      aiTutorMessages: messages.map(serializeAITutorMessage),
    }));
    set({ aiTutorMessages: messages });
  },
  deleteAITutorMessage: (id) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const messages = get().aiTutorMessages.filter(m => m.id !== id);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      aiTutorMessages: messages.map(serializeAITutorMessage),
    }));
    set({ aiTutorMessages: messages });
  },
  clearAITutorMessages: () => {
    const userId = get().currentUserId;
    if (!userId) return;
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      aiTutorMessages: [],
    }));
    set({ aiTutorMessages: [] });
  },
  addCourse: (course) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const now = new Date();
    const nextCourse: Course = {
      ...course,
      id: createId(),
      createdAt: now,
      updatedAt: now,
    };
    const courses = [...get().courses, nextCourse];
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      courses: courses.map(serializeCourse),
    }));
    set({ courses });
  },
  updateCourse: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const courses = get().courses.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      courses: courses.map(serializeCourse),
    }));
    set({ courses });
  },
  deleteCourse: (id) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const courses = get().courses.filter(c => c.id !== id);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      courses: courses.map(serializeCourse),
    }));
    set({ courses });
  },
  addAssignment: (assignment) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const nextAssignment: Assignment = {
      ...assignment,
      id: createId(),
      createdAt: new Date(),
    };
    const assignments = [...get().assignments, nextAssignment];
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      assignments: assignments.map(serializeAssignment),
    }));
    set({ assignments });
  },
  updateAssignment: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const assignments = get().assignments.map(a => a.id === id ? { ...a, ...updates } : a);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      assignments: assignments.map(serializeAssignment),
    }));
    set({ assignments });
  },
  deleteAssignment: (id) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const assignments = get().assignments.filter(a => a.id !== id);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      assignments: assignments.map(serializeAssignment),
    }));
    set({ assignments });
  },
  addFlashcard: (card) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const nextCard: Flashcard = { ...card, id: createId() };
    const flashcards = [...get().flashcards, nextCard];
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      flashcards: flashcards.map(serializeFlashcard),
    }));
    set({ flashcards });
  },
  updateFlashcard: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const flashcards = get().flashcards.map(c => c.id === id ? { ...c, ...updates } : c);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      flashcards: flashcards.map(serializeFlashcard),
    }));
    set({ flashcards });
  },
  deleteFlashcard: (id) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const flashcards = get().flashcards.filter(c => c.id !== id);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      flashcards: flashcards.map(serializeFlashcard),
    }));
    set({ flashcards });
  },
  addStudySession: (session) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const nextSession: StudySession = {
      ...session,
      id: createId(),
      startTime: new Date(),
    };
    const sessions = [...get().studySessions, nextSession];
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      studySessions: sessions.map(serializeStudySession),
    }));
    set({ studySessions: sessions });
  },
  updateStudySession: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const sessions = get().studySessions.map(s => s.id === id ? { ...s, ...updates } : s);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      studySessions: sessions.map(serializeStudySession),
    }));
    set({ studySessions: sessions });
  },
  deleteStudySession: (id) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const sessions = get().studySessions.filter(s => s.id !== id);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      studySessions: sessions.map(serializeStudySession),
    }));
    set({ studySessions: sessions });
  },
}));

// === Family Store ===
interface FamilyStore extends UserScopedState {
  familyGroup: FamilyGroup | null;
  familyInvitations: FamilyInvitation[];
  familyChatMessages: FamilyChatMessage[];
  shoppingLists: ShoppingList[];
  householdTasks: HouseholdTask[];
  medications: Medication[];
  createFamilyGroup: (name: string) => void;
  addFamilyInvitation: (invitation: Omit<FamilyInvitation, "id" | "invitedAt" | "status">) => void;
  updateFamilyInvitation: (id: string, updates: Partial<FamilyInvitation>) => void;
  addFamilyMember: (member: Omit<FamilyMember, "id">) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  removeFamilyMember: (id: string) => void;
  addFamilyChatMessage: (msg: Partial<Omit<FamilyChatMessage, "id" | "timestamp">>) => void;
  updateFamilyChatMessage: (id: string, updates: Partial<FamilyChatMessage>) => void;
  deleteFamilyChatMessage: (id: string) => void;
  addMessageReaction: (messageId: string, userId: string, emoji: string) => void;
  removeMessageReaction: (messageId: string, userId: string, emoji: string) => void;
  addShoppingList: (list: Partial<Omit<ShoppingList, "id" | "createdAt">>) => void;
  updateShoppingList: (id: string, updates: Partial<ShoppingList>) => void;
  deleteShoppingList: (id: string) => void;
  addShoppingListItem: (listId: string, item: Partial<Omit<ShoppingListItem, "id">>) => void;
  updateShoppingListItem: (listId: string, itemId: string, updates: Partial<ShoppingListItem>) => void;
  deleteShoppingListItem: (listId: string, itemId: string) => void;
  toggleShoppingListItemPurchased: (listId: string, itemId: string, userId: string) => void;
  addHouseholdTask: (task: Partial<Omit<HouseholdTask, "id" | "createdAt" | "updatedAt">>) => void;
  updateHouseholdTask: (id: string, updates: Partial<HouseholdTask>) => void;
  deleteHouseholdTask: (id: string) => void;
  toggleHouseholdTaskStatus: (id: string) => void;
  addMedication: (med: Partial<Omit<Medication, "id">>) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
}

export const useFamilyStore = create<FamilyStore>()((set, get) => ({
  currentUserId: null,
  familyGroup: null,
  familyInvitations: [],
  familyChatMessages: [],
  shoppingLists: [],
  householdTasks: [],
  medications: [],
  syncUser: (userId) => {
    const workspace = getWorkspaceRecord(userId);
    set({
      currentUserId: userId,
      familyGroup: workspace.familyGroup ? deserializeFamilyGroup(workspace.familyGroup) : null,
      familyInvitations: workspace.familyInvitations.map(deserializeFamilyInvitation),
      familyChatMessages: workspace.familyChatMessages.map(deserializeFamilyChatMessage),
      shoppingLists: workspace.shoppingLists.map(deserializeShoppingList),
      householdTasks: workspace.householdTasks.map(deserializeHouseholdTask),
      medications: workspace.medications.map(deserializeMedication),
    });
  },
  createFamilyGroup: (name) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const group: FamilyGroup = {
      id: createId(),
      name,
      members: [],
      createdAt: new Date(),
    };
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      familyGroup: serializeFamilyGroup(group),
    }));
    set({ familyGroup: group });
  },
  addFamilyInvitation: (invitation) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const nextInvitation: FamilyInvitation = {
      ...invitation,
      id: createId(),
      invitedAt: new Date(),
      status: "pending",
    };
    const invitations = [...get().familyInvitations, nextInvitation];
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      familyInvitations: invitations.map(serializeFamilyInvitation),
    }));
    set({ familyInvitations: invitations });
  },
  updateFamilyInvitation: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const invitations = get().familyInvitations.map(inv => inv.id === id ? { ...inv, ...updates } : inv);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      familyInvitations: invitations.map(serializeFamilyInvitation),
    }));
    set({ familyInvitations: invitations });
  },
  addFamilyMember: (member) => {
    const userId = get().currentUserId;
    if (!userId || !get().familyGroup) return;
    const nextMember: FamilyMember = { 
      id: createId(),
      name: "New Member",
      email: "",
      role: "guest",
      online: false,
      locationSharingEnabled: true,
      ...member 
    };
    const group = { ...get().familyGroup!, members: [...get().familyGroup!.members, nextMember] };
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      familyGroup: serializeFamilyGroup(group),
    }));
    set({ familyGroup: group });
  },
  updateFamilyMember: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId || !get().familyGroup) return;
    const group = {
      ...get().familyGroup!,
      members: get().familyGroup!.members.map(m => m.id === id ? { ...m, ...updates } : m),
    };
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      familyGroup: serializeFamilyGroup(group),
    }));
    set({ familyGroup: group });
  },
  removeFamilyMember: (id) => {
    const userId = get().currentUserId;
    if (!userId || !get().familyGroup) return;
    const group = {
      ...get().familyGroup!,
      members: get().familyGroup!.members.filter(m => m.id !== id),
    };
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      familyGroup: serializeFamilyGroup(group),
    }));
    set({ familyGroup: group });
  },
  addFamilyChatMessage: (msg) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const nextMsg: FamilyChatMessage = {
      id: createId(),
      senderId: userId,
      content: "",
      type: "text",
      timestamp: new Date(),
      isRead: false,
      readBy: [],
      ...msg,
    };
    const messages = [...get().familyChatMessages, nextMsg];
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      familyChatMessages: messages.map(serializeFamilyChatMessage),
    }));
    set({ familyChatMessages: messages });
  },
  updateFamilyChatMessage: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const messages = get().familyChatMessages.map(m => m.id === id ? { ...m, ...updates, editedAt: new Date() } : m);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      familyChatMessages: messages.map(serializeFamilyChatMessage),
    }));
    set({ familyChatMessages: messages });
  },
  deleteFamilyChatMessage: (id) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const messages = get().familyChatMessages.filter(m => m.id !== id);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      familyChatMessages: messages.map(serializeFamilyChatMessage),
    }));
    set({ familyChatMessages: messages });
  },
  addMessageReaction: (messageId, userId, emoji) => {
    const storeUserId = get().currentUserId;
    if (!storeUserId) return;
    const messages = get().familyChatMessages.map(msg => {
      if (msg.id === messageId) {
        const newReaction = { userId, emoji, timestamp: new Date() };
        const existingReactions = msg.reactions || [];
        const hasReaction = existingReactions.some(r => r.userId === userId && r.emoji === emoji);
        return {
          ...msg,
          reactions: hasReaction ? existingReactions : [...existingReactions, newReaction],
        };
      }
      return msg;
    });
    updateWorkspaceRecord(storeUserId, workspace => ({
      ...workspace,
      familyChatMessages: messages.map(serializeFamilyChatMessage),
    }));
    set({ familyChatMessages: messages });
  },
  removeMessageReaction: (messageId, userId, emoji) => {
    const storeUserId = get().currentUserId;
    if (!storeUserId) return;
    const messages = get().familyChatMessages.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          reactions: msg.reactions?.filter(r => !(r.userId === userId && r.emoji === emoji)),
        };
      }
      return msg;
    });
    updateWorkspaceRecord(storeUserId, workspace => ({
      ...workspace,
      familyChatMessages: messages.map(serializeFamilyChatMessage),
    }));
    set({ familyChatMessages: messages });
  },
  addShoppingList: (list) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const nextList: ShoppingList = {
      id: createId(),
      title: "Shopping List",
      items: [],
      isShared: true,
      createdAt: new Date(),
      ...list,
    };
    const shoppingLists = [...get().shoppingLists, nextList];
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      shoppingLists: shoppingLists.map(serializeShoppingList),
    }));
    set({ shoppingLists });
  },
  updateShoppingList: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const shoppingLists = get().shoppingLists.map(l => l.id === id ? { ...l, ...updates } : l);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      shoppingLists: shoppingLists.map(serializeShoppingList),
    }));
    set({ shoppingLists });
  },
  deleteShoppingList: (id) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const shoppingLists = get().shoppingLists.filter(l => l.id !== id);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      shoppingLists: shoppingLists.map(serializeShoppingList),
    }));
    set({ shoppingLists });
  },
  addShoppingListItem: (listId, item) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const shoppingLists = get().shoppingLists.map(list => {
      if (list.id === listId) {
        const nextItem: ShoppingListItem = {
          id: createId(),
          title: "New Item",
          quantity: 1,
          priority: "medium",
          purchased: false,
          addedBy: userId,
          addedAt: new Date(),
          ...item,
        };
        return { ...list, items: [...list.items, nextItem] };
      }
      return list;
    });
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      shoppingLists: shoppingLists.map(serializeShoppingList),
    }));
    set({ shoppingLists });
  },
  updateShoppingListItem: (listId, itemId, updates) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const shoppingLists = get().shoppingLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.map(item => item.id === itemId ? { ...item, ...updates } : item),
        };
      }
      return list;
    });
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      shoppingLists: shoppingLists.map(serializeShoppingList),
    }));
    set({ shoppingLists });
  },
  deleteShoppingListItem: (listId, itemId) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const shoppingLists = get().shoppingLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.filter(item => item.id !== itemId),
        };
      }
      return list;
    });
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      shoppingLists: shoppingLists.map(serializeShoppingList),
    }));
    set({ shoppingLists });
  },
  toggleShoppingListItemPurchased: (listId, itemId, userId) => {
    const storeUserId = get().currentUserId;
    if (!storeUserId) return;
    const shoppingLists = get().shoppingLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.map(item => {
            if (item.id === itemId) {
              const newPurchased = !item.purchased;
              return {
                ...item,
                purchased: newPurchased,
                completedBy: newPurchased ? userId : undefined,
                completedAt: newPurchased ? new Date() : undefined,
              };
            }
            return item;
          }),
        };
      }
      return list;
    });
    updateWorkspaceRecord(storeUserId, workspace => ({
      ...workspace,
      shoppingLists: shoppingLists.map(serializeShoppingList),
    }));
    set({ shoppingLists });
  },
  addHouseholdTask: (task) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const now = new Date();
    const nextTask: HouseholdTask = {
      id: createId(),
      title: "New Task",
      assignedTo: [userId],
      priority: "medium",
      status: "not-started",
      progress: 0,
      attachments: [],
      subtasks: [],
      createdAt: now,
      updatedAt: now,
      ...task,
    };
    const householdTasks = [...get().householdTasks, nextTask];
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      householdTasks: householdTasks.map(serializeHouseholdTask),
    }));
    set({ householdTasks });
  },
  updateHouseholdTask: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const now = new Date();
    const householdTasks = get().householdTasks.map(task => {
      if (task.id === id) {
        return { ...task, ...updates, updatedAt: now };
      }
      return task;
    });
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      householdTasks: householdTasks.map(serializeHouseholdTask),
    }));
    set({ householdTasks });
  },
  deleteHouseholdTask: (id) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const householdTasks = get().householdTasks.filter(task => task.id !== id);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      householdTasks: householdTasks.map(serializeHouseholdTask),
    }));
    set({ householdTasks });
  },
  toggleHouseholdTaskStatus: (id) => {
    const task = get().householdTasks.find(t => t.id === id);
    if (!task) return;
    let newStatus: TaskStatus;
    switch (task.status) {
      case "not-started":
        newStatus = "in-progress";
        break;
      case "in-progress":
        newStatus = "completed";
        break;
      case "completed":
        newStatus = "not-started";
        break;
      default:
        newStatus = "not-started";
    }
    get().updateHouseholdTask(id, { 
      status: newStatus, 
      completedAt: newStatus === "completed" ? new Date() : undefined 
    });
  },
  addMedication: (med) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const nextMed: Medication = { 
      id: createId(),
      name: "New Medication",
      dosage: "",
      schedule: [],
      ...med 
    };
    const medications = [...get().medications, nextMed];
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      medications: medications.map(serializeMedication),
    }));
    set({ medications });
  },
  updateMedication: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const medications = get().medications.map(m => m.id === id ? { ...m, ...updates } : m);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      medications: medications.map(serializeMedication),
    }));
    set({ medications });
  },
  deleteMedication: (id) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const medications = get().medications.filter(m => m.id !== id);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      medications: medications.map(serializeMedication),
    }));
    set({ medications });
  },
}));

// === Productivity Store ===
interface ProductivityStore extends UserScopedState {
  productivityEntries: ProductivityEntry[];
  addProductivityEntry: (entry: Partial<Omit<ProductivityEntry, "id" | "createdAt" | "updatedAt">>) => void;
  updateProductivityEntry: (id: string, updates: Partial<ProductivityEntry>) => void;
  deleteProductivityEntry: (id: string) => void;
}

export const useProductivityStore = create<ProductivityStore>()((set, get) => ({
  currentUserId: null,
  productivityEntries: [],
  syncUser: (userId) => {
    const workspace = getWorkspaceRecord(userId);
    set({
      currentUserId: userId,
      productivityEntries: workspace.productivityEntries.map(deserializeProductivityEntry),
    });
  },
  addProductivityEntry: (entry) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const now = new Date();
    const nextEntry: ProductivityEntry = {
      id: createId(),
      taskName: "New Task",
      category: "Work",
      startTime: now,
      endTime: new Date(now.getTime() + 3600000), // +1 hour
      totalHours: 1,
      breakDuration: 0,
      productivityScore: 50,
      priority: "medium",
      status: "not-started",
      createdAt: now,
      updatedAt: now,
      ...entry,
    };
    const entries = [...get().productivityEntries, nextEntry];
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      productivityEntries: entries.map(serializeProductivityEntry),
    }));
    set({ productivityEntries: entries });
  },
  updateProductivityEntry: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const now = new Date();
    const entries = get().productivityEntries.map(e => {
      if (e.id === id) {
        return { ...e, ...updates, updatedAt: now };
      }
      return e;
    });
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      productivityEntries: entries.map(serializeProductivityEntry),
    }));
    set({ productivityEntries: entries });
  },
  deleteProductivityEntry: (id) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const entries = get().productivityEntries.filter(e => e.id !== id);
    updateWorkspaceRecord(userId, workspace => ({
      ...workspace,
      productivityEntries: entries.map(serializeProductivityEntry),
    }));
    set({ productivityEntries: entries });
  },
}));

// === Automation Store ===
interface AutomationStore extends UserScopedState {
  workflows: Workflow[];
  executionLogs: ExecutionLog[];
  addWorkflow: (workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt" | "executionCount" | "successCount" | "failureCount">) => Workflow;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  duplicateWorkflow: (id: string) => void;
  archiveWorkflow: (id: string) => void;
  enableWorkflow: (id: string) => void;
  disableWorkflow: (id: string) => void;
  executeWorkflow: (id: string, triggerSource?: string) => void;
  addExecutionLog: (log: Omit<ExecutionLog, "id" | "createdAt">) => ExecutionLog;
  clearExecutionLogs: () => void;
  searchWorkflows: (query: string) => Workflow[];
  getWorkflowsByCategory: (category: Workflow["category"]) => Workflow[];
  getWorkflowsByStatus: (status: WorkflowStatus) => Workflow[];
  exportWorkflow: (id: string) => string;
  importWorkflow: (jsonData: string) => void;
}

export const useAutomationStore = create<AutomationStore>()((set, get) => ({
  currentUserId: null,
  workflows: [],
  executionLogs: [],
  syncUser: (userId) => {
    const workspace = getWorkspaceRecord(userId);
    set({
      currentUserId: userId,
      workflows: workspace.workflows.map(deserializeWorkflow),
      executionLogs: workspace.executionLogs.map(deserializeExecutionLog),
    });
  },
  addWorkflow: (workflow) => {
    const userId = get().currentUserId;
    if (!userId) throw new Error("No user logged in");
    const now = new Date();
    const nextWorkflow: Workflow = {
      ...workflow,
      id: createId(),
      createdAt: now,
      updatedAt: now,
      executionCount: 0,
      successCount: 0,
      failureCount: 0,
    };
    const workflows = [...get().workflows, nextWorkflow];
    updateWorkspaceRecord(userId, (w) => ({
      ...w, workflows: workflows.map(serializeWorkflow)
    }));
    set({ workflows });
    return nextWorkflow;
  },
  updateWorkflow: (id, updates) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const now = new Date();
    const workflows = get().workflows.map(w => w.id === id ? { ...w, ...updates, updatedAt: now } : w);
    updateWorkspaceRecord(userId, w => ({ ...w, workflows: workflows.map(serializeWorkflow) }));
    set({ workflows });
  },
  deleteWorkflow: (id) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const workflows = get().workflows.filter(w => w.id !== id);
    updateWorkspaceRecord(userId, w => ({ ...w, workflows: workflows.map(serializeWorkflow) }));
    set({ workflows });
  },
  duplicateWorkflow: (id) => {
    const userId = get().currentUserId;
    if (!userId) return;
    const original = get().workflows.find(w => w.id === id);
    if (!original) return;
    const now = new Date();
    const duplicated: Workflow = {
      ...original,
      id: createId(),
      name: `${original.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
      executionCount: 0,
      successCount: 0,
      failureCount: 0,
    };
    const workflows = [...get().workflows, duplicated];
    updateWorkspaceRecord(userId, w => ({ ...w, workflows: workflows.map(serializeWorkflow) }));
    set({ workflows });
  },
  archiveWorkflow: (id) => get().updateWorkflow(id, { status: "archived" }),
  enableWorkflow: (id) => get().updateWorkflow(id, { status: "active" }),
  disableWorkflow: (id) => get().updateWorkflow(id, { status: "inactive" }),
  executeWorkflow: (id, triggerSource = "manual") => {
    const userId = get().currentUserId;
    if (!userId) return;
    const workflow = get().workflows.find(w => w.id === id);
    if (!workflow) return;
    const now = new Date();
    const log: ExecutionLog = {
      id: createId(),
      workflowId: workflow.id,
      workflowName: workflow.name,
      status: "success",
      startTime: now,
      endTime: new Date(now.getTime() + 100),
      duration: 100,
      triggerSource,
      executedActions: workflow.actions.map(a => a.id),
      logs: ["Workflow executed successfully"],
      canRetry: false,
      createdAt: now,
    };
    get().addExecutionLog(log);
    get().updateWorkflow(id, {
      executionCount: workflow.executionCount + 1,
      successCount: workflow.successCount + 1,
      lastExecution: now,
    });
  },
  addExecutionLog: (log) => {
    const userId = get().currentUserId;
    if (!userId) throw new Error("No user logged in");
    const now = new Date();
    const nextLog: ExecutionLog = {
      ...log,
      id: createId(),
      createdAt: now,
    };
    const executionLogs = [...get().executionLogs, nextLog];
    updateWorkspaceRecord(userId, w => ({
      ...w, executionLogs: executionLogs.map(serializeExecutionLog)
    }));
    set({ executionLogs });
    return nextLog;
  },
  clearExecutionLogs: () => {
    const userId = get().currentUserId;
    if (!userId) return;
    updateWorkspaceRecord(userId, w => ({ ...w, executionLogs: [] }));
    set({ executionLogs: [] });
  },
  searchWorkflows: (query) => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return get().workflows;
    return get().workflows.filter(w =>
      w.name.toLowerCase().includes(normalized) ||
      (w.description?.toLowerCase().includes(normalized) || false)
    );
  },
  getWorkflowsByCategory: (category) => get().workflows.filter(w => w.category === category),
  getWorkflowsByStatus: (status) => get().workflows.filter(w => w.status === status),
  exportWorkflow: (id) => {
    const workflow = get().workflows.find(w => w.id === id);
    if (!workflow) return "{}";
    return JSON.stringify(workflow);
  },
  importWorkflow: (jsonData) => {
    try {
      const data = JSON.parse(jsonData) as Workflow;
      get().addWorkflow(data);
    } catch (e) {
      console.error("Failed to import workflow", e);
    }
  },
}));

export const resetUserWorkspace = (userId: string) => {
  if (!userId) {
    return;
  }

  const storage = readWorkspaceStorage();
  storage[userId] = createEmptyWorkspace();
  writeWorkspaceStorage(storage);
};

export const syncAllUserStores = (userId: string | null) => {
  useTaskStore.getState().syncUser(userId);
  useCalendarStore.getState().syncUser(userId);
  useHealthStore.getState().syncUser(userId);
  useFinanceStore.getState().syncUser(userId);
  useNotesStore.getState().syncUser(userId);
  useEmailStore.getState().syncUser(userId);
  useLearningStore.getState().syncUser(userId);
  useFamilyStore.getState().syncUser(userId);
  useProductivityStore.getState().syncUser(userId);
  useAutomationStore.getState().syncUser(userId);
};

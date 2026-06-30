import { useState, useMemo } from "react";
import {
  Zap,
  Play,
  Plus,
  Trash2,
  Settings,
  CheckCircle,
  Clock,
  Mail,
  FileText,
  Sparkles,
  MessageSquare,
  Activity,
  ListFilter,
  RotateCcw,
  AlertTriangle,
  X,
  Copy,
  Archive,
  PauseCircle,
  Download,
  Upload,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useAutomationStore } from "@/lib/store";
import type {
  Workflow,
  WorkflowTrigger,
  WorkflowCondition,
  WorkflowAction,
  ExecutionLog,
} from "@/lib/store";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "builder" | "templates" | "logs"
  >("dashboard");
  const [isAIPromptOpen, setIsAIPromptOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const {
    workflows,
    executionLogs,
    addWorkflow,
    updateWorkflow,
    deleteWorkflow,
    duplicateWorkflow,
    archiveWorkflow,
    enableWorkflow,
    disableWorkflow,
    executeWorkflow,
  } = useAutomationStore();

  const stats = useMemo(() => {
    const active = workflows.filter((w) => w.status === "active").length;
    const totalExecutions = executionLogs.length;
    const successCount = executionLogs.filter(
      (e) => e.status === "success"
    ).length;
    const failCount = executionLogs.filter(
      (e) => e.status === "failed"
    ).length;
    const estimatedSaved = Math.min(
      successCount * 5,
      1000
    );
    const lastExecution = executionLogs.slice(-1)[0]?.startTime;
    return {
      total: workflows.length,
      active,
      success: successCount,
      failed: failCount,
      totalExecutions,
      saved: estimatedSaved,
      aiGenerated: workflows.filter((w) => w.name.includes("AI")).length,
      lastExecution,
    };
  }, [workflows, executionLogs]);

  const activityData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const execs = executionLogs.filter(
        (log) =>
          new Date(log.startTime).toDateString() === d.toDateString()
      ).length;
      return { date: dateStr, executions: execs };
    });
    return last7Days;
  }, [executionLogs]);

  const statusData = useMemo(() => {
    const active = stats.active;
    const inactive = workflows.filter((w) => w.status === "inactive").length;
    const archived = workflows.filter((w) => w.status === "archived").length;
    return [
      { name: "Active", value: active },
      { name: "Inactive", value: inactive },
      { name: "Archived", value: archived },
    ];
  }, [workflows, stats.active]);

  const handleAIGenerate = () => {
    if (!aiPrompt) return;
    const now = new Date();
    const trigger: WorkflowTrigger = {
      id: crypto.randomUUID(),
      type: "manual",
      config: {},
    };
    const action: WorkflowAction = {
      id: crypto.randomUUID(),
      type: "send-notification",
      config: { text: "Workflow executed" },
    };
    addWorkflow({
      name: aiPrompt.slice(0, 42),
      description: aiPrompt,
      category: "general",
      status: "inactive",
      trigger,
      conditions: [],
      actions: [action],
      variables: [],
    });
    setAiPrompt("");
    setIsAIPromptOpen(false);
  };

  const handleCreateNew = () => {
    const trigger: WorkflowTrigger = {
      id: crypto.randomUUID(),
      type: "manual",
      config: {},
    };
    addWorkflow({
      name: "New Workflow",
      category: "general",
      status: "inactive",
      trigger,
      conditions: [],
      actions: [],
      variables: [],
    });
  };

  return (
    <div className="flex-1 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/10 via-background to-background flex flex-col min-h-0">
      <header className="glass border-b border-white/10 p-4 flex flex-col sm:flex-row justify-between sm:items-center px-4 md:px-8 gap-4 shrink-0">
        <h1 className="text-xl md:text-2xl font-bold capitalize flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Automation
        </h1>

        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 sm:pb-0">
          {[
            { id: "dashboard", icon: Activity, label: "Dashboard" },
            { id: "builder", icon: Settings, label: "Workflows" },
            { id: "templates", icon: FileText, label: "Templates" },
            { id: "logs", icon: ListFilter, label: "Logs" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all text-xs md:text-sm font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-white/5 hover:bg-white/10 text-foreground/70"
              }`}
            >
              <tab.icon className="w-3 h-3 md:w-4 md:h-4" />
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => setIsAIPromptOpen(true)}
            className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 hover:opacity-90 transition-opacity font-semibold text-white shadow-lg shadow-yellow-900/20 text-xs md:text-sm whitespace-nowrap ml-auto"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            AI Auto-Build
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        {activeTab === "dashboard" && (
          <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass p-6 rounded-2xl border border-white/10">
                <p className="text-sm text-foreground/60 mb-2">
                  Total Workflows
                </p>
                <p className="text-4xl font-bold">{stats.total}</p>
                <p className="text-xs text-foreground/40 mt-2">
                  {stats.active} active
                </p>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/10">
                <p className="text-sm text-foreground/60 mb-2">
                  Successful Executions
                </p>
                <p className="text-4xl font-bold text-green-400">
                  {stats.success}
                </p>
                <p className="text-xs text-foreground/40 mt-2">
                  {stats.totalExecutions} total runs
                </p>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/10">
                <p className="text-sm text-foreground/60 mb-2">
                  Est. Time Saved
                </p>
                <p className="text-4xl font-bold text-blue-400">
                  {stats.saved}m
                </p>
                <p className="text-xs text-foreground/40 mt-2">
                  Across all automations
                </p>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/10">
                <p className="text-sm text-foreground/60 mb-2">
                  Last Execution
                </p>
                <p className="text-4xl font-bold text-yellow-400">
                  {stats.lastExecution
                    ? new Date(stats.lastExecution).toLocaleTimeString()
                    : "Never"}
                </p>
                <p className="text-xs text-foreground/40 mt-2">
                  {stats.lastExecution
                    ? new Date(stats.lastExecution).toLocaleDateString()
                    : "Start automating!"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-2xl border border-white/10">
                <h3 className="font-bold text-lg mb-4">
                  Execution Activity
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient
                          id="colorExec"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8b5cf6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#ffffff10"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        stroke="#ffffff40"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#ffffff40"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          borderColor: "#ffffff20",
                          borderRadius: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="executions"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorExec)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass p-6 rounded-2xl border border-white/10">
                <h3 className="font-bold text-lg mb-4">
                  Workflow Status
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {statusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          borderColor: "#ffffff20",
                          borderRadius: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                  {statusData.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[idx % COLORS.length],
                        }}
                      />
                      <span className="text-foreground/70">
                        {item.name} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "builder" && (
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold">Workflows</h2>
                <p className="text-foreground/60 text-sm">
                  Manage your automations
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:opacity-90 transition-opacity font-semibold text-white shadow-lg rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  New Workflow
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="glass p-6 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{workflow.name}</h3>
                      <p className="text-sm text-foreground/60">
                        {workflow.description || "No description"}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        workflow.status === "active"
                          ? "bg-green-500/20 text-green-400 border border-green-500/20"
                          : workflow.status === "inactive"
                          ? "bg-gray-500/20 text-gray-400 border border-gray-500/20"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                      }`}
                    >
                      {workflow.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4 gap-2">
                    <button
                      onClick={() => executeWorkflow(workflow.id)}
                      className="p-2 hover:bg-white/10 rounded-lg flex items-center gap-1 text-xs"
                    >
                      <Play className="w-4 h-4" />
                      Run
                    </button>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {workflow.status === "active" ? (
                        <button
                          onClick={() => disableWorkflow(workflow.id)}
                          className="p-2 hover:bg-white/10 rounded-lg"
                        >
                          <PauseCircle className="w-4 h-4 text-foreground/70" />
                        </button>
                      ) : (
                        <button
                          onClick={() => enableWorkflow(workflow.id)}
                          className="p-2 hover:bg-white/10 rounded-lg"
                        >
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </button>
                      )}
                      <button
                        onClick={() => duplicateWorkflow(workflow.id)}
                        className="p-2 hover:bg-white/10 rounded-lg"
                      >
                        <Copy className="w-4 h-4 text-foreground/70" />
                      </button>
                      <button
                        onClick={() => archiveWorkflow(workflow.id)}
                        className="p-2 hover:bg-white/10 rounded-lg"
                      >
                        <Archive className="w-4 h-4 text-yellow-400" />
                      </button>
                      <button
                        onClick={() => deleteWorkflow(workflow.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {workflows.length === 0 && (
                <div className="col-span-full glass p-12 rounded-2xl border border-dashed border-white/15 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Zap className="w-12 h-12 text-yellow-500/50" />
                    <div>
                      <p className="text-lg font-medium mb-1">
                        No workflows yet
                      </p>
                      <p className="text-foreground/50 text-sm mb-4">
                        Create your first automation or use AI
                      </p>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={handleCreateNew}
                          className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:opacity-90 transition-opacity font-semibold text-white shadow-lg rounded-lg flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          New Workflow
                        </button>
                        <button
                          onClick={() => setIsAIPromptOpen(true)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 transition-opacity font-medium text-white border border-white/10 rounded-lg flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          AI Auto-Build
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Workflow Templates</h2>
              <p className="text-foreground/60 text-sm">
                Get started quickly with pre-built automations
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: "daily-brief",
                  title: "Daily Brief",
                  desc: "AI summary of tasks and calendar",
                  category: "productivity",
                  icon: Sparkles,
                },
                {
                  id: "expense-alert",
                  title: "Expense Alert",
                  desc: "Notify when large transactions occur",
                  category: "finance",
                  icon: Activity,
                },
                {
                  id: "med-reminder",
                  title: "Medicine Reminder",
                  desc: "Push notifications for meds",
                  category: "health",
                  icon: Clock,
                },
                {
                  id: "email-to-task",
                  title: "Email → Task",
                  desc: "Auto-convert important emails to tasks",
                  category: "email",
                  icon: Mail,
                },
                {
                  id: "assignment-tracker",
                  title: "Assignment Tracker",
                  desc: "Track deadlines and auto-create study sessions",
                  category: "learning",
                  icon: FileText,
                },
                {
                  id: "family-shopping",
                  title: "Family Shopping Sync",
                  desc: "Sync shopping lists across family members",
                  category: "family",
                  icon: MessageSquare,
                },
              ].map((template) => {
                const handleUseTemplate = () => {
                  const trigger: WorkflowTrigger = {
                    id: crypto.randomUUID(),
                    type: "manual",
                    config: {},
                  };
                  const action: WorkflowAction = {
                    id: crypto.randomUUID(),
                    type: "send-notification",
                    config: {},
                  };
                  addWorkflow({
                    name: template.title,
                    description: template.desc,
                    category:
                      (template.category as any) || "general",
                    status: "inactive",
                    trigger,
                    conditions: [],
                    actions: [action],
                    variables: [],
                  });
                };

                return (
                  <div
                    key={template.id}
                    className="glass p-6 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <template.icon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">
                      {template.title}
                    </h3>
                    <p className="text-sm text-foreground/60 mb-4">
                      {template.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground/40 capitalize">
                        {template.category}
                      </span>
                      <button
                        onClick={handleUseTemplate}
                        className="text-sm text-yellow-500 font-medium flex items-center gap-1"
                      >
                        Use Template <Zap className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="p-4 md:p-8 max-w-7xl mx-auto h-full overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-8 shrink-0">
              <div>
                <h2 className="text-2xl font-bold">Execution Logs</h2>
                <p className="text-foreground/60 text-sm">
                  Monitor your workflow runs
                </p>
              </div>
            </div>
            <div className="glass rounded-2xl border border-white/10 overflow-hidden flex-1 overflow-auto">
              {executionLogs.length === 0 ? (
                <div className="p-12 text-center">
                  <ListFilter className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground/70 mb-1">
                    No logs yet
                  </p>
                  <p className="text-sm text-foreground/50">
                    Start running workflows to see execution history
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {executionLogs
                    .slice()
                    .reverse()
                    .map((log) => (
                      <div
                        key={log.id}
                        className="p-6 flex items-start gap-4"
                      >
                        <div
                          className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                            log.status === "success"
                              ? "bg-green-500"
                              : log.status === "failed"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">
                                {log.workflowName}
                              </h4>
                              <p className="text-sm text-foreground/60">
                                Trigger: {log.triggerSource}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-foreground/70">
                                {new Date(
                                  log.startTime
                                ).toLocaleString()}
                              </p>
                              {log.duration && (
                                <p className="text-xs text-foreground/40">
                                  {log.duration}ms
                                </p>
                              )}
                            </div>
                          </div>
                          {log.errorMessage && (
                            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                              <p className="text-red-400 text-sm">
                                <AlertTriangle className="w-4 h-4 inline mr-2 align-bottom" />
                                {log.errorMessage}
                              </p>
                            </div>
                          )}
                        </div>
                        {log.canRetry && (
                          <button
                            onClick={() =>
                              executeWorkflow(log.workflowId, "retry")
                            }
                            className="p-2 hover:bg-white/10 rounded-lg"
                          >
                            <RotateCcw className="w-4 h-4 text-foreground/70" />
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isAIPromptOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass border border-yellow-500/30 rounded-3xl p-8 max-w-xl w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
            <button
              onClick={() => setIsAIPromptOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              AI Natural Language Builder
            </h2>
            <p className="text-foreground/70 mb-6">
              Describe what you want to automate, and AI will build the workflow
              for you.
            </p>

            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., 'Every morning at 8 AM, check my calendar and send a summary of my meetings to my phone.'"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 h-32 resize-none focus:outline-none focus:border-yellow-500/50 text-sm mb-6"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAIPromptOpen(false)}
                className="px-5 py-2.5 rounded-xl hover:bg-white/10 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAIGenerate}
                className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Generate Workflow <Zap className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckSquare,
  DollarSign,
  Heart,
  Plus,
  Mail,
  FileText,
  Book,
  Activity,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart2,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell
} from "recharts";
import {
  useTaskStore,
  useCalendarStore,
  useHealthStore,
  useFinanceStore,
  useEmailStore,
  useNotesStore,
  useLearningStore,
  useFamilyStore,
  useAutomationStore
} from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Store hooks
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus);

  const events = useCalendarStore((state) => state.events);
  const healthMetrics = useHealthStore((state) => state.metrics);
  const expenses = useFinanceStore((state) => state.expenses);
  const budget = useFinanceStore((state) => state.budget);
  const emails = useEmailStore((state) => state.emails);
  const notes = useNotesStore((state) => state.notes);
  const courses = useLearningStore((state) => state.courses);
  const assignments = useLearningStore((state) => state.assignments);
  const familyGroup = useFamilyStore((state) => state.familyGroup);
  const workflows = useAutomationStore((state) => state.workflows);
  const executionLogs = useAutomationStore((state) => state.executionLogs);

  // Calculate life score
  const lifeScore = useMemo(() => {
    const scores = {
      productivity: Math.min(
        100,
        (tasks.filter((t) => t.status === "completed").length / Math.max(tasks.length, 1)) * 100
      ),
      health: healthMetrics.length > 0 ? healthMetrics[healthMetrics.length - 1].mood * 12.5 : 80,
      finance: Math.min(
        100,
        Math.max(0, ((budget - expenses.reduce((sum, e) => sum + e.amount, 0)) / Math.max(budget, 1)) * 100)
      ),
      learning: courses.length > 0 ? courses.reduce((sum, c) => sum + (c.progress || 0), 0) / courses.length : 88,
      wellness: 81,
      goals: 84,
    };
    return Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 6);
  }, [tasks, expenses, budget, healthMetrics, courses]);

  const todaysTasks = useMemo(
    () => tasks.filter((t) => t.status !== "completed").slice(0, 5),
    [tasks]
  );

  const completedTasks = useMemo(
    () => tasks.filter((t) => t.status === "completed").slice(-5),
    [tasks]
  );

  const todaysEvents = useMemo(
    () => events
      .filter((e) => e.startTime.toDateString() === new Date().toDateString())
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .slice(0, 5),
    [events]
  );

  const upcomingEvents = useMemo(
    () => events
      .filter((e) => e.startTime > new Date())
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .slice(0, 5),
    [events]
  );

  const unreadEmails = useMemo(
    () => emails.filter(e => !e.isRead).slice(0, 5),
    [emails]
  );

  const recentNotes = useMemo(
    () => notes.slice(-5).reverse(),
    [notes]
  );

  const latestHealthMetric = healthMetrics[healthMetrics.length - 1] || {
    sleep: 0,
    steps: 0,
    water: 0,
    mood: 6
  };

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const recentExpenses = useMemo(
    () => expenses.slice(-5).reverse(),
    [expenses]
  );

  const assignmentDeadlines = useMemo(
    () => assignments
      .filter(a => a.status !== "graded" && a.dueDate)
      .sort((a, b) => new Date(a.dueDate || "").getTime() - new Date(b.dueDate || "").getTime())
      .slice(0, 5),
    [assignments]
  );

  const activeAutomations = useMemo(
    () => workflows.filter(w => w.status === "active"),
    [workflows]
  );

  const courseProgress = useMemo(
    () => courses.map(c => ({
      name: c.title,
      progress: c.progress || 0
    })),
    [courses]
  );

  const chartData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        tasks: tasks.filter(t => 
          t.completedAt && new Date(t.completedAt).toDateString() === date.toDateString()
        ).length,
        events: events.filter(e => 
          e.startTime.toDateString() === date.toDateString()
        ).length,
        emails: emails.filter(e => 
          new Date(e.date).toDateString() === date.toDateString()
        ).length,
      });
    }
    return last7Days;
  }, [tasks, events, emails]);

  const pieChartData = useMemo(() => {
    return [
      { name: 'Productive', value: 65, color: '#8b5cf6' },
      { name: 'Focus', value: 20, color: '#06b6d4' },
      { name: 'Rest', value: 15, color: '#f59e0b' }
    ];
  }, []);

  const aiInsights = useMemo(() => {
    const insights = [];

    if (todaysTasks.length > 3) {
      insights.push({ type: 'warning', text: `You have ${todaysTasks.length} tasks scheduled today. Consider prioritizing high-impact items.` });
    } else if (todaysTasks.length === 0) {
      insights.push({ type: 'info', text: 'No tasks scheduled today. This is a great day for deep work or learning!' });
    } else {
      insights.push({ type: 'success', text: 'Your task load looks manageable today. Keep up the momentum!' });
    }

    if (assignmentDeadlines.length > 0) {
      const nextDeadline = assignmentDeadlines[0];
      const daysUntil = Math.ceil((new Date(nextDeadline.dueDate || '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil <= 2) {
        insights.push({ type: 'urgent', text: `Assignment "${nextDeadline.title}" is due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}!` });
      } else {
        insights.push({ type: 'info', text: `Next assignment: "${nextDeadline.title}" due in ${daysUntil} days.` });
      }
    }

    if (totalExpenses > budget * 0.8) {
      insights.push({ type: 'warning', text: `You've spent ${Math.round((totalExpenses / budget) * 100)}% of your monthly budget.` });
    } else {
      insights.push({ type: 'success', text: `Great job! You've only used ${Math.round((totalExpenses / budget) * 100)}% of your budget this month.` });
    }

    if (latestHealthMetric.sleep < 7) {
      insights.push({ type: 'info', text: 'Consider getting more sleep tonight. Aim for 7-8 hours for optimal productivity.' });
    }

    return insights.slice(0, 4);
  }, [todaysTasks, assignmentDeadlines, totalExpenses, budget, latestHealthMetric.sleep]);

  const StatCard = ({ label, value, change, icon: Icon, color = "text-accent", trend }: any) => (
    <div className="glass rounded-xl p-4 md:p-6 hover:bg-white/5 transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-foreground/70 text-sm font-medium">{label}</span>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-2xl md:text-3xl font-bold mb-2">{value}</div>
      {change && (
        <div className="flex items-center gap-1">
          {trend === 'up' && <ArrowUpRight className="w-3 h-3 text-green-400" />}
          {trend === 'down' && <ArrowDownRight className="w-3 h-3 text-red-400" />}
          <span className={`text-xs ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-accent'}`}>{change}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user?.name}</h1>
              <p className="text-foreground/60 text-sm md:text-base">Here's your life overview for today</p>
            </div>
          </div>
        </div>

        {/* Life Score */}
        <div className="mb-6 md:mb-8">
          <div className="glass-accent rounded-2xl p-6 md:p-8 glow-accent">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl md:text-2xl font-bold">Your Life Score</h2>
              <div className="text-4xl md:text-5xl font-bold gradient-text">{lifeScore}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { label: "Productivity", value: Math.round(Math.min(100, (tasks.filter((t) => t.status === "completed").length / Math.max(tasks.length, 1)) * 100)) },
                { label: "Health", value: healthMetrics.length > 0 ? Math.round(healthMetrics[healthMetrics.length - 1].mood * 12.5) : 80 },
                { label: "Finance", value: Math.round(Math.min(100, Math.max(0, ((budget - expenses.reduce((sum, e) => sum + e.amount, 0)) / Math.max(budget, 1)) * 100))) },
                { label: "Learning", value: courses.length > 0 ? Math.round(courses.reduce((sum, c) => sum + (c.progress || 0), 0) / courses.length) : 88 },
                { label: "Wellness", value: 81 },
                { label: "Goals", value: 84 },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="mb-2">
                    <div className="relative w-12 h-12 mx-auto">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-white/10"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray={`${(item.value / 100) * 125.6} 125.6`}
                          className="text-accent transition-all"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold">{item.value}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/60">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
          <StatCard
            label="Today's Schedule"
            value={todaysEvents.length}
            change={`${todaysEvents.length} event${todaysEvents.length !== 1 ? 's' : ''} today`}
            icon={Calendar}
            color="text-blue-400"
          />
          <StatCard
            label="Active Tasks"
            value={tasks.filter((t) => t.status !== "completed").length}
            change={`${tasks.filter((t) => t.status === "completed").length} completed`}
            icon={CheckSquare}
            color="text-purple-400"
            trend={tasks.filter((t) => t.status === "completed").length > 0 ? 'up' : undefined}
          />
          <StatCard
            label="Budget Remaining"
            value={`$${Math.max(0, budget - totalExpenses).toFixed(0)}`}
            change={`$${budget.toFixed(0)} budget`}
            icon={DollarSign}
            color="text-green-400"
            trend={totalExpenses < budget ? 'up' : 'down'}
          />
          <StatCard
            label="Sleep Last Night"
            value={`${latestHealthMetric.sleep || 0}h`}
            change={latestHealthMetric.steps ? `${latestHealthMetric.steps.toLocaleString()} steps` : "No data"}
            icon={Heart}
            color="text-rose-400"
          />
        </div>

        {/* Activity Chart */}
        <div className="glass rounded-xl p-4 md:p-6 mb-6 md:mb-8">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            Activity Overview
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Area type="monotone" dataKey="tasks" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTasks)" />
                <Area type="monotone" dataKey="events" stroke="#06b6d4" fillOpacity={1} fill="url(#colorEvents)" />
                <Area type="monotone" dataKey="emails" stroke="#f59e0b" fillOpacity={1} fill="url(#colorEmails)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <div className="glass rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Today's Schedule
                </h3>
                <Link to="/calendar" className="text-accent text-sm hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {todaysEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                    onClick={() => navigate('/calendar')}
                  >
                    <div className="text-sm font-medium text-blue-400 min-w-fit">
                      {event.startTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm md:text-base">{event.title}</p>
                      <p className="text-xs text-foreground/60">
                        {Math.round(
                          (event.endTime.getTime() - event.startTime.getTime()) / 60000
                        )}{" "}
                        min
                      </p>
                    </div>
                  </div>
                ))}
                {todaysEvents.length === 0 && (
                  <p className="text-foreground/60 text-sm text-center py-4">No events scheduled for today</p>
                )}
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="glass rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-purple-400" />
                  Pending Tasks
                </h3>
                <Link to="/tasks" className="text-accent text-sm hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-2">
                {todaysTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-all cursor-pointer group"
                    onClick={() => navigate('/tasks')}
                  >
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      onChange={() => toggleTaskStatus(task.id)}
                      className="w-5 h-5 rounded border-primary accent-primary cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <p className={`font-medium text-sm md:text-base group-hover:text-accent transition-colors ${task.status === "completed" ? "line-through text-foreground/50" : ""}`}>
                        {task.title}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === "high"
                          ? "bg-red-500/20 text-red-300"
                          : task.priority === "medium"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-green-500/20 text-green-300"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
                {todaysTasks.length === 0 && (
                  <p className="text-foreground/60 text-sm text-center py-4">No pending tasks</p>
                )}
              </div>
            </div>

            {/* Unread Emails */}
            <div className="glass rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Mail className="w-5 h-5 text-red-400" />
                  Unread Emails
                </h3>
                <Link to="/email" className="text-accent text-sm hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {unreadEmails.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                    onClick={() => navigate('/email')}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{email.subject}</p>
                      <p className="text-xs text-foreground/60 truncate">{email.from.name || email.from.email}</p>
                    </div>
                  </div>
                ))}
                {unreadEmails.length === 0 && (
                  <p className="text-foreground/60 text-sm text-center py-4">No unread emails</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 mt-6 lg:mt-0">
            {/* AI Insights */}
            <div className="glass rounded-xl p-4 md:p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                AI Insights
              </h3>
              <div className="space-y-3">
                {aiInsights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg text-sm ${
                      insight.type === 'success' ? 'bg-green-500/10 border border-green-500/20' :
                      insight.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                      insight.type === 'urgent' ? 'bg-red-500/10 border border-red-500/20' :
                      'bg-blue-500/10 border border-blue-500/20'
                    }`}
                  >
                    {insight.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Health Summary */}
            <div className="glass rounded-xl p-4 md:p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" />
                Health Summary
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-foreground/70 mb-1">Sleep</p>
                  <p className="text-2xl font-bold">{latestHealthMetric.sleep || 0}h</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/70 mb-1">Steps</p>
                  <p className="text-2xl font-bold">{latestHealthMetric.steps?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/70 mb-1">Water</p>
                  <p className="text-2xl font-bold">{latestHealthMetric.water || 0}/8 cups</p>
                </div>
              </div>
            </div>

            {/* Budget Status */}
            <div className="glass rounded-xl p-4 md:p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Budget Status
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground/70">Spent</span>
                    <span>${totalExpenses.toFixed(0)}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (totalExpenses / budget) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-foreground/70">Budget</p>
                    <p className="font-bold">${budget.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-foreground/70">Remaining</p>
                    <p className={`font-bold ${totalExpenses <= budget ? 'text-green-400' : 'text-red-400'}`}>
                      ${Math.max(0, budget - totalExpenses).toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Notes */}
            <div className="glass rounded-xl p-4 md:p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-400" />
                Recent Notes
              </h3>
              <div className="space-y-2">
                {recentNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-all"
                    onClick={() => navigate('/notes')}
                  >
                    <p className="font-medium text-sm">{note.title}</p>
                    <p className="text-xs text-foreground/50 mt-1">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {recentNotes.length === 0 && (
                  <p className="text-foreground/60 text-sm text-center py-4">No notes yet</p>
                )}
              </div>
            </div>

            {/* Course Progress */}
            {courses.length > 0 && (
              <div className="glass rounded-xl p-4 md:p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Book className="w-5 h-5 text-yellow-400" />
                  Course Progress
                </h3>
                <div className="space-y-3">
                  {courses.slice(0, 3).map((course) => (
                    <div key={course.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground/70 truncate">{course.title}</span>
                        <span>{course.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Automations */}
            <div className="glass rounded-xl p-4 md:p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-pink-400" />
                Active Automations
              </h3>
              <div className="space-y-2">
                {activeAutomations.slice(0, 3).map((workflow) => (
                  <div
                    key={workflow.id}
                    className="p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-all"
                    onClick={() => navigate('/automation')}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="font-medium text-sm">{workflow.name}</p>
                    </div>
                  </div>
                ))}
                {activeAutomations.length === 0 && (
                  <p className="text-foreground/60 text-sm text-center py-4">No active automations</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-xl p-4 md:p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link 
                  to="/tasks" 
                  className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-sm font-medium text-primary transition-all text-center"
                >
                  + New Task
                </Link>
                <Link 
                  to="/calendar" 
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-sm font-medium text-blue-400 transition-all text-center"
                >
                  + Event
                </Link>
                <Link 
                  to="/notes" 
                  className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-sm font-medium text-green-400 transition-all text-center"
                >
                  + Note
                </Link>
                <Link 
                  to="/automation" 
                  className="px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 rounded-lg text-sm font-medium text-pink-400 transition-all text-center"
                >
                  + Automation
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - More Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Completed Tasks */}
          <div className="glass rounded-xl p-4 md:p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-green-400" />
              Recently Completed
            </h3>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                >
                  <CheckSquare className="w-5 h-5 text-green-400" />
                  <div className="flex-1">
                    <p className="font-medium text-sm line-through text-foreground/50">{task.title}</p>
                    {task.completedAt && (
                      <p className="text-xs text-foreground/40">
                        {new Date(task.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {completedTasks.length === 0 && (
                <p className="text-foreground/60 text-sm text-center py-4">No completed tasks yet</p>
              )}
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="glass rounded-xl p-4 md:p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Recent Expenses
            </h3>
            <div className="space-y-2">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{expense.description}</p>
                    <p className="text-xs text-foreground/50">{expense.category}</p>
                  </div>
                  <p className="font-bold text-red-400">-${expense.amount.toFixed(2)}</p>
                </div>
              ))}
              {recentExpenses.length === 0 && (
                <p className="text-foreground/60 text-sm text-center py-4">No expenses logged yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="glass rounded-xl p-4 md:p-6 mt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Upcoming Events
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
                  onClick={() => navigate('/calendar')}
                >
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-foreground/60 mt-1">
                    {event.startTime.toLocaleDateString()} at {event.startTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignment Deadlines */}
        {assignmentDeadlines.length > 0 && (
          <div className="glass rounded-xl p-4 md:p-6 mt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Upcoming Deadlines
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignmentDeadlines.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
                  onClick={() => navigate('/learning')}
                >
                  <p className="font-medium">{assignment.title}</p>
                  {assignment.dueDate && (
                    <p className="text-sm text-foreground/60 mt-1">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

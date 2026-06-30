import { useMemo, useState } from "react";
import {
  BarChart3, PieChart as PieChartIcon, TrendingUp, Activity,
  DollarSign, Brain, Target, Calendar, Download,
  ChevronDown, Heart, BookOpen, Sparkles, Plus, X
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { useFinanceStore, useHealthStore, useTaskStore, useLearningStore, useProductivityStore } from "@/lib/store";

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

type TimeRange = "Today" | "This Week" | "This Month" | "This Year";
type ActiveTab = "executive" | "productivity" | "finance" | "health" | "learning";

// Modal Component for adding Productivity Entry
function AddProductivityEntryModal({ onClose, onAdd }: { onClose: () => void; onAdd: (entry: any) => void }) {
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("Work");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 3600000)); // 1 hour later
  const [breakDuration, setBreakDuration] = useState(0);
  const [productivityScore, setProductivityScore] = useState(50);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [status, setStatus] = useState<"not-started" | "in-progress" | "completed">("completed");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalHours = (endTime.getTime() - startTime.getTime()) / 3600000; // in hours
    onAdd({
      taskName,
      category,
      startTime,
      endTime,
      totalHours,
      breakDuration,
      productivityScore,
      priority,
      status,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass p-6 rounded-3xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Add Productivity Entry</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground/70">Task Name</label>
            <input 
              type="text" 
              required
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
              placeholder="What did you work on?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground/70">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
            >
              <option value="Work">Work</option>
              <option value="Study">Study</option>
              <option value="Personal">Personal</option>
              <option value="Family">Family</option>
              <option value="Health">Health</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground/70">Start Time</label>
              <input 
                type="datetime-local" 
                required
                value={startTime.toISOString().slice(0, 16)}
                onChange={(e) => setStartTime(new Date(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground/70">End Time</label>
              <input 
                type="datetime-local" 
                required
                value={endTime.toISOString().slice(0, 16)}
                onChange={(e) => setEndTime(new Date(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground/70">Break Duration (minutes)</label>
              <input 
                type="number" 
                required
                min={0}
                value={breakDuration}
                onChange={(e) => setBreakDuration(parseInt(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground/70">Productivity Score (0-100)</label>
              <input 
                type="number" 
                required
                min={0}
                max={100}
                value={productivityScore}
                onChange={(e) => setProductivityScore(parseInt(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground/70">Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground/70">Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground/70">Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
              placeholder="Any additional notes?"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-sm font-semibold rounded-lg transition-opacity text-white"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("executive");
  const [timeRange, setTimeRange] = useState<TimeRange>("This Week");
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
  const [timeRangeDropdownOpen, setTimeRangeDropdownOpen] = useState(false);
  
  const tasks = useTaskStore((state) => state.tasks);
  const expenses = useFinanceStore((state) => state.expenses);
  const budget = useFinanceStore((state) => state.budget);
  const metrics = useHealthStore((state) => state.metrics);
  const { courses, assignments, studySessions } = useLearningStore();
  const { productivityEntries, addProductivityEntry } = useProductivityStore();

  // Helper to get the start of the selected time range
  const getTimeRangeStart = (range: TimeRange) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    switch (range) {
      case "Today":
        return now;
      case "This Week":
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
        return new Date(now.setDate(diff));
      case "This Month":
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case "This Year":
        return new Date(now.getFullYear(), 0, 1);
    }
  };

  // Filter data by time range
  const startDate = getTimeRangeStart(timeRange);
  
  const filteredTasks = tasks.filter(task => task.createdAt >= startDate);
  const filteredExpenses = expenses.filter(expense => expense.date >= startDate);
  const filteredMetrics = metrics.filter(metric => metric.date >= startDate);
  const filteredProductivity = productivityEntries.filter(entry => entry.startTime >= startDate);
  const filteredStudySessions = studySessions.filter(session => session.startTime >= startDate);

  // Productivity Data
  const productivityData = useMemo(
    () =>
      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
        const dayTasks = tasks.filter((task) => task.createdAt.getDay() === (index + 1) % 7);
        const completed = dayTasks.filter((task) => task.status === "completed").length;
        return {
          name: day,
          focus: Number((completed * 1.5).toFixed(1)),
          tasks: dayTasks.length,
        };
      }),
    [tasks],
  );

  const financeData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const monthExpenses = expenses
        .filter(
          (expense) =>
            expense.date.getMonth() === date.getMonth() &&
            expense.date.getFullYear() === date.getFullYear(),
        )
        .reduce((sum, expense) => sum + expense.amount, 0);
      return {
        name: date.toLocaleString("default", { month: "short" }),
        income: budget,
        expenses: monthExpenses,
      };
    });
  }, [budget, expenses]);

  const latestMetric = metrics[metrics.length - 1];
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const taskCompletionRate = tasks.length > 0
    ? Math.round((tasks.filter((task) => task.status === "completed").length / tasks.length) * 100)
    : 0;
  const wellnessIndex = latestMetric ? Math.round(((latestMetric.mood + latestMetric.sleep) / 18) * 100) : 0;
  const financialHealth = budget > 0 ? Math.max(0, Math.round(((budget - totalExpenses) / budget) * 100)) : 0;
  const overallLifeScore = Math.round((taskCompletionRate + wellnessIndex + financialHealth) / 3 || 0);

  const overallMetricsData = useMemo(() => [
    { subject: "Productivity", A: taskCompletionRate, fullMark: 100 },
    { subject: "Wellness", A: wellnessIndex, fullMark: 100 },
    { subject: "Finance", A: financialHealth, fullMark: 100 },
  ], [taskCompletionRate, wellnessIndex, financialHealth]);

  // New useMemo calls for the charts!
  const dailyHoursData = useMemo(() => {
    const days: any[] = [];
    let current = new Date(startDate);
    while (current <= new Date()) {
      const dayEntries = filteredProductivity.filter(e => 
        e.startTime.toDateString() === current.toDateString()
      );
      days.push({
        name: current.toLocaleDateString("en-US", { weekday: "short" }),
        hours: dayEntries.reduce((sum, e) => sum + e.totalHours, 0)
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [filteredProductivity, startDate]);

  const categoryDistributionData = useMemo(() => {
    const categories = new Map<string, number>();
    filteredProductivity.forEach(entry => {
      categories.set(entry.category, (categories.get(entry.category) || 0) + entry.totalHours);
    });
    return Array.from(categories, ([name, value]) => ({ name, value }));
  }, [filteredProductivity]);

  const filteredExpenseCategories = useMemo(() => {
    const categoryTotals = new Map<string, number>();
    filteredExpenses.forEach(expense => {
      categoryTotals.set(expense.category, (categoryTotals.get(expense.category) || 0) + expense.amount);
    });
    return Array.from(categoryTotals, ([name, value]) => ({ name, value }));
  }, [filteredExpenses]);

  const sleepTrendsData = useMemo(() => filteredMetrics.map(m => ({
    date: m.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    sleep: m.sleep || 0
  })), [filteredMetrics]);

  const moodDistributionData = useMemo(() => {
    const moodCounts = [0, 0, 0, 0, 0];
    filteredMetrics.forEach(m => {
      if (m.mood >= 1 && m.mood <= 5) moodCounts[m.mood - 1]++;
    });
    return moodCounts.map((count, i) => ({ mood: i + 1, count }));
  }, [filteredMetrics]);

  const studyTimeTrendsData = useMemo(() => {
    const days: any[] = [];
    let current = new Date(startDate);
    while (current <= new Date()) {
      const daySessions = filteredStudySessions.filter(s => 
        s.startTime.toDateString() === current.toDateString()
      );
      let totalMinutes = 0;
      daySessions.forEach(s => {
        if (s.endTime) {
          totalMinutes += (s.endTime.getTime() - s.startTime.getTime()) / 60000;
        }
      });
      days.push({
        name: current.toLocaleDateString("en-US", { weekday: "short" }),
        minutes: totalMinutes
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [filteredStudySessions, startDate]);

  const courseProgressData = useMemo(() => courses.map(c => ({
    name: c.title.substring(0, 10),
    progress: c.progress
  })), [courses]);

  return (
    <div className="flex-1 w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-background to-background relative">
      <header className="glass border-b border-white/10 p-4 flex flex-col sm:flex-row justify-between sm:items-center px-4 md:px-8 gap-4">
        <h1 className="text-xl md:text-2xl font-bold capitalize flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          {activeTab.replace('-', ' ')} Analytics
        </h1>
        <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-1 sm:pb-0">
          {/* Time Range Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setTimeRangeDropdownOpen(!timeRangeDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 border border-white/10 rounded-lg text-xs md:text-sm hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              <Calendar className="w-3 h-3 md:w-4 md:h-4" /> {timeRange} <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            
            {timeRangeDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setTimeRangeDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-2 z-20 glass border border-white/10 rounded-xl p-2 min-w-[150px]">
                  {["Today", "This Week", "This Month", "This Year"].map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setTimeRange(range as TimeRange);
                        setTimeRangeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs md:text-sm transition-colors ${
                        timeRange === range ? "bg-indigo-500 text-white" : "text-foreground/70 hover:bg-white/10"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button className="flex items-center justify-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-opacity font-semibold text-white shadow-lg shadow-indigo-900/20 text-xs md:text-sm whitespace-nowrap ml-auto">
            <Download className="w-3 h-3 md:w-4 md:h-4" /> Export
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="px-4 md:px-8 pt-4 pb-4 border-b border-white/5 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {[
            { id: "executive", icon: Target, label: "Executive Dashboard" },
            { id: "productivity", icon: TrendingUp, label: "Productivity" },
            { id: "finance", icon: DollarSign, label: "Finance" },
            { id: "health", icon: Heart, label: "Health & Wellness" },
            { id: "learning", icon: BookOpen, label: "Learning" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all text-xs md:text-sm font-medium ${
                activeTab === tab.id ? "bg-indigo-500 text-white" : "bg-white/5 hover:bg-white/10 text-foreground/70"
              }`}
            >
              <tab.icon className="w-3 h-3 md:w-4 md:h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
        {activeTab === "executive" && (
          <>
            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-indigo-500/20 transition-all"></div>
                <p className="text-foreground/60 text-sm font-medium mb-1">Overall Life Score</p>
                <p className="text-4xl font-bold text-white mb-2">{overallLifeScore}<span className="text-xl text-foreground/40">/100</span></p>
                <div className="flex items-center gap-1 text-xs text-foreground/50"><TrendingUp className="w-3 h-3" /> Based on your live workspace data</div>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Productivity Index</p>
                <p className="text-4xl font-bold text-blue-400 mb-2">{taskCompletionRate}</p>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${taskCompletionRate}%` }}></div>
                </div>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Wellness Index</p>
                <p className="text-4xl font-bold text-green-400 mb-2">{wellnessIndex}</p>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${wellnessIndex}%` }}></div>
                </div>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Financial Health</p>
                <p className="text-4xl font-bold text-yellow-400 mb-2">{financialHealth}</p>
                <div className="flex items-center gap-1 text-xs text-foreground/50"><TrendingUp className="w-3 h-3" /> Remaining budget signal</div>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass p-6 rounded-3xl border border-white/10 h-96 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg flex items-center gap-2">Productivity & Focus Trends</h3>
                </div>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={productivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="focus" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border border-white/10 h-96 flex flex-col">
                <h3 className="font-bold text-lg mb-2">Overall Metrics</h3>
                <p className="text-xs text-foreground/50 mb-6">Quick overview</p>
                <div className="flex-1 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={overallMetricsData}>
                      <PolarGrid stroke="#ffffff20" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff80', fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="You" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="glass p-6 rounded-3xl border border-indigo-500/30 bg-indigo-500/5 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10"><Brain className="w-48 h-48" /></div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-400" /> AI Executive Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div>
                  <p className="text-sm leading-relaxed text-foreground/80 mb-4">
                    {tasks.length === 0 && expenses.length === 0 && metrics.length === 0
                      ? "Your analytics workspace is clean and ready. Add tasks, expenses, and health check-ins to unlock personalized insights."
                      : "Your analytics dashboard is generated from live workspace activity. Keep adding tasks, expenses, and check-ins to improve accuracy."}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {budget > 0
                      ? `Your current budget usage is ${Math.max(0, Math.round((totalExpenses / budget) * 100))}% with ${tasks.filter((task) => task.status === "completed").length} completed tasks tracked so far.`
                      : "Set a finance budget and start recording activity to see executive-level summaries here."}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-3">
                    <Heart className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">Recommendation: Rest</p>
                      <p className="text-xs text-foreground/60">Log a health check-in to turn wellness suggestions into live recommendations.</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-3">
                    <Target className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">Goal Alert: Budget</p>
                      <p className="text-xs text-foreground/60">Capture a few more data points to make this recommendation more specific.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "productivity" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Productivity KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Total Hours</p>
                <p className="text-4xl font-bold text-white mb-2">
                  {filteredProductivity.reduce((sum, entry) => sum + entry.totalHours, 0).toFixed(1)}h
                </p>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Avg. Productivity Score</p>
                <p className="text-4xl font-bold text-purple-400 mb-2">
                  {filteredProductivity.length > 0
                    ? Math.round(filteredProductivity.reduce((sum, entry) => sum + entry.productivityScore, 0) / filteredProductivity.length)
                    : 0}
                </p>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Completed Entries</p>
                <p className="text-4xl font-bold text-green-400 mb-2">
                  {filteredProductivity.filter(e => e.status === "completed").length}
                </p>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Break Time</p>
                <p className="text-4xl font-bold text-blue-400 mb-2">
                  {filteredProductivity.reduce((sum, entry) => sum + entry.breakDuration, 0)}m
                </p>
              </div>
            </div>

            {/* Add Entry Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsAddEntryModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-opacity font-semibold text-white shadow-lg shadow-indigo-900/20 rounded-lg"
              >
                <Plus className="w-4 h-4" /> Add Productivity Entry
              </button>
            </div>

            {/* Productivity Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Time Tracking by Day */}
              <div className="glass p-6 rounded-3xl border border-white/10 h-96 flex flex-col">
                <h3 className="font-bold text-lg mb-6">Daily Hours Worked</h3>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={dailyHoursData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '12px' }} />
                      <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="glass p-6 rounded-3xl border border-white/10 h-96 flex flex-col">
                <h3 className="font-bold text-lg mb-2">Task Categories</h3>
                <div className="flex-1 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Productivity Entries List */}
            <div className="glass p-6 rounded-3xl border border-white/10">
              <h3 className="font-bold text-lg mb-4">Productivity Entries</h3>
              {filteredProductivity.length === 0 ? (
                <p className="text-foreground/50 text-sm">No productivity entries yet. Add your first one!</p>
              ) : (
                <div className="space-y-3">
                  {filteredProductivity.map(entry => (
                    <div key={entry.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
                      <div>
                        <h4 className="font-medium">{entry.taskName}</h4>
                        <p className="text-xs text-foreground/50">
                          {entry.category} • {entry.startTime.toLocaleTimeString()} - {entry.endTime.toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-400">{entry.productivityScore}%</p>
                        <p className="text-xs text-foreground/50">{entry.totalHours}h</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "finance" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Budget Remaining</p>
                <p className="text-4xl font-bold text-white mb-2">${Math.max(budget - totalExpenses, 0).toFixed(2)}</p>
                <div className="flex items-center gap-1 text-xs text-foreground/50"><TrendingUp className="w-3 h-3" /> Based on your saved budget</div>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Period Expenses</p>
                <p className="text-4xl font-bold text-red-400 mb-2">${filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</p>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${budget > 0 ? Math.min((filteredExpenses.reduce((sum, e) => sum + e.amount, 0) / budget) * 100, 100) : 0}%` }}></div>
                </div>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Expense Categories</p>
                <p className="text-4xl font-bold text-yellow-400 mb-2">{new Set(filteredExpenses.map(e => e.category)).size}</p>
                <p className="text-xs text-foreground/50 mt-2">Distinct spending buckets tracked</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-3xl border border-white/10 h-96 flex flex-col">
                <h3 className="font-bold text-lg mb-6">Expenses Over Time</h3>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '12px' }} />
                      <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border border-white/10 h-96 flex flex-col">
                <h3 className="font-bold text-lg mb-2">Expense Breakdown</h3>
                <div className="flex-1 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={filteredExpenseCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "health" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Health KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Avg. Sleep</p>
                <p className="text-4xl font-bold text-blue-400 mb-2">
                  {filteredMetrics.length > 0
                    ? (filteredMetrics.reduce((sum, m) => sum + (m.sleep || 0), 0) / filteredMetrics.length).toFixed(1)
                    : 0}h
                </p>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Avg. Mood</p>
                <p className="text-4xl font-bold text-green-400 mb-2">
                  {filteredMetrics.length > 0
                    ? Math.round(filteredMetrics.reduce((sum, m) => sum + (m.mood || 0), 0) / filteredMetrics.length)
                    : 0}/5
                </p>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Water Intake</p>
                <p className="text-4xl font-bold text-cyan-400 mb-2">
                  {filteredMetrics.reduce((sum, m) => sum + (m.water || 0), 0)}L
                </p>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Exercise</p>
                <p className="text-4xl font-bold text-pink-400 mb-2">
                  {filteredMetrics.reduce((sum, m) => sum + (m.exercise || 0), 0)}m
                </p>
              </div>
            </div>

            {/* Health Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-3xl border border-white/10 h-96 flex flex-col">
                <h3 className="font-bold text-lg mb-6">Sleep Trends</h3>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sleepTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="date" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '12px' }} />
                      <Line type="monotone" dataKey="sleep" stroke="#3b82f6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border border-white/10 h-96 flex flex-col">
                <h3 className="font-bold text-lg mb-6">Mood Distribution</h3>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={moodDistributionData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="mood" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '12px' }} />
                      <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "learning" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Learning KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Total Courses</p>
                <p className="text-4xl font-bold text-white mb-2">{courses.length}</p>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Assignments</p>
                <p className="text-4xl font-bold text-blue-400 mb-2">{assignments.length}</p>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Study Sessions</p>
                <p className="text-4xl font-bold text-purple-400 mb-2">{filteredStudySessions.length}</p>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/10">
                <p className="text-foreground/60 text-sm font-medium mb-1">Total Study Time</p>
                <p className="text-4xl font-bold text-green-400 mb-2">
                  {filteredStudySessions.reduce((sum, s) => {
                    if (s.endTime) {
                      return sum + (s.endTime.getTime() - s.startTime.getTime()) / 60000;
                    }
                    return sum;
                  }, 0).toFixed(0)}m
                </p>
              </div>
            </div>

            {/* Learning Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-3xl border border-white/10 h-96 flex flex-col">
                <h3 className="font-bold text-lg mb-6">Study Time Trends</h3>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={studyTimeTrendsData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="minutes" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudy)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border border-white/10 h-96 flex flex-col">
                <h3 className="font-bold text-lg mb-6">Course Progress</h3>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={courseProgressData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '12px' }} />
                      <Bar dataKey="progress" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Productivity Entry Modal */}
      {isAddEntryModalOpen && (
        <AddProductivityEntryModal
          onClose={() => setIsAddEntryModalOpen(false)}
          onAdd={addProductivityEntry}
        />
      )}
    </div>
  );
}

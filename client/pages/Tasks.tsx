import { useState, useEffect, useRef } from "react";
import { useTaskStore, Task, TaskStatus, TaskPriority } from "@/lib/store";
import { Plus, Trash2, Filter, Eye, Search, Calendar, Clock, Tag, Star, CheckSquare, X, Save, MoreVertical, Edit, Archive, RotateCcw, Copy, Download, Upload, BarChart3, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type View = "kanban" | "list" | "analytics";

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: "not-started", label: "To Do", color: "border-gray-400" },
  { status: "in-progress", label: "In Progress", color: "border-blue-400" },
  { status: "waiting", label: "Waiting", color: "border-yellow-400" },
  { status: "blocked", label: "Blocked", color: "border-red-400" },
  { status: "completed", label: "Completed", color: "border-green-400" },
];

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  critical: "bg-red-500/20 text-red-300 border-red-500/30",
  high: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  low: "bg-green-500/20 text-green-300 border-green-500/30",
};

const PRIORITY_ICONS: Record<TaskPriority, React.ReactNode> = {
  critical: <AlertCircle className="w-3 h-3" />,
  high: <AlertTriangle className="w-3 h-3" />,
  medium: <Info className="w-3 h-3" />,
  low: <CheckCircle2 className="w-3 h-3" />,
};

function TaskModal({
  isOpen,
  onClose,
  task,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  onSave: (taskData: Partial<Task>) => void;
}) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    category: "",
    priority: "medium" as TaskPriority,
    status: "not-started" as TaskStatus,
    repeat: "never",
    reminder: "none",
    tags: [],
    project: "",
    colorLabel: "",
    icon: "",
    notes: "",
    location: "",
    relatedLink: "",
    relatedEmail: "",
    relatedCalendarEvent: "",
    relatedNote: "",
    relatedFinanceRecord: "",
    relatedLearningTopic: "",
    relatedHealthGoal: "",
    important: false,
    personal: false,
    work: false,
    study: false,
    requiresInternet: false,
    highFocus: false,
    attachments: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "ai" | "related">("details");

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "medium",
        status: "not-started",
        repeat: "never",
        reminder: "none",
        tags: [],
        project: "",
        colorLabel: "",
        icon: "",
        notes: "",
        location: "",
        relatedLink: "",
        important: false,
        personal: false,
        work: false,
        study: false,
        requiresInternet: false,
        highFocus: false,
        attachments: [],
      });
    }
  }, [task]);

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      toast.error("Task title is required");
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-bold">{task ? "Edit Task" : "New Task"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex gap-2 border-b border-white/10 px-4">
            {[
              { id: "details", label: "Details" },
              { id: "ai", label: "AI Suggestions" },
              { id: "related", label: "Related" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/60 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "details" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter task title"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter task description"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      value={formData.priority || "medium"}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={formData.status || "not-started"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
                    >
                      <option value="not-started">Not Started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="waiting">Waiting</option>
                      <option value="blocked">Blocked</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <input
                      type="text"
                      value={formData.category || ""}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Work, Personal, etc."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Project</label>
                    <input
                      type="text"
                      value={formData.project || ""}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      placeholder="Project name"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate ? new Date(formData.startDate).toISOString().split("T")[0] : ""}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value ? new Date(e.target.value) : undefined })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate ? new Date(formData.dueDate).toISOString().split("T")[0] : ""}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value ? new Date(e.target.value) : undefined })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Due Time</label>
                    <input
                      type="time"
                      value={formData.dueTime || ""}
                      onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Estimated Duration (minutes)</label>
                    <input
                      type="number"
                      value={formData.estimatedDuration || ""}
                      onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="30"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Repeat</label>
                    <select
                      value={formData.repeat || "never"}
                      onChange={(e) => setFormData({ ...formData, repeat: e.target.value as any })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
                    >
                      <option value="never">Never</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Reminder</label>
                    <select
                      value={formData.reminder || "none"}
                      onChange={(e) => setFormData({ ...formData, reminder: e.target.value as any })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
                    >
                      <option value="none">None</option>
                      <option value="5-minutes">5 minutes before</option>
                      <option value="15-minutes">15 minutes before</option>
                      <option value="30-minutes">30 minutes before</option>
                      <option value="1-hour">1 hour before</option>
                      <option value="1-day">1 day before</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-primary/80"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                      placeholder="Add a tag"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-3 bg-primary rounded-xl hover:bg-primary/90 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: "important", label: "Important", icon: <Star className="w-4 h-4" /> },
                    { key: "personal", label: "Personal", icon: <User className="w-4 h-4" /> },
                    { key: "work", label: "Work", icon: <Briefcase className="w-4 h-4" /> },
                    { key: "study", label: "Study", icon: <BookOpen className="w-4 h-4" /> },
                    { key: "requiresInternet", label: "Needs Internet", icon: <Wifi className="w-4 h-4" /> },
                    { key: "highFocus", label: "High Focus", icon: <Brain className="w-4 h-4" /> },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData[item.key as keyof Task]
                          ? "bg-primary/20 border-primary/50"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!formData[item.key as keyof Task]}
                        onChange={(e) => setFormData({ ...formData, [item.key]: e.target.checked })}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="flex items-center gap-2 text-sm">
                        {item.icon}
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "ai" && (
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl">
                  <div className="flex items-center gap-2 text-primary font-semibold mb-3">
                    <Brain className="w-5 h-5" />
                    AI Suggestions
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-sm">Suggested Category</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, category: formData.aiSuggestedCategory || "" })}
                        className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30 transition-all"
                      >
                        {formData.aiSuggestedCategory || "Generate"}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-sm">Suggested Priority</span>
                      <button
                        type="button"
                        onClick={() => formData.aiSuggestedPriority && setFormData({ ...formData, priority: formData.aiSuggestedPriority })}
                        className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30 transition-all capitalize"
                      >
                        {formData.aiSuggestedPriority || "Generate"}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-sm">Estimated Duration</span>
                      <button
                        type="button"
                        onClick={() => formData.aiEstimatedDuration && setFormData({ ...formData, estimatedDuration: formData.aiEstimatedDuration })}
                        className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30 transition-all"
                      >
                        {formData.aiEstimatedDuration ? `${formData.aiEstimatedDuration} min` : "Generate"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "related" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Where does this take place?"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Related Link</label>
                  <input
                    type="url"
                    value={formData.relatedLink || ""}
                    onChange={(e) => setFormData({ ...formData, relatedLink: e.target.value })}
                    placeholder="https://"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 p-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-primary hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff85a2"];
    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; rotation: number }[] = [];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
      });
    }

    let frame = 0;
    const animate = () => {
      if (frame > 120) return;
      frame++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.rotation += 5;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ top: 0, left: 0 }}
    />
  );
}

function Briefcase({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function BookOpen({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function Wifi({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 20h.01" />
      <path d="M5 12.55a11 11 0 0 1 14 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    </svg>
  );
}

function User({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function Brain({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.54" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.54" />
    </svg>
  );
}

function TaskCard({ task, onEdit, onDelete }: { task: Task; onEdit: () => void; onDelete: () => void }) {
  const progress = task.subtasks.length > 0
    ? Math.round((task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100)
    : 0;

  const getRemainingTime = () => {
    if (!task.dueDate) return null;
    const now = new Date();
    const due = new Date(task.dueDate);
    const diff = due.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    return `Due in ${days} days`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 mb-3 group hover:bg-white/10 transition-all cursor-pointer border border-white/5"
      onClick={onEdit}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {task.important && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
            <h3 className={`font-medium text-sm md:text-base truncate ${task.status === "completed" ? "line-through text-foreground/50" : ""}`}>
              {task.title}
            </h3>
          </div>
          {task.description && (
            <p className="text-xs text-foreground/60 mb-2 line-clamp-2">{task.description}</p>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-1.5 hover:bg-white/10 rounded-lg"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${PRIORITY_COLORS[task.priority]}`}>
          {PRIORITY_ICONS[task.priority]}
          {task.priority}
        </span>
        {task.category && (
          <span className="text-xs px-2 py-1 bg-white/5 rounded-full border border-white/10">
            {task.category}
          </span>
        )}
        {task.project && (
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
            {task.project}
          </span>
        )}
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-foreground/60">
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-foreground/60">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {task.subtasks.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-foreground/60 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-foreground/60">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {getRemainingTime()}
            </span>
          )}
          {task.estimatedDuration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.estimatedDuration}m
            </span>
          )}
          {task.attachments.length > 0 && (
            <span className="flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              {task.attachments.length}
            </span>
          )}
          {task.subtasks.length > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3" />
              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
            </span>
          )}
        </div>
        {task.status === "completed" && task.completedAt && (
          <span className="flex items-center gap-1 text-green-400">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        )}
      </div>
    </motion.div>
  );
}

function Paperclip({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function AnalyticsView({ tasks }: { tasks: Task[] }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overdueTasks = tasks.filter(t => t.status !== "completed" && t.dueDate && new Date(t.dueDate) < new Date()).length;

  const priorityCounts = {
    critical: tasks.filter(t => t.priority === "critical").length,
    high: tasks.filter(t => t.priority === "high").length,
    medium: tasks.filter(t => t.priority === "medium").length,
    low: tasks.filter(t => t.priority === "low").length,
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Task Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-6 rounded-2xl border border-white/10">
          <p className="text-sm text-foreground/60 mb-2">Total Tasks</p>
          <p className="text-4xl font-bold">{totalTasks}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10">
          <p className="text-sm text-foreground/60 mb-2">Completed</p>
          <p className="text-4xl font-bold text-green-400">{completedTasks}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10">
          <p className="text-sm text-foreground/60 mb-2">Completion Rate</p>
          <p className="text-4xl font-bold text-primary">{completionRate}%</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10">
          <p className="text-sm text-foreground/60 mb-2">Overdue</p>
          <p className="text-4xl font-bold text-red-400">{overdueTasks}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Tasks by Priority</h3>
          <div className="space-y-3">
            {Object.entries(priorityCounts).map(([priority, count]) => (
              <div key={priority} className="flex items-center gap-3">
                <span className="w-24 text-sm capitalize">{priority}</span>
                <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      priority === "critical" ? "bg-red-500" :
                      priority === "high" ? "bg-orange-500" :
                      priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: totalTasks > 0 ? `${(count / totalTasks) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-sm font-medium w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Tasks by Status</h3>
          <div className="space-y-3">
            {COLUMNS.map((column) => {
              const count = tasks.filter(t => t.status === column.status).length;
              return (
                <div key={column.status} className="flex items-center gap-3">
                  <span className="w-28 text-sm">{column.label}</span>
                  <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: totalTasks > 0 ? `${(count / totalTasks) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [view, setView] = useState<View>("kanban");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showConfetti, setShowConfetti] = useState(false);

  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = searchQuery
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      toast.success("Task updated");
    } else {
      addTask({
        ...taskData,
        tags: taskData.tags || [],
        attachments: taskData.attachments || [],
        subtasks: [],
        comments: [],
        activity: [],
        versionHistory: [],
      } as any);
      toast.success("Task created");
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    toast.success("Task deleted");
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as TaskStatus;
    const task = tasks.find(t => t.id === taskId);

    if (task) {
      const wasCompleted = task.status === "completed";
      updateTask(taskId, {
        status: newStatus,
        completedAt: newStatus === "completed" ? new Date() : undefined,
      });

      if (newStatus === "completed" && !wasCompleted) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        toast.success("Task completed! 🎉");
      }
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col h-full">
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
        onSave={handleSaveTask}
      />

      <div className="glass border-b border-white/10">
        <div className="px-4 md:px-6 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Tasks</h1>
            <p className="text-foreground/60 text-sm">
              {filteredTasks.length} tasks • {filteredTasks.filter(t => t.status === "completed").length} completed
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-primary/50 focus:outline-none transition-all w-full sm:w-64"
              />
            </div>

            <select
              value={view}
              onChange={(e) => setView(e.target.value as View)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 cursor-pointer transition-all"
            >
              <option value="kanban">Kanban View</option>
              <option value="list">List View</option>
              <option value="analytics">Analytics</option>
            </select>

            <button
              onClick={handleAddTask}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </div>

        <div className="px-4 md:px-6 pb-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
          <span className="text-sm text-foreground/60 mr-2">Filters:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 cursor-pointer transition-all"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 cursor-pointer transition-all"
          >
            <option value="all">All Status</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="waiting">Waiting</option>
            <option value="blocked">Blocked</option>
            <option value="completed">Completed</option>
          </select>
          {(filterPriority !== "all" || filterStatus !== "all" || searchQuery) && (
            <button
              onClick={() => { setFilterPriority("all"); setFilterStatus("all"); setSearchQuery(""); }}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 cursor-pointer transition-all"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        {view === "kanban" && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 h-full">
              {COLUMNS.map((column) => (
                <div key={column.status} className="flex flex-col h-full">
                  <div className={`glass rounded-xl p-3 md:p-4 border-2 ${column.color} mb-3`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{column.label}</h3>
                      <span className="text-sm text-foreground/60 bg-white/5 px-2 py-0.5 rounded-full">
                        {filteredTasks.filter(t => t.status === column.status).length}
                      </span>
                    </div>
                  </div>
                  <Droppable droppableId={column.status}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex-1 min-h-[200px] space-y-2"
                      >
                        {filteredTasks
                          .filter((task) => task.status === column.status)
                          .map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...(provided.draggableProps.style as React.CSSProperties),
                                  }}
                                  className={snapshot.isDragging ? "opacity-80 rotate-1" : ""}
                                >
                                  <TaskCard
                                    task={task}
                                    onEdit={() => handleEditTask(task)}
                                    onDelete={() => handleDeleteTask(task.id)}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        )}

        {view === "list" && (
          <div className="space-y-3 max-w-4xl mx-auto">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-foreground/60">
                <p>No tasks found. Create one to get started!</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              ))
            )}
          </div>
        )}

        {view === "analytics" && <AnalyticsView tasks={filteredTasks} />}
      </div>
    </div>
  );
}

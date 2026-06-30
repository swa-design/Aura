import { useState, useEffect, useRef } from "react";
import { 
  BookOpen, Brain, Calendar, CheckSquare, Clock, GraduationCap, 
  LineChart, Play, Settings, Bell, BookMarked, MessageSquare, 
  Video, Mic, FileText, Download, Share2, Plus, Target, Send, 
  Trash2, Star, FileImage, File, Volume2, VolumeX, Edit, 
  MoreVertical, Archive, Folder, Tag, Check, Music, SkipBack, 
  SkipForward, Repeat, Shuffle, Zap, Award, Image as ImageIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLearningStore, useNotesStore, useTaskStore, useCalendarStore } from "@/lib/store";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";

type TimerState = "idle" | "focus" | "shortBreak" | "longBreak";

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "courses" | "assignments" | "notes" | "ai-tutor" | "productivity">("dashboard");
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<{ id: string; title: string; content: string } | null>(null);
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] = useState(false);
  const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  
  // Timer state
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);
  const [currentSession, setCurrentSession] = useState(0);
  const [todayFocusTime, setTodayFocusTime] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Music player state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);

  const { 
    aiTutorMessages, addAITutorMessage, clearAITutorMessages, 
    courses, addCourse, updateCourse, deleteCourse,
    assignments, addAssignment, updateAssignment, deleteAssignment
  } = useLearningStore();
  const { notes, addNote, updateNote } = useNotesStore();
  const { addTask } = useTaskStore();
  const { addEvent } = useCalendarStore();

  // Scroll to bottom when messages update
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiTutorMessages]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      // Timer complete
      handleTimerComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeLeft]);

  const handleTimerComplete = () => {
    setIsPlaying(false);
    if (timerState === "focus") {
      setCompletedSessions(prev => prev + 1);
      setTodayFocusTime(prev => prev + focusDuration * 60);
      if ((currentSession + 1) % sessionsBeforeLongBreak === 0) {
        setTimerState("longBreak");
        setTimeLeft(longBreakDuration * 60);
      } else {
        setTimerState("shortBreak");
        setTimeLeft(shortBreakDuration * 60);
      }
      setCurrentSession(prev => prev + 1);
      toast.success("Focus session complete! Time for a break.");
    } else {
      setTimerState("focus");
      setTimeLeft(focusDuration * 60);
      toast.success("Break over! Let's get back to work.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    addAITutorMessage({
      role: "user",
      content: userMsg,
    });

    try {
      // Built-in AI tutor responses (no API key needed)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let assistantMsg = "";
      if (userMsg.toLowerCase().includes("hi") || userMsg.toLowerCase().includes("hello")) {
        assistantMsg = "Hello! I'm your AI study tutor. How can I help you learn today? I can help with subjects like math, science, coding, and more!";
      } else if (userMsg.toLowerCase().includes("math") || userMsg.toLowerCase().includes("calculus")) {
        assistantMsg = "Great! Let's work on some math. What specific topic are you studying? Calculus, algebra, statistics, or something else?";
      } else if (userMsg.toLowerCase().includes("code") || userMsg.toLowerCase().includes("programming")) {
        assistantMsg = "Perfect! Let's dive into coding. What language or concept are you working on? I can help with Python, JavaScript, React, and more.";
      } else {
        assistantMsg = `I understand you're asking about "${userMsg}". Let's break this down together:\n\n1. First, let's define the key concepts\n2. Then, we'll work through examples\n3. Finally, we'll test your understanding\n\nWould you like me to start with the basics or dive deeper into a specific part?`;
      }

      addAITutorMessage({
        role: "assistant",
        content: assistantMsg,
      });
    } catch (error) {
      addAITutorMessage({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (speakingId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
    setSpeakingId(msgId);
  };

  const handleSaveToNotes = async (content: string) => {
    const title = "AI Tutor Notes - " + new Date().toLocaleDateString();
    addNote({
      title,
      content,
      tags: ["ai-tutor"],
    });
    toast.success("Saved to Smart Notes!");
    setIsAITutorOpen(false);
    setActiveTab("notes");
  };
  
  // Course form state
  const [newCourse, setNewCourse] = useState({
    title: "", description: "", color: "#6366F1", progress: 0,
    tags: [], lessons: []
  });
  
  const handleCreateCourse = () => {
    addCourse({
      title: newCourse.title,
      description: newCourse.description,
      color: newCourse.color,
      progress: newCourse.progress,
      tags: newCourse.tags,
      lessons: newCourse.lessons
    });
    setIsCreateCourseModalOpen(false);
    setNewCourse({
      title: "", description: "", color: "#6366F1", progress: 0,
      tags: [], lessons: []
    });
    toast.success("Course created successfully!");
  };
  
  // Assignment form state
  const [newAssignment, setNewAssignment] = useState({
    title: "", description: "", courseId: "", priority: "medium" as const,
    dueDate: "", status: "pending" as const, attachments: []
  });
  
  const handleCreateAssignment = () => {
    addAssignment({
      title: newAssignment.title,
      description: newAssignment.description,
      courseId: newAssignment.courseId,
      priority: newAssignment.priority,
      dueDate: newAssignment.dueDate ? new Date(newAssignment.dueDate) : undefined,
      status: newAssignment.status,
      attachments: newAssignment.attachments
    });
    
    // Auto-create task
    addTask({
      title: `Complete: ${newAssignment.title}`,
      description: newAssignment.description,
      status: "not-started",
      priority: newAssignment.priority,
      dueDate: newAssignment.dueDate ? new Date(newAssignment.dueDate) : undefined,
      category: "study",
      repeat: "never",
      reminder: "none",
      tags: [],
      attachments: [],
      important: false,
      personal: false,
      work: false,
      study: true,
      requiresInternet: false,
      highFocus: false
    });
    
    // Auto-create calendar event
    if (newAssignment.dueDate) {
      addEvent({
        title: `Due: ${newAssignment.title}`,
        description: newAssignment.description,
        startTime: new Date(newAssignment.dueDate),
        endTime: new Date(new Date(newAssignment.dueDate).getTime() + 60*60*1000),
      });
    }
    
    setIsCreateAssignmentModalOpen(false);
    setNewAssignment({
      title: "", description: "", courseId: "", priority: "medium",
      dueDate: "", status: "pending", attachments: []
    });
    toast.success("Assignment created and linked to Tasks/Calendar!");
  };
  
  // Note form state
  const [newNote, setNewNote] = useState({
    title: "", content: "", tags: [], folder: ""
  });
  
  const handleCreateNote = () => {
    addNote({
      ...newNote,
    });
    setIsCreateNoteModalOpen(false);
    setNewNote({
      title: "", content: "", tags: [], folder: ""
    });
    toast.success("Note created!");
  };

  return (
    <div className="flex-1 w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background flex flex-col min-h-0">
      <header className="glass border-b border-white/10 p-4 flex flex-col md:flex-row justify-between md:items-center px-4 md:px-8 gap-4 shrink-0">
        <h1 className="text-xl md:text-2xl font-bold capitalize flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-400" />
          Learning Center
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs md:text-sm font-medium">Study Streak: 0 Days</span>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full relative">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="px-4 md:px-8 pt-4 pb-4 border-b border-white/5 overflow-x-auto hide-scrollbar shrink-0">
        <div className="flex items-center gap-2 min-w-max">
          {[
            { id: "dashboard", icon: Target, label: "Overview" },
            { id: "courses", icon: BookOpen, label: "Courses" },
            { id: "assignments", icon: CheckSquare, label: "Assignments" },
            { id: "notes", icon: FileText, label: "Smart Notes" },
            { id: "productivity", icon: Play, label: "Focus Timer" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all text-xs md:text-sm font-medium ${
                activeTab === tab.id ? "bg-blue-600 text-white" : "bg-white/5 hover:bg-white/10 text-foreground/70"
              }`}
            >
              <tab.icon className="w-3 h-3 md:w-4 md:h-4" />
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => setIsAITutorOpen(true)}
            className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity font-semibold text-white shadow-lg shadow-blue-900/20 text-xs md:text-sm whitespace-nowrap ml-auto"
          >
            <Brain className="w-3 h-3 md:w-4 md:h-4" />
            Launch AI Tutor
          </button>
        </div>
      </div>

      <div className="p-4 md:p-8 flex-1 overflow-y-auto">
        {activeTab === "dashboard" && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Study Progress", value: "0%", color: "text-blue-400" },
                { label: "Focus Hours", value: "0h", color: "text-indigo-400" },
                { label: "Assignments Due", value: "0", color: "text-red-400" },
                { label: "Exam Readiness", value: "N/A", color: "text-green-400" }
              ].map((stat, i) => (
                <div key={i} className="glass p-5 rounded-2xl border border-white/10 flex flex-col">
                  <span className="text-sm text-foreground/60 mb-2">{stat.label}</span>
                  <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Weekly Plan & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" /> Weekly Study Plan
                </h3>
                <div className="p-6 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center text-sm text-foreground/50">
                  No study sessions planned yet. Add your first learning block to build a personalized weekly schedule.
                </div>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-blue-900/20 to-transparent">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-400" /> AI Recommendations
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></div>
                    <p>Create your first course or revision item so the AI tutor can personalize guidance.</p>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></div>
                    <p>Use Smart Notes and the revision hub to build a clean study system from scratch.</p>
                  </li>
                </ul>
                <button onClick={() => setIsAITutorOpen(true)} className="w-full mt-6 py-2 border border-indigo-500/50 text-indigo-300 rounded-lg text-sm hover:bg-indigo-500/10 transition-colors">
                  Ask AI Tutor
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Courses</h2>
              <button onClick={() => setIsCreateCourseModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create Course
              </button>
            </div>
            
            {courses.length === 0 ? (
              <div className="text-center py-12 glass rounded-2xl border border-white/10">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-foreground/70 mb-4">No courses yet. Start creating your study plan!</p>
                <button onClick={() => setIsCreateCourseModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                  Create First Course
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course: any) => (
                  <div key={course.id} className="glass p-5 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg">{course.name}</h3>
                      <div className="flex gap-1">
                        <button onClick={() => { setSelectedCourse(course); }} className="p-1 hover:bg-white/10 rounded">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteCourse(course.id)} className="p-1 hover:bg-white/10 rounded text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/60 mb-3">{course.subject}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${course.progress}%` }} />
                      </div>
                      <span className="text-xs text-foreground/50">{course.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "assignments" && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Assignments</h2>
              <button onClick={() => setIsCreateAssignmentModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create Assignment
              </button>
            </div>
            
            {assignments.length === 0 ? (
              <div className="text-center py-12 glass rounded-2xl border border-white/10">
                <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-foreground/70 mb-4">No assignments yet. Stay on top of your work!</p>
                <button onClick={() => setIsCreateAssignmentModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                  Create First Assignment
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {assignments.map((assignment: any) => (
                  <div key={assignment.id} className="glass p-5 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{assignment.title}</h3>
                        <p className="text-sm text-foreground/60">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { setSelectedAssignment(assignment); }} className="p-1 hover:bg-white/10 rounded">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteAssignment(assignment.id)} className="p-1 hover:bg-white/10 rounded text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/70 mb-3">{assignment.description}</p>
                    <div className="flex items-center gap-3 text-xs text-foreground/60">
                      <span className="px-2 py-1 bg-white/5 rounded-full">{assignment.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex gap-6">
            {/* Note List */}
            <div className="w-1/3 glass rounded-2xl border border-white/10 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-semibold">Notes</h3>
                <button onClick={() => setIsCreateNoteModalOpen(true)} className="p-1.5 hover:bg-white/10 rounded-lg">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {notes.length === 0 ? (
                  <div className="p-6 text-center text-sm text-foreground/50">
                    <div className="rounded-2xl border border-dashed border-white/10 p-6">
                      No notes yet. Start a fresh note to populate this workspace.
                    </div>
                  </div>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => setSelectedNote(note)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${selectedNote?.id === note.id ? "bg-blue-500/20 border border-blue-500/30" : "hover:bg-white/5"}`}
                    >
                      <div className="font-medium truncate">{note.title}</div>
                      <div className="text-xs text-foreground/50 truncate">{note.content.slice(0, 60)}...</div>
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* Note Editor */}
            <div className="flex-1 glass rounded-2xl border border-white/10 flex flex-col p-6">
              {selectedNote ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <input
                      type="text"
                      value={selectedNote.title}
                      onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                      className="bg-transparent text-2xl font-bold focus:outline-none w-full"
                    />
                    <div className="flex gap-2 shrink-0">
                      <button className="p-2 hover:bg-white/10 rounded-lg tooltip" title="Add Image">
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg tooltip" title="Record Voice">
                        <Mic className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (selectedNote.id) {
                            updateNote(selectedNote.id, { title: selectedNote.title, content: selectedNote.content });
                          } else {
                            addNote({
                              title: selectedNote.title,
                              content: selectedNote.content,
                              tags: [],
                            });
                          }
                          toast.success("Note saved!");
                        }}
                        className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-blue-500/30"
                      >
                        <Save className="w-4 h-4" /> Save
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="flex-1 bg-transparent resize-none focus:outline-none text-foreground/80 leading-relaxed font-sans"
                    value={selectedNote.content}
                    onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
                    placeholder="Capture lecture notes, summaries, and revision prompts here..."
                  ></textarea>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-foreground/50">
                  Select a note or create a new one to get started
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "productivity" && (
          <div className="max-w-4xl mx-auto">
            <div className="glass p-8 rounded-3xl border border-white/10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {timerState === "focus" ? "Focus Session" : 
                   timerState === "shortBreak" ? "Short Break" : 
                   timerState === "longBreak" ? "Long Break" : "Pomodoro Timer"}
                </h2>
                <p className="text-foreground/60">Stay focused and productive</p>
              </div>

              <div className="flex justify-center mb-8">
                <div className="w-64 h-64 md:w-80 md:h-80 border-8 border-white/5 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-[-4px] border-8 border-blue-500 rounded-full border-t-transparent border-r-transparent transform -rotate-45"></div>
                  <span className="text-7xl md:text-8xl font-light tabular-nums tracking-tighter">{formatTime(timeLeft)}</span>
                </div>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                {!isPlaying ? (
                  <button onClick={() => { setIsPlaying(true); if (timerState === "idle") setTimerState("focus"); }} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-transform hover:scale-105">
                    {timerState === "idle" ? "Start Focus" : "Resume"}
                  </button>
                ) : (
                  <button onClick={() => setIsPlaying(false)} className="px-8 py-3 bg-white/20 text-white font-bold rounded-full hover:bg-white/30 transition-transform">
                    Pause
                  </button>
                )}
                <button onClick={() => { setIsPlaying(false); setTimeLeft(timerState === "focus" ? focusDuration * 60 : timerState === "shortBreak" ? shortBreakDuration * 60 : longBreakDuration * 60); }} className="px-6 py-3 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-all flex items-center gap-2">
                  <X className="w-4 h-4" /> Reset
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="glass p-4 rounded-2xl border border-white/10 text-center">
                  <div className="text-xs text-foreground/60 mb-1">Focus</div>
                  <input type="number" value={focusDuration} onChange={(e) => setFocusDuration(Number(e.target.value))} className="w-full bg-transparent text-center text-xl font-bold focus:outline-none" />
                </div>
                <div className="glass p-4 rounded-2xl border border-white/10 text-center">
                  <div className="text-xs text-foreground/60 mb-1">Short Break</div>
                  <input type="number" value={shortBreakDuration} onChange={(e) => setShortBreakDuration(Number(e.target.value))} className="w-full bg-transparent text-center text-xl font-bold focus:outline-none" />
                </div>
                <div className="glass p-4 rounded-2xl border border-white/10 text-center">
                  <div className="text-xs text-foreground/60 mb-1">Long Break</div>
                  <input type="number" value={longBreakDuration} onChange={(e) => setLongBreakDuration(Number(e.target.value))} className="w-full bg-transparent text-center text-xl font-bold focus:outline-none" />
                </div>
                <div className="glass p-4 rounded-2xl border border-white/10 text-center">
                  <div className="text-xs text-foreground/60 mb-1">Sessions</div>
                  <div className="text-xl font-bold">{completedSessions}</div>
                </div>
              </div>

              {/* Music Player */}
              <div className="glass p-4 rounded-2xl border border-white/10">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Music className="w-4 h-4 text-blue-400" /> Background Music
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => {}} className="p-2 hover:bg-white/10 rounded-full"><SkipBack className="w-4 h-4" /></button>
                    <button onClick={() => setIsMusicPlaying(!isMusicPlaying)} className="p-3 bg-blue-600 rounded-full text-white">
                      {isMusicPlaying ? <X className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button onClick={() => {}} className="p-2 hover:bg-white/10 rounded-full"><SkipForward className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setIsShuffleOn(!isShuffleOn)} className={`p-1.5 hover:bg-white/10 rounded ${isShuffleOn ? "text-blue-400" : ""}`}>
                      <Shuffle className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsRepeatOn(!isRepeatOn)} className={`p-1.5 hover:bg-white/10 rounded ${isRepeatOn ? "text-blue-400" : ""}`}>
                      <Repeat className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-foreground/60" />
                      <input type="range" min="0" max="100" value={musicVolume * 100} onChange={(e) => setMusicVolume(Number(e.target.value) / 100)} className="w-24" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      <AnimatePresence>
        {isCreateCourseModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateCourseModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-background border border-white/20 rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Create Course</h3>
                <button onClick={() => setIsCreateCourseModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-foreground/70 block mb-1">Course Title</label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50"
                    placeholder="Introduction to Computer Science"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground/70 block mb-1">Description</label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50"
                    placeholder="Course description..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground/70 block mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newCourse.tags.join(', ')}
                    onChange={(e) => setNewCourse({ ...newCourse, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50"
                    placeholder="computer science, programming, web dev"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground/70 block mb-1">Color</label>
                  <input
                    type="color"
                    value={newCourse.color}
                    onChange={(e) => setNewCourse({ ...newCourse, color: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setIsCreateCourseModalOpen(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg">
                  Cancel
                </button>
                <button onClick={handleCreateCourse} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
                  Create Course
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Assignment Modal */}
      <AnimatePresence>
        {isCreateAssignmentModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateAssignmentModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-background border border-white/20 rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Create Assignment</h3>
                <button onClick={() => setIsCreateAssignmentModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-foreground/70 block mb-1">Title</label>
                  <input
                    type="text"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50"
                    placeholder="Assignment Title"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground/70 block mb-1">Description</label>
                  <textarea
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50"
                    placeholder="Assignment description..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground/70 block mb-1">Course ID</label>
                  <input
                    type="text"
                    value={newAssignment.courseId}
                    onChange={(e) => setNewAssignment({ ...newAssignment, courseId: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50"
                    placeholder="Related course ID (optional)"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground/70 block mb-1">Priority</label>
                  <select
                    value={newAssignment.priority}
                    onChange={(e) => setNewAssignment({ ...newAssignment, priority: e.target.value as any })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-foreground/70 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setIsCreateAssignmentModalOpen(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg">
                  Cancel
                </button>
                <button onClick={handleCreateAssignment} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
                  Create Assignment
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Note Modal */}
      <AnimatePresence>
        {isCreateNoteModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateNoteModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-background border border-white/20 rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Create Note</h3>
                <button onClick={() => setIsCreateNoteModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-foreground/70 block mb-1">Title</label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50"
                    placeholder="Note Title"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground/70 block mb-1">Tags</label>
                  <input
                    type="text"
                    value={newNote.tags.join(', ')}
                    onChange={(e) => setNewNote({ ...newNote, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50"
                    placeholder="study, math, exam"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground/70 block mb-1">Content</label>
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50"
                    placeholder="Note content..."
                    rows={4}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setIsCreateNoteModalOpen(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg">
                  Cancel
                </button>
                <button onClick={handleCreateNote} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
                  Create Note
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Tutor Slide-over Panel */}
      <AnimatePresence>
        {isAITutorOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAITutorOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed inset-y-0 right-0 w-full md:w-[480px] lg:w-[560px] bg-background border-l border-white/20 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-blue-900/20 to-indigo-900/20">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold text-lg">AI Learning Tutor</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => clearAITutorMessages()} className="p-2 hover:bg-white/10 rounded-lg text-foreground/60">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsAITutorOpen(false)} className="p-2 hover:bg-white/10 rounded-lg text-foreground/60">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                {aiTutorMessages.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-foreground/50">
                    <Brain className="w-12 h-12 mb-3 opacity-50" />
                    <p className="font-medium">Hi there!</p>
                    <p className="text-sm">Ask me anything about your studies, I'm here to help!</p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {["Explain photosynthesis", "Solve calculus derivative", "Generate study plan"].map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setInputMessage(q);
                            handleSendMessage();
                          }}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs hover:bg-white/10 transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {aiTutorMessages.map((msg, idx) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white/10 text-foreground/90 rounded-tl-sm border border-white/5"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-invert max-w-none prose-sm">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || "");
                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    style={tomorrow}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, "")}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}

                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-white/10">
                          <button
                            onClick={() => handleSpeak(msg.id, msg.content)}
                            className="p-1 hover:bg-white/10 rounded"
                            title="Listen"
                          >
                            {speakingId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleSaveToNotes(msg.content)}
                            className="p-1 hover:bg-white/10 rounded text-xs flex items-center gap-1"
                            title="Save to Notes"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setInputMessage(`Explain this part again: "${msg.content.slice(0, 50)}..."`)}
                            className="p-1 hover:bg-white/10 rounded text-xs"
                            title="Ask to explain again"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 text-foreground/90 rounded-2xl rounded-tl-sm border border-white/5 px-3 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-white/10 bg-background">
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-none">
                  {["Explain Simply", "Summarize", "Solve Step-by-Step", "Generate Notes"].map((label) => (
                    <button
                      key={label}
                      onClick={() => setInputMessage(label)}
                      className="shrink-0 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs border border-white/10"
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="relative flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask your tutor anything..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-blue-500/50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Add missing component imports
function X({ className }: { className?: string }) {
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
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  );
}

function RefreshCw({ className }: { className?: string }) {
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
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
      <path d="M21 3v5h-5"></path>
    </svg>
  );
}

function Save({ className }: { className?: string }) {
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
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Brain, Zap, Shield, Sparkles, ArrowRight, Eye, EyeOff, Check, X,
  Mail, Calendar, Heart, DollarSign, FileText, Book, Activity, Target,
  Mic, Map, PenTool, Coffee, Moon, Sun, CheckCircle, Lock,
  Globe, Fingerprint, Key, Server, Users, RefreshCw, BarChart2,
  TrendingUp, MessageSquare, Play, Layout, ChevronRight, Github, Chrome,
  Clock, Activity as ActivityIcon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// --- AUTHENTICATION COMPONENT ---
const AuthForm = ({
  variant = "hero",
  defaultMode = "signup",
}: {
  variant?: "hero" | "cta";
  defaultMode?: "signup" | "signin";
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, signIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(defaultMode === "signup");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: ""
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirm?: string;
    general?: string;
  }>({});

  useEffect(() => {
    setIsSignUp(defaultMode === "signup");
    setErrors({});
  }, [defaultMode]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const validatePassword = (pass: string) => {
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNum = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const isLongEnough = pass.length >= 8;
    return { valid: hasUpper && hasLower && hasNum && hasSpecial && isLongEnough, 
             strength: pass.length === 0 ? 0 : (hasUpper?1:0) + (hasLower?1:0) + (hasNum?1:0) + (hasSpecial?1:0) + (isLongEnough?1:0) };
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (isSignUp && !formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (isSignUp) {
      if (!validatePassword(formData.password).valid) {
        newErrors.password = "Use 8+ chars with upper, lower, number, and symbol";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirm = "Passwords do not match";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        if (isSignUp) {
          await register({
            fullName: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          });

          toast.success("Account created successfully. Sign in to continue.");
          setFormData({
            name: "",
            email: formData.email.trim().toLowerCase(),
            password: "",
            confirmPassword: "",
          });
          setShowPassword(false);
          setIsSignUp(false);
          navigate("/sign-in", { replace: true });
        } else {
          await signIn({
            email: formData.email,
            password: formData.password,
          });

          toast.success("Signed in successfully.");
          const from = (location.state as { from?: string } | null)?.from;
          navigate(from || "/dashboard", { replace: true });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Authentication failed.";
        setErrors((current) => ({ ...current, general: message }));
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  };

  const passStats = validatePassword(formData.password);
  const strengthText = passStats.strength < 3 ? "Weak" : passStats.strength < 5 ? "Medium" : "Strong";
  const strengthColor = passStats.strength < 3 ? "bg-red-500" : passStats.strength < 5 ? "bg-yellow-500" : "bg-green-500";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-8 w-full max-w-md mx-auto relative overflow-hidden ${variant === 'hero' ? 'glow-accent' : 'glow-border'}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">{isSignUp ? "Create Your AI Life" : "Welcome Back"}</h3>
          <p className="text-foreground/60 text-sm">
            {isSignUp ? "Join the future of personal orchestration" : "Sign in to access your dashboard"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({...formData, name: e.target.value});
                    if (errors.name || errors.general) {
                      setErrors((current) => ({ ...current, name: undefined, general: undefined }));
                    }
                  }}
                  className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm`}
                  required
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => {
                  setFormData({...formData, email: e.target.value});
                  if (errors.email || errors.general) {
                    setErrors((current) => ({ ...current, email: undefined, general: undefined }));
                  }
                }}
                className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm`}
                required
              />
              {formData.email.length > 0 && (
                <div className="absolute right-3 top-3.5">
                  {validateEmail(formData.email) ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                </div>
              )}
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({...formData, password: e.target.value});
                  if (errors.password || errors.general) {
                    setErrors((current) => ({ ...current, password: undefined, general: undefined }));
                  }
                }}
                className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm`}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-foreground/50 hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {isSignUp && formData.password.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(passStats.strength / 5) * 100}%` }}
                    className={`h-full ${strengthColor}`}
                  />
                </div>
                <span className={`text-xs ${strengthColor.replace('bg-', 'text-')}`}>{strengthText}</span>
              </div>
            )}
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <AnimatePresence mode="popLayout">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({...formData, confirmPassword: e.target.value});
                    if (errors.confirm || errors.general) {
                      setErrors((current) => ({ ...current, confirm: undefined, general: undefined }));
                    }
                  }}
                  className={`w-full bg-white/5 border ${errors.confirm ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm`}
                  required
                />
                {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          {isSignUp && (
            <div className="flex items-start gap-2 pt-2">
              <input type="checkbox" required className="mt-1 accent-primary" />
              <p className="text-xs text-foreground/60">
                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Notice</a>.
              </p>
            </div>
          )}

          {errors.general && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all relative overflow-hidden group"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{isSignUp ? "Creating AI Core..." : "Authenticating..."}</span>
              </div>
            ) : (
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSignUp ? "Create Account" : "Sign In"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-xs text-foreground/40 font-medium uppercase tracking-wider">Or continue with</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            type="button"
            disabled
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm opacity-50 cursor-not-allowed"
          >
            <Chrome className="w-4 h-4" /> Google
          </button>
          <button
            type="button"
            disabled
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm opacity-50 cursor-not-allowed"
          >
            <Github className="w-4 h-4" /> GitHub
          </button>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              setErrors({});
              setIsSignUp(!isSignUp);
              navigate(isSignUp ? "/sign-in" : "/register");
            }}
            className="text-sm text-foreground/60 hover:text-primary transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Create one"}
          </button>
          {!isSignUp && (
            <div className="mt-2">
              <a href="#" className="text-xs text-primary hover:underline">Forgot Password?</a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- SHOWCASE CAROUSEL ---
const PremiumShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const showcases = [
    {
      title: "AI Life Assistant",
      icon: Brain,
      color: "from-blue-500 to-indigo-500",
      content: (
        <div className="space-y-4">
          <div className="glass p-3 rounded-lg border-white/5 text-sm">
            <p className="text-foreground/80 font-medium">"I organized your next meeting, paid your upcoming bill, and planned tomorrow's workout routine."</p>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Meeting Set</span>
            <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">Bill Paid</span>
          </div>
        </div>
      )
    },
    {
      title: "Finance Intelligence",
      icon: DollarSign,
      color: "from-emerald-500 to-teal-500",
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-foreground/50 mb-1">Monthly Savings</p>
              <p className="text-2xl font-bold text-emerald-400">+$1,240</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-foreground/50 mb-1">AI Score</p>
              <p className="text-xl font-bold">94/100</p>
            </div>
          </div>
          <div className="h-16 w-full flex items-end gap-1">
            {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 bg-gradient-to-t from-emerald-500/20 to-teal-400 rounded-t-sm"
              />
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Health AI",
      icon: Heart,
      color: "from-rose-500 to-pink-500",
      content: (
        <div className="grid grid-cols-2 gap-3">
          <div className="glass p-3 rounded-lg flex flex-col items-center justify-center">
            <Activity className="w-5 h-5 text-rose-400 mb-2" />
            <span className="text-xs text-foreground/60">Heart Rate</span>
            <span className="font-bold">72 BPM</span>
          </div>
          <div className="glass p-3 rounded-lg flex flex-col items-center justify-center">
            <Moon className="w-5 h-5 text-indigo-400 mb-2" />
            <span className="text-xs text-foreground/60">Sleep</span>
            <span className="font-bold">7h 45m</span>
          </div>
        </div>
      )
    },
    {
      title: "Smart Planner",
      icon: Calendar,
      color: "from-amber-500 to-orange-500",
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-3 glass p-2 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Deep Work Block</p>
              <p className="text-xs text-foreground/50">09:00 - 11:30</p>
            </div>
          </div>
          <div className="flex items-center gap-3 glass p-2 rounded-lg opacity-60">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Team Sync</p>
              <p className="text-xs text-foreground/50">13:00 - 14:00</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Learning Hub",
      icon: Book,
      color: "from-purple-500 to-fuchsia-500",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Learning Streak</span>
            <span className="text-fuchsia-400 font-bold flex items-center gap-1"><Zap className="w-4 h-4" /> 14 Days</span>
          </div>
          <div className="glass p-3 rounded-lg text-sm border-white/5">
            <p className="text-foreground/80 mb-2 font-medium">AI Tutor: Let's review React Hooks!</p>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div className="bg-fuchsia-400 h-1.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-foreground/50 mt-1">Skill Progress: 75%</p>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[400px] w-full max-w-lg mx-auto perspective-1000">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, rotateX: 10, y: 20 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, rotateX: -10, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 glass rounded-2xl p-6 border-t border-white/20 shadow-2xl flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${showcases[activeIndex].color} flex items-center justify-center shadow-lg`}>
              {React.createElement(showcases[activeIndex].icon, { className: "w-5 h-5 text-white" })}
            </div>
            <h4 className="text-xl font-bold">{showcases[activeIndex].title}</h4>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {showcases[activeIndex].content}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
        {showcases.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-primary w-6' : 'bg-white/20'}`} 
          />
        ))}
      </div>
    </div>
  );
};

// --- ANIMATED COUNTER ---
const AnimatedCounter = ({ end, suffix = "", duration = 2 }: { end: number, suffix?: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

import { Star } from "lucide-react";

// --- LIVE ACTIVITY FEED ---
const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([
    { id: 1, text: "Meeting scheduled successfully", time: "Just now", icon: Calendar, color: "text-blue-400" },
    { id: 2, text: "Email summarized: Q3 Report", time: "2m ago", icon: Mail, color: "text-indigo-400" },
    { id: 3, text: "Workout completed", time: "15m ago", icon: ActivityIcon, color: "text-rose-400" }
  ]);

  useEffect(() => {
    const events = [
      { text: "Water goal achieved", icon: Heart, color: "text-blue-300" },
      { text: "Bills paid automatically", icon: DollarSign, color: "text-emerald-400" },
      { text: "Budget optimized for the week", icon: TrendingUp, color: "text-teal-400" },
      { text: "Calendar synced across devices", icon: RefreshCw, color: "text-purple-400" }
    ];
    let counter = 3;
    const interval = setInterval(() => {
      counter++;
      const event = events[Math.floor(Math.random() * events.length)];
      setActivities(prev => [{ id: counter, text: event.text, time: "Just now", icon: event.icon, color: event.color }, ...prev].slice(0, 4));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full mx-auto glass rounded-2xl p-6 overflow-hidden border border-white/5 shadow-2xl">
      <h4 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live AI Feed
      </h4>
      <div className="space-y-4">
        <AnimatePresence>
          {activities.map((act) => (
            <motion.div 
              key={act.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
            >
              <div className={`p-2 rounded-lg bg-black/20 ${act.color}`}>
                <act.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{act.text}</p>
                <p className="text-xs text-foreground/50">{act.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- AI PERSONALIZATION ---
const AIPersonalization = () => {
  const profiles = ["Student", "Professional", "Entrepreneur", "Freelancer", "Creator"];
  const [activeProfile, setActiveProfile] = useState(profiles[0]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {profiles.map(p => (
          <button 
            key={p} 
            onClick={() => setActiveProfile(p)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeProfile === p ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'glass hover:bg-white/10 text-foreground/70 border border-white/10'}`}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden min-h-[250px] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeProfile}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center relative z-10"
          >
            <h3 className="text-2xl font-bold mb-4">Aura OS for {activeProfile}s</h3>
            <p className="text-foreground/70 max-w-xl mx-auto leading-relaxed">
              {activeProfile === 'Student' && "Automatically schedule study blocks around your classes, track assignments seamlessly, and let the AI tutor help you master difficult subjects with personalized quizzes."}
              {activeProfile === 'Professional' && "Sync all your work calendars, auto-draft contextual email replies, and generate meeting notes instantly so you can focus entirely on high-impact deep work."}
              {activeProfile === 'Entrepreneur' && "Manage your cash flow effortlessly, orchestrate team updates across platforms, and automate repetitive operational tasks without writing a single line of code."}
              {activeProfile === 'Freelancer' && "Track billable hours automatically, generate and send client invoices, and organize project assets into a single unified workspace that adapts to you."}
              {activeProfile === 'Creator' && "Plan your content calendar seamlessly, analyze cross-platform engagement trends, and let AI suggest optimal posting times and viral hooks tailored to your audience."}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- TESTIMONIAL CAROUSEL ---
const TestimonialCarousel = () => {
  const testimonials = [
    { name: "Early Access User", role: "Professional", text: "Aura OS replaced my scattered setup with one unified workspace. The automation layer saves me hours every week." },
    { name: "Design Beta Member", role: "Creative", text: "The Smart Planner keeps my schedule fluid without losing focus time. It feels polished and genuinely useful." },
    { name: "Founder Community Member", role: "Business Builder", text: "Seeing finances, wellness, and priorities in one place gives me much more clarity day to day." }
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex(prev => (prev + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-2xl mx-auto relative h-[250px] md:h-[200px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 glass p-8 rounded-3xl border border-white/10 flex flex-col justify-center"
        >
          <div className="flex gap-1 text-yellow-500 mb-4">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
          </div>
          <p className="text-lg md:text-xl italic mb-6 text-foreground/90 font-light leading-relaxed">"{testimonials[index].text}"</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
              {testimonials[index].name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-sm">{testimonials[index].name}</p>
              <p className="text-xs text-primary">{testimonials[index].role}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- COMPARISON TABLE ---
const ComparisonTable = () => {
  const features = ["Unified Dashboard", "AI-Native Architecture", "Automated Workflows", "Cross-Domain Context", "Bank-Grade Security"];
  return (
    <div className="max-w-4xl mx-auto glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="grid grid-cols-3 border-b border-white/10 bg-white/5">
        <div className="p-6 font-bold text-lg">Feature</div>
        <div className="p-6 font-bold text-lg text-center text-foreground/50">Traditional Apps</div>
        <div className="p-6 font-bold text-lg text-center text-primary bg-primary/5">Aura OS</div>
      </div>
      {features.map((feat, i) => (
        <div key={i} className={`grid grid-cols-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors`}>
          <div className="p-4 sm:p-6 font-medium flex items-center">{feat}</div>
          <div className="p-4 sm:p-6 flex items-center justify-center">
            <X className="w-5 h-5 text-red-500/50" />
          </div>
          <div className="p-4 sm:p-6 flex items-center justify-center bg-primary/5">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
        </div>
      ))}
    </div>
  );
};

// --- FLOATING AI ASSISTANT CHAT ---
const FloatingAssistant = () => {
  const [messages, setMessages] = useState<{sender: 'user'|'ai', text: string}[]>([
    { sender: 'user', text: 'Plan my day' }
  ]);

  useEffect(() => {
    const sequence = [
      "Analyzing your habits and pending tasks...",
      "I've scheduled your 10 AM meeting.",
      "Optimized 2 hours for deep work at 1 PM.",
      "Added a gym reminder for 6 PM. All set!"
    ];
    let i = 0;
    const timer = setInterval(() => {
      if (i < sequence.length) {
        setMessages(prev => [...prev, { sender: 'ai', text: sequence[i] }]);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto glass rounded-3xl p-6 border border-white/10 shadow-2xl relative">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm">Aura AI</p>
          <p className="text-xs text-green-400 font-medium">Online</p>
        </div>
      </div>
      <div className="space-y-4 h-[250px] overflow-y-auto pr-2 custom-scrollbar">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm shadow-md ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-white/10 border border-white/5 rounded-bl-sm'}`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {messages.length < 5 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1.5 items-center px-4 py-3 bg-white/5 border border-white/5 rounded-2xl rounded-bl-sm w-fit shadow-md">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- MAIN INDEX PAGE ---
export default function Index({
  defaultAuthMode = "signup",
}: {
  defaultAuthMode?: "signup" | "signin";
}) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background overflow-hidden text-foreground selection:bg-primary/30">
      
      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            y: [0, -100, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 left-1/4 w-[900px] h-[900px] bg-accent/15 rounded-full blur-[150px]" 
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text tracking-tight">AURA OS</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-foreground/70 hover:text-foreground hidden md:block transition-colors">Capabilities</a>
              <a href="#timeline" className="text-sm font-medium text-foreground/70 hover:text-foreground hidden md:block transition-colors">Experience</a>
              <button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/sign-in')}
                className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all text-sm backdrop-blur-md border border-white/10"
              >
                {isAuthenticated ? "Open Dashboard" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content wrapper */}
      <div className="relative z-10">
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Text */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-primary/20 bg-primary/5">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">The Premium AI Operating System</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
                Your Life.<br />
                <span className="gradient-text">Perfectly Orchestrated.</span>
              </h1>
              <p className="text-lg sm:text-xl text-foreground/70 mb-8 max-w-lg leading-relaxed">
                One AI. One Dashboard. Every aspect of your life unified. From productivity and health to finance and learning—manage everything with intelligent automation.
              </p>
              
              <div className="flex items-center gap-4 text-sm font-medium text-foreground/60">
                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> No Credit Card</div>
                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Cancel Anytime</div>
              </div>
            </motion.div>

            {/* Hero Auth Form & Showcase container */}
            <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <AuthForm variant="hero" defaultMode={defaultAuthMode} />
            </div>

          </div>
        </section>

        {/* Trusted By Marquee */}
        <div className="w-full border-y border-white/5 bg-black/20 backdrop-blur-sm py-8 overflow-hidden flex relative">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
          
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-16 whitespace-nowrap px-8 opacity-50"
          >
            {/* Logos represented by stylized text/icons for demo */}
            {['Google', 'Microsoft', 'OpenAI', 'GitHub', 'Figma', 'Notion', 'Slack', 'Spotify', 'Apple'].map((brand, i) => (
              <div key={i} className="flex items-center gap-2 text-xl font-bold text-white tracking-widest uppercase">
                {brand === 'Apple' ? <Layout className="w-6 h-6" /> : <Globe className="w-6 h-6" />} {brand}
              </div>
            ))}
            {/* Repeat for seamless scroll */}
            {['Google', 'Microsoft', 'OpenAI', 'GitHub', 'Figma', 'Notion', 'Slack', 'Spotify', 'Apple'].map((brand, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-2 text-xl font-bold text-white tracking-widest uppercase">
                {brand === 'Apple' ? <Layout className="w-6 h-6" /> : <Globe className="w-6 h-6" />} {brand}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Premium Interactive Showcase Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">Experience <span className="gradient-text">True Synergy</span></h2>
            <p className="text-foreground/70 max-w-2xl mx-auto mb-16 text-lg">
              Watch as your disjointed apps and tools transform into a singular, beautifully choreographed intelligence.
            </p>
            
            <div className="mt-12">
              <PremiumShowcase />
            </div>
          </div>
        </section>

        {/* AI Statistics */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Tasks Automated", num: 10, suffix: "M+", icon: Zap },
              { label: "Active Users", num: 250, suffix: "K+", icon: Users },
              { label: "AI Accuracy", num: 99.98, suffix: "%", icon: Target },
              { label: "Hours Saved", num: 5, suffix: "M+", icon: Clock },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <stat.icon className="w-6 h-6 text-primary mb-3 opacity-80" />
                <h4 className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter end={stat.num} suffix={stat.suffix} />
                </h4>
                <p className="text-sm text-foreground/60 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive AI Capabilities Grid */}
        <section id="features" className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4">Unmatched <span className="gradient-text">Intelligence</span></h2>
              <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
                Discover the 12 pillars of Aura OS that adapt dynamically to your lifestyle.
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { icon: Mail, title: "AI Email Assistant", desc: "Drafts, summarizes, and categorizes automatically." },
                { icon: Calendar, title: "AI Calendar", desc: "Smart scheduling resolving conflicts instantly." },
                { icon: Heart, title: "AI Health Coach", desc: "Personalized fitness and nutrition plans." },
                { icon: DollarSign, title: "AI Finance Advisor", desc: "Automated budgeting and investment tips." },
                { icon: FileText, title: "AI Resume Builder", desc: "Tailors applications to job descriptions." },
                { icon: Book, title: "AI Study Planner", desc: "Optimizes learning curves and retention." },
                { icon: ActivityIcon, title: "AI Habit Tracker", desc: "Uses behavioral science for consistency." },
                { icon: Target, title: "AI Goal Manager", desc: "Breaks down life goals into daily tasks." },
                { icon: Mic, title: "AI Voice Assistant", desc: "Hands-free orchestration of your dashboard." },
                { icon: Map, title: "AI Travel Planner", desc: "Books, schedules, and creates itineraries." },
                { icon: PenTool, title: "AI Journal", desc: "Mood analysis and deep reflection prompts." },
                { icon: Coffee, title: "AI Meal Planner", desc: "Generates recipes based on macros and fridge." }
              ].map((feat, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  key={i}
                  className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-2 group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <feat.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold mb-2 relative z-10">{feat.title}</h3>
                  <p className="text-sm text-foreground/60 relative z-10">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Animated Daily Timeline */}
        <section id="timeline" className="py-32 px-4 sm:px-6 lg:px-8 relative bg-black/40 border-y border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold mb-16 text-center">A Day With <span className="gradient-text">Aura</span></h2>
            
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/50 before:to-transparent">
              
              {[
                { time: "Morning", title: "Wake Up & Prepare", desc: "Aura already planned your breakfast macros, synced your gym routine, and briefed you on the day's first meetings.", icon: Sun, color: "text-amber-400", align: "left" },
                { time: "Afternoon", title: "Deep Work & Optimization", desc: "Aura summarized a missed meeting, filed a business expense, and drafted 3 critical email replies while you focused.", icon: Target, color: "text-blue-400", align: "right" },
                { time: "Evening", title: "Wind Down & Review", desc: "Reviewing your daily health score, optimizing tomorrow's budget, and setting the smart thermostat for sleep.", icon: Moon, color: "text-indigo-400", align: "left" }
              ].map((event, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: event.align === 'left' ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-glass glass shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10`}>
                    <event.icon className={`w-4 h-4 ${event.color}`} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-colors">
                    <span className={`text-xs font-bold uppercase tracking-wider ${event.color} mb-2 block`}>{event.time}</span>
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-foreground/70 text-sm">{event.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Live AI Activity Feed & Personalization */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Real-Time <span className="gradient-text">Orchestration</span></h2>
              <p className="text-foreground/70 mb-12 text-lg">
                Your dashboard is alive. Aura OS constantly works in the background to optimize your life, saving you hours every single day.
              </p>
              <LiveActivityFeed />
            </div>
            <div className="w-full">
              <AIPersonalization />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-16">What Our Users <span className="gradient-text">Say</span></h2>
            <TestimonialCarousel />
          </div>
        </section>

        {/* Comparison & Floating Assistant */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Why <span className="gradient-text">Aura OS?</span></h2>
              <p className="text-foreground/70 mb-12 text-lg">
                Stop switching between 10 different apps. Aura OS brings everything into one intelligent, unified workspace.
              </p>
              <ComparisonTable />
            </div>
            <div>
              <FloatingAssistant />
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-white/5 bg-black/40">
          <div className="max-w-5xl mx-auto text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-12">Military-Grade Privacy</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { text: "AES-256 Encryption", icon: Lock },
                { text: "Zero Knowledge Privacy", icon: EyeOff },
                { text: "OAuth Authentication", icon: Key },
                { text: "SOC 2 Ready", icon: Server },
                { text: "Biometric Ready", icon: Fingerprint }
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-white/10"
                >
                  <badge.icon className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Begin Your Next Chapter</h2>
            <p className="text-foreground/70 mb-12 max-w-2xl mx-auto text-lg">
              No credit card required. Experience the power of total life orchestration in seconds.
            </p>
            <div className="max-w-md mx-auto">
              <AuthForm variant="cta" defaultMode={defaultAuthMode} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 bg-background z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold tracking-tight">AURA OS</span>
            </div>
            <div className="flex gap-6 text-sm text-foreground/60">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Security</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
            <p className="text-foreground/60 text-sm">© 2026 AURA OS. All rights reserved.</p>
          </div>
        </footer>

      </div>
    </div>
  );
}

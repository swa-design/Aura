import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Settings,
  LogOut,
  Home,
  Calendar,
  CheckSquare,
  Mail,
  FileText,
  DollarSign,
  Heart,
  BookOpen,
  Users,
  Zap,
  BarChart3,
  Command,
  Moon,
  Sun,
  X,
  UserRound,
  Palette,
} from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import type { ThemePreference } from "@/lib/store";

interface MenuItem {
  icon: any;
  label: string;
  href: string;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: Mail, label: "Emails", href: "/emails" },
  { icon: FileText, label: "Notes", href: "/notes" },
  { icon: DollarSign, label: "Finance", href: "/finance" },
  { icon: Heart, label: "Health", href: "/health" },
  { icon: BookOpen, label: "Learning", href: "/learning" },
  { icon: Users, label: "Family", href: "/family" },
  { icon: Zap, label: "Automation", href: "/automation" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: UserRound, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, updatePreferences } = useAuth();

  if (!user) {
    return null;
  }

  const themeOrder: ThemePreference[] = ["dark", "light", "blue"];
  const currentTheme = user.preferences.theme;
  const currentThemeIndex = themeOrder.indexOf(currentTheme);
  const nextTheme = themeOrder[(currentThemeIndex + 1) % themeOrder.length];

  const handleThemeCycle = async () => {
    await updatePreferences({ theme: nextTheme });
  };

  const handleSignOut = () => {
    signOut();
    navigate("/sign-in", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen glass border-r border-white/10 transition-all duration-300 z-50 
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            {(sidebarOpen || mobileMenuOpen) && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Command className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text whitespace-nowrap">AURA</span>
              </div>
            )}
            
            {/* Desktop Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:block p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Close */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {MENU_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-white/10"
                  }`}
                  title={!sidebarOpen && !mobileMenuOpen ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {(sidebarOpen || mobileMenuOpen) && (
                    <span className="font-medium whitespace-nowrap">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-3 hover:bg-white/10 rounded-xl transition-all flex items-center gap-3"
            >
              <UserAvatar
                name={user.name}
                avatar={user.avatar}
                className="w-10 h-10 shrink-0"
                textClassName="text-base"
              />
              {(sidebarOpen || mobileMenuOpen) && (
                <div className="min-w-0 text-left">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-xs text-foreground/50 truncate">{user.email}</p>
                </div>
              )}
            </Link>
            <button 
              onClick={() => void handleThemeCycle()}
              className="w-full p-3 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center gap-3"
              title={!sidebarOpen && !mobileMenuOpen ? "Cycle Theme" : undefined}
            >
              {currentTheme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : currentTheme === "light" ? (
                <Palette className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              {(sidebarOpen || mobileMenuOpen) && (
                <span className="font-medium capitalize">Theme: {currentTheme}</span>
              )}
            </button>
            <button 
              onClick={handleSignOut}
              className="w-full p-3 hover:bg-white/10 rounded-xl transition-all text-red-400 flex items-center justify-center gap-3"
              title={!sidebarOpen && !mobileMenuOpen ? "Log Out" : undefined}
            >
              <LogOut className="w-5 h-5" />
              {(sidebarOpen || mobileMenuOpen) && <span className="font-medium">Log Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 w-full md:w-auto ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
        {/* Top Bar */}
        <div className="glass border-b border-white/10 sticky top-0 z-30 bg-background/80 backdrop-blur-md">
          <div className="px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex-1 max-w-md hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/50" />
                  <input
                    type="text"
                    placeholder="Search or ask AI (Cmd+K)"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 ml-4 md:ml-6">
              <button className="sm:hidden p-2 hover:bg-white/10 rounded-lg transition-all">
                <Search className="w-5 h-5" />
              </button>
              <Link to="/settings" className="hidden sm:block p-2 hover:bg-white/10 rounded-lg transition-all">
                <Settings className="w-5 h-5" />
              </Link>
              <Link to="/profile" className="flex-shrink-0">
                <UserAvatar
                  name={user.name}
                  avatar={user.avatar}
                  className="w-8 h-8 md:w-10 md:h-10 shadow-lg shadow-primary/20"
                  textClassName="text-sm md:text-base"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[calc(100vh-73px)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

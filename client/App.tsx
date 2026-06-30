import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Finance from "./pages/Finance";
import Health from "./pages/Health";
import Notes from "./pages/Notes";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
import Emails from "./pages/Emails";
import Learning from "./pages/Learning";
import Family from "./pages/Family";
import Automation from "./pages/Automation";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      themes={["dark", "light", "blue"]}
    >
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index defaultAuthMode="signup" />} />
              <Route path="/sign-in" element={<Index defaultAuthMode="signin" />} />
              <Route path="/register" element={<Index defaultAuthMode="signup" />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/finance" element={<Finance />} />
                  <Route path="/health" element={<Health />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/emails" element={<Emails />} />
                  <Route path="/learning" element={<Learning />} />
                  <Route path="/family" element={<Family />} />
                  <Route path="/automation" element={<Automation />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Profile initialSection="theme" />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

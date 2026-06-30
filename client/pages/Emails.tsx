import { useState, useMemo, useEffect } from "react";
import { 
  Menu, Trash2, ArrowLeft, Mail, Search, Star, Archive, Filter, 
  AlertCircle, Edit, Calendar, Clock, Paperclip, Send, Brain, 
  CheckCircle, Users, Activity, Settings, Zap, Inbox, LogIn
} from "lucide-react";
import { toast } from "sonner";
import { useEmailStore, type Email as EmailStoreType, type EmailCategory } from "@/lib/store";

export default function EmailsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<EmailCategory>("primary");
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [gmailLabels, setGmailLabels] = useState<any[]>([]);
  const [gmailEmails, setGmailEmails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // UI State for advanced features
  const [isComposing, setIsComposing] = useState(false);
  const [activeTab, setActiveTab] = useState<"inbox" | "analytics" | "automation" | "contacts">("inbox");
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  
  // Compose State
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  const { 
    emails, 
    addEmail, 
    updateEmail, 
    deleteEmail, 
    markAsRead, 
    markAsUnread, 
    toggleStar, 
    moveToCategory 
  } = useEmailStore();

  // Handle OAuth login
  const handleConnectGmail = async () => {
    try {
      const res = await fetch("/api/gmail/auth-url");
      const data = await res.json();
      window.location.href = data.url;
    } catch (error) {
      toast.error("Failed to connect Gmail");
    }
  };

  // Fetch Gmail labels
  const fetchLabels = async () => {
    try {
      const res = await fetch("/api/gmail/labels");
      const data = await res.json();
      setGmailLabels(data.labels || []);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch labels:", error);
    }
  };

  // Fetch Gmail emails
  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      // Map selected category to Gmail label IDs
      let labelIds = [];
      if (selectedCategory === "primary") labelIds = ["INBOX"];
      if (selectedCategory === "sent") labelIds = ["SENT"];
      if (selectedCategory === "archive") labelIds = ["ARCHIVE"];
      if (selectedCategory === "trash") labelIds = ["TRASH"];
      if (selectedCategory === "spam") labelIds = ["SPAM"];

      const res = await fetch(`/api/gmail/emails?labelIds=${labelIds.join(",")}`);
      const data = await res.json();
      setGmailEmails(data.messages || []);
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send email via Gmail API
  const handleSendGmail = async () => {
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
      toast.error("Add a recipient, subject, and message before sending.");
      return;
    }

    try {
      await fetch("/api/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: composeTo,
          subject: composeSubject,
          body: composeBody
        })
      });
      toast.success("Email sent successfully!");
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");
      setIsComposing(false);
      fetchEmails();
    } catch (error) {
      toast.error("Failed to send email");
    }
  };

  // Fetch data when category changes or on load
  useEffect(() => {
    fetchLabels();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEmails();
    }
  }, [isAuthenticated, selectedCategory]);

  // Convert Gmail message to page format
  const normalizedGmailEmails = useMemo(() => {
    return gmailEmails.map(msg => {
      // Extract headers
      const headers = msg.payload?.headers || [];
      const fromHeader = headers.find((h: any) => h.name === "From")?.value || "";
      const subject = headers.find((h: any) => h.name === "Subject")?.value || "(No Subject)";
      const date = headers.find((h: any) => h.name === "Date")?.value ? new Date(headers.find((h: any) => h.name === "Date")?.value) : new Date();
      
      // Extract body
      let body = "";
      if (msg.payload?.parts) {
        const textPart = msg.payload.parts.find((p: any) => p.mimeType === "text/plain");
        const htmlPart = msg.payload.parts.find((p: any) => p.mimeType === "text/html");
        const partToUse = htmlPart || textPart;
        if (partToUse?.body?.data) {
          body = Buffer.from(partToUse.body.data, "base64").toString();
        }
      } else if (msg.payload?.body?.data) {
        body = Buffer.from(msg.payload.body.data, "base64").toString();
      }

      return {
        id: msg.id,
        from: fromHeader,
        fromObject: { email: fromHeader, name: fromHeader },
        subject,
        preview: body.substring(0, 80),
        fullBody: body,
        body,
        date,
        isRead: !msg.labelIds?.includes("UNREAD"),
        isStarred: msg.labelIds?.includes("STARRED"),
        isImportant: msg.labelIds?.includes("IMPORTANT"),
        category: selectedCategory,
        labels: msg.labelIds || [],
        attachments: [],
        hasAttachment: msg.payload?.parts?.some((p: any) => p.filename && p.filename.length > 0) || false,
      };
    });
  }, [gmailEmails, selectedCategory]);

  const filteredEmails = useMemo(() => {
    let filtered = normalizedGmailEmails;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.subject.toLowerCase().includes(lowerQuery) ||
          (typeof e.from === 'string' ? e.from.toLowerCase().includes(lowerQuery) : false)
      );
    }
    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [normalizedGmailEmails, searchQuery]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/gmail/emails/${id}/modify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ removeLabelIds: ["UNREAD"] })
      });
      fetchEmails();
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleToggleStar = async (id: string) => {
    const isStarred = normalizedGmailEmails.find(e => e.id === id)?.isStarred;
    try {
      await fetch(`/api/gmail/emails/${id}/modify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addLabelIds: isStarred ? [] : ["STARRED"],
          removeLabelIds: isStarred ? ["STARRED"] : []
        })
      });
      fetchEmails();
    } catch (error) {
      toast.error("Failed to update star status");
    }
  };

  const handleMoveToCategory = (id: string, newCategory: EmailCategory) => {
    // Map to Gmail labels
    let addLabelIds: string[] = [];
    let removeLabelIds: string[] = [];
    
    if (newCategory === "archive") {
      removeLabelIds = ["INBOX"];
    } else if (newCategory === "trash") {
      addLabelIds = ["TRASH"];
      removeLabelIds = ["INBOX"];
    } else if (newCategory === "spam") {
      addLabelIds = ["SPAM"];
      removeLabelIds = ["INBOX"];
    }

    fetch(`/api/gmail/emails/${id}/modify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addLabelIds, removeLabelIds })
    }).then(() => {
      fetchEmails();
      if (selectedEmail === id) setSelectedEmail(null);
    });
  };
  
  const handleSnooze = (id: string) => {
    // For now, just mark as unread
    toast.info("Snooze feature coming soon!");
  };

  const handleAISmartReply = () => {
    setIsAIGenerating(true);
    setTimeout(() => {
      setIsComposing(true);
      setComposeTo(typeof selectedEmailData?.from === 'string' 
        ? selectedEmailData.from 
        : (selectedEmailData?.fromObject?.email || ""));
      setComposeSubject(`Re: ${selectedEmailData?.subject}`);
      setComposeBody("Hi there,\n\nThanks for reaching out! I've received your message and will review the details shortly. Let me know if you need anything else in the meantime.\n\nBest regards,");
      setIsAIGenerating(false);
    }, 1500);
  };

  const selectedEmailData = normalizedGmailEmails.find((e) => e.id === selectedEmail);
  const inboxCount = normalizedGmailEmails.length;
  const unreadCount = normalizedGmailEmails.filter((email) => !email.isRead).length;
  const sentCount = 0;
  const automationCount = 0;

  const handleSendCompose = isAuthenticated ? handleSendGmail : () => {
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
      toast.error("Add a recipient, subject, and message before sending.");
      return;
    }

    addEmail({
      threadId: Date.now().toString(),
      from: { name: "You", email: "you@example.com" },
      to: [{ name: "", email: composeTo.trim() }],
      subject: composeSubject.trim(),
      preview: composeBody.trim().slice(0, 80),
      body: composeBody.trim(),
      date: new Date(),
      isRead: true,
      isStarred: false,
      isImportant: false,
      category: "sent",
      labels: [],
      attachments: [],
      hasAttachment: false,
    });
    setComposeTo("");
    setComposeSubject("");
    setComposeBody("");
    setIsComposing(false);
    setActiveTab("inbox");
    setSelectedCategory("sent");
    toast.success("Message saved to Sent.");
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col min-h-0 bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="glass border-b border-white/10 p-4 z-30 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold md:text-2xl">Mail Center</h1>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 md:pb-0 w-full md:w-auto">
            {!isAuthenticated ? (
              <button 
                onClick={handleConnectGmail}
                className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0 text-sm"
              >
                <LogIn className="w-4 h-4" /> Connect Gmail
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setIsComposing(true)}
                  className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0 text-sm"
                >
                  <Edit className="w-4 h-4" /> Compose
                </button>
                <div className="w-px h-6 bg-white/20 mx-1 shrink-0"></div>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 text-sm shrink-0 ${
                    activeTab === "analytics" ? "bg-primary/20 text-primary font-medium" : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Activity className="w-4 h-4" /> <span className="hidden sm:inline">Analytics</span>
                </button>
                <button
                  onClick={() => setActiveTab("automation")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 text-sm shrink-0 ${
                    activeTab === "automation" ? "bg-primary/20 text-primary font-medium" : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Zap className="w-4 h-4" /> <span className="hidden sm:inline">Automation</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Folders & Search */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 overflow-x-auto hide-scrollbar flex items-center gap-2 pb-1 md:pb-0">
            {[
              { id: "primary", icon: Inbox, label: "Primary" },
              { id: "promotions", icon: Star, label: "Promotions" },
              { id: "social", icon: Users, label: "Social" },
              { id: "updates", icon: Activity, label: "Updates" },
              { id: "sent", icon: Send, label: "Sent" },
              { id: "archive", icon: Archive, label: "Archive" },
              { id: "trash", icon: Trash2, label: "Trash" },
              { id: "spam", icon: AlertCircle, label: "Spam" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab("inbox"); setSelectedCategory(item.id as any); }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 shrink-0 text-xs md:text-sm font-medium ${
                  selectedCategory === item.id && activeTab === "inbox" ? "bg-primary text-white" : "bg-white/5 hover:bg-white/10 text-foreground/80"
                }`}
              >
                <item.icon className="w-3 h-3 md:w-4 md:h-4" /> {item.label}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in mail..."
              className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>
      </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === "inbox" && (
            <div className="h-full flex">
              {/* Email List */}
              <div className={`border-r border-white/10 flex flex-col h-full bg-background/50 backdrop-blur-sm transition-all duration-300 ${selectedEmail ? 'w-1/3 hidden lg:flex' : 'w-full'}`}>
                <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                  <h2 className="font-semibold capitalize text-lg">{selectedCategory}</h2>
                  <button className="p-1 hover:bg-white/10 rounded transition-all text-foreground/60"><Filter className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredEmails.length === 0 ? (
                    <div className="p-8 text-center text-foreground/40 flex flex-col items-center">
                      <Mail className="w-12 h-12 mb-3 opacity-20" />
                      <p>No emails here</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {filteredEmails.map((email) => (
                        <div
                          key={email.id}
                          onClick={() => { setSelectedEmail(email.id); handleMarkAsRead(email.id); }}
                          className={`w-full p-4 text-left cursor-pointer transition-all hover:bg-white/5 group relative ${
                            selectedEmail === email.id ? "bg-white/10" : ""
                          }`}
                        >
                          {/* Quick Actions (Hover) */}
                          <div className="absolute right-4 top-4 hidden group-hover:flex items-center gap-1 bg-background/90 p-1 rounded-lg shadow-sm border border-white/10">
                            <button onClick={(e) => { e.stopPropagation(); handleMoveToCategory(email.id, 'archive'); }} className="p-1.5 hover:bg-white/10 rounded text-foreground/70"><Archive className="w-4 h-4" /></button>
                            <button onClick={(e) => { e.stopPropagation(); handleMoveToCategory(email.id, 'trash'); }} className="p-1.5 hover:bg-white/10 rounded text-foreground/70"><Trash2 className="w-4 h-4" /></button>
                            <button onClick={(e) => { e.stopPropagation(); handleSnooze(email.id); }} className="p-1.5 hover:bg-white/10 rounded text-foreground/70"><Clock className="w-4 h-4" /></button>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="pt-1">
                              {!email.isRead && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline mb-0.5">
                                <p className={`font-medium truncate pr-4 ${!email.isRead ? "text-foreground" : "text-foreground/70"}`}>
                                  {email.from}
                                </p>
                                <span className="text-xs text-foreground/40 shrink-0">
                                  {email.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              <p className={`text-sm truncate mb-1 ${!email.isRead ? "text-foreground font-medium" : "text-foreground/70"}`}>
                                {email.subject}
                              </p>
                              <p className="text-xs text-foreground/50 truncate">
                                {email.preview}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Detail Panel */}
              <div className={`flex-1 flex flex-col h-full bg-background/30 transition-all ${!selectedEmail ? 'hidden lg:flex' : 'flex'}`}>
                {selectedEmailData ? (
                  <>
                    {/* Detail Toolbar */}
                    <div className="p-3 border-b border-white/10 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedEmail(null)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg mr-2"><ArrowLeft className="w-4 h-4" /></button>
                        <button onClick={() => handleMoveToCategory(selectedEmailData.id, 'archive')} className="p-2 hover:bg-white/10 rounded-lg text-foreground/70 tooltip" title="Archive"><Archive className="w-4 h-4" /></button>
                        <button onClick={() => handleMoveToCategory(selectedEmailData.id, 'trash')} className="p-2 hover:bg-white/10 rounded-lg text-foreground/70 tooltip" title="Trash"><Trash2 className="w-4 h-4" /></button>
                        <button onClick={() => handleSnooze(selectedEmailData.id)} className="p-2 hover:bg-white/10 rounded-lg text-foreground/70 tooltip" title="Snooze"><Clock className="w-4 h-4" /></button>
                        <div className="w-px h-4 bg-white/10 mx-2"></div>
                        <button onClick={() => handleMoveToCategory(selectedEmailData.id, 'spam')} className="p-2 hover:bg-white/10 rounded-lg text-foreground/70 tooltip" title="Report Spam"><AlertCircle className="w-4 h-4" /></button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={handleAISmartReply} className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 text-primary text-sm font-medium rounded-lg hover:bg-primary/30 transition-all">
                          <Brain className="w-4 h-4" /> AI Smart Reply
                        </button>
                      </div>
                    </div>

                    {/* Detail Content */}
                    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                      <div className="max-w-3xl mx-auto">
                        <div className="flex justify-between items-start mb-8">
                          <h1 className="text-2xl font-bold leading-tight mr-4">{selectedEmailData.subject}</h1>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => handleToggleStar(selectedEmailData.id)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                              <Star className={`w-5 h-5 ${selectedEmailData.isStarred ? "fill-accent text-accent" : "text-foreground/40"}`} />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg">
                              {selectedEmailData.from.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{selectedEmailData.from}</p>
                              <p className="text-xs text-foreground/50">to me</p>
                            </div>
                          </div>
                          <p className="text-sm text-foreground/50">
                            {selectedEmailData.date.toLocaleString()}
                          </p>
                        </div>



                        <div className="prose prose-invert max-w-none prose-sm">
                          <div className="whitespace-pre-wrap text-foreground/80 leading-relaxed font-sans">
                            {selectedEmailData.fullBody}
                          </div>
                        </div>

                        {selectedEmailData.hasAttachment && (
                          <div className="mt-8 pt-6 border-t border-white/10">
                            <h3 className="text-sm font-semibold mb-3">Attachments (1)</h3>
                            <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg max-w-sm hover:bg-white/10 transition-all cursor-pointer">
                              <div className="w-10 h-10 bg-primary/20 text-primary rounded flex items-center justify-center">
                                <Paperclip className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">Document.pdf</p>
                                <p className="text-xs text-foreground/50">2.4 MB</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-foreground/30 h-full">
                    <Mail className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg">Select an email to read</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="p-8 h-full overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Inbox Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass p-6 rounded-2xl">
                  <p className="text-sm text-foreground/60 mb-2">Inbox Health Score</p>
                  <p className="text-4xl font-bold text-accent">
                    {emails.length === 0 ? "0%" : `${Math.max(0, 100 - unreadCount * 12)}%`}
                  </p>
                  <p className="text-xs text-foreground/40 mt-2">{unreadCount} unread messages</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                  <p className="text-sm text-foreground/60 mb-2">Primary Inbox</p>
                  <p className="text-4xl font-bold">{inboxCount}</p>
                  <p className="text-xs text-foreground/40 mt-2">Active primary messages</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                  <p className="text-sm text-foreground/60 mb-2">Sent + Automated</p>
                  <p className="text-4xl font-bold">{sentCount + automationCount}</p>
                  <p className="text-xs text-foreground/40 mt-2">Messages and AI actions</p>
                </div>
              </div>
              <div className="glass p-8 rounded-2xl h-64 flex items-center justify-center border border-white/10">
                <p className="text-foreground/50">
                  {emails.length === 0
                    ? "No email history yet. Your analytics will appear as your inbox grows."
                    : "Email analytics visualization will reflect your live mailbox activity here."}
                </p>
              </div>
            </div>
          )}

          {activeTab === "automation" && (
            <div className="p-8 h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Email Automation Rules</h2>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm">Create Rule</button>
              </div>
              <div className="grid gap-4">
                <div className="glass p-5 rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Extract Meetings</p>
                      <p className="text-xs text-foreground/60">Create calendar events from future meeting emails</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                  </div>
                </div>
                <div className="glass p-5 rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Trash2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Auto-Clean Promo</p>
                      <p className="text-xs text-foreground/60">Archive stale promotional mail after 30 days</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      {/* Compose Modal */}
      {isComposing && (
        <div className="fixed bottom-0 right-24 w-[500px] bg-background border border-white/20 rounded-t-xl shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom">
          <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between rounded-t-xl">
            <span className="font-medium text-sm">New Message</span>
            <button onClick={() => setIsComposing(false)} className="p-1 hover:bg-white/10 rounded">&times;</button>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="To" 
              value={composeTo}
              onChange={(e) => setComposeTo(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 pb-2 text-sm focus:outline-none focus:border-primary/50" 
            />
            <input 
              type="text" 
              placeholder="Subject" 
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 pb-2 text-sm font-medium focus:outline-none focus:border-primary/50" 
            />
            <div className="flex gap-2 mt-2">
              <button className="text-xs px-2 py-1 bg-primary/20 text-primary rounded flex items-center gap-1 hover:bg-primary/30">
                <Brain className="w-3 h-3" /> AI Draft
              </button>
              <button className="text-xs px-2 py-1 bg-white/5 rounded flex items-center gap-1 hover:bg-white/10">
                <Activity className="w-3 h-3" /> Tone: Professional
              </button>
            </div>
            <textarea 
              placeholder="Write your message..." 
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              className="w-full h-64 bg-transparent resize-none text-sm focus:outline-none mt-2 font-sans text-foreground/80 leading-relaxed"
            ></textarea>
          </div>
          <div className="px-4 py-3 bg-white/5 border-t border-white/10 flex justify-between items-center">
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white/10 rounded text-foreground/60 tooltip" title="Formatting"><Edit className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-white/10 rounded text-foreground/60 tooltip" title="Attach"><Paperclip className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-white/10 rounded text-foreground/60 tooltip" title="Schedule"><Clock className="w-4 h-4" /></button>
            </div>
            <button
              onClick={handleSendCompose}
              className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center gap-2 hover:bg-primary/90"
            >
              Send <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Global AI Loading Overlay */}
      {isAIGenerating && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-background border border-white/20 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
            <Brain className="w-10 h-10 text-primary animate-pulse" />
            <p className="font-medium animate-pulse">AI is generating response...</p>
          </div>
        </div>
      )}
    </div>
  );
}

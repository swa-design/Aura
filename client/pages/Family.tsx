import { useState, useEffect } from "react";
import { 
  Users, Calendar, CheckSquare, MessageCircle, Heart, DollarSign, 
  Home, Plus, ShoppingCart, Activity,
  Settings, MapPin, Send, Image as ImageIcon, X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFamilyStore, useUserStore } from "../lib/store";

export default function FamilyPage() {
  const [activeTab, setActiveTab] = useState<"workspace" | "communication" | "health" | "home">("workspace");
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [chatMsg, setChatMsg] = useState("");
  const [newShoppingItem, setNewShoppingItem] = useState("");
  const navigate = useNavigate();

  const {
    familyGroup,
    familyInvitations,
    familyChatMessages,
    shoppingLists,
    householdTasks,
    medications,
    addFamilyInvitation,
    addFamilyMember,
    updateFamilyMember,
    addFamilyChatMessage,
    updateFamilyChatMessage,
    deleteFamilyChatMessage,
    addMessageReaction,
    addShoppingList,
    addShoppingListItem,
    updateShoppingListItem,
    deleteShoppingListItem,
    toggleShoppingListItemPurchased,
    addHouseholdTask,
    updateHouseholdTask,
    deleteHouseholdTask,
    toggleHouseholdTaskStatus,
  } = useFamilyStore();

  const { user } = useUserStore();

  // Ensure we have a default shopping list
  useEffect(() => {
    if (shoppingLists.length === 0) {
      addShoppingList({ title: "Family Shopping List", isShared: true });
    }
  }, [shoppingLists.length, addShoppingList]);

  const handleAddMember = () => {
    if (!newMemberName || !newMemberEmail || !user) return;
    addFamilyInvitation({ name: newMemberName, email: newMemberEmail, invitedBy: user.id });
    setIsAddMemberModalOpen(false);
    setNewMemberName("");
    setNewMemberEmail("");
  };

  const handleSendChat = () => {
    if (!chatMsg || !user) return;
    addFamilyChatMessage({ senderId: user.id, content: chatMsg, type: "text" });
    setChatMsg("");
  };

  const handleAddShoppingItem = () => {
    if (!newShoppingItem || !user) return;
    
    let listId = mainShoppingList.id;
    if (!listId || shoppingLists.length === 0) {
      // Create a default list first
      addShoppingList({ title: "Family Shopping List", isShared: true });
      return; // We'll get the new list on next render
    }
    
    addShoppingListItem(listId, {
      title: newShoppingItem,
      quantity: 1,
      priority: "medium",
      purchased: false,
      addedBy: user.id,
      addedAt: new Date(),
    });
    setNewShoppingItem("");
  };

  const mainShoppingList = shoppingLists[0] || { id: "", title: "Family Shopping List", items: [], isShared: true, createdAt: new Date() };

  return (
    <div className="flex-1 w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-900/10 via-background to-background">
      <header className="glass border-b border-white/10 p-4 flex flex-col md:flex-row justify-between md:items-center px-4 md:px-8 gap-4">
        <h1 className="text-xl md:text-2xl font-bold capitalize flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-400" />
          Family Hub
        </h1>
        <div className="flex items-center gap-4 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar w-full md:w-auto">
          <div className="flex -space-x-3 shrink-0">
            {familyGroup?.members.map((m) => (
              <div key={m.id} className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center bg-white/10 text-sm tooltip" title={m.name}>
                {m.avatar || m.name.charAt(0).toUpperCase()}
              </div>
            ))}
            <button 
              onClick={() => setIsAddMemberModalOpen(true)}
              className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center bg-white/5 hover:bg-white/10 text-xs shrink-0"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full shrink-0">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="px-4 md:px-8 pt-4 pb-4 border-b border-white/5 overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {[
            { id: "workspace", icon: Users, label: "Shared Space" },
            { id: "communication", icon: MessageCircle, label: "Family Chat" },
            { id: "home", icon: Home, label: "Home Mgmt" },
            { id: "health", icon: Activity, label: "Health & Meds" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all text-xs md:text-sm font-medium ${
                activeTab === tab.id ? "bg-pink-500 text-white" : "bg-white/5 hover:bg-white/10 text-foreground/70"
              }`}
            >
              <tab.icon className="w-3 h-3 md:w-4 md:h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
          {activeTab === "workspace" && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Daily Briefing & Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass p-6 rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">Good morning, Family!</h2>
                  <p className="text-foreground/70 mb-6">Invite family members or housemates to begin sharing plans, checklists, and household coordination in one place.</p>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => navigate("/calendar")}
                      className="px-4 py-2 bg-pink-500/20 text-pink-400 rounded-lg text-sm font-medium hover:bg-pink-500/30"
                    >
                      View Calendar
                    </button>
                    <button 
                      onClick={() => navigate("/finance")}
                      className="px-4 py-2 bg-white/5 rounded-lg text-sm font-medium hover:bg-white/10"
                    >
                      Pay Bills
                    </button>
                  </div>
                </div>
                
                <div className="glass p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-400"/> Family Locations</h3>
                  <div className="space-y-4">
                    {!familyGroup || familyGroup.members.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-foreground/50">
                        No members connected yet.
                      </div>
                    ) : (
                      familyGroup.members.map(m => (
                        <div key={m.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{m.avatar || m.name.charAt(0).toUpperCase()}</span>
                            <span className="text-sm font-medium">{m.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-foreground/70">
                              {m.locationSharingEnabled ? (m.location?.address || "Location available") : "Location disabled"}
                            </p>
                            {m.batteryLevel && (
                              <p className="text-[10px] text-green-400">🔋 {m.batteryLevel}%</p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Shopping List */}
              <div className="glass p-6 rounded-3xl border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-green-400" /> Shared Shopping List</h3>
                </div>
                <div className="space-y-2 mb-4">
                  {mainShoppingList?.items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-foreground/50">
                      Your shared shopping list is empty.
                    </div>
                  ) : (
                    mainShoppingList.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              if (mainShoppingList.id) {
                                toggleShoppingListItemPurchased(mainShoppingList.id, item.id, user?.id || "");
                              }
                            }}
                            className={`w-5 h-5 rounded border flex items-center justify-center ${
                              item.purchased ? "bg-green-500/20 border-green-500" : "border-white/20"
                            }`}
                          >
                            {item.purchased && <CheckSquare className="w-3 h-3 text-green-400" />}
                          </button>
                          <span className={`text-sm ${item.purchased ? "line-through text-foreground/50" : ""}`}>
                            {item.title}
                          </span>
                        </div>
                        <div className="text-xs text-foreground/50">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add item..." 
                    value={newShoppingItem}
                    onChange={(e) => setNewShoppingItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddShoppingItem()}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-pink-500/50"
                  />
                  <button 
                    onClick={handleAddShoppingItem}
                    className="px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "communication" && (
            <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col glass rounded-3xl border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center"><Users className="w-5 h-5 text-pink-400"/></div>
                  <div>
                    <h3 className="font-semibold">Shared Family Chat</h3>
                    <p className="text-xs text-foreground/50">{familyChatMessages.length} messages</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {familyChatMessages.length > 0 && <div className="text-center text-xs text-foreground/40 my-4">Today</div>}
                {familyChatMessages.length === 0 && (
                  <div className="h-full flex items-center justify-center text-sm text-foreground/45">
                    Start the first shared conversation in this workspace.
                  </div>
                )}
                {familyChatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                    {msg.senderId !== user?.id && <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2 text-xs">
                      {familyGroup?.members.find(m => m.id === msg.senderId)?.name.charAt(0) || "U"}
                    </div>}
                    <div className="max-w-[70%]">
                      {msg.senderId !== user?.id && <p className="text-xs text-foreground/50 mb-1 ml-1">
                        {familyGroup?.members.find(m => m.id === msg.senderId)?.name || "Unknown"}
                      </p>}
                      <div className={`p-3 rounded-2xl text-sm ${
                        msg.senderId === user?.id ? 'bg-pink-600 text-white rounded-tr-sm' : 'bg-white/10 rounded-tl-sm'
                      }`}>
                        {msg.content}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className={`text-[10px] text-foreground/40 ${msg.senderId === user?.id ? 'text-right mr-1' : 'ml-1'}`}>
                          {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex gap-1">
                            {msg.reactions.map((r, idx) => (
                              <span key={idx} className="text-xs">{r.emoji}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-white/10 bg-background/50">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white/10 rounded-full text-foreground/60"><ImageIcon className="w-5 h-5" /></button>
                  <input 
                    type="text" 
                    value={chatMsg}
                    onChange={(e) => setChatMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder="Type a message..." 
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 focus:outline-none focus:border-pink-500/50"
                  />
                  <button onClick={handleSendChat} className="p-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition-colors"><Send className="w-5 h-5 ml-0.5" /></button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "home" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Household Tasks</h2>
                <button 
                  onClick={() => {
                    if (user) {
                      addHouseholdTask({
                        title: "New Task",
                        assignedTo: [user.id],
                        priority: "medium",
                        status: "not-started",
                      });
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 text-pink-400 rounded-lg text-sm font-medium hover:bg-pink-500/30"
                >
                  <Plus className="w-4 h-4" /> Add Task
                </button>
              </div>
              
              <div className="space-y-4">
                {householdTasks.length === 0 ? (
                  <div className="glass p-8 rounded-3xl border border-white/10 text-center text-foreground/50">
                    <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No household tasks yet</p>
                    <p className="text-sm">Create your first household task to get started</p>
                  </div>
                ) : (
                  householdTasks.map(task => (
                    <div key={task.id} className="glass p-6 rounded-3xl border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => toggleHouseholdTaskStatus(task.id)}
                            className={`w-6 h-6 rounded border flex items-center justify-center ${
                              task.status === "completed" ? "bg-green-500/20 border-green-500" : "border-white/20"
                            }`}
                          >
                            {task.status === "completed" && <CheckSquare className="w-4 h-4 text-green-400" />}
                          </button>
                          <div>
                            <h3 className={`font-semibold ${task.status === "completed" ? "line-through text-foreground/50" : ""}`}>
                              {task.title}
                            </h3>
                            <p className="text-xs text-foreground/50">
                              Assigned to: {task.assignedTo.map(id => 
                                familyGroup?.members.find(m => m.id === id)?.name || "Unknown"
                              ).join(", ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-1 hover:bg-white/10 rounded text-foreground/50">
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {task.description && (
                        <p className="text-sm text-foreground/70 mb-4">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {task.priority === "high" && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">High Priority</span>
                        )}
                        {task.priority === "medium" && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Medium Priority</span>
                        )}
                        {task.priority === "low" && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Low Priority</span>
                        )}
                        {task.dueDate && (
                          <span className="px-2 py-1 bg-white/5 text-foreground/60 text-xs rounded-full">
                            Due: {task.dueDate.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "health" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Health & Medications</h2>
                <button 
                  onClick={() => navigate("/health")}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 text-pink-400 rounded-lg text-sm font-medium hover:bg-pink-500/30"
                >
                  Go to Health Module
                </button>
              </div>
              <div className="glass p-8 rounded-3xl border border-white/10 text-center text-foreground/50">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Your Health Information</p>
                <p className="text-sm">Access your health records, medications, and wellness data in the Health module</p>
              </div>
            </div>
          )}
      </div>

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass p-6 rounded-3xl border border-white/10 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Add Family Member</h3>
              <button 
                onClick={() => setIsAddMemberModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground/70">Name</label>
                <input 
                  type="text" 
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-500/50"
                  placeholder="Enter member's name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground/70">Email</label>
                <input 
                  type="email" 
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-500/50"
                  placeholder="Enter member's email"
                />
              </div>
              <button 
                onClick={handleAddMember}
                className="w-full py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

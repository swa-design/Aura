import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  Check,
  Mail,
  MapPin,
  Moon,
  Palette,
  Phone,
  Save,
  Sun,
  Trash2,
  UserRound,
  Briefcase,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import UserAvatar from "@/components/common/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import type { ThemePreference } from "@/lib/store";

type Section = "profile" | "theme";

interface ProfilePageProps {
  initialSection?: Section;
}

interface ProfileDraft {
  name: string;
  email: string;
  bio: string;
  occupation: string;
  organization: string;
  location: string;
  phone: string;
  avatar: string | null;
}

const THEME_OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  description: string;
  icon: typeof Moon;
  previewClass: string;
}> = [
  {
    value: "dark",
    label: "Dark Mode",
    description: "The default cinematic AURA experience.",
    icon: Moon,
    previewClass: "bg-[radial-gradient(circle_at_top,#7c3aed_0%,#111827_45%,#020617_100%)]",
  },
  {
    value: "light",
    label: "Light Mode",
    description: "Bright glass panels with softer contrast.",
    icon: Sun,
    previewClass: "bg-[radial-gradient(circle_at_top,#bfdbfe_0%,#f8fafc_55%,#e2e8f0_100%)]",
  },
  {
    value: "blue",
    label: "Blue Theme",
    description: "Cool neon blues with a futuristic control-room feel.",
    icon: Palette,
    previewClass: "bg-[radial-gradient(circle_at_top,#38bdf8_0%,#1d4ed8_45%,#0f172a_100%)]",
  },
];

export default function ProfilePage({ initialSection = "profile" }: ProfilePageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user, updateProfile, updatePreferences } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>(initialSection);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [draft, setDraft] = useState<ProfileDraft>({
    name: "",
    email: "",
    bio: "",
    occupation: "",
    organization: "",
    location: "",
    phone: "",
    avatar: null,
  });
  const [accentColor, setAccentColor] = useState("#7c3aed");

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setDraft({
      name: user.name,
      email: user.email,
      bio: user.bio,
      occupation: user.occupation,
      organization: user.organization,
      location: user.location,
      phone: user.phone ?? "",
      avatar: user.avatar ?? null,
    });
    setAccentColor(user.preferences.accentColor ?? "#7c3aed");
  }, [user]);

  const profileCompleteness = useMemo(() => {
    const values = [
      draft.name,
      draft.email,
      draft.bio,
      draft.occupation,
      draft.organization,
      draft.location,
      draft.phone,
    ];
    const completed = values.filter((value) => value.trim().length > 0).length;
    return Math.round((completed / values.length) * 100);
  }, [draft]);

  if (!user) {
    return null;
  }

  const handleAvatarFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      setDraft((current) => ({ ...current, avatar: result }));
      toast.success("Avatar ready to save.");
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async () => {
    setIsSavingProfile(true);
    try {
      await updateProfile(draft);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleThemeSelect = async (theme: ThemePreference) => {
    setIsSavingTheme(true);
    try {
      await updatePreferences({ theme });
      toast.success(`${THEME_OPTIONS.find((option) => option.value === theme)?.label} applied.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update theme.");
    } finally {
      setIsSavingTheme(false);
    }
  };

  const handleAccentApply = async () => {
    setIsSavingTheme(true);
    try {
      await updatePreferences({ accentColor });
      toast.success("Accent color updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update accent color.");
    } finally {
      setIsSavingTheme(false);
    }
  };

  const handlePreferenceToggle = async (
    key: "notifications" | "emailDigest",
    value: boolean,
  ) => {
    try {
      await updatePreferences({ [key]: value });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update preferences.");
    }
  };

  return (
    <div className="flex-1 w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <div className="glass rounded-[2rem] border border-white/10 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <UserAvatar
                name={draft.name || user.name}
                avatar={draft.avatar}
                className="w-20 h-20 md:w-24 md:h-24 shadow-xl shadow-primary/20"
                textClassName="text-3xl md:text-4xl"
              />
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-foreground/50 mb-2">
                  Personal Profile
                </p>
                <h1 className="text-3xl md:text-4xl font-bold">{draft.name || user.name}</h1>
                <p className="text-foreground/60 mt-2 max-w-xl">
                  Keep your account details, profile identity, and visual preferences in sync
                  across your workspace.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 min-w-[260px]">
              <div className="glass rounded-2xl p-4 border border-white/10">
                <p className="text-xs uppercase tracking-wider text-foreground/50 mb-2">
                  Profile Completion
                </p>
                <p className="text-3xl font-bold">{profileCompleteness}%</p>
              </div>
              <div className="glass rounded-2xl p-4 border border-white/10">
                <p className="text-xs uppercase tracking-wider text-foreground/50 mb-2">
                  Active Theme
                </p>
                <p className="text-3xl font-bold capitalize">{user.preferences.theme}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveSection("profile")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeSection === "profile"
                  ? "bg-primary text-white"
                  : "bg-white/5 hover:bg-white/10 text-foreground/70"
              }`}
            >
              Profile Details
            </button>
            <button
              onClick={() => setActiveSection("theme")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeSection === "theme"
                  ? "bg-primary text-white"
                  : "bg-white/5 hover:bg-white/10 text-foreground/70"
              }`}
            >
              Theme Settings
            </button>
          </div>
        </div>

        {activeSection === "profile" && (
          <div className="grid lg:grid-cols-[320px,1fr] gap-6">
            <div className="glass rounded-[2rem] border border-white/10 p-6 space-y-4">
              <h2 className="text-xl font-bold">Avatar</h2>
              <p className="text-sm text-foreground/60">
                Upload a profile photo or keep the generated monogram avatar.
              </p>

              <div className="pt-2 flex flex-col items-center gap-4">
                <UserAvatar
                  name={draft.name || user.name}
                  avatar={draft.avatar}
                  className="w-32 h-32 shadow-2xl shadow-primary/20"
                  textClassName="text-5xl"
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void handleAvatarFile(file);
                    }
                  }}
                />

                <div className="w-full space-y-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    {draft.avatar ? "Replace Picture" : "Upload Picture"}
                  </button>
                  <button
                    onClick={() => setDraft((current) => ({ ...current, avatar: null }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-foreground/80 font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Picture
                  </button>
                </div>
              </div>
            </div>

            <div className="glass rounded-[2rem] border border-white/10 p-6 md:p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-sm text-foreground/60 flex items-center gap-2">
                    <UserRound className="w-4 h-4" />
                    Full Name
                  </span>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-foreground/60 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </span>
                  <input
                    type="email"
                    value={draft.email}
                    onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-foreground/60 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Occupation
                  </span>
                  <input
                    type="text"
                    value={draft.occupation}
                    onChange={(event) => setDraft((current) => ({ ...current, occupation: event.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-foreground/60 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    College / Organization
                  </span>
                  <input
                    type="text"
                    value={draft.organization}
                    onChange={(event) => setDraft((current) => ({ ...current, organization: event.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-foreground/60 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </span>
                  <input
                    type="text"
                    value={draft.location}
                    onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-foreground/60 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    value={draft.phone}
                    onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </label>
              </div>

              <label className="space-y-2 block">
                <span className="text-sm text-foreground/60">Bio / About Me</span>
                <textarea
                  value={draft.bio}
                  onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 resize-none"
                />
              </label>

              <div className="flex justify-end">
                <button
                  onClick={handleProfileSave}
                  disabled={isSavingProfile}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {isSavingProfile ? (
                    <>
                      <Check className="w-4 h-4 animate-pulse" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === "theme" && (
          <div className="space-y-6">
            <div className="glass rounded-[2rem] border border-white/10 p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-2">Theme Settings</h2>
              <p className="text-foreground/60 mb-6">
                Pick the look of your workspace. Theme changes apply instantly and follow your
                account on future sign-ins.
              </p>

              <div className="grid lg:grid-cols-3 gap-4">
                {THEME_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isActive = user.preferences.theme === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => void handleThemeSelect(option.value)}
                      className={`text-left rounded-[1.5rem] border p-4 transition-all ${
                        isActive
                          ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className={`h-28 rounded-2xl ${option.previewClass} border border-white/10`} />
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {option.label}
                          </p>
                          <p className="text-sm text-foreground/60 mt-1">{option.description}</p>
                        </div>
                        {isActive && <Check className="w-5 h-5 text-primary shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.4fr,1fr] gap-6">
              <div className="glass rounded-[2rem] border border-white/10 p-6 md:p-8">
                <h3 className="text-xl font-bold mb-2">Accent Customization</h3>
                <p className="text-sm text-foreground/60 mb-6">
                  Fine-tune the primary glow color while keeping the existing premium layout intact.
                </p>

                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  <label className="flex items-center gap-4 glass rounded-2xl border border-white/10 px-4 py-3">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(event) => setAccentColor(event.target.value)}
                      className="w-12 h-12 bg-transparent border-none cursor-pointer"
                    />
                    <div>
                      <p className="font-medium">Custom Accent</p>
                      <p className="text-sm text-foreground/60">{accentColor}</p>
                    </div>
                  </label>

                  <button
                    onClick={() => void handleAccentApply()}
                    disabled={isSavingTheme}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all font-medium"
                  >
                    Apply Accent
                  </button>
                </div>
              </div>

              <div className="glass rounded-[2rem] border border-white/10 p-6 md:p-8 space-y-5">
                <div>
                  <h3 className="text-xl font-bold mb-2">Preferences</h3>
                  <p className="text-sm text-foreground/60">
                    Keep essential account behavior synced to your profile.
                  </p>
                </div>

                {[
                  {
                    key: "notifications" as const,
                    label: "In-app notifications",
                    description: "Show alerts and updates throughout the workspace.",
                    enabled: user.preferences.notifications,
                  },
                  {
                    key: "emailDigest" as const,
                    label: "Email digest",
                    description: "Receive account summaries and preference-based updates.",
                    enabled: user.preferences.emailDigest,
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 border border-white/10 px-4 py-4"
                  >
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-foreground/60">{item.description}</p>
                    </div>
                    <button
                      onClick={() => void handlePreferenceToggle(item.key, !item.enabled)}
                      className={`w-14 h-8 rounded-full transition-all relative ${
                        item.enabled ? "bg-primary" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${
                          item.enabled ? "left-7" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

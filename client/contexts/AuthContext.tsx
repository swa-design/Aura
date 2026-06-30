import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTheme } from "next-themes";
import {
  resetUserWorkspace,
  syncAllUserStores,
  type ThemePreference,
  type UserProfile,
  useUserStore,
} from "@/lib/store";

interface AuthSessionRecord {
  userId: string;
  token: string;
  createdAt: string;
}

interface AuthAccountRecord {
  id: string;
  email: string;
  passwordSalt: string;
  passwordHash: string;
  createdAt: string;
  profile: UserProfile;
}

interface AuthStorage {
  accounts: AuthAccountRecord[];
  session: AuthSessionRecord | null;
}

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

interface ProfileUpdatePayload {
  name?: string;
  email?: string;
  bio?: string;
  occupation?: string;
  organization?: string;
  location?: string;
  phone?: string;
  avatar?: string | null;
}

interface PreferenceUpdatePayload {
  theme?: ThemePreference;
  accentColor?: string | null;
  notifications?: boolean;
  emailDigest?: boolean;
}

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (payload: RegisterPayload) => Promise<void>;
  signIn: (payload: SignInPayload) => Promise<void>;
  signOut: () => void;
  updateProfile: (payload: ProfileUpdatePayload) => Promise<UserProfile>;
  updatePreferences: (payload: PreferenceUpdatePayload) => Promise<UserProfile>;
}

const AUTH_STORAGE_KEY = "aura-os-auth-v1";
const DEFAULT_THEME: ThemePreference = "dark";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const canUseStorage = () => typeof window !== "undefined" && !!window.localStorage;

const createId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isHexColor = (value: string) => /^#[0-9a-f]{6}$/i.test(value);

const readAuthStorage = (): AuthStorage => {
  if (!canUseStorage()) {
    return { accounts: [], session: null };
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return { accounts: [], session: null };
    }

    const parsed = JSON.parse(raw) as AuthStorage;
    return {
      accounts: Array.isArray(parsed.accounts) ? parsed.accounts : [],
      session: parsed.session ?? null,
    };
  } catch {
    return { accounts: [], session: null };
  }
};

const writeAuthStorage = (storage: AuthStorage) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(storage));
};

const createDefaultProfile = (id: string, fullName: string, email: string): UserProfile => ({
  id,
  name: fullName.trim(),
  email: normalizeEmail(email),
  avatar: null,
  bio: "",
  occupation: "",
  organization: "",
  location: "",
  phone: "",
  preferences: {
    theme: DEFAULT_THEME,
    accentColor: null,
    notifications: true,
    emailDigest: true,
  },
});

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const hexToHslChannels = (hex: string) => {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;

  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));

    switch (max) {
      case r:
        hue = ((g - b) / delta) % 6;
        break;
      case g:
        hue = (b - r) / delta + 2;
        break;
      default:
        hue = (r - g) / delta + 4;
        break;
    }
  }

  const finalHue = Math.round((hue * 60 + 360) % 360);
  const finalSaturation = Math.round(saturation * 100);
  const finalLightness = Math.round(lightness * 100);

  return {
    h: finalHue,
    s: finalSaturation,
    l: finalLightness,
  };
};

const applyAccentColor = (accentColor?: string | null) => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const vars = ["--primary", "--secondary", "--accent", "--ring"];

  if (!accentColor || !isHexColor(accentColor)) {
    vars.forEach((variable) => root.style.removeProperty(variable));
    return;
  }

  const { h, s, l } = hexToHslChannels(accentColor);
  const primary = `${h} ${clamp(s, 65, 92)}% ${clamp(l, 42, 58)}%`;
  const secondary = `${(h + 18) % 360} ${clamp(s, 68, 95)}% ${clamp(l + 6, 48, 64)}%`;
  const accent = `${(h + 42) % 360} 88% 48%`;

  root.style.setProperty("--primary", primary);
  root.style.setProperty("--secondary", secondary);
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--ring", primary);
};

const hashPassword = async (password: string, salt: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setTheme } = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyUserState = useCallback(
    (nextUser: UserProfile | null) => {
      setUser(nextUser);
      useUserStore.getState().setUser(nextUser);
      syncAllUserStores(nextUser?.id ?? null);
      applyAccentColor(nextUser?.preferences.accentColor);
      setTheme(nextUser?.preferences.theme ?? DEFAULT_THEME);
    },
    [setTheme],
  );

  useEffect(() => {
    const hydrate = async () => {
      const storage = readAuthStorage();
      const activeSession = storage.session;
      const activeAccount = activeSession
        ? storage.accounts.find((account) => account.id === activeSession.userId)
        : undefined;

      applyUserState(activeAccount?.profile ?? null);
      setIsLoading(false);
    };

    hydrate();
  }, [applyUserState]);

  const register = useCallback(
    async ({ fullName, email, password, confirmPassword }: RegisterPayload) => {
      const trimmedName = fullName.trim();
      const normalizedEmail = normalizeEmail(email);

      if (!trimmedName) {
        throw new Error("Full name is required.");
      }

      if (!isValidEmail(normalizedEmail)) {
        throw new Error("Enter a valid email address.");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      const storage = readAuthStorage();
      const existingAccount = storage.accounts.find(
        (account) => normalizeEmail(account.email) === normalizedEmail,
      );

      if (existingAccount) {
        throw new Error("An account with this email already exists.");
      }

      const id = createId();
      const passwordSalt = createId();
      const passwordHash = await hashPassword(password, passwordSalt);
      const profile = createDefaultProfile(id, trimmedName, normalizedEmail);

      storage.accounts.push({
        id,
        email: normalizedEmail,
        passwordSalt,
        passwordHash,
        createdAt: new Date().toISOString(),
        profile,
      });

      writeAuthStorage(storage);
      resetUserWorkspace(id);
    },
    [],
  );

  const signIn = useCallback(
    async ({ email, password }: SignInPayload) => {
      const normalizedEmail = normalizeEmail(email);
      const storage = readAuthStorage();
      const account = storage.accounts.find(
        (candidate) => normalizeEmail(candidate.email) === normalizedEmail,
      );

      if (!account) {
        throw new Error("No account found for this email address.");
      }

      const passwordHash = await hashPassword(password, account.passwordSalt);
      if (passwordHash !== account.passwordHash) {
        throw new Error("Incorrect email or password.");
      }

      storage.session = {
        userId: account.id,
        token: createId(),
        createdAt: new Date().toISOString(),
      };

      writeAuthStorage(storage);
      applyUserState(account.profile);
    },
    [applyUserState],
  );

  const signOut = useCallback(() => {
    const storage = readAuthStorage();
    storage.session = null;
    writeAuthStorage(storage);
    applyUserState(null);
  }, [applyUserState]);

  const updateAccount = useCallback(
    async (
      updater: (account: AuthAccountRecord, storage: AuthStorage) => AuthAccountRecord,
    ): Promise<UserProfile> => {
      if (!user) {
        throw new Error("You must be signed in to update your profile.");
      }

      const storage = readAuthStorage();
      const accountIndex = storage.accounts.findIndex((account) => account.id === user.id);

      if (accountIndex < 0) {
        throw new Error("Your account could not be found.");
      }

      const nextAccount = updater(storage.accounts[accountIndex], storage);
      storage.accounts[accountIndex] = nextAccount;
      writeAuthStorage(storage);
      applyUserState(nextAccount.profile);
      return nextAccount.profile;
    },
    [applyUserState, user],
  );

  const updateProfile = useCallback(
    async (payload: ProfileUpdatePayload) =>
      updateAccount((account, storage) => {
        const nextEmail = payload.email ? normalizeEmail(payload.email) : account.profile.email;
        if (!isValidEmail(nextEmail)) {
          throw new Error("Enter a valid email address.");
        }

        const emailOwner = storage.accounts.find(
          (candidate) =>
            candidate.id !== account.id &&
            normalizeEmail(candidate.email) === normalizeEmail(nextEmail),
        );

        if (emailOwner) {
          throw new Error("Another account is already using that email.");
        }

        const nextProfile: UserProfile = {
          ...account.profile,
          ...payload,
          name: payload.name?.trim() || account.profile.name,
          email: nextEmail,
          phone: payload.phone ?? account.profile.phone,
        };

        if (!nextProfile.name.trim()) {
          throw new Error("Full name is required.");
        }

        return {
          ...account,
          email: nextEmail,
          profile: nextProfile,
        };
      }),
    [updateAccount],
  );

  const updatePreferences = useCallback(
    async (payload: PreferenceUpdatePayload) =>
      updateAccount((account) => ({
        ...account,
        profile: {
          ...account.profile,
          preferences: {
            ...account.profile.preferences,
            ...payload,
          },
        },
      })),
    [updateAccount],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      register,
      signIn,
      signOut,
      updateProfile,
      updatePreferences,
    }),
    [isLoading, register, signIn, signOut, updatePreferences, updateProfile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}

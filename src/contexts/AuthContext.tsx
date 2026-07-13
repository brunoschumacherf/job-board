import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

/**
 * Auth context scaffold for future Firebase Authentication.
 * Currently exposes an anonymous/local session placeholder.
 */
interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Placeholder for future sign-in */
  signIn: () => Promise<void>;
  /** Placeholder for future sign-out */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const LOCAL_USER: AuthUser = {
  uid: 'local-user',
  displayName: 'Usuário local',
  email: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState<AuthUser | null>(LOCAL_USER);
  const [isLoading] = useState(false);

  const signIn = useCallback(async () => {
    // Ready for Firebase Auth (signInWithPopup / signInWithEmailAndPassword)
    console.info('[Auth] signIn placeholder — integrate Firebase Authentication here');
  }, []);

  const signOut = useCallback(async () => {
    console.info('[Auth] signOut placeholder — integrate Firebase Authentication here');
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signIn,
      signOut,
    }),
    [user, isLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

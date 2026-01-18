"use client";

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useCallback,
  ReactNode 
} from "react";
import { getAdminMe } from "@/lib/services/auth-service";
import type { User, UserRole, Admin } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Transform Admin → User dengan validasi UserRole
  const transformAdminToUser = (admin: Admin): User => {
    // Validasi role sesuai UserRole union type
    const role: UserRole = (admin.role as UserRole) || 'admin';
    
    if (!['admin', 'user'].includes(role)) {
      throw new Error(`Invalid role: ${admin.role}. Expected: admin|user`);
    }

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: role as UserRole,
      avatar: admin.avatar
    };
  };

  const initializeAuth = useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Instant load dari cache
      const cachedUser = localStorage.getItem("admin_user");
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser) as User;
          // Double-check role validity
          if (parsedUser.role && ['admin', 'user'].includes(parsedUser.role)) {
            setUser(parsedUser);
          }
        } catch {
        }
      }

      // Server validation
      const adminData = await getAdminMe();
      const userData = transformAdminToUser(adminData);
      
      localStorage.setItem("admin_user", JSON.stringify(userData));
      setUser(userData);
      
    } catch (error: unknown) {
      console.error("Auth restore failed:", error);
      
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      document.cookie = "admin_token=; path=/; max-age=0";
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const logout = useCallback((): void => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    document.cookie = "admin_token=; path=/; max-age=0";
    setUser(null);
    window.location.href = "/adminbma/login";
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

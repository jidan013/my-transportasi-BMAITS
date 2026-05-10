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
  refetch: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  logout: () => {},
  refetch: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const transformAdminToUser = useCallback((admin: Admin): User => {
    // Validasi role sesuai UserRole union type
    let role: UserRole = 'admin'; // Default to admin
    
    if (admin.role === 'user') {
      role = 'user';
    } else if (admin.role === 'admin') {
      role = 'admin';
    }
    
    if (!['admin', 'user'].includes(role)) {
      console.warn(`Unknown role: ${admin.role}, defaulting to admin`);
    }

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: role,
    };
  }, []);

  // FIXED: Move all initialization logic inside useEffect
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          if (isMounted) {
            setLoading(false);
            setUser(null);
          }
          return;
        }

        // Instant load dari cache
        const cachedUser = localStorage.getItem("admin_user");
        if (cachedUser && isMounted) {
          try {
            const parsedUser = JSON.parse(cachedUser) as User;
            // Double-check role validity
            if (parsedUser.role && ['admin', 'user'].includes(parsedUser.role)) {
              setUser(parsedUser);
            }
          } catch (error) {
            console.error("Failed to parse cached user:", error);
          }
        }

        // Server validation
        const adminData = await getAdminMe();
        
        if (!isMounted) return;
        
        const userData = transformAdminToUser(adminData);
        
        localStorage.setItem("admin_user", JSON.stringify(userData));
        setUser(userData);
        
      } catch (error: unknown) {
        console.error("Auth restore failed:", error);
        
        if (isMounted) {
          // Clear invalid auth data
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          document.cookie = "admin_token=; path=/; max-age=0";
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [transformAdminToUser]);

  const logout = useCallback((): void => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    document.cookie = "admin_token=; path=/; max-age=0";
    setUser(null);
    window.location.href = "/adminbma/login";
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }

      const adminData = await getAdminMe();
      const userData = transformAdminToUser(adminData);
      
      localStorage.setItem("admin_user", JSON.stringify(userData));
      setUser(userData);
    } catch (error: unknown) {
      console.error("Refetch failed:", error);
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      document.cookie = "admin_token=; path=/; max-age=0";
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [transformAdminToUser]);

  const value: AuthContextType = {
    user,
    loading,
    logout,
    refetch,
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
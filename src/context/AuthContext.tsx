import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'alumni' | 'department';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll check against our mock data
      const usersJSON = localStorage.getItem('users');
      const users = usersJSON ? JSON.parse(usersJSON) : [];
      
      const foundUser = users.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      const authenticatedUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      const usersJSON = localStorage.getItem('users');
      const users = usersJSON ? JSON.parse(usersJSON) : [];
      
      // Check if email already exists
      if (users.some((u: any) => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password, // In a real app, this would be hashed
        role
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Also add to the respective table based on role
      if (role === 'student' || role === 'alumni') {
        const tableKey = role === 'student' ? 'students' : 'alumni';
        const tableJSON = localStorage.getItem(tableKey);
        const table = tableJSON ? JSON.parse(tableJSON) : [];
        
        const newRecord = {
          id: newUser.id,
          name: name,
          email: email,
          graduationYear: role === 'alumni' ? new Date().getFullYear() - Math.floor(Math.random() * 10) : new Date().getFullYear() + Math.floor(Math.random() * 4),
          department: ['Computer Science', 'Engineering', 'Business', 'Arts'][Math.floor(Math.random() * 4)],
          ...(role === 'alumni' ? {
            company: ['Google', 'Microsoft', 'Amazon', 'Apple', 'Facebook'][Math.floor(Math.random() * 5)],
            position: ['Software Engineer', 'Product Manager', 'Data Scientist', 'Designer', 'Marketing'][Math.floor(Math.random() * 5)],
          } : {})
        };
        
        table.push(newRecord);
        localStorage.setItem(tableKey, JSON.stringify(table));
      }
      
      const authenticatedUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
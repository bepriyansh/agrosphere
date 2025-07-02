import { createContext } from 'react';
import type { AuthResponse, IUser } from '../api/types';

interface AuthContextType {
  user: IUser | null;
  login: (userData: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

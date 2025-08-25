// types/auth.ts
import { UserCredential } from "firebase/auth";

export type UserRole = 'admin' | 'user' | 'manager';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  role: UserRole;
  department?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string, role?: UserRole, department?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
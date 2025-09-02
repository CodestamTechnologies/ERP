'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// Define Firebase error type
interface FirebaseError {
  code: string;
  message: string;
}

// Type guard to check if error is a Firebase error
const isFirebaseError = (error: unknown): error is FirebaseError => {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    'message' in error &&
    typeof (error as FirebaseError).code === 'string' &&
    typeof (error as FirebaseError).message === 'string'
  );
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, user } = useAuth();
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      return setError('Please fill in all fields');
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      return setError('Please enter a valid email address');
    }
    
    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
      // The redirect will be handled by the useEffect when user state changes
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      
      // More specific error messages
      if (isFirebaseError(error)) {
        if (error.code === 'auth/invalid-credential') {
          setError('Invalid email or password');
        } else if (error.code === 'auth/too-many-requests') {
          setError('Too many failed attempts. Please try again later.');
        } else {
          setError('Failed to sign in: ' + error.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      // The redirect will be handled by the useEffect when user state changes
    } catch (error: unknown) {
      console.error('Google sign in error:', error);
      
      if (isFirebaseError(error)) {
        if (error.code === 'auth/popup-closed') {
          setError('Google sign in was canceled');
        } else {
          setError('Failed to sign in with Google: ' + error.message);
        }
      } else {
        setError('An unexpected error occurred during Google sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              Sign in with Google
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot your password?
            </Link>
          </div>
          
          <div className="mt-2 text-center">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <Link href="/auth/signup" className="text-sm text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
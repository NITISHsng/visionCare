'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, Lock, Mail, AlertCircle } from 'lucide-react';
// import { validateUser } from '@/src/middleware/auth';
import { useAuth } from '@/src/contexts/AuthContext'; // Import useAuth

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const [isLoading, setIsLoading] = useState(false); // Remove local isLoading
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const { login, isLoading } = useAuth(); // Use isLoading from useAuth


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // setIsLoading(true); // No need for local setIsLoading

    const success = await login(email, password); // Use login from useAuth
    if (success) {
      // Redirect based on role or to requested page
      if (redirectTo !== '/') {
        router.push(redirectTo);
      } else {
  
        router.push('/');
      }
    } else {
      setError('Invalid email or password');
    }

  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Eye className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Kachakali Vision Care</h1>
          <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-teal-600 hover:text-teal-800 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
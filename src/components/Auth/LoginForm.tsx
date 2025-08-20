import React, { useState, useEffect } from 'react';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';
import { signInWithCustomAuth, checkUsersExist } from '../../lib/supabase';

interface LoginFormProps {
  onLogin: (user: any, userType: 'admin' | 'customer') => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'admin' | 'customer'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Check if users exist in database on component mount
    const checkUsers = async () => {
      const result = await checkUsersExist();
      setDebugInfo(result);
    };
    checkUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Login attempt:', { email, password, userType });
      
      const { data, error: authError } = await signInWithCustomAuth(email, password, userType);
      
      if (authError) {
        console.error('Auth error:', authError);
        setError(authError.message);
        return;
      }

      if (data?.user) {
        console.log('Login successful:', data.user);
        onLogin(data.user, userType);
      } else {
        setError('Login failed - no user data returned');
      }
    } catch (err) {
      console.error('Login exception:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (type: 'admin' | 'customer') => {
    if (type === 'admin') {
      setEmail('admin@kioskpay.com');
      setPassword('admin123');
      setUserType('admin');
    } else {
      setEmail('customer@example.com');
      setPassword('customer123');
      setUserType('customer');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">KioskPay Login</h1>
          <p className="text-gray-600 mt-2">Access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login As
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userType === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setUserType('customer')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userType === 'customer'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Customer
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-3">🚀 Demo Credentials</h3>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded border">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">Admin Login:</p>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                >
                  Use These
                </button>
              </div>
              <p className="text-xs text-gray-600">Email: admin@kioskpay.com</p>
              <p className="text-xs text-gray-600">Password: admin123</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">Customer Login:</p>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('customer')}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                >
                  Use These
                </button>
              </div>
              <p className="text-xs text-gray-600">Email: customer@example.com</p>
              <p className="text-xs text-gray-600">Password: customer123</p>
            </div>
          </div>
        </div>

        {/* Debug Information */}
        {debugInfo && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Database Status:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Admin users: {debugInfo.adminUsers?.length || 0}</p>
              <p>Customers: {debugInfo.customers?.length || 0}</p>
              {debugInfo.adminError && <p className="text-red-600">Admin error: {debugInfo.adminError.message}</p>}
              {debugInfo.customerError && <p className="text-red-600">Customer error: {debugInfo.customerError.message}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
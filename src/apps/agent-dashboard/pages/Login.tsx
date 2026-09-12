import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeClosed, AlertCircle } from 'lucide-react';
import { Button, Input } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { isValidEmail } from '../../../utils/validators';
import Logo from '../../../assets/logo.png'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false)
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });

  // Surface the reason the user was sent back here (expired token, 401 from the
  // API). The banner below already existed but nothing ever populated it.
  useEffect(() => {
    const authError = sessionStorage.getItem('auth_error');
    if (!authError) return;

    setSessionExpiredMessage(authError);
    sessionStorage.removeItem('auth_error');

    const timer = setTimeout(() => setSessionExpiredMessage(null), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
  };

  const validate = (): boolean => {
    const newErrors = { email: '', password: '', general: '' };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Check if staff must change password on first login
      if (result.mustChangePassword) {
        navigate('/first-login-setup');
        return;
      }

      // Check if user has a company, if not redirect to company setup
      // Access from localStorage since the store might not have updated yet
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        if (!userData.company_id) {
          navigate('/company-setup');
          return;
        }
      }
      navigate('/dashboard');
    } else {
      setErrors((prev) => ({
        ...prev,
        general: result.error || 'Login failed. Please try again.',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-dark-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-secondary-700 p-4 rounded-2xl mb-4 cursor-pointer" onClick={() => navigate('/')}>
            {/* <span className="text-white font-bold text-2xl">L</span> */}
             <img src={Logo} alt="logo" className='w-full h-full object-cover' />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Company Dashboard</h1>
          <p className="text-secondary-200">Sign in to manage conversations</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Session Expired Message */}
            {sessionExpiredMessage && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Session Expired</p>
                  <p className="mt-1">{sessionExpiredMessage}</p>
                </div>
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            {/* Email Input */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail size={18} />}
              placeholder="agent@company.com"
              error={errors.email}
              required
            />

            {/* Password Input */}
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              leftIcon={<Lock size={18} />}
              rightIcon={showPassword ? <div onClick={() => setShowPassword(false)}><Eye /></div> : <div onClick={() => setShowPassword(true)}><EyeClosed /></div>}
              placeholder="Enter your password"
              error={errors.password}
              required
            />

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Create an account
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-secondary-200 text-sm mt-8">
          © 2025 AI Support Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
};
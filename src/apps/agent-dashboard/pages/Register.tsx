import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { Button, Input } from '../../../components/ui';
import { authService } from '../../../services/auth.service';
import { isValidEmail } from '../../../utils/validators';
import { UserRole } from '@/types/user.types';
import Logo from '../../../assets/logo.png'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
  });

  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    general: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('One number');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('One special character');
    return errors;
  };

  const validate = (): boolean => {
    const newErrors = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone_number: '',
      general: '',
    };
    let isValid = true;

    if (!formData.first_name || formData.first_name.length < 3) {
      newErrors.first_name = 'First name must be at least 3 characters';
      isValid = false;
    }

    if (!formData.last_name || formData.last_name.length < 3) {
      newErrors.last_name = 'Last name must be at least 3 characters';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = 'Password must have: ' + passwordErrors.join(', ');
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await authService.register({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number,
        role: UserRole.COMPANY_SUPER_ADMIN, // Default role for new registrations
      });

      // Store the token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      // Navigate to company setup page
      navigate('/company-setup', {
        state: { message: 'Account created successfully! Now set up your company.' }
      });
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error.response?.data?.message || 'Registration failed. Please try again.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (): { score: number; label: string; color: string } => {
    if (!formData.password) return { score: 0, label: '', color: '' };

    const errors = validatePassword(formData.password);
    const score = 5 - errors.length;

    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Medium', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-primary-800 to-dark-800 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-secondary-700 p-4 rounded-2xl mb-4 cursor-pointer" onClick={() => navigate('/')}>
            {/* <span className="text-white font-bold text-2xl">L</span> */}
             <img src={Logo} alt="logo" className='w-full h-full object-cover' />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Account</h1>
          <p className="text-secondary-200">Start your journey with getLync</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                leftIcon={<User size={18} />}
                placeholder="John"
                error={errors.first_name}
                required
              />

              <Input
                label="Last Name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                leftIcon={<User size={18} />}
                placeholder="Doe"
                error={errors.last_name}
                required
              />
            </div>

            {/* Email Input */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail size={18} />}
              placeholder="john@company.com"
              error={errors.email}
              required
            />

            {/* Phone Number */}
            <Input
              label="Phone Number"
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              leftIcon={<Phone size={18} />}
              placeholder="+1234567890"
              error={errors.phone_number}
              required
            />

            {/* Password Input */}
            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                leftIcon={<Lock size={18} />}
                placeholder="Create a strong password"
                error={errors.password}
                required
              />

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{passwordStrength.label}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Password must contain: 8+ characters, uppercase, lowercase, number, special character
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              leftIcon={<Lock size={18} />}
              placeholder="Re-enter your password"
              error={errors.confirmPassword}
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-secondary-200 text-sm mt-8">
          © 2025 getLync. All rights reserved.
        </p>
      </div>
    </div>
  );
};

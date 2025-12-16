import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Phone, Check, Eye, EyeClosed } from 'lucide-react';
import { Button, Input } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { authService } from '../../../services/auth.service';
import Logo from '../../../assets/logo.png';

export const FirstLoginSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [step, setStep] = useState<'password' | 'profile'>('password');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone_number: (user as any)?.phone_number || '',
  });

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    general: '',
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
  };

  const validatePassword = (): boolean => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      first_name: '',
      last_name: '',
      phone: '',
      general: '',
    };
    let isValid = true;

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateProfile = (): boolean => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      first_name: '',
      last_name: '',
      phone: '',
      general: '',
    };
    let isValid = true;

    if (!profileData.first_name) {
      newErrors.first_name = 'First name is required';
      isValid = false;
    }

    if (!profileData.last_name) {
      newErrors.last_name = 'Last name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      setIsLoading(true);
      await authService.changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });

      // Move to profile step
      setStep('profile');
      setErrors({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone: '',
        general: '',
      });
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error.response?.data?.message || 'Failed to change password',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfile()) return;

    try {
      setIsLoading(true);
      await authService.updateProfile(profileData);

      // Refresh user data
      await refreshUser();

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error.response?.data?.message || 'Failed to update profile',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-primary-800 to-dark-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-secondary-700 p-4 rounded-2xl mb-4 cursor-pointer" onClick={() => navigate('/')}>
            <img src={Logo} alt="logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome!</h1>
          <p className="text-secondary-200">
            {step === 'password'
              ? 'Please change your temporary password'
              : 'Complete your profile to get started'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'password'
                  ? 'bg-primary-500 text-white'
                  : 'bg-green-500 text-white'
              }`}
            >
              {step === 'profile' ? <Check size={16} /> : '1'}
            </div>
            <span className="ml-2 text-white text-sm">Change Password</span>
          </div>
          <div className="w-12 h-0.5 bg-secondary-400" />
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'profile'
                  ? 'bg-primary-500 text-white'
                  : 'bg-secondary-600 text-secondary-300'
              }`}
            >
              2
            </div>
            <span className={`ml-2 text-sm ${step === 'profile' ? 'text-white' : 'text-secondary-300'}`}>
              Update Profile
            </span>
          </div>
        </div>

        {/* Setup Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {step === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Change Your Password</h2>
                <p className="text-gray-600 text-sm">
                  For security reasons, please change your temporary password
                </p>
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}

              {/* Current Password Input */}
              <Input
                label="Current Password (Temporary)"
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                leftIcon={<Lock size={18} />}
                placeholder="Enter your temporary password"
                error={errors.currentPassword}
                rightIcon={showCurrentPassword ? <div onClick={() => setShowCurrentPassword(false)}><Eye /></div> : <div onClick={() => setShowCurrentPassword(true)}><EyeClosed /></div>}
                required
              />

              {/* New Password Input */}
              <Input
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                leftIcon={<Lock size={18} />}
                placeholder="Enter your new password"
                error={errors.newPassword}
                helperText="Must be at least 8 characters"
                rightIcon={showNewPassword ? <div onClick={() => setShowNewPassword(false)}><Eye /></div> : <div onClick={() => setShowNewPassword(true)}><EyeClosed /></div>}
                required
              />

              {/* Confirm Password Input */}
              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                leftIcon={<Lock size={18} />}
                placeholder="Confirm your new password"
                error={errors.confirmPassword}
                rightIcon={showConfirmPassword ? <div onClick={() => setShowConfirmPassword(false)}><Eye /></div> : <div onClick={() => setShowConfirmPassword(true)}><EyeClosed /></div>}
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
                {isLoading ? 'Changing Password...' : 'Continue'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
                <p className="text-gray-600 text-sm">
                  Help us personalize your experience
                </p>
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}

              {/* First Name Input */}
              <Input
                label="First Name"
                type="text"
                name="first_name"
                value={profileData.first_name}
                onChange={handleProfileChange}
                leftIcon={<User size={18} />}
                placeholder="Enter your first name"
                error={errors.first_name}
                required
              />

              {/* Last Name Input */}
              <Input
                label="Last Name"
                type="text"
                name="last_name"
                value={profileData.last_name}
                onChange={handleProfileChange}
                leftIcon={<User size={18} />}
                placeholder="Enter your last name"
                error={errors.last_name}
                required
              />

              {/* Phone Input */}
              <Input
                label="Phone Number (Optional)"
                type="tel"
                name="phone_number"
                value={profileData.phone_number}
                onChange={handleProfileChange}
                leftIcon={<Phone size={18} />}
                placeholder="Enter your phone number"
                error={errors.phone}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Complete Setup'}
              </Button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-secondary-200 text-sm mt-8">
          © 2025 AI Support Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
};

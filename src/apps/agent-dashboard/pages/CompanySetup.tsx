import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Globe, Mail, Phone, CheckCircle } from 'lucide-react';
import { Button, Input } from '../../../components/ui';
import api from '../../../services/api';
import { isValidEmail } from '../../../utils/validators';
import { useAuth } from '../../../hooks';

export const CompanySetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    email: '',
    phone_number: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    email: '',
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

  const validate = (): boolean => {
    const newErrors = {
      name: '',
      address: '',
      city: '',
      country: '',
      email: '',
      phone_number: '',
      general: '',
    };
    let isValid = true;

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Company name must be at least 3 characters';
      isValid = false;
    }

    if (!formData.address || formData.address.length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
      isValid = false;
    }

    if (!formData.city || formData.city.length < 2) {
      newErrors.city = 'City is required';
      isValid = false;
    }

    if (!formData.country || formData.country.length < 2) {
      newErrors.country = 'Country is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
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

    // setIsLoading(true);

    try {
      const response = await api.post('/auth/onboard-company', formData);

      if (response.data.success) {
        // Refresh user data to update company_id in the store
        await refreshUser();

        // Navigate to dashboard after successful company setup
        navigate('/dashboard', {
          state: { message: 'Company setup completed successfully!' }
        });
      }
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error.response?.data?.message || 'Company setup failed. Please try again.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-primary-800 to-dark-800 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Setup Your Company</h1>
          <p className="text-secondary-200">Tell us about your organization</p>
        </div>

        {/* Setup Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Account Created</span>
              </div>

              <div className="flex-1 h-1 bg-primary-500 mx-4" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">2</span>
                </div>
                <span className="text-sm font-medium text-primary-600">Company Setup</span>
              </div>

              <div className="flex-1 h-1 bg-gray-200 mx-4" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 font-semibold text-sm">3</span>
                </div>
                <span className="text-sm text-gray-400">Dashboard</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            {/* Company Name */}
            <Input
              label="Company Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              leftIcon={<Building2 size={18} />}
              placeholder="Acme Corporation"
              error={errors.name}
              required
            />

            {/* Address */}
            <Input
              label="Company Address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              leftIcon={<MapPin size={18} />}
              placeholder="123 Main Street, Suite 100"
              error={errors.address}
              required
            />

            {/* City and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="City"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                leftIcon={<MapPin size={18} />}
                placeholder="New York"
                error={errors.city}
                required
              />

              <Input
                label="Country"
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                leftIcon={<Globe size={18} />}
                placeholder="United States"
                error={errors.country}
                required
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                leftIcon={<Mail size={18} />}
                placeholder="contact@company.com"
                error={errors.email}
                required
              />

              <Input
                label="Company Phone"
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                leftIcon={<Phone size={18} />}
                placeholder="+1234567890"
                error={errors.phone_number}
                required
              />
            </div>

            {/* Info Box */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-900 mb-2 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                What happens next?
              </h3>
              <ul className="text-sm text-primary-800 space-y-1 ml-7">
                <li>• Your company profile will be created</li>
                <li>• You'll get access to your dashboard</li>
                <li>• You can start onboarding your team</li>
                <li>• Begin managing customer conversations</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Skip for Now
              </Button>

              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Setting Up...' : 'Complete Setup'}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-secondary-200 text-sm mt-8">
          © 2025 getLync. All rights reserved.
        </p>
      </div>
    </div>
  );
};

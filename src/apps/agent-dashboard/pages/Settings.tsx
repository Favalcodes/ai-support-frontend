import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, Building, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks';
import { Button, Input, Card } from '../../../components/ui';
import { userService } from '../../../services/user.service';
import { companyService, Company } from '../../../services/company.service';
import { UserRole } from '../../../types/user.types';

export const SettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'company'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
  });

  // Company form state
  const [company, setCompany] = useState<Company | null>(null);
  const [companyForm, setCompanyForm] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    email: '',
    phone_number: '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification preferences state (stored locally for now)
  const [notifications, setNotifications] = useState({
    emailOnNewMessage: true,
    emailOnEscalation: true,
    emailOnResolution: false,
    appNotifications: true,
    soundEnabled: true,
  });

  // Load profile data and company data
  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: '',
      });

      // Load company data if user is COMPANY_SUPER_ADMIN
      if (user.role === UserRole.COMPANY_SUPER_ADMIN) {
        loadCompanyData();
      }
    }

    // Load notification preferences from localStorage
    const savedNotifications = localStorage.getItem('notification_preferences');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Failed to parse notification preferences:', error);
      }
    }
  }, [user]);

  const loadCompanyData = async () => {
    try {
      const companyData = await companyService.getCurrentCompany();
      console.log('------COMPANY DATA------', companyData)
      setCompany(companyData);
      setCompanyForm({
        name: companyData.name || '',
        address: companyData.address || '',
        city: companyData.city || '',
        country: companyData.country || '',
        email: companyData.email || '',
        phone_number: companyData.phone_number || '',
      });
    } catch (error) {
      console.error('Failed to load company data:', error);
    }
  };

  const handleProfileSave = async () => {
    if (!profileForm.first_name.trim() || !profileForm.last_name.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      await userService.updateProfile(profileForm);

      // Refresh user data
      await refreshUser();

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompanySave = async () => {
    if (!companyForm.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    if (!company?.id) {
      toast.error('Company ID not found');
      return;
    }

    setIsSaving(true);
    try {
      const updatedCompany = await companyService.updateCompany(company.id, companyForm);
      setCompany(updatedCompany);
      toast.success('Company details updated successfully!');
    } catch (error: any) {
      console.error('Failed to update company:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to update company details. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long!');
      return;
    }

    setIsSaving(true);
    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Failed to change password:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to change password. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationsSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage (backend notification endpoint can be added later)
      localStorage.setItem('notification_preferences', JSON.stringify(notifications));
      toast.success('Notification preferences updated successfully!');
    } catch (error) {
      console.error('Failed to update notifications:', error);
      toast.error('Failed to update notification preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'company' as const, label: 'Company', icon: Building },
  ];

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <Input
                      type="text"
                      value={profileForm.first_name}
                      onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      value={profileForm.last_name}
                      onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed. Contact support if you need to update your email.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={profileForm.phone_number}
                    onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                    placeholder="Enter phone number (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <Input
                    type="text"
                    value={user?.role || 'N/A'}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleProfileSave} loading={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                <Lock className="w-5 h-5 inline mr-2" />
                Change Password
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handlePasswordChange} loading={isSaving}>
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> The password change endpoint may need to be implemented on the backend.
                  If you receive an error, please contact your administrator.
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Email Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notifications.emailOnNewMessage}
                      onChange={(e) => setNotifications({ ...notifications, emailOnNewMessage: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">New Messages</div>
                      <div className="text-xs text-gray-500">Get notified when you receive new messages</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notifications.emailOnEscalation}
                      onChange={(e) => setNotifications({ ...notifications, emailOnEscalation: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Escalations</div>
                      <div className="text-xs text-gray-500">Get notified when a conversation is escalated to you</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notifications.emailOnResolution}
                      onChange={(e) => setNotifications({ ...notifications, emailOnResolution: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Resolutions</div>
                      <div className="text-xs text-gray-500">Get notified when a conversation is resolved</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">App Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notifications.appNotifications}
                      onChange={(e) => setNotifications({ ...notifications, appNotifications: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Push Notifications</div>
                      <div className="text-xs text-gray-500">Show desktop notifications for new messages</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notifications.soundEnabled}
                      onChange={(e) => setNotifications({ ...notifications, soundEnabled: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Sound Alerts</div>
                      <div className="text-xs text-gray-500">Play sound when receiving notifications</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleNotificationsSave} loading={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Notification preferences are currently stored locally in your browser.
                Backend notification management will be implemented in the next phase.
              </p>
            </div>
          </Card>
        )}

        {/* Company Tab */}
        {activeTab === 'company' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>

            {user?.role === UserRole.COMPANY_SUPER_ADMIN ? (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <Input
                      type="text"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={companyForm.email}
                      onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                      placeholder="company@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={companyForm.phone_number}
                      onChange={(e) => setCompanyForm({ ...companyForm, phone_number: e.target.value })}
                      placeholder="+1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <Input
                      type="text"
                      value={companyForm.address}
                      onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <Input
                        type="text"
                        value={companyForm.city}
                        onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })}
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <Input
                        type="text"
                        value={companyForm.country}
                        onChange={(e) => setCompanyForm({ ...companyForm, country: e.target.value })}
                        placeholder="United States"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company ID
                    </label>
                    <Input
                      type="text"
                      value={company?.id || user?.company_id || 'N/A'}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Staff
                    </label>
                    <Input
                      type="text"
                      value={company?.number_of_staff?.toString() || '0'}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleCompanySave} loading={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <Input
                      type="text"
                      value={company?.name || 'Loading...'}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company ID
                    </label>
                    <Input
                      type="text"
                      value={user?.company_id || 'N/A'}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Company settings can only be modified by Super Admins.
                    Contact your administrator to make changes.
                  </p>
                </div>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

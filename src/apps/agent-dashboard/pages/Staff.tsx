import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Shield,
  Activity,
  Search,
  X,
} from 'lucide-react';
import { useAuth } from '../../../hooks';
import { staffService, type Staff } from '../../../services/staff.service';
import { departmentService, type Department } from '../../../services/department.service';
import { Button, Input, Card, CardBody, Badge, Spinner, MultiSelectDropdown } from '../../../components/ui';

export const StaffPage: React.FC = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for adding/editing staff
  const [formData, setFormData] = useState({
    email: '',
    role: 'COMPANY_STAFF',
    department_ids: [] as string[],
    is_all_rounder: false,
  });

  useEffect(() => {
    loadStaff();
    loadDepartments();
  }, [user]);

  const loadDepartments = async () => {
    try {
      const departmentList = await departmentService.getDepartments();
      setDepartments(departmentList);
    } catch (err) {
      console.error('Failed to load departments:', err);
    }
  };

  const loadStaff = async () => {
    if (!user?.company_id) return;

    try {
      setIsLoading(true);
      setError(null);
      const staffList = await staffService.getCompanyStaff(user.company_id);
      setStaff(staffList);
    } catch (err) {
      console.error('Failed to load staff:', err);
      setError('Failed to load staff members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStaff = async () => {
    if (!user?.company_id) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await staffService.onboardStaff({
        ...formData,
        company_id: user.company_id,
      });

      setShowAddModal(false);
      setFormData({ email: '', role: 'COMPANY_STAFF', department_ids: [], is_all_rounder: false });
      await loadStaff();
    } catch (err: any) {
      console.error('Failed to add staff:', err);
      setError(err.response?.data?.message || 'Failed to add staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStaff = async () => {
    if (!selectedStaff) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await staffService.updateStaff(selectedStaff.id, {
        role: formData.role,
        department_ids: formData.department_ids,
        is_all_rounder: formData.is_all_rounder,
      });

      setShowEditModal(false);
      setSelectedStaff(null);
      setFormData({ email: '', role: 'COMPANY_STAFF', department_ids: [], is_all_rounder: false });
      await loadStaff();
    } catch (err: any) {
      console.error('Failed to update staff:', err);
      setError(err.response?.data?.message || 'Failed to update staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivateStaff = async (staffId: string) => {
    if (!confirm('Are you sure you want to deactivate this staff member?')) return;

    try {
      setError(null);
      await staffService.deactivateStaff(staffId);
      await loadStaff();
    } catch (err: any) {
      console.error('Failed to deactivate staff:', err);
      setError(err.response?.data?.message || 'Failed to deactivate staff member');
    }
  };

  const openEditModal = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setFormData({
      email: staffMember.email,
      role: staffMember.role,
      department_ids: staffMember.departments?.map(d => d.id) || [],
      is_all_rounder: staffMember.is_all_rounder || false,
    });
    setShowEditModal(true);
  };

  const filteredStaff = staff.filter((member) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      member.first_name?.toLowerCase().includes(searchLower) ||
      member.last_name?.toLowerCase().includes(searchLower) ||
      member.email?.toLowerCase().includes(searchLower)
    );
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'COMPANY_SUPER_ADMIN':
        return <Badge variant="danger">Super Admin</Badge>;
      case 'COMPANY_ADMIN':
        return <Badge variant="warning">Admin</Badge>;
      case 'COMPANY_STAFF':
        return <Badge variant="info">Staff</Badge>;
      default:
        return <Badge variant="default">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'ACTIVE' ? (
      <Badge variant="success">Active</Badge>
    ) : (
      <Badge variant="default">Inactive</Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
              <p className="text-gray-600 mt-1">
                Manage your team members and their permissions
              </p>
            </div>
            <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
              Add Staff Member
            </Button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                leftIcon={<Search className="w-4 h-4" />}
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredStaff.length} of {staff.length} members
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Staff List */}
        {filteredStaff.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'No staff members found' : 'No staff members yet'}
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Get started by adding your first team member'}
                </p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredStaff.map((member) => (
              <Card key={member.id}>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-full flex items-center justify-center">
                        <span className="text-cyan-700 font-bold text-lg">
                          {member.first_name?.charAt(0) || member.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {member.first_name && member.last_name
                            ? `${member.first_name} ${member.last_name}`
                            : 'Pending Setup'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{member.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gray-400" />
                          {getRoleBadge(member.role)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-gray-400" />
                          {getStatusBadge(member.live_status)}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(member)}
                          leftIcon={<Edit2 className="w-3 h-3" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeactivateStaff(member.id)}
                          leftIcon={<Trash2 className="w-3 h-3" />}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add Staff Member</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="staff@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="COMPANY_STAFF">Staff</option>
                    <option value="COMPANY_ADMIN">Admin</option>
                    <option value="COMPANY_SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>

                {/* All-Rounder Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="font-medium text-gray-900">All-Rounder</label>
                    <p className="text-sm text-gray-600 mt-1">
                      Can handle conversations from any department
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_all_rounder}
                      onChange={(e) => setFormData({ ...formData, is_all_rounder: e.target.checked, department_ids: e.target.checked ? [] : formData.department_ids })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                  </label>
                </div>

                {/* Department Selection */}
                {!formData.is_all_rounder && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departments
                    </label>
                    <MultiSelectDropdown
                      options={departments.map(dept => ({
                        id: dept.id,
                        label: dept.name,
                        icon: dept.icon,
                        color: dept.color,
                      }))}
                      selectedIds={formData.department_ids}
                      onChange={(selectedIds) => setFormData({ ...formData, department_ids: selectedIds })}
                      placeholder="Select departments..."
                      searchPlaceholder="Search departments..."
                      emptyMessage="No departments available. Create departments first."
                    />
                  </div>
                )}

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    An email will be sent to the staff member with their login credentials.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddStaff}
                  className="flex-1"
                  loading={isSubmitting}
                  disabled={!formData.email || isSubmitting}
                >
                  Add Staff Member
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Edit Staff Member</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input type="email" value={formData.email} disabled />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="COMPANY_STAFF">Staff</option>
                    <option value="COMPANY_ADMIN">Admin</option>
                    <option value="COMPANY_SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>

                {/* All-Rounder Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="font-medium text-gray-900">All-Rounder</label>
                    <p className="text-sm text-gray-600 mt-1">
                      Can handle conversations from any department
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_all_rounder}
                      onChange={(e) => setFormData({ ...formData, is_all_rounder: e.target.checked, department_ids: e.target.checked ? [] : formData.department_ids })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                  </label>
                </div>

                {/* Department Selection */}
                {!formData.is_all_rounder && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departments
                    </label>
                    <MultiSelectDropdown
                      options={departments.map(dept => ({
                        id: dept.id,
                        label: dept.name,
                        icon: dept.icon,
                        color: dept.color,
                      }))}
                      selectedIds={formData.department_ids}
                      onChange={(selectedIds) => setFormData({ ...formData, department_ids: selectedIds })}
                      placeholder="Select departments..."
                      searchPlaceholder="Search departments..."
                      emptyMessage="No departments available. Create departments first."
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateStaff}
                  className="flex-1"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Update Staff Member
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

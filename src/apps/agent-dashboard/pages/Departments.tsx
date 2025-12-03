import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Users,
  Search,
  X,
  Save,
  GripVertical,
} from 'lucide-react';
import { departmentService, type Department } from '../../../services/department.service';
import { Button, Input, Card, CardBody, Badge, Spinner } from '../../../components/ui';

const PRESET_COLORS = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'
];

const PRESET_ICONS = ['💼', '🔧', '💰', '📊', '🎯', '🚀', '💡', '🏆', '📱', '🌟'];

export const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: PRESET_COLORS[0],
    icon: PRESET_ICONS[0],
    display_order: 0,
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const departmentList = await departmentService.getDepartments();
      setDepartments(departmentList);
    } catch (err) {
      console.error('Failed to load departments:', err);
      setError('Failed to load departments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDepartment = async () => {
    if (!formData.name.trim()) {
      setError('Department name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await departmentService.createDepartment({
        name: formData.name,
        description: formData.description,
        color: formData.color,
        icon: formData.icon,
        display_order: formData.display_order,
      });

      setShowAddModal(false);
      resetForm();
      await loadDepartments();
    } catch (err: any) {
      console.error('Failed to add department:', err);
      setError(err.response?.data?.message || 'Failed to add department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDepartment = async () => {
    if (!selectedDepartment) return;

    if (!formData.name.trim()) {
      setError('Department name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await departmentService.updateDepartment(selectedDepartment.id, {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        icon: formData.icon,
        display_order: formData.display_order,
      });

      setShowEditModal(false);
      setSelectedDepartment(null);
      resetForm();
      await loadDepartments();
    } catch (err: any) {
      console.error('Failed to update department:', err);
      setError(err.response?.data?.message || 'Failed to update department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    if (!confirm('Are you sure you want to delete this department? Staff assignments will be removed.')) {
      return;
    }

    try {
      setError(null);
      await departmentService.deleteDepartment(departmentId);
      await loadDepartments();
    } catch (err: any) {
      console.error('Failed to delete department:', err);
      setError(err.response?.data?.message || 'Failed to delete department');
    }
  };

  const openEditModal = (department: Department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || '',
      color: department.color || PRESET_COLORS[0],
      icon: department.icon || PRESET_ICONS[0],
      display_order: department.display_order,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: PRESET_COLORS[0],
      icon: PRESET_ICONS[0],
      display_order: 0,
    });
    setError(null);
  };

  const filteredDepartments = departments.filter((dept) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      dept.name?.toLowerCase().includes(searchLower) ||
      dept.description?.toLowerCase().includes(searchLower)
    );
  });

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
              <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
              <p className="text-gray-600 mt-1">
                Organize your team into departments for better conversation routing
              </p>
            </div>
            <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
              Add Department
            </Button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                leftIcon={<Search className="w-4 h-4" />}
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredDepartments.length} of {departments.length} departments
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Department List */}
        {filteredDepartments.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'No departments found' : 'No departments yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Create departments to organize your support team'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
                    Create First Department
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredDepartments.map((department) => (
              <Card key={department.id}>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          style={{ backgroundColor: department.color + '20' }}
                        >
                          {department.icon || '📁'}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {department.name}
                          </h3>
                          {!department.is_active && (
                            <Badge variant="default">Inactive</Badge>
                          )}
                        </div>
                        {department.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {department.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Users className="w-4 h-4" />
                            <span>{department.staff?.length || 0} staff members</span>
                          </div>
                          <div
                            className="flex items-center gap-2 text-sm"
                            style={{ color: department.color }}
                          >
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: department.color }}
                            />
                            <span>{department.color}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(department)}
                        leftIcon={<Edit2 className="w-3 h-3" />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDepartment(department.id)}
                        leftIcon={<Trash2 className="w-3 h-3" />}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add Department</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Name *
                  </label>
                  <Input
                    placeholder="e.g., Technical Support"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="What does this department handle?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_ICONS.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`p-2 text-2xl rounded-lg border-2 transition-all ${
                          formData.icon === icon
                            ? 'border-cyan-500 bg-cyan-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          formData.color === color
                            ? 'border-gray-900 scale-110'
                            : 'border-gray-200 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddDepartment}
                  className="flex-1"
                  loading={isSubmitting}
                  disabled={!formData.name || isSubmitting}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Add Department
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Edit Department</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedDepartment(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Name *
                  </label>
                  <Input
                    placeholder="e.g., Technical Support"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="What does this department handle?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_ICONS.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`p-2 text-2xl rounded-lg border-2 transition-all ${
                          formData.icon === icon
                            ? 'border-cyan-500 bg-cyan-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          formData.color === color
                            ? 'border-gray-900 scale-110'
                            : 'border-gray-200 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedDepartment(null);
                    resetForm();
                  }}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateDepartment}
                  className="flex-1"
                  loading={isSubmitting}
                  disabled={!formData.name || isSubmitting}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Update Department
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

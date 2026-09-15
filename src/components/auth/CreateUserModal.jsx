import { useState } from 'react';
import {
  X,
  UserPlus,
  Eye,
  EyeOff,
  IdCard,
  User,
  Mail,
  Lock,
  Briefcase,
  Building2,
  Shield,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { registerUser } from '../../services/api';

export default function CreateUserModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'employee',
    designation: '',
    department: '',
    status: 'active',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validate = () => {
    if (!formData.employeeId.trim()) return 'Employee ID is required (e.g. EMP-1025).';
    if (!formData.fullName.trim()) return 'Full Name is required.';
    if (!formData.username.trim()) return 'Username is required.';
    if (!formData.email.trim()) return 'Email address is required.';
    
    // Simple email pattern check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid email address.';
    }

    if (!formData.password) return 'Password is required.';
    if (formData.password.length < 4) return 'Password should be at least 4 characters long.';
    if (!formData.designation.trim()) return 'Role Designation is required (e.g. Machine Operator).';
    if (!formData.department.trim()) return 'Department is required.';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const created = await registerUser(formData);
      setSuccess(`Account for "${created.fullName || formData.fullName}" created successfully!`);
      setTimeout(() => {
        if (onSuccess) onSuccess(formData);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to create user account. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="modal-content w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/95 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
              <UserPlus size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Create User Account
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Register a new operator or staff member for Sata Vikas Dashboard
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-red-300 bg-red-50 p-3.5 text-xs font-semibold text-red-700 animate-fade-in dark:border-red-500/30 dark:bg-red-500/20 dark:text-red-200">
            <AlertCircle size={17} className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-700 animate-fade-in dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-200">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 1. Employee ID */}
            <div>
              <label className="label text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <IdCard size={14} className="text-indigo-600 dark:text-indigo-400" />
                  Employee ID <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => handleChange('employeeId', e.target.value)}
                placeholder="e.g. EMP-1025"
                className="input text-xs"
                required
              />
            </div>

            {/* 2. Full Name */}
            <div>
              <label className="label text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-indigo-600 dark:text-indigo-400" />
                  Full Name <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="e.g. Amit Sharma"
                className="input text-xs"
                required
              />
            </div>

            {/* 3. Username */}
            <div>
              <label className="label text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-indigo-600 dark:text-indigo-400" />
                  Username <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="e.g. amit.sharma"
                autoComplete="username"
                className="input text-xs"
                required
              />
            </div>

            {/* 4. Email */}
            <div>
              <label className="label text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="text-indigo-600 dark:text-indigo-400" />
                  Email Address <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="e.g. amit.sharma@satavikas.com"
                autoComplete="email"
                className="input text-xs"
                required
              />
            </div>

            {/* 5. Password */}
            <div>
              <label className="label text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Lock size={14} className="text-indigo-600 dark:text-indigo-400" />
                  Password <span className="text-red-500">*</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Set account password"
                  autoComplete="new-password"
                  className="input pr-10 text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* 6. Role */}
            <div>
              <label className="label text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Shield size={14} className="text-indigo-600 dark:text-indigo-400" />
                  Role <span className="text-red-500">*</span>
                </span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="select text-xs"
                required
              >
                <option value="employee">Employee / Operator</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* 7. Role Designation */}
            <div>
              <label className="label text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Briefcase size={14} className="text-indigo-600 dark:text-indigo-400" />
                  Role Designation <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleChange('designation', e.target.value)}
                placeholder="e.g. CNC Machine Operator"
                className="input text-xs"
                required
              />
            </div>

            {/* 8. Department */}
            <div>
              <label className="label text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-indigo-600 dark:text-indigo-400" />
                  Department <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                placeholder="e.g. QA Cell - A, Production"
                className="input text-xs"
                required
              />
            </div>

            {/* 9. Status (Active or Inactive) */}
            <div className="sm:col-span-2">
              <label className="label text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Activity size={14} className="text-indigo-600 dark:text-indigo-400" />
                  Account Status <span className="text-red-500">*</span>
                </span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('status', 'active')}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                    formData.status === 'active'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-500/50 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('status', 'inactive')}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                    formData.status === 'inactive'
                      ? 'border-slate-500 bg-slate-100 text-slate-800 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  Inactive
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary !min-h-0 py-2.5 px-4 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary !min-h-0 py-2.5 px-5 text-xs font-bold shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Create User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

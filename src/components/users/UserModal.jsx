import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const DEPARTMENTS = [
  'QA Cell - A',
  'Production',
  'QA Cell - B'
];

export default function UserModal({ user, onClose, onSave }) {
  const isEdit = !!user;
  const [form, setForm] = useState({
    employeeId: '',
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'employee',
    designation: '',
    department: 'QA Cell - A',
    status: 'active',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        employeeId: user.employeeId || user.employee_id || '',
        fullName: user.fullName || user.full_name || '',
        username: user.username || '',
        email: user.email || '',
        password: '',
        role: user.role || 'employee',
        designation: user.designation || '',
        department: user.department || '',
        status: (user.status || 'active').toLowerCase(),
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form, user?.id);
      onClose();
    } catch (err) {
      console.error('Save user failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {isEdit ? 'Edit User Profile' : 'Create New User Account'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label text-xs font-semibold uppercase tracking-wider">Employee ID</label>
            <input
              type="text"
              value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
              className="input disabled:opacity-60 text-xs"
              placeholder="e.g. EMP-1025"
              required
              disabled={isEdit}
            />
          </div>

          <div>
            <label className="label text-xs font-semibold uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="input text-xs"
              placeholder="e.g. Suresh Yadav"
              required
            />
          </div>

          <div>
            <label className="label text-xs font-semibold uppercase tracking-wider">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input disabled:opacity-60 text-xs"
              placeholder="e.g. operator1"
              required
              disabled={isEdit}
            />
          </div>

          <div>
            <label className="label text-xs font-semibold uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input text-xs"
              placeholder="e.g. suresh.yadav@satavikas.com"
              required
            />
          </div>

          <div>
            <label className="label text-xs font-semibold uppercase tracking-wider">{isEdit ? 'New Password (leave blank to keep)' : 'Password'}</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input text-xs"
              placeholder={isEdit ? '••••••••' : 'Set password'}
              required={!isEdit}
            />
          </div>

          <div>
            <label className="label text-xs font-semibold uppercase tracking-wider">Role Designation</label>
            <input
              type="text"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              className="input text-xs"
              placeholder="e.g. CNC Operator"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-xs font-semibold uppercase tracking-wider">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="select text-xs"
              >
                <option value="employee">Employee</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="label text-xs font-semibold uppercase tracking-wider">Department</label>
              <select
                value={form.department || 'QA Cell - A'}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="select text-xs"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label text-xs font-semibold uppercase tracking-wider">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="select text-xs"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200/80 dark:border-slate-800">
            <button type="button" onClick={onClose} className="btn-secondary !min-h-0 py-2.5 px-4 text-xs font-semibold cursor-pointer">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary !min-h-0 py-2.5 px-5 text-xs font-bold cursor-pointer">
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                isEdit ? 'Update User' : 'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



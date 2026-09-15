import { useEffect, useMemo, useState } from 'react';
import { Plus, RotateCcw, Search, SlidersHorizontal, Users, X } from 'lucide-react';
import { createUser, deleteUser, getUsers, updateUser } from '../services/api';
import UserModal from '../components/users/UserModal';
import UserTable from '../components/users/UserTable';

const ACTIVITY_KEY = 'sata_vikas_user_management_activity';
const emptyFilters = { search: '', role: '', department: '', status: '', joinedFrom: '', joinedTo: '' };

const saveActivity = (user, action) => {
  const item = { id: `${Date.now()}-${Math.random()}`, user: user.fullName, action, at: new Date().toISOString() };
  try {
    const history = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify([item, ...history].slice(0, 100)));
  } catch (error) {
    console.warn('Unable to record user-management activity:', error);
  }
};

const actionForUpdate = (before, after) => {
  if (before.role !== after.role) return `role changed to ${after.role}`;
  if (before.department !== after.department) return `department changed to ${after.department || 'Unassigned'}`;
  if (before.status !== after.status) return after.status === 'inactive' ? 'marked as inactive' : 'marked as active';
  return 'profile updated';
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(emptyFilters);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sort, setSort] = useState({ field: 'fullName', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data.map((user, index) => ({
        ...user,
        employeeId: user.employeeId || `EMP-${String(1001 + index).padStart(4, '0')}`,
        email: user.email || `${user.username}@satavikas.com`,
      })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);
  useEffect(() => { setPage(1); }, [filters, sort, pageSize]);

  const departments = useMemo(
    () => [...new Set(users.map(user => user.department).filter(Boolean))].sort(),
    [users],
  );
  const filteredUsers = useMemo(() => users.filter(user => {
    const searchable = Object.values(user).join(' ').toLowerCase();
    return (!filters.search || searchable.includes(filters.search.toLowerCase()))
      && (!filters.role || user.role === filters.role)
      && (!filters.department || user.department === filters.department)
      && (!filters.status || user.status === filters.status)
      && (!filters.joinedFrom || user.createdDate >= filters.joinedFrom)
      && (!filters.joinedTo || user.createdDate <= filters.joinedTo);
  }).sort((left, right) => {
    const comparison = String(left[sort.field] || '').localeCompare(String(right[sort.field] || ''));
    return sort.direction === 'asc' ? comparison : -comparison;
  }), [users, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const displayedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeFilters = Object.entries(filters).filter(([, value]) => value);
  const setFilter = (name, value) => setFilters(current => ({ ...current, [name]: value }));

  const saveUser = async (form, id) => {
    const previous = users.find(user => String(user.id) === String(id));
    const saved = id ? await updateUser(id, form) : await createUser(form);
    saveActivity({ ...previous, ...saved, fullName: form.fullName }, id ? actionForUpdate(previous, form) : 'was added');
    await loadUsers();
  };

  const toggleStatus = async (user) => {
    const becomingInactive = user.status === 'active';
    if (!window.confirm(`${becomingInactive ? 'Deactivate' : 'Activate'} ${user.fullName}?`)) return;
    await updateUser(user.id, { status: becomingInactive ? 'inactive' : 'active' });
    saveActivity(user, becomingInactive ? 'marked as inactive' : 'marked as active');
    await loadUsers();
  };

  const removeUser = async (user) => {
    if (!window.confirm(`Delete ${user.fullName}? This cannot be undone.`)) return;
    await deleteUser(user.id);
    saveActivity(user, 'was deleted');
    await loadUsers();
  };

  const changeRole = async (user) => {
    const nextRole = window.prompt(`Change role for ${user.fullName}: admin, employee, or supervisor`, user.role);
    if (!nextRole || !['admin', 'employee', 'supervisor'].includes(nextRole.toLowerCase())) return;
    await updateUser(user.id, { role: nextRole.toLowerCase() });
    saveActivity(user, `role changed to ${nextRole.toLowerCase()}`);
    await loadUsers();
  };

  return (
    <div className="page-enter mx-auto max-w-[1440px] space-y-6">
      <section className="overview-banner flex flex-col justify-between gap-4 px-6 py-6 sm:flex-row sm:items-center sm:px-8">
        <div>
          <span className="mb-3 inline-flex rounded-full border border-indigo-200 bg-white/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[.15em] text-indigo-600 dark:border-indigo-400/20 dark:bg-white/10 dark:text-indigo-200">Administration</span>
          <h2 className="page-heading flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white"><Users className="text-indigo-600" />User Management</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-indigo-100/75">Manage shop-floor operator and administrator accounts</p>
        </div>
        <button onClick={() => { setModalUser(null); setShowForm(true); }} className="btn-primary text-xs"><Plus size={16} />Add New User</button>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-200/80 p-4 dark:border-slate-700/80">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-2"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={filters.search} onChange={event => setFilter('search', event.target.value)} placeholder="Search users, email, employee ID…" className="input pl-9 text-xs" /></div>
            <select value={filters.role} onChange={event => setFilter('role', event.target.value)} className="select text-xs"><option value="">All roles</option><option value="admin">Admin</option><option value="employee">Employee</option><option value="supervisor">Supervisor</option></select>
            <select value={filters.department} onChange={event => setFilter('department', event.target.value)} className="select text-xs"><option value="">All departments</option>{departments.map(department => <option key={department}>{department}</option>)}</select>
            <select value={filters.status} onChange={event => setFilter('status', event.target.value)} className="select text-xs"><option value="">All status</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button onClick={() => setAdvancedOpen(open => !open)} className="btn-secondary !min-h-0 px-3 py-2 text-xs"><SlidersHorizontal size={14} />Filters</button>
            <span className="text-xs text-slate-500">{filteredUsers.length} matching user{filteredUsers.length === 1 ? '' : 's'}</span>
            {activeFilters.length > 0 && <button onClick={() => setFilters(emptyFilters)} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-red-500"><RotateCcw size={13} />Reset filters</button>}
          </div>
          {advancedOpen && <div className="mt-3 grid gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-2 dark:bg-slate-800/60"><label className="text-xs font-semibold">Joined from<input type="date" value={filters.joinedFrom} onChange={event => setFilter('joinedFrom', event.target.value)} className="input mt-1 text-xs" /></label><label className="text-xs font-semibold">Joined to<input type="date" value={filters.joinedTo} onChange={event => setFilter('joinedTo', event.target.value)} className="input mt-1 text-xs" /></label></div>}
          {activeFilters.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{activeFilters.map(([name, value]) => <button key={name} onClick={() => setFilter(name, '')} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">{name}: {value}<X size={11} /></button>)}</div>}
        </div>
        <UserTable users={displayedUsers} loading={loading} sort={sort} onSort={field => setSort(current => ({ field, direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc' }))} onView={user => { setModalUser(user); setShowForm(false); }} onEdit={user => { setModalUser(user); setShowForm(true); }} onToggleStatus={toggleStatus} onDelete={removeUser} onMore={changeRole} />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 p-4 text-xs dark:border-slate-700">
          <span className="text-slate-500">Showing {filteredUsers.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length}</span>
          <div className="flex items-center gap-2"><button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="btn-secondary !min-h-0 px-3 py-1.5 text-xs">Previous</button><span className="font-semibold">{currentPage} / {totalPages}</span><button disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} className="btn-secondary !min-h-0 px-3 py-1.5 text-xs">Next</button><select value={pageSize} onChange={event => setPageSize(Number(event.target.value))} className="select !min-h-0 py-1.5 text-xs"><option value={8}>8 / page</option><option value={15}>15 / page</option><option value={25}>25 / page</option></select></div>
        </div>
      </section>

      {showForm && <UserModal user={modalUser} onClose={() => { setShowForm(false); setModalUser(null); }} onSave={saveUser} />}
      {modalUser && !showForm && <div className="modal-overlay" onClick={() => setModalUser(null)}><div className="modal-content max-w-md p-6" onClick={event => event.stopPropagation()}><div className="flex items-center justify-between"><h3 className="text-lg font-bold">{modalUser.fullName}</h3><button onClick={() => setModalUser(null)} aria-label="Close"><X /></button></div><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><p><b>Employee ID</b><br />{modalUser.employeeId}</p><p><b>Role</b><br />{modalUser.role}</p><p><b>Department</b><br />{modalUser.department}</p><p><b>Status</b><br />{modalUser.status}</p><p className="col-span-2"><b>Email</b><br />{modalUser.email}</p></div></div></div>}
    </div>
  );
}

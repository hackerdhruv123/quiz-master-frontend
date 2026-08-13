import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiEye,
  FiShield,
  FiUser,
  FiClock,
} from 'react-icons/fi';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  // User detail modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAttempts, setUserAttempts] = useState([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (role) params.append('role', role);
      if (status) params.append('status', status);

      const res = await api.get(`/users?${params.toString()}`);
      if (res.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, role, status]);

  const handleToggleStatus = async (userObj) => {
    try {
      const newStatus = !userObj.is_active;
      await api.patch(`/users/${userObj.id}/status`, { is_active: newStatus });
      fetchUsers();
    } catch (err) {
      alert(`Status Toggle Error: ${err.message}`);
    }
  };

  const handleViewUserDetail = async (userObj) => {
    setSelectedUser(userObj);
    setDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const res = await api.get(`/users/${userObj.id}`);
      if (res.success) {
        setUserAttempts(res.data.attempts);
      }
    } catch (err) {
      console.error('Error fetching user detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const roleOptions = [
    { label: 'Student', value: 'student' },
    { label: 'Admin', value: 'admin' },
  ];

  const statusOptions = [
    { label: 'Active Users', value: 'active' },
    { label: 'Inactive Users', value: 'false' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white flex items-center gap-2.5">
          <FiUsers className="text-blue-500" /> User & Student Directory
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage registered platform users, monitor performance metrics, and toggle account activation.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." />

        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown value={role} onChange={setRole} options={roleOptions} label="Role" />
          <FilterDropdown value={status} onChange={setStatus} options={statusOptions} label="Status" />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner text="Fetching directory..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchUsers} />
      ) : users.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400">No registered users match your criteria.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">User Info</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Total Attempts</th>
                  <th className="px-6 py-4">Avg Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-blue-400">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-white block leading-none">{u.name}</span>
                          <span className="text-xs text-slate-400 mt-1 block">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {u.role === 'admin' ? (
                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-lg flex items-center gap-1 w-fit">
                          <FiShield className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-lg flex items-center gap-1 w-fit">
                          <FiUser className="w-3 h-3" /> Student
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-200">{u.total_attempts}</td>
                    <td className="px-6 py-4 font-mono font-bold text-blue-400">{u.avg_score}%</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border transition flex items-center gap-1.5 ${
                          u.is_active
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
                        }`}
                      >
                        {u.is_active ? (
                          <>
                            <FiUserCheck className="w-3.5 h-3.5" /> Active
                          </>
                        ) : (
                          <>
                            <FiUserX className="w-3.5 h-3.5" /> Deactivated
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewUserDetail(u)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl border border-slate-700 transition inline-flex items-center gap-1"
                      >
                        <FiEye className="w-3.5 h-3.5" /> View Activity
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Detail & Attempts Drawer Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={`Student Profile: ${selectedUser?.name}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white">{selectedUser?.name}</h4>
              <p className="text-xs text-slate-400">{selectedUser?.email}</p>
            </div>
            <span className="px-3 py-1 bg-slate-800 text-xs font-semibold text-slate-300 rounded-lg capitalize">
              Role: {selectedUser?.role}
            </span>
          </div>

          <h4 className="text-sm font-bold text-white flex items-center gap-2 pt-2">
            <FiClock className="text-blue-400" /> Quiz Attempt Records
          </h4>

          {detailLoading ? (
            <LoadingSpinner text="Loading user attempts..." />
          ) : userAttempts.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No attempt history recorded for this user.</p>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {userAttempts.map((att) => (
                <div key={att.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200 block">{att.quiz_title}</span>
                    <span className="text-slate-400 text-[11px]">{new Date(att.submitted_at).toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-blue-400 block">{att.percentage}%</span>
                    <span className="text-[10px] text-slate-400">Score: {att.score}/{att.total_marks}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 text-right">
            <button
              onClick={() => setDetailModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-xl"
            >
              Close Profile
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

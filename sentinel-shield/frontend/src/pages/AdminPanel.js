import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { authAPI, ledgerAPI } from '../services/api';
import {
    FiUsers,
    FiShield,
    FiEdit2,
    FiTrash2,
    FiCheck,
    FiX,
    FiDatabase,
    FiCheckCircle,
    FiAlertTriangle
} from 'react-icons/fi';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [ledgerStatus, setLedgerStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'ledger') {
            verifyLedger();
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await authAPI.getUsers();
            setUsers(response.data.users || []);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const verifyLedger = async () => {
        setLoading(true);
        try {
            const response = await ledgerAPI.verify();
            setLedgerStatus(response.data);
        } catch (error) {
            toast.error('Failed to verify ledger');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (userId, updates) => {
        try {
            await authAPI.updateUser(userId, updates);
            toast.success('User updated successfully');
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Update failed');
        }
    };

    const handleToggleUserStatus = async (user) => {
        await handleUpdateUser(user.id, { is_active: !user.is_active });
    };

    const handleRoleChange = async (userId, role) => {
        await handleUpdateUser(userId, { role });
    };

    const tabs = [
        { id: 'users', label: 'User Management', icon: FiUsers },
        { id: 'ledger', label: 'Evidence Ledger', icon: FiDatabase },
    ];

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ marginBottom: '8px' }}>Admin Panel</h1>
                <p>System administration and configuration</p>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '24px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '16px'
            }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <>
                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="card">
                            <div className="card-header" style={{ marginBottom: '16px' }}>
                                <h3 className="card-title">Users ({users.length})</h3>
                            </div>

                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Last Login</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td>
                                                    <div style={{ fontWeight: 500 }}>{user.username}</div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        className="form-input"
                                                        style={{
                                                            padding: '6px 12px',
                                                            width: 'auto',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        <option value="viewer">Viewer</option>
                                                        <option value="analyst">Analyst</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <span className={`badge ${user.is_active ? 'badge-success' : 'badge-danger'}`}>
                                                        {user.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            onClick={() => handleToggleUserStatus(user)}
                                                            className={`btn btn-icon ${user.is_active ? 'btn-danger' : 'btn-secondary'}`}
                                                            title={user.is_active ? 'Deactivate' : 'Activate'}
                                                        >
                                                            {user.is_active ? <FiX size={16} /> : <FiCheck size={16} />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Ledger Tab */}
                    {activeTab === 'ledger' && (
                        <div>
                            {/* Integrity Status */}
                            <div className="card" style={{ marginBottom: '24px' }}>
                                <div className="card-header">
                                    <h3 className="card-title">Ledger Integrity Status</h3>
                                    <button onClick={verifyLedger} className="btn btn-secondary">
                                        Verify Again
                                    </button>
                                </div>

                                {ledgerStatus && (
                                    <div style={{ marginTop: '16px' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '20px',
                                            background: ledgerStatus.status === 'VALID' ? 'var(--success-bg)' :
                                                ledgerStatus.status === 'EMPTY' ? 'var(--info-bg)' : 'var(--danger-bg)',
                                            borderRadius: 'var(--radius-md)',
                                            border: `1px solid ${ledgerStatus.status === 'VALID' ? 'var(--success)' :
                                                    ledgerStatus.status === 'EMPTY' ? 'var(--info)' : 'var(--danger)'
                                                }`
                                        }}>
                                            {ledgerStatus.status === 'VALID' ? (
                                                <FiCheckCircle size={32} color="var(--success)" />
                                            ) : ledgerStatus.status === 'EMPTY' ? (
                                                <FiDatabase size={32} color="var(--info)" />
                                            ) : (
                                                <FiAlertTriangle size={32} color="var(--danger)" />
                                            )}
                                            <div>
                                                <div style={{
                                                    fontSize: '1.25rem',
                                                    fontWeight: 600,
                                                    color: ledgerStatus.status === 'VALID' ? 'var(--success)' :
                                                        ledgerStatus.status === 'EMPTY' ? 'var(--info)' : 'var(--danger)'
                                                }}>
                                                    {ledgerStatus.status}
                                                </div>
                                                <div style={{ color: 'var(--text-secondary)' }}>
                                                    {ledgerStatus.message}
                                                </div>
                                            </div>
                                        </div>

                                        {ledgerStatus.total_entries !== undefined && (
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(2, 1fr)',
                                                gap: '16px',
                                                marginTop: '16px'
                                            }}>
                                                <div style={{
                                                    padding: '16px',
                                                    background: 'var(--bg-tertiary)',
                                                    borderRadius: 'var(--radius-md)'
                                                }}>
                                                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                                                        {ledgerStatus.total_entries}
                                                    </div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                        Total Entries
                                                    </div>
                                                </div>
                                                <div style={{
                                                    padding: '16px',
                                                    background: 'var(--bg-tertiary)',
                                                    borderRadius: 'var(--radius-md)'
                                                }}>
                                                    <div style={{
                                                        fontSize: '2rem',
                                                        fontWeight: 700,
                                                        color: ledgerStatus.chain_intact ? 'var(--success)' : 'var(--danger)'
                                                    }}>
                                                        {ledgerStatus.chain_intact ? 'Yes' : 'No'}
                                                    </div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                        Chain Intact
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {ledgerStatus.issues && ledgerStatus.issues.length > 0 && (
                                            <div style={{ marginTop: '16px' }}>
                                                <h4 style={{ marginBottom: '12px', color: 'var(--danger)' }}>Issues Found:</h4>
                                                {ledgerStatus.issues.map((issue, index) => (
                                                    <div
                                                        key={index}
                                                        className="alert alert-danger"
                                                    >
                                                        <strong>Entry #{issue.entry_id}:</strong> {issue.issue}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Export Button */}
                            <div className="card">
                                <h3 className="card-title" style={{ marginBottom: '16px' }}>Export Ledger</h3>
                                <p style={{ marginBottom: '16px' }}>
                                    Download the complete evidence ledger for audit purposes.
                                </p>
                                <button
                                    onClick={async () => {
                                        try {
                                            const response = await ledgerAPI.export();
                                            const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `evidence_ledger_${new Date().toISOString().split('T')[0]}.json`;
                                            a.click();
                                            URL.revokeObjectURL(url);
                                            toast.success('Ledger exported successfully');
                                        } catch (error) {
                                            toast.error('Export failed');
                                        }
                                    }}
                                    className="btn btn-primary"
                                >
                                    <FiDatabase /> Export to JSON
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminPanel;

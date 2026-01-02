import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
    FiShield,
    FiHome,
    FiUploadCloud,
    FiFileText,
    FiAlertTriangle,
    FiSettings,
    FiLogOut,
    FiUser
} from 'react-icons/fi';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
        { path: '/analysis', icon: FiUploadCloud, label: 'Media Analysis' },
        { path: '/results', icon: FiFileText, label: 'Results' },
        { path: '/incidents', icon: FiAlertTriangle, label: 'Incidents' },
    ];

    if (user?.role === 'admin') {
        navItems.push({ path: '/admin', icon: FiSettings, label: 'Admin Panel' });
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">
                    <FiShield />
                </div>
                <h1>Sentinel Shield</h1>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon className="icon" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="nav-item" style={{ marginBottom: '8px', cursor: 'default' }}>
                    <FiUser className="icon" />
                    <div>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{user?.username}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role}</div>
                    </div>
                </div>
                <button
                    className="nav-item"
                    onClick={handleLogout}
                    style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}
                >
                    <FiLogOut className="icon" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

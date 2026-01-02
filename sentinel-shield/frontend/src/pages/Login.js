import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';
import { FiShield, FiUser, FiLock, FiMail, FiArrowRight } from 'react-icons/fi';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const result = await login(formData.username, formData.password);
                if (result.success) {
                    toast.success('Welcome back!');
                    navigate('/dashboard');
                } else {
                    toast.error(result.error);
                }
            } else {
                if (formData.password !== formData.confirmPassword) {
                    toast.error('Passwords do not match');
                    setLoading(false);
                    return;
                }
                const result = await register(formData.username, formData.email, formData.password);
                if (result.success) {
                    toast.success('Account created successfully!');
                    navigate('/dashboard');
                } else {
                    toast.error(result.error);
                }
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card fade-in">
                <div className="login-header">
                    <div className="logo">
                        <FiShield />
                    </div>
                    <h2>Sentinel Shield</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                        {isLogin ? 'Sign in to your account' : 'Create your account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <div style={{ position: 'relative' }}>
                            <FiUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                name="username"
                                className="form-input"
                                style={{ paddingLeft: '40px' }}
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <div style={{ position: 'relative' }}>
                                <FiMail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    style={{ paddingLeft: '40px' }}
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                style={{ paddingLeft: '40px' }}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-input"
                                    style={{ paddingLeft: '40px' }}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '14px', marginTop: '8px' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading-spinner" style={{ width: '20px', height: '20px' }}></span>
                        ) : (
                            <>
                                {isLogin ? 'Sign In' : 'Create Account'}
                                <FiArrowRight />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            style={{
                                marginLeft: '8px',
                                background: 'none',
                                border: 'none',
                                color: 'var(--accent-primary)',
                                cursor: 'pointer',
                                fontWeight: 500
                            }}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>

                {isLogin && (
                    <div style={{
                        marginTop: '24px',
                        padding: '16px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem'
                    }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Demo Credentials:</p>
                        <p style={{ color: 'var(--text-primary)' }}>
                            <strong>Username:</strong> admin<br />
                            <strong>Password:</strong> admin123
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;

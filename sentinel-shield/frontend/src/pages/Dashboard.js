import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { detectionAPI, incidentsAPI } from '../services/api';
import {
    FiShield,
    FiAlertTriangle,
    FiCheckCircle,
    FiActivity,
    FiTrendingUp,
    FiUploadCloud,
    FiArrowRight
} from 'react-icons/fi';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_analyses: 0,
        deepfakes_detected: 0,
        authentic_files: 0,
        high_risk_count: 0,
        detection_rate: 0
    });
    const [incidentSummary, setIncidentSummary] = useState(null);
    const [recentResults, setRecentResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, incidentsRes, resultsRes] = await Promise.all([
                detectionAPI.getStats(),
                incidentsAPI.getSummary(),
                detectionAPI.getResults()
            ]);

            setStats(statsRes.data);
            setIncidentSummary(incidentsRes.data);
            setRecentResults(resultsRes.data.results?.slice(0, 5) || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const doughnutData = {
        labels: ['Deepfakes', 'Authentic', 'Inconclusive'],
        datasets: [{
            data: [
                stats.deepfakes_detected || 0,
                stats.authentic_files || 0,
                Math.max(0, (stats.total_analyses || 0) - (stats.deepfakes_detected || 0) - (stats.authentic_files || 0))
            ],
            backgroundColor: ['#ef4444', '#22c55e', '#f59e0b'],
            borderWidth: 0,
        }]
    };

    const riskData = {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{
            label: 'Incidents by Risk Level',
            data: incidentSummary ? [
                incidentSummary.by_risk_level?.critical || 0,
                incidentSummary.by_risk_level?.high || 0,
                incidentSummary.by_risk_level?.medium || 0,
                incidentSummary.by_risk_level?.low || 0
            ] : [0, 0, 0, 0],
            backgroundColor: ['#dc2626', '#ef4444', '#f59e0b', '#22c55e'],
            borderRadius: 6,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#94a3b8',
                    padding: 16,
                    font: { size: 12 }
                }
            }
        }
    };

    const barOptions = {
        ...chartOptions,
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
            },
            y: {
                grid: { color: '#2d2d4a' },
                ticks: { color: '#94a3b8' }
            }
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ marginBottom: '8px' }}>Dashboard</h1>
                <p>Real-time threat intelligence overview</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">{stats.total_analyses}</div>
                            <div className="stat-label">Total Analyses</div>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'var(--info-bg)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FiActivity size={24} color="var(--info)" />
                        </div>
                    </div>
                </div>

                <div className="stat-card danger">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">{stats.deepfakes_detected}</div>
                            <div className="stat-label">Deepfakes Detected</div>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'var(--danger-bg)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FiAlertTriangle size={24} color="var(--danger)" />
                        </div>
                    </div>
                </div>

                <div className="stat-card success">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">{stats.authentic_files}</div>
                            <div className="stat-label">Authentic Files</div>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'var(--success-bg)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FiCheckCircle size={24} color="var(--success)" />
                        </div>
                    </div>
                </div>

                <div className="stat-card warning">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">{stats.high_risk_count}</div>
                            <div className="stat-label">High Risk Threats</div>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'var(--warning-bg)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FiShield size={24} color="var(--warning)" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {/* Detection Overview Chart */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Detection Overview</h3>
                    </div>
                    <div style={{ height: '280px' }}>
                        <Doughnut data={doughnutData} options={chartOptions} />
                    </div>
                </div>

                {/* Risk Distribution Chart */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Risk Distribution</h3>
                    </div>
                    <div style={{ height: '280px' }}>
                        <Bar data={riskData} options={barOptions} />
                    </div>
                </div>
            </div>

            {/* Quick Actions & Recent Results */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {/* Quick Actions */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Quick Actions</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link to="/analysis" className="btn btn-primary" style={{ justifyContent: 'space-between' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiUploadCloud /> Upload & Analyze Media
                            </span>
                            <FiArrowRight />
                        </Link>
                        <Link to="/incidents" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiAlertTriangle /> View Active Incidents
                            </span>
                            <FiArrowRight />
                        </Link>
                        <Link to="/results" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiTrendingUp /> Analysis History
                            </span>
                            <FiArrowRight />
                        </Link>
                    </div>
                </div>

                {/* Recent Results */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Analyses</h3>
                        <Link to="/results" style={{ fontSize: '0.875rem' }}>View All</Link>
                    </div>
                    {recentResults.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {recentResults.map((result) => (
                                <div
                                    key={result.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px',
                                        background: 'var(--bg-tertiary)',
                                        borderRadius: 'var(--radius-md)'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                                            Analysis #{result.id}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            Confidence: {(result.confidence * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                    <span className={`badge ${result.result === 'DEEPFAKE' ? 'badge-danger' : result.result === 'AUTHENTIC' ? 'badge-success' : 'badge-warning'}`}>
                                        {result.result}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                            No analyses yet. Upload media to get started.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

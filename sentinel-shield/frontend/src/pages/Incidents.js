import React, { useState, useEffect } from 'react';
import { incidentsAPI } from '../services/api';
import {
    FiAlertTriangle,
    FiAlertOctagon,
    FiClock,
    FiShield,
    FiChevronRight,
    FiFilter
} from 'react-icons/fi';

const Incidents = () => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [riskFilter, setRiskFilter] = useState('all');

    useEffect(() => {
        fetchIncidents();
    }, [riskFilter]);

    const fetchIncidents = async () => {
        try {
            const params = riskFilter !== 'all' ? { risk_level: riskFilter } : {};
            const response = await incidentsAPI.getAll(params);
            setIncidents(response.data.incidents || []);
        } catch (error) {
            console.error('Error fetching incidents:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchIncidentDetails = async (id) => {
        try {
            const response = await incidentsAPI.get(id);
            setSelectedIncident(response.data);
        } catch (error) {
            console.error('Error fetching incident details:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const getRiskIcon = (level) => {
        switch (level) {
            case 'CRITICAL':
                return <FiAlertOctagon color="var(--risk-critical)" size={20} />;
            case 'HIGH':
                return <FiAlertTriangle color="var(--risk-high)" size={20} />;
            default:
                return <FiShield color="var(--risk-medium)" size={20} />;
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
                <h1 style={{ marginBottom: '8px' }}>Incident Logs</h1>
                <p>Track and manage detected deepfake incidents</p>
            </div>

            {/* Risk Level Filters */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <FiFilter style={{ alignSelf: 'center', color: 'var(--text-muted)' }} />
                {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((level) => (
                    <button
                        key={level}
                        onClick={() => setRiskFilter(level)}
                        className={`btn ${riskFilter === level ? 'btn-primary' : 'btn-secondary'}`}
                        style={{
                            borderColor: level !== 'all' ? `var(--risk-${level.toLowerCase()})` : undefined,
                            color: riskFilter !== level && level !== 'all' ? `var(--risk-${level.toLowerCase()})` : undefined
                        }}
                    >
                        {level === 'all' ? 'All Risks' : level}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedIncident ? '1fr 1fr' : '1fr', gap: '24px' }}>
                {/* Incidents List */}
                <div className="card">
                    <h3 className="card-title" style={{ marginBottom: '16px' }}>
                        Active Incidents ({incidents.length})
                    </h3>

                    {incidents.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {incidents.map((incident) => (
                                <div
                                    key={incident.id}
                                    onClick={() => fetchIncidentDetails(incident.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px',
                                        background: selectedIncident?.incident?.id === incident.id ?
                                            'var(--bg-hover)' : 'var(--bg-tertiary)',
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        border: '1px solid',
                                        borderColor: selectedIncident?.incident?.id === incident.id ?
                                            'var(--accent-primary)' : 'transparent',
                                        transition: 'all var(--transition-fast)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {getRiskIcon(incident.risk_level)}
                                        <div>
                                            <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                                                Incident #{incident.id}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <FiClock size={12} />
                                                {formatDate(incident.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span className={`badge risk-${incident.risk_level?.toLowerCase()}`}>
                                            {incident.risk_level}
                                        </span>
                                        <FiChevronRight color="var(--text-muted)" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                            <FiShield size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <p>No incidents found</p>
                            <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>
                                {riskFilter !== 'all' ? 'Try changing the filter' : 'All clear!'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Incident Details */}
                {selectedIncident && (
                    <div className="card fade-in">
                        <div className="card-header">
                            <h3 className="card-title">Incident Details</h3>
                            <button
                                className="btn btn-secondary"
                                style={{ fontSize: '0.75rem' }}
                                onClick={() => setSelectedIncident(null)}
                            >
                                Close
                            </button>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            {/* Header Info */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '24px',
                                padding: '16px',
                                background: 'var(--danger-bg)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--danger)'
                            }}>
                                <FiAlertTriangle size={24} color="var(--danger)" />
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--danger)' }}>
                                        DEEPFAKE DETECTED
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        Confidence: {(selectedIncident.incident?.confidence * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '16px',
                                marginBottom: '24px'
                            }}>
                                <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Risk Level</div>
                                    <span className={`badge risk-${selectedIncident.incident?.risk_level?.toLowerCase()}`}>
                                        {selectedIncident.incident?.risk_level}
                                    </span>
                                </div>
                                <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Attack Type</div>
                                    <div style={{ fontWeight: 500 }}>{selectedIncident.incident?.attack_type || 'Unknown'}</div>
                                </div>
                            </div>

                            {/* Media Info */}
                            {selectedIncident.media && (
                                <div style={{ marginBottom: '24px' }}>
                                    <h4 style={{ marginBottom: '12px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        AFFECTED MEDIA
                                    </h4>
                                    <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                                            {selectedIncident.media.original_filename}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            Type: {selectedIncident.media.media_type} •
                                            Size: {(selectedIncident.media.file_size / 1024 / 1024).toFixed(2)} MB
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Recommendations */}
                            {selectedIncident.recommendations && (
                                <div>
                                    <h4 style={{ marginBottom: '12px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        RECOMMENDED ACTIONS
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {selectedIncident.recommendations.map((rec, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    padding: '12px',
                                                    background: 'var(--bg-tertiary)',
                                                    borderRadius: 'var(--radius-md)',
                                                    borderLeft: `3px solid ${rec.priority === 'IMMEDIATE' ? 'var(--danger)' :
                                                            rec.priority === 'HIGH' ? 'var(--warning)' : 'var(--info)'
                                                        }`
                                                }}
                                            >
                                                <div style={{
                                                    fontSize: '0.625rem',
                                                    fontWeight: 600,
                                                    color: rec.priority === 'IMMEDIATE' ? 'var(--danger)' :
                                                        rec.priority === 'HIGH' ? 'var(--warning)' : 'var(--info)',
                                                    marginBottom: '4px'
                                                }}>
                                                    {rec.priority}
                                                </div>
                                                <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                                                    {rec.action}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {rec.reason}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Incidents;

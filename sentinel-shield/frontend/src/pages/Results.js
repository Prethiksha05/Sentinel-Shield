import React, { useState, useEffect } from 'react';
import { detectionAPI, mediaAPI } from '../services/api';
import {
    FiFileText,
    FiVideo,
    FiMusic,
    FiClock,
    FiSearch,
    FiFilter,
    FiEye
} from 'react-icons/fi';

const Results = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResult, setSelectedResult] = useState(null);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await detectionAPI.getResults();
            setResults(response.data.results || []);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredResults = results.filter(result => {
        if (filter !== 'all' && result.result !== filter) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return result.id.toString().includes(query) ||
                result.attack_type?.toLowerCase().includes(query);
        }
        return true;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
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
                <h1 style={{ marginBottom: '8px' }}>Analysis Results</h1>
                <p>View all deepfake detection analysis history</p>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                flexWrap: 'wrap'
            }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                    <FiSearch style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                    }} />
                    <input
                        type="text"
                        className="form-input"
                        style={{ paddingLeft: '40px' }}
                        placeholder="Search by ID or attack type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['all', 'DEEPFAKE', 'AUTHENTIC', 'INCONCLUSIVE'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                        >
                            {f === 'all' ? 'All' : f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Table */}
            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Result</th>
                                <th>Confidence</th>
                                <th>Risk Level</th>
                                <th>Attack Type</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.length > 0 ? (
                                filteredResults.map((result) => (
                                    <tr key={result.id}>
                                        <td>
                                            <span style={{ fontWeight: 500 }}>#{result.id}</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${result.result === 'DEEPFAKE' ? 'badge-danger' :
                                                    result.result === 'AUTHENTIC' ? 'badge-success' : 'badge-warning'
                                                }`}>
                                                {result.result}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{
                                                    width: '60px',
                                                    height: '6px',
                                                    background: 'var(--bg-tertiary)',
                                                    borderRadius: '3px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        width: `${result.confidence * 100}%`,
                                                        height: '100%',
                                                        background: result.confidence > 0.7 ? 'var(--danger)' :
                                                            result.confidence > 0.4 ? 'var(--warning)' : 'var(--success)',
                                                        borderRadius: '3px'
                                                    }}></div>
                                                </div>
                                                <span style={{ fontSize: '0.875rem' }}>
                                                    {(result.confidence * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge risk-${result.risk_level?.toLowerCase()}`}>
                                                {result.risk_level}
                                            </span>
                                        </td>
                                        <td>
                                            {result.attack_type || '-'}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                <FiClock size={14} />
                                                {formatDate(result.created_at)}
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-icon btn-secondary"
                                                onClick={() => setSelectedResult(result)}
                                            >
                                                <FiEye />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                                        No results found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Result Detail Modal */}
            {selectedResult && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                    onClick={() => setSelectedResult(null)}
                >
                    <div
                        className="card fade-in"
                        style={{ maxWidth: '500px', width: '100%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header">
                            <h3 className="card-title">Analysis #{selectedResult.id}</h3>
                            <button
                                className="btn btn-icon btn-secondary"
                                onClick={() => setSelectedResult(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ marginTop: '16px' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '16px'
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Result</div>
                                    <span className={`badge ${selectedResult.result === 'DEEPFAKE' ? 'badge-danger' :
                                            selectedResult.result === 'AUTHENTIC' ? 'badge-success' : 'badge-warning'
                                        }`}>
                                        {selectedResult.result}
                                    </span>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Risk Level</div>
                                    <span className={`badge risk-${selectedResult.risk_level?.toLowerCase()}`}>
                                        {selectedResult.risk_level}
                                    </span>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Confidence</div>
                                    <div style={{ fontWeight: 600 }}>{(selectedResult.confidence * 100).toFixed(2)}%</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Attack Type</div>
                                    <div style={{ fontWeight: 500 }}>{selectedResult.attack_type || 'N/A'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Processing Time</div>
                                    <div>{selectedResult.processing_time?.toFixed(2)}s</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Model Version</div>
                                    <div>{selectedResult.model_version}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '16px' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Analyzed At</div>
                                <div>{formatDate(selectedResult.created_at)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Results;

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { mediaAPI, detectionAPI, ledgerAPI } from '../services/api';
import {
    FiUploadCloud,
    FiFile,
    FiVideo,
    FiMusic,
    FiCheckCircle,
    FiAlertTriangle,
    FiX,
    FiPlay
} from 'react-icons/fi';

const MediaAnalysis = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [mediaInfo, setMediaInfo] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploadedFile(file);
        setAnalysisResult(null);
        setMediaInfo(null);
        setUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const response = await mediaAPI.upload(formData);

            clearInterval(progressInterval);
            setUploadProgress(100);
            setMediaInfo(response.data.media);
            toast.success('File uploaded successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Upload failed');
            setUploadedFile(null);
        } finally {
            setUploading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'audio/*': ['.mp3', '.wav', '.flac', '.ogg', '.m4a'],
            'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm']
        },
        maxSize: 100 * 1024 * 1024, // 100MB
        multiple: false
    });

    const handleAnalyze = async () => {
        if (!mediaInfo) return;

        setAnalyzing(true);
        setAnalysisResult(null);

        try {
            let response;
            if (mediaInfo.media_type === 'audio') {
                response = await detectionAPI.analyzeAudio(mediaInfo.id);
            } else {
                response = await detectionAPI.analyzeVideo(mediaInfo.id);
            }

            setAnalysisResult(response.data.analysis);

            // Auto-log to evidence ledger
            if (response.data.analysis.result === 'DEEPFAKE') {
                await ledgerAPI.log(response.data.analysis.id, 'Automated analysis completed');
                toast.warning('⚠️ Deepfake detected! Evidence logged.');
            } else {
                toast.success('Analysis complete!');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Analysis failed');
        } finally {
            setAnalyzing(false);
        }
    };

    const resetUpload = () => {
        setUploadedFile(null);
        setMediaInfo(null);
        setAnalysisResult(null);
        setUploadProgress(0);
    };

    const getFileIcon = () => {
        if (!uploadedFile) return FiFile;
        const type = uploadedFile.type;
        if (type.startsWith('video')) return FiVideo;
        if (type.startsWith('audio')) return FiMusic;
        return FiFile;
    };

    const FileIcon = getFileIcon();

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ marginBottom: '8px' }}>Media Analysis</h1>
                <p>Upload audio or video files for deepfake detection</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: analysisResult ? '1fr 1fr' : '1fr', gap: '24px' }}>
                {/* Upload Section */}
                <div className="card">
                    <h3 className="card-title" style={{ marginBottom: '20px' }}>Upload Media</h3>

                    {!uploadedFile ? (
                        <div
                            {...getRootProps()}
                            className={`upload-zone ${isDragActive ? 'active' : ''}`}
                        >
                            <input {...getInputProps()} />
                            <FiUploadCloud className="upload-icon" />
                            <h3>Drag & drop your file here</h3>
                            <p>or click to browse</p>
                            <p style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Supported: MP3, WAV, MP4, AVI, MOV (max 100MB)
                            </p>
                        </div>
                    ) : (
                        <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        background: 'var(--accent-gradient)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <FileIcon size={24} color="white" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 500, marginBottom: '4px' }}>{uploadedFile.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </div>
                                    </div>
                                </div>
                                <button onClick={resetUpload} className="btn btn-icon btn-secondary">
                                    <FiX />
                                </button>
                            </div>

                            {uploading && (
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                </div>
                            )}

                            {mediaInfo && !analysisResult && (
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '16px',
                                        color: 'var(--success)'
                                    }}>
                                        <FiCheckCircle />
                                        <span>Ready for analysis</span>
                                    </div>
                                    <button
                                        onClick={handleAnalyze}
                                        className="btn btn-primary"
                                        style={{ width: '100%' }}
                                        disabled={analyzing}
                                    >
                                        {analyzing ? (
                                            <>
                                                <span className="loading-spinner" style={{ width: '18px', height: '18px' }}></span>
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <FiPlay /> Start Analysis
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {analysisResult && (
                    <div className={`result-card fade-in`}>
                        <div className={`result-header ${analysisResult.result.toLowerCase()}`}>
                            <div>
                                <h3 style={{ marginBottom: '4px' }}>Analysis Result</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    Processed in {analysisResult.processing_time?.toFixed(2)}s
                                </p>
                            </div>
                            <span className={`badge ${analysisResult.result === 'DEEPFAKE' ? 'badge-danger' :
                                    analysisResult.result === 'AUTHENTIC' ? 'badge-success' : 'badge-warning'
                                }`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
                                {analysisResult.result}
                            </span>
                        </div>

                        <div className="result-body">
                            {/* Confidence Meter */}
                            <div className="confidence-meter">
                                <div className="confidence-label">
                                    <span>Confidence Score</span>
                                    <span style={{ fontWeight: 600 }}>{(analysisResult.confidence * 100).toFixed(1)}%</span>
                                </div>
                                <div className="confidence-bar">
                                    <div
                                        className={`confidence-fill ${analysisResult.confidence > 0.5 ? 'high' : 'low'}`}
                                        style={{ width: `${analysisResult.confidence * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Details */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
                                <div style={{
                                    padding: '16px',
                                    background: 'var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-md)'
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                        RISK LEVEL
                                    </div>
                                    <span className={`badge risk-${analysisResult.risk_level?.toLowerCase()}`}>
                                        {analysisResult.risk_level}
                                    </span>
                                </div>

                                {analysisResult.attack_type && (
                                    <div style={{
                                        padding: '16px',
                                        background: 'var(--bg-tertiary)',
                                        borderRadius: 'var(--radius-md)'
                                    }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                            ATTACK TYPE
                                        </div>
                                        <div style={{ fontWeight: 500 }}>{analysisResult.attack_type}</div>
                                    </div>
                                )}
                            </div>

                            {/* Warning for Deepfakes */}
                            {analysisResult.result === 'DEEPFAKE' && (
                                <div className="alert alert-danger" style={{ marginTop: '24px' }}>
                                    <FiAlertTriangle size={20} />
                                    <div>
                                        <strong>Warning:</strong> This media has been identified as potentially manipulated.
                                        Exercise caution and verify through additional sources.
                                    </div>
                                </div>
                            )}

                            {/* Analyze Another */}
                            <button
                                onClick={resetUpload}
                                className="btn btn-secondary"
                                style={{ width: '100%', marginTop: '24px' }}
                            >
                                Analyze Another File
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaAnalysis;

# 🛡️ Project Sentinel Shield

### Real-Time Deepfake Detection & Threat Intelligence System

---

## 📌 Overview

**Project Sentinel Shield** is a full-stack AI-powered security system designed to detect, analyze, and assess **weaponized deepfake audio and video content**. The system provides real-time authenticity verification, risk assessment, and forensic evidence logging.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The API will be available at `http://localhost:5000`

**Default Login:**
- Username: `admin`
- Password: `admin123`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The web app will be available at `http://localhost:3000`

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Chart.js, React Router |
| Backend | Python Flask, Flask-JWT-Extended |
| Database | SQLite (SQLAlchemy ORM) |
| AI/ML | OpenCV, Librosa, NumPy |

---

## 📂 Project Structure

```
sentinel-shield/
├── frontend/                 # React Application
│   ├── public/
│   └── src/
│       ├── auth/            # Authentication context
│       ├── components/      # Reusable components
│       ├── pages/           # Page components
│       └── services/        # API services
│
├── backend/                  # Flask API Server
│   ├── app.py              # Application entry point
│   ├── config.py           # Configuration
│   ├── models/             # Database models
│   ├── routes/             # API endpoints
│   └── ai_engine/          # Detection modules
│
└── database/
    └── schema.sql          # Database schema
```

---

## 🖥️ Features

### Dashboard
- Real-time threat statistics
- Detection rate visualizations
- Risk distribution charts
- Recent analysis history

### Media Analysis
- Drag-and-drop file upload
- Audio deepfake detection (Voice Clone, TTS, Splice)
- Video deepfake detection (Face Swap, Lip Sync)
- Confidence scoring and risk assessment

### Incident Management
- Filtered incident logs
- Risk-level categorization
- Actionable recommendations
- Evidence tracking

### Admin Panel
- User management (RBAC)
- Evidence ledger verification
- Blockchain-like audit trail
- Data export functionality

---

## ⚙️ API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/auth/register` | POST | User registration |
| `/api/media/upload` | POST | Upload media file |
| `/api/detect/audio` | POST | Analyze audio |
| `/api/detect/video` | POST | Analyze video |
| `/api/incidents` | GET | Get incidents |
| `/api/ledger/verify` | POST | Verify ledger integrity |

---

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **Role-Based Access** - Admin, Analyst, Viewer roles
- **Evidence Ledger** - Blockchain-like tamper detection
- **Input Validation** - Request sanitization

---

## 🧠 AI Detection

### Audio Analysis
- Spectrogram extraction with Librosa
- MFCC feature analysis
- Voice cloning detection
- TTS synthesis identification

### Video Analysis
- Frame sampling with OpenCV
- Face detection and tracking
- Temporal consistency checks
- Lip-sync detection

---

## 📈 Future Enhancements

- [ ] Real-time video stream analysis
- [ ] Pre-trained deep learning models
- [ ] Federated learning support
- [ ] Mobile application
- [ ] Blockchain ledger integration

---

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for security professionals**

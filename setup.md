# Sahayak AI Setup Guide

## 🚀 Quick Setup Commands

### 1. **Database Setup** (Already done by you)
```bash
# Database is already created as 'sahayak'
# Schema is in database_schema.sql
```

### 2. **Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Install Node.js dependencies
npm install

# Create .env file (copy from env.example)
copy env.example .env

# Edit .env file with your database credentials
# DB_USER=postgres
# DB_HOST=localhost
# DB_NAME=sahayak
# DB_PASSWORD=1234
# DB_PORT=5432
# JWT_SECRET=your-super-secret-jwt-key
# GEMINI_API_KEY=your-gemini-api-key

# Start backend server
npm run dev
```

### 3. **Frontend Setup**
```bash
# Open new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

### 4. **Python Environment Setup** (Optional)
```bash
# Create Python virtual environment
python -m venv sahayak-env

# Activate virtual environment
# Windows:
sahayak-env\Scripts\activate
# Linux/Mac:
source sahayak-env/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run Stable Diffusion server (optional)
python src/services/ai/stable_diffusion_server.py
```

## 📁 Project Structure
```
gemini-clone/
├── backend/                 # Node.js Express server
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── package.json
│   └── server.js
├── frontend/               # React application
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── database_schema.sql     # Database schema
├── requirements.txt        # Python dependencies
└── setup.md               # This file
```

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=sahayak
DB_PASSWORD=1234
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-gemini-api-key
PORT=5000
```

### Frontend Configuration
- API base URL: `http://localhost:5000/api`
- Frontend runs on: `http://localhost:5173`

## 🎯 Running the Application

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Access Application**: Open `http://localhost:5173`

## 🐍 Python Models (Optional)

### TinyLlama Example
```bash
cd frontend/src/services/ai
python tinyllama_example.py
```

### Stable Diffusion Server
```bash
cd frontend/src/services/ai
python stable_diffusion_server.py
```

## 🔍 Troubleshooting

### Common Issues:
1. **Database Connection**: Ensure PostgreSQL is running
2. **Port Conflicts**: Change PORT in .env if needed
3. **CORS Issues**: Backend is configured to allow frontend origin
4. **Python Dependencies**: Use virtual environment

### Health Checks:
- Backend: `http://localhost:5000/health`
- Frontend: `http://localhost:5173` 
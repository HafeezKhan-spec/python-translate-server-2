# English to Telugu Translation Web Application

A full-stack MERN application for translating English text to Telugu with user authentication, translation history, and a modern UI.

## Features

- User authentication (signup, login, password reset)
- English to Telugu translation
- Translation history tracking
- Dark/light mode toggle
- Profile management
- Responsive design for all devices

## Tech Stack

### Frontend
- React.js
- Material-UI
- React Router
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication

### Translation Server
- Python
- FastAPI

## Installation and Setup

### Prerequisites
- Node.js
- MongoDB
- Python 3.7+

### Frontend and Backend Setup

1. Clone the repository:
```
git clone <repository-url>
cd english-telugu-translator
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/telugu-translator
JWT_SECRET=your_jwt_secret_key_change_in_production
```

4. Start the development servers:
```
npm run dev:all
```

This will start both the React frontend and Express backend in development mode.

### Python Translation Server Setup

1. Navigate to the Python server directory:
```
cd python-translate-server
```

2. Create a virtual environment and activate it:
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Start the FastAPI server:
```
python app.py
```

## Usage

After starting all the servers:

1. Frontend will be available at: http://localhost:5173
2. Backend API will be available at: http://localhost:5000/api
3. Python translation server will be available at: http://localhost:8000

## Development Notes

### Production Deployment

For production deployment:

1. Build the React frontend:
```
npm run build
```

2. Set up proper environment variables for production
3. Use a process manager like PM2 for the Node.js server
4. Deploy the Python server with Gunicorn or similar WSGI server

### Real Translation Model Integration

The current Python server uses a mock translation. To integrate a real MBART or other translation model:

1. Install additional dependencies (uncomment in requirements.txt)
2. Modify the `translate_to_telugu` function in `app.py` to use a pre-trained model
3. Ensure you have adequate hardware resources for running the model

## License

MIT
const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://your-backend-name.railway.app' // This will be replaced by the user eventually
    : 'http://localhost:5000';

export default API_URL;

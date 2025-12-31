const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://web2-project-phase2-production.up.railway.app'
    : 'http://localhost:5000';

export default API_URL;

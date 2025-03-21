import axios from 'axios';

// const BASE_URL = 'https://api.meteo.lt/v1';

const BASE_URL = import.meta.env.PROD ? window.location.origin : 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

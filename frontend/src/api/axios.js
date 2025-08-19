import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: ' https://job-portal-bgml.onrender.com/api', // 👈 your live backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

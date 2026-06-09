import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
});

apiClient.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user?.token) {
        config.headers.Authorization = `${user.type || 'Bearer'} ${user.token}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('auth:logout'));
        }

        return Promise.reject(error);
    }
);

export default apiClient;

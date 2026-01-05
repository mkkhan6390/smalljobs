import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

api.interceptors.request.use(function (config) {
    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const token = getCookie('csrftoken');
    if (token) {
        config.headers['X-CSRFToken'] = token;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default api;

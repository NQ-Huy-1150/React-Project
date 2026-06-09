import apiClient from './apiClient';

const BASE_URL = "/api/v1/auth/";
const register = (firstName, lastName, username, email, password, phoneNumber,
    confirmPassword) => {
    return apiClient.post(BASE_URL + 'signup', {
        firstName, lastName, username,
        email, password, confirmPassword, phoneNumber
    });
};
const login = (username, password) => {
    return apiClient.post(BASE_URL + 'signin', {
        username,
        password
    }).then(response => {
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    });
};
const logout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth:logout'));
}
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
}
const AuthService = {
    register,
    login,
    logout,
    getCurrentUser
}
export default AuthService;

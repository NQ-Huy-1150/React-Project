import apiClient from './apiClient';

const unwrapApiResponse = (response) => response.data?.result ?? response.data;

export const getMyProfile = async () => {
    const response = await apiClient.get('/users/me');
    return unwrapApiResponse(response);
};

export const updateMyProfile = async (payload) => {
    const response = await apiClient.put('/users/me', payload);
    return unwrapApiResponse(response);
};

const UserService = {
    getMyProfile,
    updateMyProfile,
};

export default UserService;

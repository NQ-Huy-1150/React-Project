import apiClient from "../../../service/apiClient";

const BASE_URL = '/api/v1/catalog/'
export const createCatalog = (item) => {
    const payload = {
        title: item.title || 'Untitled'
    };
    return apiClient.post(BASE_URL + 'create-catalog', payload)
        .then(response => {
            return response.data;
        });
}
export const getAllCatalog = () => {
    return apiClient.get(BASE_URL + 'fetch-all-catalog')
        .then(response => {
            return response.data;
        })
}
export const updateCatalog = (item) => {
    const payload = {
        id: item.id,
        title: item.title
    };
    return apiClient.post(BASE_URL + 'update-catalog', payload)
        .then(response => {
            console.log(response.data);
        });
}
export const deleteCatalog = (id) => {
    return apiClient.delete(BASE_URL + `delete/${id}`)
        .then(response => {
            console.log(response.data);
        });
}

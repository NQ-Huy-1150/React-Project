import axios from "axios";
const BASE_URL = 'http://localhost:8080/api/v1/catalog/'
export const createCatalog = (item) => {
    const payload = {
        title: item.title || 'Untitled'
    };
    return axios.post(BASE_URL + 'create-catalog', payload)
        .then(response => {
            return response.data;
        });
}
export const getAllCatalog = () => {
    return axios.get(BASE_URL + 'fetch-all-catalog')
        .then(response => {
            return response.data;
        })
}
export const updateCatalog = (item) => {
    const payload = {
        id: item.id,
        title: item.title
    };
    return axios.post(BASE_URL + 'update-catalog', payload)
        .then(response => {
            console.log(response.data);
        });
}
export const deleteCatalog = (id) => {
    return axios.delete(BASE_URL + `delete/${id}`)
        .then(response => {
            console.log(response.data);
        });
}

import apiClient from "../../../service/apiClient";
import { requireAuth } from "../../../service/authGuard";

const BASE_URL = '/api/v1/catalog/'
export const createCatalog = (item) => {
    requireAuth();
    const payload = {
        title: item.title || 'Chưa đặt tên'
    };
    return apiClient.post(BASE_URL + 'create-catalog', payload)
        .then(response => {
            return response.data;
        });
}
export const getAllCatalog = () => {
    requireAuth();
    return apiClient.get(BASE_URL + 'fetch-all-catalog')
        .then(response => {
            return response.data;
        })
}
export const updateCatalog = (item) => {
    requireAuth();
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
    requireAuth();
    return apiClient.delete(BASE_URL + `delete/${id}`)
        .then(response => {
            console.log(response.data);
        });
}

export const NotesCatalogLoader = async () => {
    requireAuth();
    const [catalogs, notesResponse, todoListsResponse] = await Promise.all([
        apiClient.get(BASE_URL + 'fetch-all-catalog'),
        apiClient.get('/api/v1/note/get-all-notes'),
        apiClient.get('/api/v1/get-todolists'),
    ]);

    return {
        catalogs: catalogs.data,
        notes: notesResponse.data,
        todoLists: todoListsResponse.data,
    };
};

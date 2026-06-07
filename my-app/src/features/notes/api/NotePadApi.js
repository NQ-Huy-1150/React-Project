import axios from "axios";
const BASE_URL = "http://localhost:8080/api/v1/note/";
export const CreateNotePad = async (payload) => {
    return axios.post(BASE_URL + "create-notepad", payload)
        .then(response => {
            console.log(response.data);
        });
}
export const UpdateNotePad = async (payload) => {
    return axios.put(BASE_URL + "update-notepad", payload)
        .then(response => {
            console.log(response.data);
        });
}
export const GetAllNotePad = async () => {
    return axios.get(BASE_URL + "get-all-notes")
        .then(response => {
            return response.data;
        });
}
export const GetDeleteById = (id) => {
    return axios.delete(BASE_URL + `delete/${id}`)
        .then(response => {
            console.log(response.data);
        });;
}
export const NotePadAction = async ({ request }) => {
    try {
        const dataForm = await request.formData();
        const rawId = dataForm.get("id");
        const id = rawId ? +rawId : null;
        const rawCatalogId = dataForm.get('catalogId');
        const catalogId = rawCatalogId ? +rawCatalogId : null;
        const payload = {
            id: id,
            title: dataForm.get("title")?.toString().trim() || "Untitled",
            content: dataForm.get("content")?.toString().trim(),
            createdAt: null,
            updatedAt: null,
            catalogId: catalogId
        };
        console.log(payload);
        if (!payload.content) {
            return { error: "Content can not empty." };
        }
        if (payload.id == null) {
            await CreateNotePad(payload);
        }
        else {
            await UpdateNotePad(payload);
        }

    } catch (error) {
        return {
            error: error.response?.data?.message || "Cant connect to server !"
        }
    }

};
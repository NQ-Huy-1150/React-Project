import apiClient from "../../../service/apiClient";
import { requireAuth } from "../../../service/authGuard";

const BASE_URL = "/api/v1/note/";
export const CreateNotePad = async (payload) => {
    return apiClient.post(BASE_URL + "create-notepad", payload)
        .then(response => {
            console.log(response.data);
        });
}
export const UpdateNotePad = async (payload) => {
    return apiClient.put(BASE_URL + "update-notepad", payload)
        .then(response => {
            console.log(response.data);
        });
}
export const GetAllNotePad = async () => {
    requireAuth();
    return apiClient.get(BASE_URL + "get-all-notes")
        .then(response => {
            return response.data;
        });
}
export const GetDeleteById = (id) => {
    return apiClient.delete(BASE_URL + `delete/${id}`)
        .then(response => {
            console.log(response.data);
        });;
}
export const NotePadAction = async ({ request }) => {
    try {
        requireAuth();
        const dataForm = await request.formData();
        const intent = dataForm.get("intent");
        const rawId = dataForm.get("id");
        const id = rawId ? +rawId : null;

        if (intent === "delete") {
            if (id == null) return { error: "Note id is required." };
            await GetDeleteById(id);
            return { message: "Deleted successfully." };
        }

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

        return { message: "Saved successfully." };

    } catch (error) {
        return {
            error: error.response?.data?.message || "Cant connect to server !"
        }
    }

};

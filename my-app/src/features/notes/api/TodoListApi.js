import apiClient from "../../../service/apiClient";
import { requireAuth } from "../../../service/authGuard";

const BASE_URL = "/api/v1/";
export const CreateTodoList = async (payload) => {
    return apiClient.post(BASE_URL + "create-todolist", payload)
        .then(response => {
            console.log(response.data);
        });
}
export const ModifyTodoList = async (payload) => {
    return apiClient.put(BASE_URL + "modify-todolist", payload)
        .then(response => {
            console.log(response.data);
        });
}
export const GetAllTodoList = async () => {
    requireAuth();
    return apiClient.get(BASE_URL + "get-todolists")
        .then(response => {
            return response.data;
        });
}
export const GetTodoListById = async (id = 1) => {
    return apiClient.get(BASE_URL + `todolist/${id}`)
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
export const TodoListAction = async ({ request }) => {
    try {
        requireAuth();
        const dataForm = await request.formData();
        const intent = dataForm.get("intent");
        const rawId = dataForm.get("id");
        const id = rawId ? +rawId : null;

        if (intent === "delete") {
            if (id == null) return { error: "Thiếu mã danh sách việc cần làm." };
            await GetDeleteById(id);
            return { message: "Xóa thành công." };
        }

        const rawCatalogId = dataForm.get('catalogId');
        const catalogId = rawCatalogId ? +rawCatalogId : null;
        const payload = {
            id: id,
            title: dataForm.get("title")?.toString().trim() || "Chưa đặt tên",
            todos: JSON.parse(dataForm.get("items") || "[]"),
            createdAt: null,
            updatedAt: null,
            catalogId: catalogId
        };
        if (!payload.todos.length) {
            return { error: "Danh sách cần có ít nhất một công việc." };
        }
        if (payload.id == null) {
            await CreateTodoList(payload);
        }
        else {
            await ModifyTodoList(payload);
        }

        return { message: "Lưu thành công." };

    } catch (error) {
        return {
            error: error.response?.data?.message || "Không thể kết nối tới server!"
        }
    }

};

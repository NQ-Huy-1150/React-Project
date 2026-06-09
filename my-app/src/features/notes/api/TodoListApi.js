import axios from "axios";
const BASE_URL = "http://localhost:8080/api/v1/";
export const CreateTodoList = async (payload) => {
    return axios.post(BASE_URL + "create-todolist", payload)
        .then(response => {
            console.log(response.data);
        });
}
export const ModifyTodoList = async (payload) => {
    return axios.put(BASE_URL + "modify-todolist", payload)
        .then(response => {
            console.log(response.data);
        });
}
export const GetAllTodoList = async () => {
    return axios.get(BASE_URL + "get-todolists")
        .then(response => {
            return response.data;
        });
}
export const GetTodoListById = async (id = 1) => {
    return axios.get(BASE_URL + `todolist/${id}`)
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
export const TodoListAction = async ({ request }) => {
    try {
        const dataForm = await request.formData();
        const intent = dataForm.get("intent");
        const rawId = dataForm.get("id");
        const id = rawId ? +rawId : null;

        if (intent === "delete") {
            if (id == null) return { error: "Todo list id is required." };
            await GetDeleteById(id);
            return { message: "Deleted successfully." };
        }

        const rawCatalogId = dataForm.get('catalogId');
        const catalogId = rawCatalogId ? +rawCatalogId : null;
        const payload = {
            id: id,
            title: dataForm.get("title")?.toString().trim() || "Untitled",
            todos: JSON.parse(dataForm.get("items") || "[]"),
            createdAt: null,
            updatedAt: null,
            catalogId: catalogId
        };
        if (!payload.todos.length) {
            return { error: "Todo list must have at least 1 item." };
        }
        if (payload.id == null) {
            await CreateTodoList(payload);
        }
        else {
            await ModifyTodoList(payload);
        }

        return { message: "Saved successfully." };

    } catch (error) {
        return {
            error: error.response?.data?.message || "Cant connect to server !"
        }
    }

};

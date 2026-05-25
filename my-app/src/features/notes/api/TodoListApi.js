const TodoListAction = async ({ request }) => {
    const dataForm = await request.formData();
    const payload = {
        title: dataForm.get("title")?.toString().trim() || "Untitled",
        items: JSON.parse(dataForm.get("items") || "[]"),
        createdAt: Date.now(),
        updatedAt: null
    };
    if (!payload.items.length) {
        return { error: "Todo list must have at least 1 item." };
    }

    return { message: 'successfully' }
};
export default TodoListAction;
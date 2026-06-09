import apiClient from '../../../service/apiClient';
import { requireAuth } from '../../../service/authGuard';

const BASE_URL = '/persionalexpensives';

const unwrapResult = (response) => response.data?.result ?? response.data;

export const getAllPersionalExpenses = async () => {
    const response = await apiClient.get(BASE_URL);
    return unwrapResult(response);
};

export const createPersionalExpense = async (payload) => {
    const response = await apiClient.post(BASE_URL, payload);
    return unwrapResult(response);
};

export const updatePersionalExpense = async (id, payload) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, payload);
    return unwrapResult(response);
};

export const deletePersionalExpense = async (id) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return unwrapResult(response);
};

const toNumber = (value) => {
    if (value === '' || value == null) return 0;
    return Number(value);
};

export const GetAllPersionalExpenses = async () => {
    requireAuth();
    return getAllPersionalExpenses();
};

export const PersionalExpensesAction = async ({ request }) => {
    try {
        requireAuth();
        const formData = await request.formData();
        const intent = formData.get('intent');
        const id = formData.get('id')?.toString() || null;

        if (intent === 'delete') {
            if (!id) return { error: 'Expense id is required.' };
            await deletePersionalExpense(id);
            return { message: 'Deleted successfully.' };
        }

        const payload = {
            month: formData.get('month') || null,
            totalIncome: toNumber(formData.get('totalIncome')),
            houseCost: toNumber(formData.get('houseCost')),
            foodCost: toNumber(formData.get('foodCost')),
            traveCost: toNumber(formData.get('traveCost')),
            otherCost1: toNumber(formData.get('otherCost1')),
            otherCost2: toNumber(formData.get('otherCost2')),
            otherCost3: toNumber(formData.get('otherCost3')),
            savingAndInvestment: toNumber(formData.get('savingAndInvestment')),
        };

        if (id) {
            await updatePersionalExpense(id, payload);
        } else {
            await createPersionalExpense(payload);
        }

        return { message: 'Saved successfully.' };
    } catch (error) {
        return {
            error: error.response?.data?.message || 'Cannot save personal expense.',
        };
    }
};

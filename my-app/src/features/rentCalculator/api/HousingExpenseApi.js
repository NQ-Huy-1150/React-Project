import apiClient from '../../../service/apiClient';
import { requireAuth } from '../../../service/authGuard';

const BASE_URL = '/housings';

const unwrapResult = (response) => response.data?.result ?? response.data;

export const getAllHousingExpenses = async () => {
    const response = await apiClient.get(BASE_URL);
    return unwrapResult(response);
};

export const createHousingExpense = async (payload) => {
    const response = await apiClient.post(BASE_URL, payload);
    return unwrapResult(response);
};

export const updateHousingExpense = async (id, payload) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, payload);
    return unwrapResult(response);
};

export const deleteHousingExpense = async (id) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return unwrapResult(response);
};

const toNumber = (value) => {
    if (value === '' || value == null) return 0;
    return Number(value);
};

export const GetAllHousingExpenses = async () => {
    requireAuth();
    return getAllHousingExpenses();
};

export const HousingExpenseAction = async ({ request }) => {
    try {
        requireAuth();
        const formData = await request.formData();
        const intent = formData.get('intent');
        const id = formData.get('id')?.toString() || null;

        if (intent === 'delete') {
            if (!id) return { error: 'Housing expense id is required.' };
            await deleteHousingExpense(id);
            return { message: 'Deleted successfully.' };
        }

        const payload = {
            id,
            month: formData.get('month') || null,
            housePrice: toNumber(formData.get('housePrice')),
            amoutOfElectric: toNumber(formData.get('amoutOfElectric')),
            electricityPrice: toNumber(formData.get('electricityPrice')),
            amoutOfWater: toNumber(formData.get('amoutOfWater')),
            waterPrice: toNumber(formData.get('waterPrice')),
            serviceCosts: toNumber(formData.get('serviceCosts')),
            othercosts: toNumber(formData.get('othercosts')),
        };

        if (payload.id) {
            await updateHousingExpense(payload.id, payload);
        } else {
            await createHousingExpense(payload);
        }

        return { message: 'Saved successfully.' };
    } catch (error) {
        return {
            error: error.response?.data?.message || 'Cannot save rent expense.',
        };
    }
};

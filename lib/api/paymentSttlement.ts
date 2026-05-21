import api from './api';

export const getPaymentSettlement = async () => {
  try {
    const response = await api.get('/supplier-settlement/supplier');
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const requestForTransfer = async (settlementId: string) => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await api.post(
      `/payment/request-transfer/${settlementId}`,
      {}, // body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    // ✅ Better Error Handling
    const errorMessage =
      error?.response?.data?.message || error?.response?.data?.error || 'Transfer request failed';

    throw new Error(errorMessage);
  }
};

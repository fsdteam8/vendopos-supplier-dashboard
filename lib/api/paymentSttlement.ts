import api from "./api";



export const getPaymentSettlement= async ()=> {
  try {
    const response = await api.get("/supplier-settlement/supplier");
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

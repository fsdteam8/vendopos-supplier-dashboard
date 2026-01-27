import api from "./api";



export async function getProductsRevenue(year: string | number = "2026") {
   try{
    const res= await api.get(`dashboard/supplier-charts?year=${year}`);
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to Fetch Your Profile please check everyting")
    }
   } 
    
}

export async function getAnalytics() {
   try{
    const res= await api.get(`/dashboard/supplier-analytics`);
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to Fetch Your Profile please check everyting")
    }
   } 
    
}

export async function getSalesTrend(year: string | number = "2026") {
   try{
    const res= await api.get(`/dashboard/supplier-order-charts?year=${year}`);
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to Fetch Your Profile please check everyting")
    }
   } 
    
}
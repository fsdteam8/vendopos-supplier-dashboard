export interface SupplierChartData {
    month: string;
    totalRevenue: number;
    sales: number;
}

export interface ProductAnalyticsData {
    supplierId: string;
    shopName: string;
    productName: string;
    year: number;
    chart: SupplierChartData[];
}

export interface ProductAnalyticsApiResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: ProductAnalyticsData;
}

export interface SaleCartItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    imageUrl: string;
}

export interface SaleCartData {
    userId: string;
    items: SaleCartItem[];
    totalAmount: number;
    itemCount: number;
}

export interface SaleCartApiResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: SaleCartData;
}
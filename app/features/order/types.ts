export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface BillingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface ProductImage {
  public_id: string;
  url: string;
  _id: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  images: ProductImage[];
}

export interface SupplierLogo {
  public_id: string;
  url: string;
}

export interface Supplier {
  _id: string;
  shopName: string;
  brandName: string;
  logo: SupplierLogo;
}

export interface Wholesale {
  _id: string;
  type: string;
  label: string;
}

export interface Order {
  [x: string]: ReactNode;
  _id: string;
  user: User;
  orderType: string;
  paymentType: string;
  paymentStatus: string;
  orderStatus: string;
  totalPrice: number;
  billingInfo: BillingInfo;
  purchaseDate: string;
  items: any[]; // Use 'any' for items to match the provided example structure
  meta?: Meta;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  orderStatus?: string;
  paymentStatus?: string;
  paymentType?: string;
  sort?: string;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface GetOrdersResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Order[];
  meta?: Meta;
}

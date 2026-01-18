export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  street?: string;
  location?: string;
  postalCode?: string;
  dateOfBirth?: string;
  image?: {
    url: string;
    publicId: string;
  };
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetProfileResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: UserProfile;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: UserProfile;
}

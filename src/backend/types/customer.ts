export interface CustomerEntity {
  id: string;
  phone: string;
  name: string;
  email: string | null;
  isActive: boolean;
  notes: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface CustomerAddressEntity {
  id: string;
  customerId: string;
  addressLine1: string;
  apartment: string | null;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
}

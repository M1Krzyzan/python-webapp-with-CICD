export interface Client {
  email: string;
  payment_address: Address;
  delivery_address: Address;
  nip: string;
  password: string;
  company_name: string;
}

export interface Address {
  voivodeship: string;
  city: string;
  street: string;
  postal_code: string;
  house_number: string;
}
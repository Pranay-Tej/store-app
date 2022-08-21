export interface Address {
  id: string;
  name: string;
  mobile: string;
  house: string;
  street: string;
  landmark?: string | null | undefined;
  city: string;
  pincode: string;
}

export type AddressResponse = Address & { __typename: 'addresses' | undefined };

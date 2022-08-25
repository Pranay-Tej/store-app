export const API_URL: string =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
export const NHOST_BASE_URL = import.meta.env.VITE_NHOST_BASE_URL as string;
export const SHIRUDO_BASE_URL = import.meta.env.VITE_SHIRUDO_BASE_URL as string;
export const SHIRUDO_APP_ID = import.meta.env.VITE_SHIRUDO_APP_ID as string;
export const NETLIFY_FUNCTIONS_BASE_URL = import.meta.env
  .VITE_NETLIFY_FUNCTIONS_BASE_URL as string;

export enum ORDER_STATUS {
  PAID = 'PAID',
  PAYMENT_PENDING = 'PAYMENT_PENDING'
}

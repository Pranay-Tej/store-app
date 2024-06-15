import { API_URL } from '@/constants/app.constants';
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: API_URL
});

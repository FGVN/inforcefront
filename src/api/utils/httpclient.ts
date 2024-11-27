// httpClient.ts
import axios, { AxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClientWithFormData = axios.create({
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const fetchJson = async (url: string, options: RequestInit = {}): Promise<any> => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

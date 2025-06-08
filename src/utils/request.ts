import axios from 'axios'
import type { InternalAxiosRequestConfig,AxiosInstance } from 'axios'


const service:AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

service.interceptors.request.use((config:InternalAxiosRequestConfig) => {
  return config;
})

service.interceptors.response.use((response) => {
  const { data } = response;
  return data;
})


export default service;
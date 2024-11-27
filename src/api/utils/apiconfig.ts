// apiConfig.ts
export const getApiUrl = (): string => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
      throw new Error('API URL is not defined');
    }
    return apiUrl;
  };
  
  export const getApiBaseUrl = (): string => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    if (!apiBaseUrl) {
      throw new Error('API BASE URL is not defined');
    }
    return apiBaseUrl;
  };
  
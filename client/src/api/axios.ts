import axios from 'axios';

const API_URL = 'http://localhost:3000';

const API = axios.create({ baseURL: API_URL, responseType: 'json' });

interface ApiRequestParams {
  url: string;
  token?: string;
  data?: Record<string, unknown>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  contentType?: string;
}

export const apiRequest = async ({
  url,
  token,
  data,
  method,
  contentType = 'application/json',
}: ApiRequestParams): Promise<Record<string, unknown>> => {
  try {
    const response = await API(url, {
      method: method || 'GET',
      data,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': contentType,
      },
      validateStatus: function (status) {
        return (
          status === 200 ||
          status === 201 ||
          status === 204 ||
          status === 400 ||
          status === 401 ||
          status === 403 ||
          status === 404 ||
          status === 409
        );
      },
    });
    return response?.data;
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: error instanceof Error ? error.message : 'Something went wrong',
    };
  }
};

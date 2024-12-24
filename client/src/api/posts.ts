import { apiRequest } from './axios';

export const gePosts = async (token?: string) => {
  try {
    const response = await apiRequest({ url: '/posts', token });
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const likePost = () => {};

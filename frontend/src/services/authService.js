import API from './api';

export const registerUser = async (payload) => {
  const response = await API.post('api/auth/register', payload);

  return response.data;
};

export const loginUser = async (payload) => {
  const response = await API.post('api/auth/login', payload);

  return response.data;
};

export const getProfile = async () => {
  const response = await API.get('/users/profile');

  return response.data;
};

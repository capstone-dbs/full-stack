import API from './api';

export const getChildren = async () => {
  const response = await API.get('/children');
  return response.data;
};

export const createChild = async (payload) => {
  const response = await API.post('/children', payload);

  return response.data;
};

export const updateChild = async (id, payload) => {
  const response = await API.put(`/children/${id}`, payload);

  return response.data;
};

export const deleteChild = async (id) => {
  const response = await API.delete(`/children/${id}`);

  return response.data;
};

export const getChildHistories = async (childId) => {
  const response = await API.get(
    `/children/${childId}/histories`
  );

  return response.data;
};
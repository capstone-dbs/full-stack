import API from './api';

export const createPrediction = async (payload) => {
  const response = await API.post('/predictions', payload);

  return response.data;
};

export const getPredictions = async () => {
  const response = await API.get('/predictions');

  return response.data;
};

export const getPredictionById = async (id) => {
  const response = await API.get(`/predictions/${id}`);

  return response.data;
};

export const deletePrediction = async (id) => {
  const response = await API.delete(`/predictions/${id}`);

  return response.data;
};

export const getPredictionHistories = async () => {
  const response = await API.get('/predictions/histories');

  return response.data;
};
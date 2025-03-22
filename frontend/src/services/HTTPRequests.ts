import api from './axios';

export async function getCities() {
  const response = await api.get('/places');

  return response.data;
}

export async function getCityForecast(cityCode: string) {
  const response = await api.post('/cityForecast', { cityCode });

  return response.data;
}

export async function sendCityData(cityName: string) {
  const response = await api.post('/cityName', { cityName });

  return response.data;
}

import api from './axios';
import { CitiesData } from './interfaces';

export async function getCities(): Promise<CitiesData[]> {
  const response = await api.get('/places');

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
}

export async function getCityForecast(cityCode: string) {
  const response = await api.post('/cityForecast', { cityCode });

  return response.data;
}

export async function sendCityData(cityName: string) {
  const response = await api.post('/cityName', { cityName });

  return response.data;
}

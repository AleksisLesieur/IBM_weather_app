import api from './axios';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CitiesData {
  code: string;
  name: string;
  administrativeDivision: string;
  country?: string;
  countryCode: string;
  coordinates: Coordinates;
}

export interface ForecastTimestamps {
  forecastTimeUtc: string;
  airTemperature: number;
  feelsLikeTemperature: number;
  windSpeed: number;
  windGust: number;
  windDirection: number;
  cloudCover: number;
  seaLevelPressure: number;
  relativeHumidity: number;
  totalPrecipitation: number;
  conditionCode: string;
}

export interface ForecastData {
  place: CitiesData;
  forecastType: string;
  forecastCreationTimeUtc: string;
  forecastTimestamps: ForecastTimestamps[];
}

export async function getCities(): Promise<CitiesData[]> {
  const response = await api.get('/places');

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
}

export async function getCityForecast(cityName: string) {
  const response = await api.post('/cityForecast', { cityName });

  console.log(response.data);

  return response.data;
}

// : Promise<ForecastData>

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

export interface DailyForecast {
  date: string;
  dayName: string;
  formattedDate: string;
  highTemp: number;
  lowTemp: number;
  conditions: string[];
  condition: string;
  humidity: number[];
  avgHumidity: number;
  windSpeed: number[];
  avgWindSpeed: number;
  forecasts: ForecastTimestamps[];
}

export interface ConditionCounts {
  [key: string]: number;
}

export interface DailyDataMap {
  [key: string]: DailyForecast;
}

export interface SearchCitiesProps {
  setSelectedCity: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCode: React.Dispatch<React.SetStateAction<string>>;
}

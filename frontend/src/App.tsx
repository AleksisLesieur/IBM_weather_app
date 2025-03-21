import React, { useState, useEffect } from 'react';
import { Search, Cloud, CloudRain, Sun, CloudSun, MapPin, Wind, Droplets, Gauge } from 'lucide-react';
import styles from './WeatherApp.module.scss';
import MostViewedCities from './MostViewedCities';
import SearchCities from './SearchCities';
import DisplayCityWeather from './DisplayCityWeather';
import DisplayCityFiveDayForecast from './DisplayFiveDayForecast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 0,
    },
  },
});

// 1. mano atveju... nebus taip jog darys vel uzklausa i api po 1 minutes?
// 2. kas tas retry? cia tipo jeigu kazkas nesuveikia bando vel?

function App() {
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <QueryClientProvider client={queryClient}>
      <div>A nice looking whatever...</div>
      <SearchCities setSelectedCity={setSelectedCity} />
      <MostViewedCities />
      <DisplayCityWeather selectedCity={selectedCity} />
      <DisplayCityFiveDayForecast selectedCity={selectedCity} />
    </QueryClientProvider>
  );
}

export default App;

import { useState } from 'react';
import styles from './App.module.scss';
import MostViewedCities from './pages/MostViewedCities';
import SearchCities from './pages/SearchCities';
import DisplayCityWeather from './pages/DisplayCityWeather';
import DisplayCityFiveDayForecast from './pages/DisplayFiveDayForecast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

function App() {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCode, setSelectedCode] = useState('');

  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.container}>
        <header className={styles.appHeader}>
          <h1>Weather Forecast</h1>
        </header>
        <div className={styles.searchContainer}>
          <SearchCities setSelectedCity={setSelectedCity} setSelectedCode={setSelectedCode} />
        </div>
        <section className={styles.cityGrid}>
          <MostViewedCities setSelectedCity={setSelectedCity} setSelectedCode={setSelectedCode} />
        </section>
        <section className={styles.weatherDisplay}>
          <DisplayCityWeather selectedCity={selectedCity} selectedCode={selectedCode} />
        </section>
        <section className={styles.forecastDisplay}>
          <DisplayCityFiveDayForecast selectedCity={selectedCity} selectedCode={selectedCode} />
        </section>
      </div>
    </QueryClientProvider>
  );
}

export default App;

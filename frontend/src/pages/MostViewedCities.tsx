import { useState, useEffect } from 'react';
import styles from './MostViewedCities.module.scss';
import { useQueryClient } from '@tanstack/react-query';
import { getCityForecast, sendCityData } from '../services/HTTPRequests';
import { SearchCitiesProps } from '../services/interfaces';

function MostViewedCities({ setSelectedCity, setSelectedCode }: SearchCitiesProps) {
  const [citiesArray, setCitiesArray] = useState<Array<{ code: string; name: string; views: number }>>([]);
  const queryClient = useQueryClient();

  const loadCityData = () => {
    const getCitiesName = localStorage.getItem('savedCitiesName');
    const getCitiesCodes = localStorage.getItem('savedCitiesCode');

    const parsedCitiesName = getCitiesName ? JSON.parse(getCitiesName) : {};
    const parsedCitiesCodes = getCitiesCodes ? JSON.parse(getCitiesCodes) : {};

    const newCitiesArray = Object.entries(parsedCitiesName).map(([code, name]) => ({
      code,
      name: name as string,
      views: parsedCitiesCodes[code] || 0,
    }));

    newCitiesArray.sort((a, b) => b.views - a.views);

    setCitiesArray(newCitiesArray);
  };

  const handleCityClick = (cityCode: string, cityName: string) => {
    setSelectedCity(cityName);

    setSelectedCode(cityCode);

    sendCityData(cityName);

    queryClient.prefetchQuery({
      queryKey: ['cityForecast', cityCode],
      queryFn: () => getCityForecast(cityCode),
    });
  };

  useEffect(() => {
    loadCityData();

    window.addEventListener('storage', loadCityData);

    window.addEventListener('localStorageChange', loadCityData);

    return () => {
      window.removeEventListener('storage', loadCityData);
      window.removeEventListener('localStorageChange', loadCityData);
    };
  }, []);

  const topCities = citiesArray.slice(0, 3);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Mostly Viewed</h3>
      {topCities.length > 0 ? (
        <div className={styles.citiesList}>
          {topCities.map((city) => (
            <div key={city.code} className={styles.cityItem} onClick={() => handleCityClick(city.code, city.name)}>
              <span className={styles.cityName}>{city.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No cities viewed yet</p>
      )}
    </div>
  );
}

export default MostViewedCities;

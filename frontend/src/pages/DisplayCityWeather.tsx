import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ForecastTimestamps, getCityForecast } from '../services/HTTPRequests';
import { useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudSun, MapPin, Wind, Droplets, Gauge, Thermometer } from 'lucide-react';
import LoadingSpinner from '../assets/loadingAnimation';
import styles from './DisplayCityWeather.module.scss';

function DisplayCityWeather({ selectedCity, selectedCode }: { selectedCity: string; selectedCode: string }) {
  const queryClient = useQueryClient();

  const { mutate, data, isPending, isError, error } = useMutation({
    mutationFn: () => getCityForecast(selectedCode),
    onSuccess: (data) => {
      // Store the result in the query cache for potential future use
      queryClient.setQueryData(['cityForecast', selectedCode], data);
    },
  });

  useEffect(() => {
    if (selectedCode) {
      mutate();
    }
  }, [selectedCode, mutate]);

  // Format the current time for display
  const formatCurrentTime = () => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${day}, ${month} ${date} at ${hours}:${formattedMinutes}`;
  };

  // Helper function to get weather icon based on condition code
  const getWeatherIcon = (conditionCode: string) => {
    // Map condition codes to icons
    switch (conditionCode.toLowerCase()) {
      case 'clear':
        return <Sun />;
      case 'isolated-clouds':
      case 'scattered-clouds':
      case 'overcast':
        return <Cloud />;
      case 'light-rain':
      case 'moderate-rain':
      case 'heavy-rain':
        return <CloudRain />;
      case 'partly-cloudy':
        return <CloudSun />;
      default:
        return <Cloud />;
    }
  };

  // Helper function to get readable condition name
  const getConditionName = (conditionCode: string) => {
    return conditionCode
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isPending)
    return (
      <div className={styles.loadingState}>
        <LoadingSpinner size={48} color="#4a6fa5" />
        <div className={styles.loadingText}>
          Loading forecast for <span className={styles.loadingCity}>{selectedCity}</span>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className={styles.errorState}>
        <div>Error loading forecast: {(error as Error).message}</div>
      </div>
    );

  if (!data || !data.forecastTimestamps || data.forecastTimestamps.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div>Select a city to display current weather</div>
      </div>
    );
  }

  // Get current forecast (first timestamp)
  const currentForecast = data.forecastTimestamps[0];

  return (
    <div className={styles.weatherContainer}>
      <div className={styles.weatherHeader}>
        <h2 className={styles.cityName}>
          <MapPin size={20} /> {selectedCity}
        </h2>
        <div className={styles.dateTime}>{formatCurrentTime()}</div>
      </div>

      <div className={styles.mainWeather}>
        <div className={styles.temperature}>
          <div className={styles.currentTemp}>{Math.round(currentForecast.airTemperature)}°C</div>
          <div className={styles.feelsLike}>Feels like {Math.round(currentForecast.feelsLikeTemperature)}°C</div>
        </div>
        <div className={styles.condition}>
          <div className={styles.conditionIcon}>{getWeatherIcon(currentForecast.conditionCode)}</div>
          <div className={styles.conditionText}>{getConditionName(currentForecast.conditionCode)}</div>
        </div>
      </div>

      <div className={styles.weatherDetailsGrid}>
        <div className={styles.weatherDetail}>
          <div className={styles.detailIcon}>
            <Droplets />
          </div>
          <div className={styles.detailContent}>
            <div className={styles.detailLabel}>Humidity</div>
            <div className={styles.detailValue}>{currentForecast.relativeHumidity}%</div>
          </div>
        </div>

        <div className={styles.weatherDetail}>
          <div className={styles.detailIcon}>
            <Gauge />
          </div>
          <div className={styles.detailContent}>
            <div className={styles.detailLabel}>Pressure</div>
            <div className={styles.detailValue}>{currentForecast.seaLevelPressure} hPa</div>
          </div>
        </div>

        <div className={styles.weatherDetail}>
          <div className={styles.detailIcon}>
            <Wind />
          </div>
          <div className={styles.detailContent}>
            <div className={styles.detailLabel}>Wind Speed</div>
            <div className={styles.detailValue}>{currentForecast.windSpeed} m/s</div>
          </div>
        </div>

        <div className={styles.weatherDetail}>
          <div className={styles.detailIcon}>
            <Wind />
          </div>
          <div className={styles.detailContent}>
            <div className={styles.detailLabel}>Wind Direction</div>
            <div className={styles.detailValue}>{currentForecast.windDirection}°</div>
          </div>
        </div>

        <div className={styles.weatherDetail}>
          <div className={styles.detailIcon}>
            <Wind />
          </div>
          <div className={styles.detailContent}>
            <div className={styles.detailLabel}>Wind Gust</div>
            <div className={styles.detailValue}>{currentForecast.windGust} m/s</div>
          </div>
        </div>

        <div className={styles.weatherDetail}>
          <div className={styles.detailIcon}>
            <Cloud />
          </div>
          <div className={styles.detailContent}>
            <div className={styles.detailLabel}>Cloud Cover</div>
            <div className={styles.detailValue}>{currentForecast.cloudCover}%</div>
          </div>
        </div>

        <div className={styles.weatherDetail}>
          <div className={styles.detailIcon}>
            <CloudRain />
          </div>
          <div className={styles.detailContent}>
            <div className={styles.detailLabel}>Precipitation</div>
            <div className={styles.detailValue}>{currentForecast.totalPrecipitation} mm</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayCityWeather;

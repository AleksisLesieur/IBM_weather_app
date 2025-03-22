import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSun,
  Calendar,
  Wind,
  Droplets,
  CloudLightning,
  CloudDrizzle,
  CloudHail,
  CloudSnow,
  Snowflake,
  CloudFog,
  CircleOff,
} from 'lucide-react';
import { ForecastTimestamps, getCityForecast } from '../services/HTTPRequests';
import { useEffect } from 'react';
import LoadingSpinner from '../assets/loadingAnimation';
import styles from './DisplayFiveDayForecast.module.scss';

function DisplayCityFiveDayForecast({ selectedCity, selectedCode }: { selectedCity: string; selectedCode: string }) {
  const queryClient = useQueryClient();

  const { mutate, data, isPending, isError, error } = useMutation({
    mutationFn: () => getCityForecast(selectedCode),
    onSuccess: (data) => {
      queryClient.setQueryData(['cityForecast', selectedCity], data);
    },
  });

  useEffect(() => {
    if (selectedCity) {
      mutate();
    }
  }, [selectedCity, mutate]);

  const getWeatherIcon = (conditionCode: string) => {
    switch (conditionCode.toLowerCase()) {
      case 'clear':
        return <Sun />;
      case 'partly-cloudy':
        return <CloudSun />;
      case 'cloudy-with-sunny-intervals':
        return <CloudSun />;
      case 'cloudy':
        return <Cloud />;
      case 'light-rain':
        return <CloudDrizzle />;
      case 'rain':
        return <CloudRain />;
      case 'heavy-rain':
        return <CloudRain size={24} strokeWidth={2.5} />;
      case 'thunder':
        return <CloudLightning />;
      case 'isolated-thunderstorms':
        return <CloudLightning />;
      case 'thunderstorms':
        return <CloudLightning />;
      case 'heavy-rain-with-thunderstorms':
        return <CloudLightning size={24} strokeWidth={2.5} />;
      case 'light-sleet':
      case 'sleet':
        return <CloudDrizzle />;
      case 'freezing-rain':
        return <CloudDrizzle />;
      case 'hail':
        return <CloudHail />;
      case 'light-snow':
        return <CloudSnow />;
      case 'snow':
        return <CloudSnow />;
      case 'heavy-snow':
        return <Snowflake size={24} />;
      case 'fog':
        return <CloudFog />;
      case 'null':
        return <CircleOff />;
      default:
        return <Cloud />;
    }
  };

  const getConditionName = (conditionCode: string) => {
    return conditionCode
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDayName = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDailyForecasts = () => {
    if (!data || !data.forecastTimestamps) return [];

    const dailyData: { [key: string]: any } = {};

    // Process all timestamps
    data.forecastTimestamps.forEach((forecast: ForecastTimestamps) => {
      const date = new Date(forecast.forecastTimeUtc);
      const dateKey = date.toISOString().split('T')[0];

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: dateKey,
          dayName: formatDayName(forecast.forecastTimeUtc),
          formattedDate: formatDate(forecast.forecastTimeUtc),
          highTemp: forecast.airTemperature,
          lowTemp: forecast.airTemperature,
          conditions: [],
          humidity: [],
          windSpeed: [],
          forecasts: [],
        };
      }

      // Update high/low temperatures
      dailyData[dateKey].highTemp = Math.max(dailyData[dateKey].highTemp, forecast.airTemperature);
      dailyData[dateKey].lowTemp = Math.min(dailyData[dateKey].lowTemp, forecast.airTemperature);

      // Collect conditions and other data for determining most common
      dailyData[dateKey].conditions.push(forecast.conditionCode);
      dailyData[dateKey].humidity.push(forecast.relativeHumidity);
      dailyData[dateKey].windSpeed.push(forecast.windSpeed);

      // Store the full forecast
      dailyData[dateKey].forecasts.push(forecast);
    });

    Object.keys(dailyData).forEach((dateKey) => {
      // Find most common condition
      const conditionCounts: { [key: string]: number } = {};
      dailyData[dateKey].conditions.forEach((condition: string) => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
      });

      let mostCommonCondition = '';
      let maxCount = 0;

      Object.entries(conditionCounts).forEach(([condition, count]) => {
        if (count > maxCount) {
          mostCommonCondition = condition;
          maxCount = count;
        }
      });

      dailyData[dateKey].condition = mostCommonCondition;

      // Calculate averages
      dailyData[dateKey].avgHumidity = Math.round(
        dailyData[dateKey].humidity.reduce((sum: number, val: number) => sum + val, 0) / dailyData[dateKey].humidity.length
      );

      dailyData[dateKey].avgWindSpeed = Math.round(
        dailyData[dateKey].windSpeed.reduce((sum: number, val: number) => sum + val, 0) / dailyData[dateKey].windSpeed.length
      );
    });

    // Convert to array and sort by date
    return Object.values(dailyData)
      .sort((a: any, b: any) => a.date.localeCompare(b.date))
      .slice(0, 5); // Limit to 5 days
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
      <div className={styles.emptyState}>
        <div>Error loading forecast: {(error as Error).message}</div>
      </div>
    );

  if (!data || !data.forecastTimestamps || data.forecastTimestamps.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div>Select a city to view 5-day forecast</div>
      </div>
    );
  }

  const dailyForecasts = getDailyForecasts();

  return (
    <div className={styles.forecastContainer}>
      <div className={styles.forecastHeader}>
        <h2>
          <Calendar size={18} /> 5-Day Forecast
        </h2>
      </div>

      <div className={styles.forecastGrid}>
        {dailyForecasts.map((day: any, index) => (
          <div key={index} className={styles.forecastDay}>
            <div className={styles.dayName}>{day.dayName}</div>
            <div className={styles.date}>{day.formattedDate}</div>

            <div className={styles.weatherIcon}>{getWeatherIcon(day.condition)}</div>

            <div className={styles.temperature}>
              <div className={styles.highTemp}>{Math.round(day.highTemp)}°</div>
              <div className={styles.lowTemp}>{Math.round(day.lowTemp)}°</div>
            </div>

            <div className={styles.condition}>{getConditionName(day.condition)}</div>

            <div className={styles.extraInfo}>
              <div className={styles.infoItem}>
                <Droplets size={16} />
                <div className={styles.infoValue}>{day.avgHumidity}%</div>
              </div>

              <div className={styles.infoItem}>
                <Wind size={16} />
                <div className={styles.infoValue}>{day.avgWindSpeed}m/s</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DisplayCityFiveDayForecast;

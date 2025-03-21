import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ForecastTimestamps, getCityForecast } from './HTTPRequests';
import { useEffect } from 'react';

function DisplayCityWeather({ selectedCity }: { selectedCity: string }) {
  const queryClient = useQueryClient();

  const { mutate, data, isPending, isError, error } = useMutation({
    mutationFn: () => getCityForecast(selectedCity),
    onSuccess: (data) => {
      // Store the result in the query cache for potential future use
      queryClient.setQueryData(['cityForecast', selectedCity], data);
    },
  });

  useEffect(() => {
    if (selectedCity) {
      mutate();
    }
  }, [selectedCity, mutate]);

  if (isPending) return <div>Loading forecast for {selectedCity}...</div>;

  if (isError) return <div>Error loading forecast: {(error as Error).message}</div>;

  if (!data) return <div>Select a city to view forecast</div>;

  console.log(data);

  return (
    <div>
      {data.forecastTimestamps &&
        data.forecastTimestamps.map((element: ForecastTimestamps, index: number) => (
          <div key={index}>Temperature: {element.airTemperature}°C</div>
        ))}
    </div>
  );
}

export default DisplayCityWeather;

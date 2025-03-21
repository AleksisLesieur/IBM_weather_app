import { getCityForecast } from './HTTPRequests';

function DisplayCityFiveDayForecast({ selectedCity }: { selectedCity: string }) {
  return (
    <>
      <div>{selectedCity}</div>
      <button onClick={() => getCityForecast(selectedCity)}>debug me</button>
    </>
  );
}

export default DisplayCityFiveDayForecast;

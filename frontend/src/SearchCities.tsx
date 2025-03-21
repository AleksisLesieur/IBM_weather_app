import debounce from './debounce';
import LoadingSpinner from './assets/loadingAnimation';
import { useQuery } from '@tanstack/react-query';
import { CitiesData, getCities } from './HTTPRequests';
import { useState, useEffect, useCallback } from 'react';

function SearchCities({ setSelectedCity }) {
  // const [searchTerm, setSearchTerm] = useState('');
  // const [selectedCity, setSelectedCity] = useState<CitiesData | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const { isPending, isError, error, data } = useQuery<CitiesData[]>({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  // Create debounced search function with 1s delay

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  if (isPending) return <LoadingSpinner size={36} color="#808080" />;

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* Input field */}
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => setShowDropdown(true)} />

      {/* Dropdown that appears conditionally */}
      {showDropdown && (
        <div>
          {data.map((city, index) => (
            <div
              key={index}
              onClick={() => {
                setSearchTerm(city.name);
                setSelectedCity(city.name);
                setShowDropdown(false);
              }}
            >
              {city.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchCities;

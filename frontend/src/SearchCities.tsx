import debounce from './debounce';
import LoadingSpinner from './assets/loadingAnimation';
import { useQuery } from '@tanstack/react-query';
import { CitiesData, getCities } from './HTTPRequests';
import { useState, useEffect, useCallback } from 'react';

interface SearchCitiesProps {
  setSelectedCity: React.Dispatch<React.SetStateAction<string>>;
}

function SearchCities({ setSelectedCity }: SearchCitiesProps) {
  // const [searchTerm, setSearchTerm] = useState('');
  // const [selectedCity, setSelectedCity] = useState<CitiesData | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const { isPending, isError, error, data } = useQuery<CitiesData[]>({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  // Handle input change

  const citiesToDisplay = data ? data.filter((city) => city.code.includes(searchTerm.toLowerCase())) : [];

  if (isPending) return <LoadingSpinner size={36} color="#808080" />;

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* Input field */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        onFocus={() => setShowDropdown(true)}
      />

      {/* Dropdown that appears conditionally */}
      {showDropdown && citiesToDisplay.length > 0 && (
        <div>
          {citiesToDisplay.map((city, index) => (
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
